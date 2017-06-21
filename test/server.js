const server = require('../index');
const request = require('request');
const fs = require('fs');
const assert = require('assert');
const fileName = 'f53b175f18259347605c176c05c554c2.txt';

describe('server tests', () => {
  let app;
  before((done) => {
    app = server.listen(3000, done);
  });

  after((done) => {
    app.close(done);
  });

  it('get index.html', (done) => {
    /*
      1. запустить сервер
      2. сделать GET запрос на /
      3. дождаться ответа
      4. прочитать с диска public/index.html
      5. сравнить, что ответ сервера и файла с диска одинаковые
      6. остановить сервер
    */
    request('http://localhost:3000/index.html', (error, response, body) => {
      if (error) return done(error);

      const fileContent = fs.readFileSync('files/index.html');
      assert.equal(body, fileContent);
      done();
    });
  });

  it('post create file', (done) => {
    const file1 = fs.readFileSync('files/index.html');
    const options = {
      url: `http://localhost:3000/${fileName}.html`,
      body: file1,
    };

    request.post(options, (error, response, body) => {
      if (error) return done(error);

      const file2 = fs.readFileSync(`files/${fileName}.html`);
      assert.deepEqual(file1, file2);
      done();
    });
  });

  it('post file exists', (done) => {
    const readStream = fs.createReadStream('files/index.html');

    const req = request.post(`http://localhost:3000/${fileName}.html`, (error, response, body) => {
      if (error) return done(error);
      const result = 'File exists';

      assert.equal(body, result);
      done();
    });

    readStream
    .on('error', (err)=>{
      done(err);
    })
    .pipe(req);
  });

  it('post file size limit', (done) => {
    const file = fs.readFileSync('files/index.html');
    const options = {
      url: `http://localhost:3000/${fileName}.html`,
      body: file,
      headers: {
        'content-length': 1024*1024+1,
      },
    };

    request.post(options, (error, response, body) => {
      if (error) return done(error);
      const result = 'File is too big!';

      assert.equal(body, result);
      done();
    });
  });

  it('delete existing file', (done) => {
    request.delete(`http://localhost:3000/${fileName}.html`, (error, response, body) => {
      if (error) return done(error);

      const result = 'OK';
      assert.equal(body, result);

      try {
        fs.readFileSync(`files/${fileName}.html`);
      } catch (e) {
        assert.equal(e.code, 'ENOENT');
      }
      done();
    });
  });

  it('delete NOT existing file', (done) => {
    request.delete(`http://localhost:3000/${fileName}.html`, (error, response, body) => {
      if (error) return done(error);

      const result = 'File not found';
      assert.equal(result, result);

      try {
        fs.readFileSync(`files/${fileName}.html`);
      } catch (e) {
        assert.equal(e.code, 'ENOENT');
      }
      done();
    });
  });
});
