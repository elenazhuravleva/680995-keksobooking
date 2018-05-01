// Файл maps.js
'use strict';

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

var map = document.querySelector('.map');
var adForm = document.querySelector('.ad-form');
var template = document.querySelector('template');
var mapCardArticleTemplate = template.content.querySelector('.map__card');
var mapPinButtonTemplate = template.content.querySelector('.map__pin');
var mapPinsBlock = document.querySelector('.map__pins');
var docFragment = document.createDocumentFragment();
var mapFiltersContainer = document.querySelector('.map__filters-container');
var mapPinMainButton = document.querySelector('.map__pin--main'); //Это метка
var fieldset = document.querySelectorAll('fieldset');
var mapCardElement = mapCardArticleTemplate.cloneNode(true);
var address = document.querySelector('#address');
var mapPinMainButtonWidth = mapPinMainButton.querySelector('img').width;
var mapPinMainButtonHeight = mapPinMainButton.querySelector('img').height;
var capacitySelector = adForm.querySelector('#capacity');
var roomsSelector = adForm.querySelector('#room_number');
var typeSelector = adForm.querySelector('#type');
var priceSelector = adForm.querySelector('#price');
var timeinSelector = adForm.querySelector('#timein');
var timeoutSelector = adForm.querySelector('#timeout');
var resetForm = adForm.querySelector('#form-reset');
var typeCheckboxSelect = adForm.querySelectorAll('[type="checkbox"]');

var nearestOffers = [];
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

var locationXRange = {
  min: 300,
  max: 900
};

var locationYRange = {
  min: 150,
  max: 500
};

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
    var positionX = getRandom(locationXRange.min,locationXRange.max);
    var positionY = getRandom(locationYRange.min, locationYRange.max);
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
        'checkin': getRandom(12, 14) + ':00',
        'checkout': getRandom(12, 14) + ':00',
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
var createMarker = function (offer,id) {    // createmarkerofferonmap or foroffer
  var mapPinElement = mapPinButtonTemplate.cloneNode(true);
  var image = mapPinElement.querySelector('img');
  mapPinElement.tabindex = '0';
  mapPinElement.style.left = offer.location.x - image.width / 2 + 'px';
  mapPinElement.style.top = offer.location.y - image.height + 'px';
  image.src = offer.author.avatar;
  image.alt = offer.title;
  mapPinElement.dataset.index = id;

  return mapPinElement;
};

//Отрисовка сгенерированных DOM-элементов в блок
var createMapPins = function (parent, offer) {
  if(parent.querySelector('.map__pin--new')) {
  var childs = parent.querySelectorAll('.map__pin--new');
  childs.forEach(function(it) {
    it.remove();
  })
  }
  for (var i = 0; i < offer.length; i++) {
    docFragment.appendChild(createMarker(offer[i],i));
  }
  parent.appendChild(docFragment);
};

var makePopupPhoto = function (parent, photo) {
  var image = parent.querySelector('img').cloneNode(true);
  image.src = photo;
  image.classList.remove('hidden');

  return image;
};

var makePopupPhotos = function (parent, photos) {
  photos.forEach(function(it){docFragment.appendChild(makePopupPhoto(parent, it))});
  var images = parent.querySelectorAll('img:not(.hidden)');
  images.forEach(function(it) {parent.removeChild(it)});
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

  popupPhotosElement.querySelector('img').classList.add('hidden');
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

var createCard = function (offersArray,id) {
  openCard();
  docFragment.appendChild(fillCard(offersArray[id]));
  map.insertBefore(docFragment, mapFiltersContainer);
};

var setFieldsetDisabled = function (status) {
  fieldset.forEach(function(it){it.disabled = status;});
  };

var setActivePage = function (status) {
  if (status) {
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    } else {
    map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    }
    setFieldsetDisabled(!status);
    setAddressField();
};

//Поле адреса
var setAddressField = function () {
  address.value = (parseInt(mapPinMainButton.style.left, 10) - mapPinMainButtonWidth / 2) + ', ' + (parseInt(mapPinMainButton.style.top, 10) - mapPinMainButtonHeight / 2);
  address.readOnly = true;
};
var updateAddressField = function () {
  address.value = (parseInt(mapPinMainButton.style.left, 10) + mapPinMainButtonWidth / 2) + ', ' + (parseInt(mapPinMainButton.style.top, 10) + mapPinMainButtonHeight / 2 + 22);
};

//работа с меткой
var onMapPinMainButtonMouseup = function() {
  setActivePage(true);
  createData();
  createMapPins(mapPinsBlock,nearestOffers);
  updateAddressField();
  onRoomsSelectorChange();
  onTypeSelectorChange();
  mapPinMainButton.removeEventListener('mouseup',onMapPinMainButtonMouseup);
};

var onCardEscPress = function(evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeCard();
  }
};

