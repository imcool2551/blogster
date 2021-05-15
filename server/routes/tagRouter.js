const router = require('express').Router();

const { Post, Tag } = require('../db/models');

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
