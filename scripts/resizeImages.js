const fs = require('fs');
const process = require('process');
const path = require('path');
const glob = require("glob");
const sharp = require("sharp");

const dir = path.resolve("./src/assets/badges");
const output_path = path.resolve("./public");
const input_path = path.join(dir, '**', '*.{png,jpg,jpeg,HEIC}');

glob(input_path, function (err, files) {
  files.forEach(function (inputFile) {
    const relativePath = path.relative(process.cwd(), inputFile);
    const output = output_path + '/' + relativePath.replace('assets/', '').replace(path.basename(inputFile), '')

    let fileName = path.basename(inputFile, path.extname(inputFile));

    const match = fileName.match(/{(f;(.*?))*,*(max;(\d*?))*}/);

    let ext = inputFile.split('.').pop();
    let max = 1536;

    if (match && match.length > 1) {
      fileName = fileName.replace(match[0], '');
      let split = match[0].replaceAll(/[{}]/g, '').split(',');
      split.forEach((option, index) => {
        if (option.startsWith('f')) {
          ext = option.split(';')[1]
        }
        if (option.startsWith('max')) {
          max = parseInt(option.split(';')[1])
        }
      })
    }

    fileName = fileName.toLowerCase();

    fs.mkdirSync(output, {recursive: true});

    console.log(fileName, ext, max);

    if (ext === 'png') {
      sharp(inputFile)
        .resize(max, null, {
          withoutEnlargement: true
        })
        .png({quality: 90, force: true})
        .toFile(path.join(output, fileName + '.' + ext), (err, info) => {
          //console.log('DONE',fileName + '.' + ext);
        });
    } else {
      sharp(inputFile)
        .resize(max, null, {
          withoutEnlargement: true
        })
        .jpeg({mozjpeg: true, quality: 90, force: true})
        .toFile(path.join(output, fileName + '.' + ext), (err, info) => {
          //console.log('DONE',fileName + '.' + ext);
        });
    }

    /*
        sharp(inputFile)
          .resize(max, null, {
            withoutEnlargement: true
          })
          .webp({quality: 90})
          .toFile(path.join(output, fileName + '.webp'), (err, info) => {
            //console.log('DONE', fileName + '.' + ext);
          });
     */
  });
});

/*
ffmpeg -i "./MNSTR_3030_2-3-cut.mp4" -movflags faststart -c:v libx264 -crf 30 -an "./environment-264.mp4"
ffmpeg -i "./MNSTR_3030_2-3-cut.mp4" -movflags faststart -c:v libx265 -crf 34 -an "./environment-265.mp4"
ffmpeg -i "./MNSTR_3030_2-3-cut.mp4" -c:v libvpx-vp9 -crf 40 -an "./environment-vp9.webm"
 */