var closeCard = function() {
  mapCardElement.classList.add('hidden');
  document.removeEventListener('keydown', onCardEscPress);
};

var openCard = function() {
  mapCardElement.classList.remove('hidden');
  document.addEventListener('keydown', onCardEscPress);
};

var onMapPinsBlockCLick = function(evt) {
  var target = evt.target;
  var currentPin;
  while (!target.classList.contains('map__pin') && target.parentElement !== null) {
    target = target.parentElement;
  }
  currentPin = target.dataset.index;
  if (isFinite(currentPin)) {
      createCard(nearestOffers,currentPin);
      var closeButton = mapCardElement.querySelector('.popup__close');
      if (closeButton !== null) {
        closeButton.tabindex = '0';
        var onCloseButton = function () {
          closeCard();
        };
        closeButton.addEventListener('click', onCloseButton);
        closeButton.addEventListener('keydown', function (evt) {
        if (evt.keyCode === ENTER_KEYCODE) {
          closeCard();
        }
        });
      }
    }
};

//Действие по активации страницы по нажатию на метку
mapPinMainButton.addEventListener('mouseup',onMapPinMainButtonMouseup);

//Действия по активации карточек объявлений
mapPinsBlock.addEventListener('click',onMapPinsBlockCLick);
mapPinsBlock.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    onMapPinsBlockCLick(evt);
  }
});

//По умолчанию страница недоступна
setActivePage(false);

var onRoomsSelectorChange = function () {
  var allowedVariants = {
    '1': ['1'],
    '2': ['1','2'],
    '3': ['1','2','3'],
    '100': ['0']
  };
  var rooms = roomsSelector.options[roomsSelector.selectedIndex].value;
  var capacity = capacitySelector.options;
  for (var i = 0; i < capacity.length; i++) {
    if (allowedVariants[rooms].indexOf(capacity[i].value) === -1) {
      capacity[i].disabled = true;
      capacity[i].style.display = 'none';
    } else {
      capacity[i].disabled = false;
      capacity[i].selected = true;
      capacity[i].style.display = 'block';
    }
  };
};

var onTypeSelectorChange = function () {
  var allowedVariants = {
    'palace': 10000,
    'flat': 1000,
    'house': 5000,
    'bungalo': 0
  };

  var type = typeSelector.options[typeSelector.selectedIndex].value;
  var minAllowedValue = allowedVariants[type];
  priceSelector.placeholder = minAllowedValue;
  priceSelector.min = minAllowedValue;
};

var onTimeSelectorChange = function (evt) {
  timeinSelector.value = evt.target.value;
  timeoutSelector.value = evt.target.value;
};

var onResetFormClick = function () {
  var formDefaults = {
    'title' : '',
    'address' : '',
    'type' : 'flat',
    'price' : 1000,
    'rooms' : '1',
    'capacity' : '1',
    'timein' : '12:00',
    'timeout' : '12:00',
    'description' : ''
  }

  for (let key in formDefaults) {
    adForm.querySelector('[name="'+ key +'"]').value = formDefaults[key];
  }
  typeCheckboxSelect.forEach(function(checkbox) {
    checkbox.checked = false;
  });

  nearestOffers =[];
  createMapPins(mapPinsBlock,nearestOffers);
  closeCard();
  setActivePage(false);
  setAddressField();
  mapPinMainButton.addEventListener('mouseup',onMapPinMainButtonMouseup);
};

roomsSelector.addEventListener('change', onRoomsSelectorChange);
typeSelector.addEventListener('change', onTypeSelectorChange);
timeinSelector.addEventListener('change', onTimeSelectorChange);
timeoutSelector.addEventListener('change', onTimeSelectorChange);
resetForm.addEventListener('click', onResetFormClick);
