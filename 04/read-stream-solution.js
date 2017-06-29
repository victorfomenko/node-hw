const fs = require('fs');

// хотим читать данные из потока в цикле
function readStream(stream) {
  let globalError = null;

  function onGlobalError(err) {
    globalError = err;
  }

  stream.on('error', onGlobalError);

  return function() {
    return new Promise((resolve, reject) => {
      if (globalError) {
        cleanup();
        stream.removeListener('error', onGlobalError);
        reject(globalError);
      }

      function onData(chunk) {
        stream.pause();
        cleanup();
        resolve(chunk);
      }

      function onEnd() {
        cleanup();
        stream.removeListener('error', onGlobalError);
        resolve(null);
      }

      function onError(err) {
        cleanup();
        stream.removeListener('error', onGlobalError);
        reject(err);
      }

      function cleanup() {
        stream.removeListener('data', onData);
        stream.removeListener('end', onEnd);
        stream.removeListener('error', onError);
      }

      stream.on('data', onData);
      stream.on('end', onEnd);
      stream.on('error', onError);
      stream.resume();
    });
  }
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function read(path) {

  let stream = fs.createReadStream(path, {highWaterMark: 60, encoding: 'utf-8'});

  let data;

  // ЗАДАЧА: написать такой readStream
  let reader = readStream(stream);

  while(data = await reader()) {
    console.log(data);
    await sleep(1000);
  }

}

read(__filename).catch(console.error);
