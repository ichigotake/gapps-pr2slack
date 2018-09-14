const ejs = require('ejs');
const fs = require('fs');
const env = require('dotenv').config().parsed

fs.readdir('template', (err, files) => {
  files.forEach(filename => {
    ejs.renderFile(`template/${filename}`, env, undefined, (err, str) => {
      if (err) {
        console.error(filename, err);
      } else {
        fs.writeFile(`src/${filename}`, str, err => {
          if (err) {
            console.log(`src/${filename}`, err);
          }
        });
      }
    });
  });
});

