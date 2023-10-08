const { existsSync, mkdirSync } = require('fs');
const fs = require('fs');
const { config } = require('../../commons/config');

class LocalStorageService {
  constructor() {
    // if public path not exist, create it.
    if (!existsSync(config.app.imagesPublicPath)) {
      mkdirSync(config.app.imagesPublicPath, { recursive: true });
    }
  }

  saveAlbumArt(albumId, albumArt, fileExtension) {
    return new Promise((resolve, reject) => {
      const filename = `${albumId}.${fileExtension}`;
      const filePath = `${config.app.imagesPublicPath}/${filename}`;
      const writable = fs.createWriteStream(filePath);

      // @TODO-7: pipe `albumArt` ke `writable`. Referensi: https://www.dicoding.com/academies/271/tutorials/17740
      albumArt.pipe(writable)

      writable.on('finish', () => {
        resolve(filename);
      });

      writable.on('error', (err) => {
        reject(err);
      });
    });
  }
}

module.exports = LocalStorageService;
