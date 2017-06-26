const server = require('../index');
const fse = require('fs-extra');
const assert = require('assert');
const config = require('config');
const request = require('request');
const rp = require('request-promise');
const fixturesRoot = __dirname + '/fixtures';
const host = 'http://127.0.0.1:3000';
const expect = require('expect');
const Readable = require('stream').Readable;

describe('Server tests', () => {
  let app;
  before((done) => {
    app = server.listen(3000, done);
  });

  after((done) => {
    fse.emptyDirSync(config.get('filesRoot'));
    app.close(done);
  });

  beforeEach(() => {
    fse.emptyDirSync(config.get('filesRoot'));
  });

  describe('GET /files.ext', () => {
    context('When exist', ()=>{
      beforeEach(()=>{
        fse.copySync(
          `${fixturesRoot}/small.png`, config.get('filesRoot') + '/small.png'
        );
      });
      it('return 200', async() => {
        const fixture = fse.readFileSync(`${fixturesRoot}/small.png`);
        const result = await rp.get(`${host}/small.png`);
        assert.equal(result, fixture);
      });
    });

    it('return 404 if not exist', async() => {
      const res = await rp.get(`${host}/small.png`).catch((e) => e);
      assert.equal(res.statusCode, 404);
      assert.equal(res.error, 'File not found');
    });
  });

  describe('GET ../parent/path', () => {
    it('returns 400', async() => {
      const res = await rp.get(`${host}/../parent/path`).catch((e)=>e);
      assert.equal(res.statusCode, 400);
    });
  });

  describe('POST /file.ext', () => {
    context('When exists', () => {
      beforeEach(() => {
        fse.copySync(`${fixturesRoot}/small.png`, config.get('filesRoot') + '/small.png');
      });

      context('When small file size', () => {
        it('returns 409 & file not modified', async() => {
          const mtime = fse.statSync(config.get('filesRoot') + '/small.png').mtime;
          const res = await rp.post(`${host}/small.png`).catch((e) => e);
          const newMtime = fse.statSync(config.get('filesRoot') + '/small.png').mtime;
          expect(mtime).toEqual(newMtime);
          expect(res.statusCode).toEqual(409);
        });

        it('returns 409 when zero file size', async() => {
          const body = new Readable().push(null); // emulate zero-file
          const url = `${host}/small.png`;

          const res = await rp.post({url, body}).catch((e) => e);
          expect(res.statusCode).toEqual(409);
        });
      });

      context('When too big', () => {
        it('returns 413 and no file appears', async() => {
          const file = fse.readFileSync(`${fixturesRoot}/big.png`);
          const options = {
            url: `${host}/big.png`,
            body: file,
          };

          const res = await rp.post(options).catch((e)=>e);
          expect(res.statusCode).toEqual(413);
          
          setTimeout(() => {
            expect(fse.existsSync(config.get('filesRoot') + '/big.png')).toEqual(false);
          }, 30);
        });
      });
    });
  });


  // it('delete existing file', (done) => {
  //   request.delete(`http://localhost:3000/${fileName}.html`, (error, response, body) => {
  //     if (error) return done(error);

  //     const result = 'OK';
  //     assert.equal(body, result);

  //     try {
  //       fs.readFileSync(`files/${fileName}.html`);
  //     } catch (e) {
  //       assert.equal(e.code, 'ENOENT');
  //     }
  //     done();
  //   });
  // });

  // it('delete NOT existing file', (done) => {
  //   request.delete(`http://localhost:3000/${fileName}.html`, (error, response, body) => {
  //     if (error) return done(error);

  //     const result = 'File not found';
  //     assert.equal(result, result);

  //     try {
  //       fs.readFileSync(`files/${fileName}.html`);
  //     } catch (e) {
  //       assert.equal(e.code, 'ENOENT');
  //     }
  //     done();
  //   });
  // });
});
