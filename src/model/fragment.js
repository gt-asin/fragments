// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');
const { logger } = require('../logger');

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

    this.created = created || new Date().toISOString();
    this.id = id || randomUUID();
    this.ownerId = ownerId;
    this.size = size;
    this.type = type;
    this.updated = updated || new Date().toISOString();
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
      throw new Error(`Error: ${err}`);
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
      throw new Error(`Error: ${err}`);
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
      throw new Error(`Error: ${err}`);
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
      throw new Error(`Error: ${err.message}`);
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
      logger.error(err, ' getData() failed to retrieve the buffer data');
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
      logger.error(err, ' setData() failed to overwrite the fragment');
      throw new Error(`Error: ${err}`);
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
    if (this.mimeType == 'text/plain') return ['text/plain'];
    else return null;
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    const validTypes = ['text/plain'];

    return validTypes.some((element) => value.includes(element));
  }
}
module.exports.Fragment = Fragment;
