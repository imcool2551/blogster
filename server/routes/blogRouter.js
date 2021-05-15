const router = require('express').Router();
const { body } = require('express-validator');
const sanitizeHtml = require('sanitize-html');
const jwt = require('jsonwebtoken');
const util = require('util');
const { Op } = require('sequelize');

const client = require('../config/redisClient');

const BadRequestError = require('../errors/bad-request-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const NotFoundError = require('../errors/not-found-error');

const validateRequest = require('../middlewares/validateRequest');
const requireAuth = require('../middlewares/requireAuth');

const { Post, Image, Tag, User, sequelize } = require('../db/models');

jwt.verify = util.promisify(jwt.verify);
client.get = util.promisify(client.get);

/*
  POST /api/blogs

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
        for (const tag of tags) {
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
      // const createdPost = await Post.findByPk(post.id, {
      //   include: ['tags', 'images', 'user'],
      // });
      return res.redirect(303, `/api/blogs/${post.id}`);
    } catch (err) {
      console.log(err);
      await t.rollback();
      res.status(500).send(err);
    }
  }
);

/* 
  GET /api/blogs/:id

*/

router.get('/api/blogs/:id', async (req, res) => {
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
  res.send(post);
});

module.exports = router;
