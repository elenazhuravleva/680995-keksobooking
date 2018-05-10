// Файл maps.js
'use strict';

(function () {

  var map = document.querySelector('.map');
  var adForm = document.querySelector('.ad-form');
  var mapPinsBlock = document.querySelector('.map__pins');
  var docFragment = document.createDocumentFragment();
  var mapPinMainButton = document.querySelector('.map__pin--main'); // Это метка
  var address = document.querySelector('#address');
  var mapPinMainButtonWidth = mapPinMainButton.querySelector('img').width;
  var mapPinMainButtonHeight = mapPinMainButton.querySelector('img').height;
  var mapPinMainButtonStartLeft = mapPinMainButton.style.left;
  var mapPinMainButtonStartTop = mapPinMainButton.style.top;
  var startCoords = {};
  var mouseClick = false;

  // Пределы карты, за которые не должна вылезать главная метка
  var MAP_PIN_LOCATION_X_LIMITS = {
    MIN: 0,
    MAX: 1135
  };

  var MAP_PIN_LOCATION_Y_LIMITS = {
    MIN: 150,
    MAX: 625
  };

  var MAP_PIN_MAIN_TAIL_LENGTH = 22;

  window.map = {
    // Отрисовка сгенерированных DOM-элементов в блок
    createMapPins: function (parent, offer) {
      if (parent.querySelector('.map__pin--new')) {
        var childs = parent.querySelectorAll('.map__pin--new');
        childs.forEach(function (it) {
          it.remove();
        });
      }
      for (var i = 0; i < offer.length; i++) {
        if (i === window.filter.OFFERS_NUMBER) {
          break;
        }
        var offerElement = offer[i];
        docFragment.appendChild(window.pin.createMarkerForOffer(offerElement));
      }
      parent.appendChild(docFragment);
    },

    setActivePage: function (status) {
      if (status) {
        map.classList.remove('map--faded');
        adForm.classList.remove('ad-form--disabled');
      } else {
        mapPinMainButton.style.left = mapPinMainButtonStartLeft;
        mapPinMainButton.style.top = mapPinMainButtonStartTop;
        map.classList.add('map--faded');
        adForm.classList.add('ad-form--disabled');
        window.map.createMapPins(mapPinsBlock, []);
        mapPinMainButton.addEventListener('mouseup', onMapPinMainButtonMouseup);
        mapPinMainButton.removeEventListener('mousedown', onMapPinMainButtonMousedown);
      }
      window.form.setFieldsetDisabled(!status);
      setAddressField();
      mapPinMainButton.addEventListener('mousedown', onMapPinMainButtonMousedown);
    },

    resetPins: function () {
      var mapPins = mapPinsBlock.querySelectorAll('.map__pin:not(.map__pin--main)');
      for (var i = 0; i < mapPins.length; i++) {
        mapPinsBlock.removeChild(mapPins[i]);
      }
    }
  };

  // Поле адреса
  var setAddressField = function () {
    address.value = (parseInt(mapPinMainButton.style.left, 10) - mapPinMainButtonWidth / 2) + ', ' + (parseInt(mapPinMainButton.style.top, 10) - mapPinMainButtonHeight / 2);
    address.readOnly = true;
  };

  var updateAddressField = function () {
    address.value = (parseInt(mapPinMainButton.style.left, 10) + mapPinMainButtonWidth / 2) + ', ' + (parseInt(mapPinMainButton.style.top, 10) + mapPinMainButtonHeight / 2 + MAP_PIN_MAIN_TAIL_LENGTH);
  };

  var onMapPinMainButtonMousemove = function (evt) {
    evt.preventDefault();

    var movement = {
      x: startCoords.x - evt.clientX,
      y: startCoords.y - evt.clientY
    };

    startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var finalTop = mapPinMainButton.offsetTop - movement.y;
    var finalLeft = mapPinMainButton.offsetLeft - movement.x;

    if (finalTop < MAP_PIN_LOCATION_Y_LIMITS.MIN) {
      finalTop = MAP_PIN_LOCATION_Y_LIMITS.MIN;
    } else if (finalTop > MAP_PIN_LOCATION_Y_LIMITS.MAX) {
      finalTop = MAP_PIN_LOCATION_Y_LIMITS.MAX;
    }

    if (finalLeft < MAP_PIN_LOCATION_X_LIMITS.MIN) {
      finalLeft = MAP_PIN_LOCATION_X_LIMITS.MIN;
    } else if (finalLeft > MAP_PIN_LOCATION_X_LIMITS.MAX) {
      finalLeft = MAP_PIN_LOCATION_X_LIMITS.MAX;
    }

    mapPinMainButton.style.top = finalTop + 'px';
    mapPinMainButton.style.left = finalLeft + 'px';
    updateAddressField();
  };

  // работа с меткой
  var onMapPinMainButtonMouseup = function (evt) {
    evt.preventDefault();
    mapPinMainButton.removeEventListener('mousedown', onMapPinMainButtonMousedown);
    window.map.setActivePage(true);
    mouseClick = true;
    if (mouseClick) {
      window.map.createMapPins(mapPinsBlock, window.data.nearestOffers.slice(0, window.filter.offersNumber));
    }
    updateAddressField();
    window.form.onRoomsSelectorChange();
    window.form.onTypeSelectorChange();
    document.removeEventListener('mousemove', onMapPinMainButtonMousemove);
    document.removeEventListener('mouseup', onMapPinMainButtonMouseup);
  };

  var onSuccess = function (response) {
    window.data.setData(response);
    window.map.createMapPins(mapPinsBlock, window.data.nearestOffers.slice(0, window.filter.offersNumber));
  };

  var onError = function (errorMessage) {
    window.util.showErrorMessage(errorMessage);
  };

  var onMapPinMainButtonMousedown = function (evt) {
    evt.preventDefault();
    window.map.setActivePage(true);
    if (!window.data.dataLoad() && !window.backend.dataLoadingState) {
      window.backend.dataLoad(onSuccess, onError);
    }
    startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    document.addEventListener('mousemove', onMapPinMainButtonMousemove);
    document.addEventListener('mouseup', onMapPinMainButtonMouseup);
  };

  var onMapPinsBlockCLick = function (evt) {
    var target = evt.target;
    while (!target.classList.contains('map__pin') && target.parentElement !== null) {
      target = target.parentElement;
    }
    if (target.dataset.offer) {
      window.card.createCard(JSON.parse(target.dataset.offer));
    }
  };


  // Действие по активации страницы по нажатию на метку
  mapPinMainButton.addEventListener('keydown', function (evt) {
    window.util.onEnterPress(evt, onMapPinMainButtonMouseup);
  });

  // Действия по активации карточек объявлений
  mapPinsBlock.addEventListener('click', onMapPinsBlockCLick);
  mapPinsBlock.addEventListener('keydown', function (evt) {
    window.util.onEnterPress(evt, onMapPinsBlockCLick);
  });

  // По умолчанию страница недоступна
  window.map.setActivePage(false);
  mapPinMainButton.addEventListener('mousedown', onMapPinMainButtonMousedown);

})();
