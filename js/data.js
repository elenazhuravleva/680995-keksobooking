// Файл data.js
'use strict';
(function () {

  var nearestOffers = [];

  var setData = function (response) {
    window.data.nearestOffers = response;
  };

  var dataLoad = function () {
    return window.data.nearestOffers.length !== 0;
  };

  window.data = {
    setData: setData,
    nearestOffers: nearestOffers,
    dataLoad: dataLoad
  };
})();
