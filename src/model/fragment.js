// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');
const logger = require('../logger');
const { htmlToText } = require('html-to-text');
const md = require('markdown-it')();
const yaml = require('js-yaml');
const sharp = require('sharp');
const Papa = require('papaparse');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    if (!ownerId) {
      throw new Error('ownerId is required');
    }
    if (type) {
      if (!Fragment.isSupportedType(type)) throw new Error('invalid types throw');
    } else throw 'type is required';

    if (size) {
      if (typeof size != 'number') throw new Error('size must be a number');
      if (size < 0) throw new Error('size cannot be negative');
    }

    this.id = id || randomUUID();
    this.ownerId = ownerId;
    this.created = created || new Date().toISOString();
    this.updated = updated || new Date().toISOString();
    this.type = type;
    this.size = size;
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    try {
      return listFragments(ownerId, expand);
    } catch (err) {
      logger.error(err, ' byUser() failed to retrieve fragments for user');
      throw new Error(err);
    }
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    try {
      const fragment = await readFragment(ownerId, id);

      if (!fragment) throw new Error(`Fragment was not found`);

      return fragment instanceof Fragment ? fragment : new Fragment(fragment);
    } catch (err) {
      logger.error(err, ' byId() failed to retrieve the fragment by ID');
      throw new Error(err);
    }
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<void>
   */
  static async delete(ownerId, id) {
    try {
      await deleteFragment(ownerId, id);
    } catch (err) {
      logger.error(err, ' delete() failed to delete a fragment');
      throw new Error(err);
    }
  }

  /**
   * Saves the current fragment (metadata) to the database
   * @returns Promise<void>
   */
  async save() {
    try {
      this.updated = new Date().toISOString();
      await writeFragment(this);
    } catch (err) {
      logger.error(err, ' save() failed to update the fragment');
      throw new Error(err);
    }
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  async getData() {
    try {
      return readFragmentData(this.ownerId, this.id);
    } catch (err) {
      logger.error({ err: err.message }, ' getData() failed to retrieve the buffer data');
      throw new Error(`Error: ${err}`);
    }
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  async setData(data) {
    try {
      if (!Buffer.isBuffer(data)) throw Error('Given data is not a Buffer');
      else {
        this.updated = new Date();
        this.size = Buffer.byteLength(data);
        await this.save();
        return writeFragmentData(this.ownerId, this.id, data);
      }
    } catch (err) {
      logger.error({ err: err.message }, ' setData() failed to overwrite the fragment');
      throw new Error(err);
    }
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    return this.mimeType.startsWith('text/');
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    switch (this.mimeType) {
      case 'text/plain':
        return ['text/plain'];
      case 'text/markdown':
        return ['text/markdown', 'text/html', 'text/plain'];
      case 'text/html':
        return ['text/html', 'text/plain'];
      case 'text/csv':
        return ['text/csv', 'text/plain', 'application/json'];
      case 'application/json':
        return ['application/json', 'text/plain', 'application/yaml', 'application/x-yaml'];
      case 'application/yaml':
        return ['application/yaml', 'text/plain'];
      case 'image/png':
      case 'image/jpeg':
      case 'image/webp':
      case 'image/avif':
      case 'image/gif':
        return ['image/gif', 'image/png', 'image/jpeg', 'image/webp', 'image/avif'];
      default:
        return null;
    }
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    const validTypes = [
      'text/plain',
      'text/markdown',
      'text/html',
      'text/csv',
      'application/json',
      'application/yaml',
      'application/x-yaml',
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/gif',
      'image/avif',
    ];

    return validTypes.some((element) => value.includes(element));
  }

  static async convertData(data, from, to) {
    let convertedData = Buffer.from(data).toString();

    switch (from) {
      case 'text/markdown':
        if (to === 'txt') {
          convertedData = md.render(data.toString());
          convertedData = htmlToText(convertedData.toString(), { wordwrap: 150 });
        } else if (to === 'html') convertedData = md.render(convertedData);
        break;
      case 'text/html':
        if (to === 'txt') convertedData = htmlToText(convertedData, { wordwrap: 130 });
        break;
      case 'text/csv':
        if (to === 'txt') convertedData = data.toString();
        else if (to === 'json') {
          const csvData = data.toString();
          const parse = Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
            delimiter: ',',
          });

          if (parse.errors.length) {
            throw new Error(`CSV parse error: ${parse.errors[0].message}`);
          }

          convertedData = JSON.stringify(parse.data, null, 2);
        }
        break;
      case 'application/json':
        if (to === 'txt') {
          const json = JSON.parse(data.toString());
          convertedData = JSON.stringify(json, null, 2);
        } else if (to === 'application/yaml' || to === 'application/x-yaml') {
          const json = JSON.parse(data.toString());
          convertedData = yaml.dump(json);
        }
        break;
      case 'image/png':
      case 'image/jpeg':
      case 'image/webp':
      case 'image/gif':
      case 'image/avif':
        if (to === 'png') convertedData = await sharp(data).png().toBuffer();
        else if (to === 'jpg') convertedData = await sharp(data).jpeg().toBuffer();
        else if (to === 'webp') convertedData = await sharp(data).jpeg().toBuffer();
        else if (to === 'gif') convertedData = await sharp(data).gif().toBuffer();
        else if (to === 'avif') convertedData = await sharp(data).avif().toBuffer();
        break;
    }
    return Promise.resolve(convertedData);
  }
}
module.exports.Fragment = Fragment;
