const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API Routes',
    endpoints: {
      health: '/health',
      api: '/api'
    }
  });
});

module.exports = router;
