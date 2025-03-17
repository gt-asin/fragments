// src/routes/api/get.js
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { version, author } = require('../../../package.json');
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  logger.info('GET request from /fragments/ success');
  try {
    const displayExpand = req.query.expand == 1 ? true : false;
    const fragments = await Fragment.byUser(req.user, displayExpand);
    const response = createSuccessResponse({
      author,
      githubUrl: 'https://github.com/gt-asin/fragments',
      version,
      fragments,
    });
    res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, 'GET request from /fragments/ failed');
    res.status(500).json(createErrorResponse(500, error));
  }
};
