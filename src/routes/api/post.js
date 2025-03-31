const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createSuccessResponse, createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
  const reqBody = req.body;
  logger.debug({ reqBody }, 'POST /fragments request');

  if (!Buffer.isBuffer(req.body)) {
    logger.warn('Incorrect or missing buffer data');
    return res.status(415).json(createErrorResponse(415, 'Incorrect or missing buffer data'));
  }

  try {
    const fragment = new Fragment({
      ownerId: req.user,
      type: req.get('Content-Type'),
    });
    await fragment.setData(req.body);
    await fragment.save();
    logger.info({ fragment }, 'Successfully created a new fragment');

    res.set({
      Location: `${process.env.API_URL}/v1/fragments/${fragment.id}`,
    });

    res.status(201).json(
      createSuccessResponse({
        fragment: fragment,
      })
    );
  } catch (error) {
    logger.error({ error }, 'POST /fragments error');
    res.status(500).json(createErrorResponse(500, error));
  }
};
