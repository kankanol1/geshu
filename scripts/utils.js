const fs = require('fs');

function copyFileTo(from, to) {
  fs.createReadStream(from).pipe(fs.createWriteStream(to));
}

module.exports = {
  copyFileTo,
};
