
const express = require('express');
const path = require('path');
const formidable = require('formidable');
const convertFile = require('./convertFile');
const zipFolder = require('zip-folder');
const rimraf = require('rimraf');
const uuid = require('uuid');
const fs = require('fs');

const router = express();

router.use(express.static(path.resolve('./public')));

router.post('/lesson', (req, res) => {
  const id = uuid();
  const form = new formidable.IncomingForm();

  const uploadDir = path.resolve(`./tmp/input`, id);
  fs.mkdirSync(uploadDir);

  form.uploadDir = uploadDir;

  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(400).jsonp({error: 'internal server error'});
    } else {

      // put into folder and zip
      const fileNames = Object.keys(files);

      const folder = path.resolve('./tmp/output', id);

      console.log('files: ', fileNames);

      console.log('converting, folder is: ', folder);
      fs.mkdir(folder, err => {
        if (err){
          res.status(400).jsonp({ error: 'internal server error'});
        }else{
          const convertFilesPromise = Promise.all(fileNames.map(fileName => {
            const file = files[fileName];
            const filePath = file.path;
            const outPath = path.resolve(folder, fileName);
            return convertFile(filePath, outPath);
          }));

          convertFilesPromise.then(() => {
            const zipFolderPath = path.resolve('./tmp/output', `${uuid()}.notebook`);
            zipFolder(folder, zipFolderPath , err => {
              rimraf(folder,  (err) => {
                  console.log(err);
              });
              rimraf(uploadDir, err => {
                console.log(err);
              });
              if (err){
                res.status(400).jsonp({error: 'internal server error'});
              }else{
                res.download(zipFolderPath, 'notebooks.zip',  () => {
                  fs.unlink(zipFolderPath);
                });
              }
            });
          }).catch(() => {
            rimraf(folder, err => {
              console.log(err);
            });
            rimraf(uploadDir, err => {
              console.log(err);
            });
            res.status(400).jsonp({error: 'internal server error'});
          });
        }
      });

    }
  });
});

router.listen(80, ()  =>  {
  console.log('listening');
});

/*

 res.sendFile(outPath, 'yo.flp',  err => {
 if (err){
 // what to do?
 console.log('shit error!');
 console.log(err);
 }
 fs.unlink(filePath);
 fs.unlink(outPath);
 console.log('finished');
 });
 */