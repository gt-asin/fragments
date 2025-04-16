// src/routes/api/delete.js

const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
  const fragmentId = req.params.id;
  const ownerId = req.user;

  logger.info('DELETE /fragments/:id');

  try {
    await Fragment.delete(ownerId, fragmentId);

    logger.debug({ fragmentId }, `Fragment was deleted`);

    const successResponse = createSuccessResponse({});
    return res.status(200).json(successResponse);
  } catch (err) {
    const errorResponse = createErrorResponse(404, err.message);
    logger.error({ errorResponse }, 'Failed to delete the fragment');

    return res.status(404).json(errorResponse);
  }
};
