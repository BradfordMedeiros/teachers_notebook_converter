
const express = require('express');
const path = require('path');
const formidable = require('formidable');
const convertFile = require('./convertFile');
const uuid = require('uuid');
const fs = require('fs');

const router = express();

router.use(express.static(path.resolve('./public')));

router.post('/lesson', (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.resolve(`./tmp/input`);

  form.parse(req, (err, fields, files) => {
    if (err){
      res.status(400).jsonp({ error: 'internal server error' });
    }else{

      // put into folder and zip
      const fileNames = Object.keys(files);
      fileNames.forEach(fileName => {
        const file = files[fileName];
        const filePath = file.path;
        const outPath = path.resolve('./tmp/output', `${uuid()}.notebook`);
        convertFile(filePath,  outPath).then(() => {
          console.log('converted');
          console.log('trying to send : ', outPath);
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
        });
      });
    }
  });
});

router.listen(80, ()  =>  {
  console.log('listening');
});
