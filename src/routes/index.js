// src/routes/index.js

const express = require('express');
const { version, author } = require('../../package.json');
const { createSuccessResponse } = require('../response');
const router = express.Router();
const { authenticate } = require('../auth');
const { hostname } = require('os');
/**
 * Expose all of our API routes on /v1/* to include an API version.
 */

router.use(`/v1`, authenticate(), require('./api'));

/**
 * Define a simple health check route. If the server is running
 * we'll respond with a 200 OK.  If not, the server isn't healthy.
 */
router.get('/', (req, res) => {
  // Client's shouldn't cache this response (always request it fresh)
  res.setHeader('Cache-Control', 'no-cache');
  const response = createSuccessResponse({
    status: 'ok',
    author,
    // Use your own GitHub URL for this!
    githubUrl: 'https://github.com/gt-asin/fragments',
    version,
    // Include the hostname in the response
    hostname: hostname(),
  });
  // Send a 200 'OK' response
  res.status(200).json(response);
});

module.exports = router;
