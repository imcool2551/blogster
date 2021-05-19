const router = require('express').Router();
const { body } = require('express-validator');
const sanitizeHtml = require('sanitize-html');
const util = require('util');

const client = require('../config/redisClient');

const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-error');

const validateRequest = require('../middlewares/validateRequest');
const requireAuth = require('../middlewares/requireAuth');
const { blogPostLimiter } = require('../middlewares/apiLimiter');

const { Post, Image, Tag, User, sequelize } = require('../db/models');

client.get = util.promisify(client.get);
client.set = util.promisify(client.set);
client.hget = util.promisify(client.hget);
client.hset = util.promisify(client.hset);

/*
  POST /api/blogs

  Headers: [x-access-token] || [Authorization]

  {
    title
    tags
    content
    files
  }
*/

router.post(
  '/api/blogs',
  requireAuth,
  [
    body('title').trim().notEmpty().withMessage('Title must not be empty'),
    body('tags')
      .trim()
      .notEmpty()
      .custom((val) => /#[\d|A-Z|a-z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+/gi.test(val))
      .withMessage('Invalid tag format'),
    body('files')
      .isArray({ max: 10 })
      .withMessage('Too many images (Maximum 10)'),
    body('content').trim().notEmpty().withMessage('Content must not be empty'),
  ],
  validateRequest,
  blogPostLimiter,
  async (req, res) => {
    req.body.content = sanitizeHtml(req.body.content);
    req.body.tags = req.body.tags.match(/#[\d|A-Z|a-z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+/gi);

    const t = await sequelize.transaction();

    try {
      let { title, content, tags, files } = req.body;

      // User fetch
      const user = await User.findByPk(req.user.id);

      // Post 생성
      const post = await Post.create(
        {
          title,
          content,
        },
        { transaction: t }
      );

      // req.body.fiels 포맷 수정 뒤 Image 인스턴스 배열 생성
      files = files.length > 0 ? files : [];
      files = files.map((file) => {
        return { path: file };
      });
      const images = await Image.bulkCreate(files, { transaction: t });

      // Tag 인스턴스 배열 생성
      async function getTagArray() {
        tags = [...new Set(tags)]; // tags 배열 중복 제거
        const tagArray = [];
        for (let tag of tags) {
          tag = tag.substring(1); // # 제거
          const [tagInstance, created] = await Tag.findOrCreate({
            where: {
              tag_name: tag,
            },
            transaction: t,
          });
          tagArray.push(tagInstance);
        }
        return tagArray;
      }
      const tagArray = await getTagArray();

      await post.setTags(tagArray, { transaction: t });
      await post.setUser(user, { transaction: t });
      await post.setImages(images, { transaction: t });
      await t.commit();
      // 캐시 무효화 (blogs, tags, mypage)
      client.del('blogs');
      client.del('tags');
      client.del(`mypage/${req.user.id}`);

      return res.redirect(303, `/api/blogs/${post.id}`);
    } catch (err) {
      console.log(err);
      await t.rollback();
      res.status(500).send(err);
    }
  }
);

/*
  GET /api/blogs 

  query-string: page, limit
*/

router.get('/api/blogs', async (req, res) => {
  try {
    if (!req.query.page || !req.query.limit) {
      throw new BadRequestError('Missing required query-strings');
    }

    // 캐시에 존재하면 캐시값 바로 리턴 (key1: 'blogs', key2: query-string)
    const key = JSON.stringify(req.query);
    const cacheValue = await client.hget('blogs', key);
    if (cacheValue) {
      console.log('Returning from cache');
      return res.send(JSON.parse(cacheValue));
    }

    console.log('Returning from DB');
    let { page, limit } = req.query;
    limit = parseInt(limit);
    page = parseInt(page);
    offset = (page - 1) * limit;

    const count = await Post.count();
    const posts = await Post.findAll({
      offset,
      limit,
      include: [
        {
          model: Tag,
          attributes: ['tag_name'],
          as: 'tags',
        },
        {
          model: User,
          attributes: ['username'],
          as: 'user',
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    // 캐시에 값 채워넣기 (key1: 'blogs', key2: query-string)
    const value = { count, posts };
    client.hset('blogs', key, JSON.stringify(value));
    res.send(value);
  } catch (err) {
    throw err;
  }
});

/* 
  GET /api/blogs/:id
*/

router.get('/api/blogs/:id', async (req, res) => {
  try {
    // 캐시에 존재하면 캐시값 바로 리턴 (key: `blog${req.params.id}`)
    const key = `blog/${req.params.id}`;
    const cacheValue = await client.get(key);
    if (cacheValue) {
      console.log('Returning from cache');
      return res.send(JSON.parse(cacheValue));
    }

    console.log('Returning from DB');
    const post = await Post.findByPk(req.params.id, {
      include: [
        {
          model: Tag,
          attributes: ['tag_name'],
          as: 'tags',
        },
        {
          model: Image,
          attributes: ['path'],
          as: 'images',
        },
        {
          model: User,
          attributes: ['username'],
          as: 'user',
        },
      ],
    });
    if (!post) {
      throw new NotFoundError('Post does not exist');
    }
    // 캐시에 값 채워넣기 (key: `blog${req.params.id}`)
    client.set(key, JSON.stringify(post));

    res.send(post);
  } catch (err) {
    throw err;
  }
});

/*
  GET /api/user/blogs

  Headers: [x-access-token] || [Authorization]
*/

router.get('/api/user/blogs', requireAuth, async (req, res) => {
  try {
    // 캐시에 존재하면 캐시값 바로 리턴 (key: `mypage${req.user.id}`)
    const key = `mypage/${req.user.id}`;
    const cacheValue = await client.get(key);
    if (cacheValue) {
      console.log('Returning from cache');
      return res.send(JSON.parse(cacheValue));
    }

    const posts = await Post.findAll({
      where: {
        user_id: req.user.id,
      },
      order: [['createdAt', 'DESC']],
    });
    // 캐시에 값 채워넣기 (key: `mypage${req.user.id}`)
    client.set(key, JSON.stringify(posts));

    res.send(posts);
  } catch (err) {
    throw err;
  }
});

/*
  DELETE /api/blogs/:id

  Headers: [x-access-token] || [Authorization]
*/

router.delete('/api/blogs/:id', requireAuth, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      throw new NotFoundError('Post does not exist');
    }
    if (post.user_id !== req.user.id) {
      throw new ForbiddenError('Forbidden');
    }
    // 캐시 무효화 (blogs, blog, tags, mypage)
    client.del('blogs');
    client.del(`blog/${req.params.id}`);
    client.del('tags');
    client.del(`mypage/${req.user.id}`);

    await post.destroy();

    // 연관된 포스트가 없는 태그 삭제
    const tags = await sequelize.query(
      `
      SELECT * 
      FROM tags 
      LEFT JOIN post_tags 
        ON tags.id = post_tags.tag_id
      WHERE post_id IS NULL`,
      {
        model: Tag,
      }
    );
    tags.forEach((tag) => {
      tag.destroy();
    });

    res.send({});
  } catch (err) {
    throw err;
  }
});

module.exports = router;
