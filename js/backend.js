// Файл backend.js
'use strict';

(function () {

  var Url = {
    LOAD: 'https://js.dump.academy/keksobooking/data/',
    UPLOAD: 'https://js.dump.academy/keksobooking'
  };

  var XHR_TIMEOUT = 10000;
  var STATUS_OK = 200;
  var STATUS_WRONG_REQUEST = 400;
  var STATUS_NOTHING_FOUND = 404;
  var dataLoadingState = false;

  var xhrConfig = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === STATUS_OK) {
        window.backend.dataLoadingState = false;
        onSuccess(xhr.response);
      } else if (xhr.status === STATUS_WRONG_REQUEST) {
        onError('неверный запрос');
      } else if (xhr.status === STATUS_NOTHING_FOUND) {
        onError('ничего не найдено');
      } else {
        onError('Стастус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });


    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения. Код ошибки ' + xhr.statusText);
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = XHR_TIMEOUT;
    return xhr;
  };

  // Функция получения данных с сервера
  var dataLoad = function (onSuccess, onError) {
    window.backend.dataLoadingState = true;
    var xhr = xhrConfig(onSuccess, onError);
    xhr.open('GET', Url.LOAD);
    xhr.send();
  };

  // Функция для отправки данных на сервер
  var dataUpload = function (data, onSuccess, onError) {
    var xhr = xhrConfig(onSuccess, onError);
    xhr.open('POST', Url.UPLOAD);
    xhr.send(data);
  };

  window.backend = {
    dataLoad: dataLoad,
    dataUpload: dataUpload,
    dataLoadingState: dataLoadingState
  };

})();
