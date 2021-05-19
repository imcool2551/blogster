const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');

const requireAuth = require('../middlewares/requireAuth');

const s3 = require('../config/aws-s3');

/*
  GET /api/upload

  Headers: [x-access-token] || [Authorization]
*/

router.get('/api/upload', requireAuth, async (req, res) => {
  const path = `${req.user.id}/${uuidv4()}.jpeg`;

  const params = {
    Bucket: 'legends-guide-archive-2021',
    ContentType: 'image/*',
    Expires: 60 * 5,
    Key: path,
  };

  try {
    const url = await new Promise((resolve, reject) => {
      s3.getSignedUrl('putObject', params, (err, url) => {
        err ? reject(err) : resolve(url);
      });
    });
    res.send({ url, path });
  } catch (err) {
    throw err;
  }
});

module.exports = router;
