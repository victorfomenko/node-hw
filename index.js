
//  ЗАДАЧА
//  Написать HTTP-сервер для загрузки и получения файлов
//  - Все файлы находятся в директории files
//  - Структура файлов НЕ вложенная.

//  - Виды запросов к серверу
//    GET /file.ext [image.png, text.txt]
//    - выдаёт файл file.ext из директории files,

//    POST /file.ext []
//    - пишет всё тело запроса в файл files/file.ext и выдаёт ОК
//    - если файл уже есть, то выдаёт ошибку 409
//    - при превышении файлом размера 1MB выдаёт ошибку 413

//    DELETE /file
//    - удаляет файл
//    - выводит 200 OK
//    - если файла нет, то ошибка 404

//  Вместо file может быть любое имя файла.
//  Так как поддиректорий нет, то при наличии / или .. в пути сервер должен выдавать ошибку 400.

// - Сервер должен корректно обрабатывать ошибки 'файл не найден' и другие (ошибка чтения файла)
// - index.html или curl для тестирования


'use strict';

const url = require('url');
const sendFile = require('./sendFile');
const createFile = require('./createFile');
const deleteFile = require('./deleteFile');

require('http').createServer(function(req, res) {
  const filePath = url.parse(req.url).pathname;

  switch (req.method) {
    case 'GET':
        sendFile(filePath, res);
        return;

    case 'POST':
        createFile(filePath, req, res);
        return;

    case 'DELETE':
        deleteFile(filePath, res);
        return;

  default:
    res.statusCode = 502;
    res.end('Not implemented');
  }
}).listen(3000);

