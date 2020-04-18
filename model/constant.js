/**
 * Here we define constants used in our web application at backend only.
 * These constants are not needed in front end.
 */

// TO IMPORT: const constant = require('./constant');

/**
 * List of Error Types we have
 */
const errType = {
  VALIDATION_ERROR: 0,
  INTERNAL_ERROR: 1,
  DB_ERROR: 2,
  AUTH_ERROR: 3, // Frontend should redirect to Login page
};




// ============================================
// For TESTING ONLY
// ============================================
/**
 * Time taken by beforeAll function for its setup including DB setup
 * and some other work.
 */
const testTimeout = {
  beforeAll: 10000,
  afterAll: 10000,
};

const imageStorageBaseLocation = {
  DEFAULT: 'assets\\img\\profile\\emp\\',
  PATH: '/assets/img/profile/emp/',
};

const IMG_EXTENSION = '.jpg';

module.exports.errType = errType;
module.exports.imageStorageBaseLocation = imageStorageBaseLocation;
module.exports.IMG_EXTENSION = IMG_EXTENSION;
