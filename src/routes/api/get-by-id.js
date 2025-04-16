const { createErrorResponse } = require('../../response');
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const mimeTypes = require('mime-types');
const path = require('path');

module.exports = async (req, res) => {
  const ownerId = req.user;
  const url = req.params.id;
  const id = path.basename(url, path.extname(url));
  const extension = path.extname(url).slice(1).toLowerCase();

  logger.debug({ id, extension }, 'GET /fragments/:id');

  try {
    const fragment = await Fragment.byId(ownerId, id);
    const data = await fragment.getData();
    logger.debug({ fragment }, 'Fragment and data was found');

    if (extension) {
      let newContentType = mimeTypes.lookup(extension);

      if (newContentType === 'application/x-yaml') {
        newContentType = 'application/yaml';
      }

      if (fragment.formats.includes(newContentType)) {
        const convertedData = await Fragment.convertData(data, fragment.mimeType, extension);
        logger.debug({ from: fragment.mimeType, to: newContentType }, 'Converting fragment type');
        res.setHeader('Content-Type', newContentType);
        res.status(200).send(convertedData);
      } else {
        logger.debug({ extension }, 'Invalid extension');
        res.status(415).json(createErrorResponse(415, 'Invalid extension'));
      }
    } else {
      res.setHeader('Content-Type', fragment.type);
      res.status(200).send(data);
    }
  } catch (error) {
    logger.warn({ id, error }, 'Failed to retrieve fragment');
    res.status(404).json(createErrorResponse(404, error.message));
  }
};
