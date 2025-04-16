const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createErrorResponse, createSuccessResponse } = require('../../response');

module.exports = async (req, res) => {
  const id = req.params.id;
  const ownerId = req.user;
  const type = req.get('Content-Type');
  const body = req.body;

  logger.info({ id, ownerId, type }, `PUT request`);

  try {
    const fragment = await Fragment.byId(ownerId, id);

    logger.debug({ fragment }, 'Fragment was found');

    if (fragment.type == type) {
      await fragment.setData(body);
      await fragment.save();

      logger.debug({ fragment }, `Fragment has been updated successfully`);

      const successResponse = createSuccessResponse({ fragment: fragment });
      res.status(200).json(successResponse);
    } else {
      const errorResponse = createErrorResponse(
        400,
        'Fragment type cannot be changed after creation'
      );
      logger.warn({ errorResponse }, 'Failed to update the fragment');

      return res.status(400).json(errorResponse);
    }
  } catch (error) {
    const errorResponse = createErrorResponse(404, error.message);
    logger.warn({ errorResponse }, 'Failed to update the fragment');
    return res.status(404).json(errorResponse);
  }
};
