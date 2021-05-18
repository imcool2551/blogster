const router = require('express').Router();
const util = require('util');
const etag = require('etag');

const client = require('../config/redisClient');

const { Post, Tag } = require('../db/models');

client.get = util.promisify(client.get);
client.set = util.promisify(client.set);

/*
  GET /api/tags
*/

router.get('/api/tags', async (req, res) => {
  try {
    const key = 'tags';
    const cacheValue = await client.get(key);
    // 캐시에 존재하면 리턴 (key: 'tags')
    if (cacheValue) {
      console.log('Returning from cache');
      res.set('Cache-control', 'no-cache');
      return res.send(JSON.parse(cacheValue));
    }

    console.log('Returning from DB');
    const tags = await Tag.findAll({
      include: [
        {
          model: Post,
          attributes: ['id', 'title'],
          as: 'posts',
        },
      ],
    });
    // 캐시에 값 채워넣기 (key: 'tags')
    client.set(key, JSON.stringify(tags));

    res.setHeader('ETag', etag(JSON.stringify(tags)));
    res.send(tags);
  } catch (err) {
    throw err;
  }
});

module.exports = router;
