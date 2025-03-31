// src/routes/api/get.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');

// Displays list of all fragments. If url contains ?expand=1 then display all metadata of fragments
module.exports = async (req, res) => {
  logger.info('GET /fragments/');
  try {
    const displayExpand = req.query.expand == 1 ? true : false;
    const fragments = await Fragment.byUser(req.user, displayExpand);
    const response = createSuccessResponse({
      fragments,
    });
    logger.info('GET all fragments success');
    res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, 'GET request from /fragments/ failed');
    res.status(500).json(createErrorResponse(500, error));
  }
};
