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
    const fileContent = fs.readFileSync('files/index.html');

    request('http://localhost:3000/index2.html', (error, response, body) => {
      if (error) return done(error);

      assert.equal(body, fileContent);
      done();
    });
  });
});
