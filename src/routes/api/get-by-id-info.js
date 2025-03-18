const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createErrorResponse, createSuccessResponse } = require('../../response');

module.exports = async (req, res) => {
  const idParam = req.params.id;
  logger.info('GET /fragments/:id/info request');

  try {
    const fragment = await Fragment.byId(req.user, idParam);
    logger.debug({ fragment }, 'Successful fragment retrieval');
    res.status(200).json(
      createSuccessResponse({
        fragments: fragment,
      })
    );
  } catch (error) {
    logger.error({ error }, 'GET /fragments/:id/info error');
    res.status(500).json(createErrorResponse(500, error));
  }
};
