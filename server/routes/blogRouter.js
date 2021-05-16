const router = require('express').Router();
const { body } = require('express-validator');
const sanitizeHtml = require('sanitize-html');
const jwt = require('jsonwebtoken');
const util = require('util');
const { Op } = require('sequelize');

const client = require('../config/redisClient');

const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const NotFoundError = require('../errors/not-found-error');

const validateRequest = require('../middlewares/validateRequest');
const requireAuth = require('../middlewares/requireAuth');

const { Post, Image, Tag, User, sequelize } = require('../db/models');

jwt.verify = util.promisify(jwt.verify);
client.get = util.promisify(client.get);

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
    body('content').trim().notEmpty().withMessage('Content must not be empty'),
  ],
  validateRequest,
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
    res.send({ count, posts });
  } catch (err) {
    throw err;
  }
});

/* 
  GET /api/blogs/:id
*/

router.get('/api/blogs/:id', async (req, res) => {
  try {
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
    const posts = await Post.findAll({
      where: {
        user_id: req.user.id,
      },
      order: [['createdAt', 'DESC']],
    });

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
    await post.destroy();
    res.send({});
  } catch (err) {
    throw err;
  }
});

/*
  GET /api/tags
*/

router.get('/api/tags', async (req, res) => {
  try {
    const tags = await Tag.findAll({
      include: [
        {
          model: Post,
          attributes: ['id', 'title'],
          as: 'posts',
        },
      ],
    });

    res.send(tags);
  } catch (err) {
    throw err;
  }
});

module.exports = router;
