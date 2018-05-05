// Файл data.js
'use strict';
(function () {


  var advertArrayLength = 8;
  var titleArray = ['Большая уютная квартира',
                    'Маленькая неуютная квартира',
                    'Огромный прекрасный дворец',
                    'Маленький ужасный дворец',
                    'Красивый гостевой домик',
                    'Некрасивый негостеприимный домик',
                    'Уютное бунгало далеко от моря',
                    'Неуютное бунгало по колено в воде'];

  var typeArray = ['palace',
                   'flat',
                   'house',
                   'bungalo'];

  var featuresArray = ['wifi',
                       'dishwasher',
                       'parking',
                       'washer',
                       'elevator',
                       'conditioner'];

  var photosArray = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
                     'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
                     'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

  var locationXRange = {
    min: 300,
    max: 900
  };

  var locationYRange = {
    min: 150,
    max: 500
  };

  var nearestOffers = [];

  window.data = {

  createData : function () {
    var titleElement = window.util.getArrayShuffledNoDuplicate(titleArray);
    for (var i = 0; i < advertArrayLength; i++) {
      var positionX = window.util.getRandom(locationXRange.min,locationXRange.max);
      var positionY = window.util.getRandom(locationYRange.min, locationYRange.max);
      nearestOffers[i] = {
        'author': {
          'avatar': 'img/avatars/user0' + (i+1) +'.png'
        },
        'offer': {
          'title': titleElement[i],
          'address': positionX + ', ' + positionY,
          'price': window.util.getRandom (1000,1000000),
          'type': typeArray[window.util.getRandom(0,typeArray.length-1)],
          'rooms': window.util.getRandom(1, 5),
          'guests': window.util.getRandom(1, 10),
          'checkin': window.util.getRandom(12, 14) + ':00',
          'checkout': window.util.getRandom(12, 14) + ':00',
          'features': window.util.getArrayRandomLength(featuresArray),
          'description': '',
          'photos': window.util.getArrayShuffledNoDuplicate(photosArray)
        },
        'location': {
          'x': positionX,
          'y': positionY
        }
      };
    };
  },
    nearestOffers: nearestOffers
  };
})();
