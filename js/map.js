// Файл maps.js
'use strict';

var mapMode = document.querySelector('.map');
var template = document.querySelector('template');
var mapCardArticleTemplate = template.content.querySelector('.map__card');
var mapPinButtonTemplate = template.content.querySelector('.map__pin');
var mapPinsBlock = document.querySelector('.map__pins');
var docFragment = document.createDocumentFragment();
var mapSection = document.querySelector('.map');
var mapFiltersContainer = document.querySelector('.map__filters-container');

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

var typeTranslate = {
  'palace': 'Дворец',
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalo': 'Бунгало'
};

var featuresArray = ['wifi',
                     'dishwasher',
                     'parking',
                     'washer',
                     'elevator',
                     'conditioner'];

var photosArray = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
                   'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
                   'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var locationX = [300, 900];
var locationY = [150, 500];

var nearestOffers = [];

var getRandom = function (min, max) {
  var rand = Math.floor(Math.random() * (max - min + 1) + min);
  return rand;
};

var getArrayNoDuplicate = function (array) {
  var newArray = array.slice(0,array.length);
  var k = 0;
  var temp = 0;
  for (var i = newArray.length -1; i > 0 ; i--) {
    k = Math.floor(Math.random()*(i+1));
    temp = newArray[i];
    newArray[i] = newArray[k];
    newArray[k] = temp;
  }
  return newArray;
};

var getArrayRandomLength = function (array) {
  return getArrayNoDuplicate(array).slice(0,getRandom(1,array.length));
}

//Заполнение массива объектов
var createData = function () {
  var titleElement = getArrayNoDuplicate(titleArray);

  for (var i = 0; i < advertArrayLength; i++) {
    var positionX = getRandom(locationX[0],locationX[1]);
    var positionY = getRandom(locationY[0], locationY[1]);
    nearestOffers[i] = {
      'author': {
        'avatar': 'img/avatars/user0' + (i+1) +'.png'
      },
      'offer': {
        'title': titleElement[i],
        'address': positionX + ', ' + positionY,
        'price': getRandom (1000,1000000),
        'type': typeArray[getRandom(0,typeArray.length-1)],
        'rooms': getRandom(1, 5),
        'guests': getRandom(1, 10),
        'checkin': '1' + getRandom(2, 4) + ':00',
        'checkout': '1' + getRandom(2, 4) + ':00',
        'features': getArrayRandomLength(featuresArray),
        'description': '',
        'photos': getArrayNoDuplicate(photosArray)
      },
      'location': {
        'x': positionX,
        'y': positionY
      }
    };

  };
};

//создание DOM-элементов, соответствующих меткам на карте
var createMarker = function (offer) {
  var mapPinElement = mapPinButtonTemplate.cloneNode(true);
  var image = mapPinElement.querySelector('img');
  mapPinElement.style.left = offer.location.x - image.width / 2 + 'px';
  mapPinElement.style.top = offer.location.y - image.height + 'px';
  image.src = offer.author.avatar;
  image.alt = offer.title;

  return mapPinElement;
};

//Отрисовка сгенерированных DOM-элементов в блок
var createMapPins = function (parent, offer) {
  for (var i = 0; i < offer.length; i++) {
    docFragment.appendChild(createMarker(offer[i]));
  }
  parent.appendChild(docFragment);
};

var makePopupPhoto = function (parent, photo) {
  var image = parent.querySelector('img').cloneNode(true);
  image.src = photo;

  return image;
};

var makePopupPhotos = function (parent, photos) {
  for (var i = 0; i < photos.length; i++) {
    docFragment.appendChild(makePopupPhoto(parent, photos[i]));
  }
  parent.removeChild(parent.querySelector('img'));
  parent.appendChild(docFragment);
};


var fillPopupFeature = function (feature) {
  var liElement = document.createElement('li');
  liElement.classList.add('popup__feature');
  liElement.classList.add('popup__feature--' + feature);

  return liElement;
};

var fillPopupFeatures = function (parent, features) {
  var ulElement = document.createElement('ul');
  parent.removeChild(parent.querySelector('.popup__features'));
  ulElement.className = 'popup__features';

  for (var i = 0; i < features.length; i++) {
    docFragment.appendChild(fillPopupFeature(features[i]));
  }
  ulElement.appendChild(docFragment);
  parent.appendChild(ulElement);
};



var fillCard = function (inputOfferElement) {
  var mapCardElement = mapCardArticleTemplate.cloneNode(true);
  var popupAvatarElement = mapCardElement.querySelector('.popup__avatar');
  var popupPhotosElement = mapCardElement.querySelector('.popup__photos');
  var offerRooms = inputOfferElement.offer.rooms;
  var offerRoomsText = ' комнат';
  var offerGuests = inputOfferElement.offer.guests;
  var offerGuestsText = offerGuests === 1 ? ' гостя' : ' гостей';

  if (offerRooms === 1) {
    offerRoomsText += 'а';
  } else if (offerRooms !== 5) {
    offerRoomsText += 'ы';
  }

  mapCardElement.querySelector('.popup__title').textContent = inputOfferElement.offer.title;
  mapCardElement.querySelector('.popup__text--address').textContent = inputOfferElement.offer.address;
  mapCardElement.querySelector('.popup__text--price').innerHTML = inputOfferElement.offer.price + '&#x20bd;<span>/ночь</span>';
  mapCardElement.querySelector('.popup__type').textContent = typeTranslate[inputOfferElement.offer.type];
  mapCardElement.querySelector('.popup__text--capacity').textContent = offerRooms + offerRoomsText + ' для ' + offerGuests + offerGuestsText;
  mapCardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + inputOfferElement.offer.checkin + ', выезд до ' + inputOfferElement.offer.checkout;
  fillPopupFeatures(mapCardElement, inputOfferElement.offer.features);
  mapCardElement.querySelector('.popup__description').textContent = inputOfferElement.offer.description;
  makePopupPhotos(popupPhotosElement, inputOfferElement.offer.photos);
  popupAvatarElement.src = inputOfferElement.author.avatar;
  popupAvatarElement.alt = inputOfferElement.offer.title;

  return mapCardElement;
};

var createCard = function (offersArray) {
  for (var i = 0; i < offersArray.length; i++) {
    docFragment.appendChild(fillCard(offersArray[i]));
  }
  mapSection.insertBefore(docFragment, mapFiltersContainer);
};

mapMode.classList.remove('map--faded');
createData();
createMapPins(mapPinsBlock,nearestOffers);
createCard(nearestOffers.slice(0, 1));
