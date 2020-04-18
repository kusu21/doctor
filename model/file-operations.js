/**
 * Generally this module can be used to move files from one place to another using promises by pify
 *
 */

const fs = require('fs');
const pify = require('pify');

async function moveFile(oldPath, newPath) {
  await pify(fs.rename)(oldPath, newPath);
}

module.exports.moveFile = moveFile;
