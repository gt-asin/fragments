const { createErrorResponse } = require('../../response');
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const md = require('markdown-it')();
const { htmlToText } = require('html-to-text');

/**
 * Get a specific fragment with optional format conversion
 */
module.exports = async (req, res) => {
  const ownerId = req.user;
  const [id, extension] = req.params.id.split('.');

  logger.info({ id, ownerId, extension }, `Calling GET ${req.originalUrl}`);

  try {
    const fragment = await Fragment.byId(ownerId, id);
    logger.debug({ fragment }, 'Fragment was found');

    const data = await fragment.getData();
    logger.debug('Fragment data has been retrieved');

    // if extension was included, attempt to convert data and then return it
    if (extension) {
      const extensionType = getExtensionContentType(extension);
      logger.info({ from: fragment.mimeType, to: extensionType }, 'Converting fragment');

      if (fragment.formats.includes(extensionType)) {
        const convertedData = await convertData(data, fragment.mimeType, extension);

        res.setHeader('Content-Type', extensionType);
        res.status(200).send(convertedData);
      } else {
        const message = `a ${fragment.mimeType} fragment cannot be return as a ${extension}`;
        const errorResponse = createErrorResponse(415, message);

        logger.error({ errorResponse }, 'Invalid operation');
        res.status(415).json(errorResponse);
      }
    }
    // otherwise return raw fragment data with its type
    else {
      res.setHeader('Content-Type', fragment.type);
      res.status(200).send(data);
    }
  } catch (err) {
    const errorResponse = createErrorResponse(404, err.message);
    logger.warn({ id, errorResponse }, 'Failed to retrieve fragment');
    res.status(404).json(err.message);
  }
};

const getExtensionContentType = (extension) => {
  switch (extension) {
    case 'txt':
      return 'text/plain';
    case 'md':
      return 'text/markdown';
    case 'html':
      return 'text/html';
    case 'json':
      return 'application/json';
    default:
      return null;
  }
};

// convert data
const convertData = async (data, from, to) => {
  let convertedData = data;

  switch (from) {
    case 'text/markdown':
      if (to == 'txt') {
        convertedData = md.render(data.toString());
        convertedData = htmlToText(convertedData.toString(), { wordwrap: 150 });
      }
      if (to == 'html') {
        convertedData = md.render(data.toString());
      }
      break;

    case 'text/html':
      if (to == 'txt') {
        convertedData = htmlToText(data.toString(), { wordwrap: 130 });
      }
      break;

    case 'application/json':
      if (to == 'txt') {
        convertedData = JSON.parse(data.toString());
      }
      break;
  }

  logger.debug(`Fragment data was successfully converted from ${from} to ${to}`);
  return Promise.resolve(convertedData);
};
