// Файл maps.js
'use strict';

(function () {

 var map = document.querySelector('.map');
 var adForm = document.querySelector('.ad-form');
 var template = document.querySelector('template');
 var mapCardArticleTemplate = template.content.querySelector('.map__card');
 var mapPinsBlock = document.querySelector('.map__pins');
 var docFragment = document.createDocumentFragment();
 var mapPinMainButton = document.querySelector('.map__pin--main'); //Это метка
 var mapCardElement = mapCardArticleTemplate.cloneNode(true);
 var address = document.querySelector('#address');
 var mapPinMainButtonWidth = mapPinMainButton.querySelector('img').width;
 var mapPinMainButtonHeight = mapPinMainButton.querySelector('img').height;
 var mapPinMainButtonStartLeft = mapPinMainButton.style.left;
 var mapPinMainButtonStartTop = mapPinMainButton.style.top;
 var startCoords = {};
 var mouseClick = false;

// Пределы карты, за которые не должна вылезать главная метка
var mapPinLocationXLimits = {
  min: 0,
  max: 1135
};

var mapPinLocationYLimits = {
  min: 150,
  max: 625
}

var mapPinMainTailLength = 22;

  //Отрисовка сгенерированных DOM-элементов в блок
  var createMapPins = function (parent, offer) {
    if(parent.querySelector('.map__pin--new')) {
    var childs = parent.querySelectorAll('.map__pin--new');
    childs.forEach(function(it) {
      it.remove();
    })
    }
    for (var i = 0; i < offer.length; i++) {
      docFragment.appendChild(window.pin.createMarkerForOffer(offer[i],i));
    }
    parent.appendChild(docFragment);
    };

    window.map = {
      setActivePage : function (status) {
    if (status) {
      map.classList.remove('map--faded');
      adForm.classList.remove('ad-form--disabled');
      } else {
      mapPinMainButton.style.left = mapPinMainButtonStartLeft;
      mapPinMainButton.style.top = mapPinMainButtonStartTop;
      map.classList.add('map--faded');
      adForm.classList.add('ad-form--disabled');
       createMapPins(mapPinsBlock,[]);
       document.addEventListener('mouseup',onMapPinMainButtonMouseup);
       mapPinMainButton.removeEventListener('mousedown', onMapPinMainButtonMousedown);
      }
      window.form.setFieldsetDisabled(!status);
      setAddressField();
      mapPinMainButton.addEventListener('mousedown',onMapPinMainButtonMousedown);
    }
  };

     //Поле адреса
    var setAddressField = function () {
    address.value = (parseInt(mapPinMainButton.style.left, 10) - mapPinMainButtonWidth / 2) + ', ' + (parseInt(mapPinMainButton.style.top, 10) - mapPinMainButtonHeight / 2);
    address.readOnly = true;
    };

    var updateAddressField = function () {
      address.value = (parseInt(mapPinMainButton.style.left, 10) + mapPinMainButtonWidth / 2) + ', ' + (parseInt(mapPinMainButton.style.top, 10) + mapPinMainButtonHeight / 2 + mapPinMainTailLength);
    };

    var onMapPinMainButtonMousemove = function(evt) {
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

      if (finalTop < mapPinLocationYLimits.min) {
        finalTop = mapPinLocationYLimits.min;
      } else if (finalTop > mapPinLocationYLimits.max) {
        finalTop = mapPinLocationYLimits.max;
      }

      if (finalLeft < mapPinLocationXLimits.min) {
        finalLeft = mapPinLocationXLimits.min;
      } else if (finalLeft > mapPinLocationXLimits.max) {
        finalLeft = mapPinLocationXLimits.max;
      }

      mapPinMainButton.style.top = finalTop + 'px';
      mapPinMainButton.style.left = finalLeft + 'px';
      updateAddressField();
    };

    //работа с меткой
    var onMapPinMainButtonMouseup = function(evt) {
    evt.preventDefault();
    mapPinMainButton.removeEventListener('mousedown',onMapPinMainButtonMousedown);
    window.map.setActivePage(true);
    mouseClick = true;
    if ( mouseClick) {
    createMapPins(mapPinsBlock,window.data.nearestOffers);}
    updateAddressField();
    window.form.onRoomsSelectorChange();
    window.form.onTypeSelectorChange();
    document.removeEventListener('mousemove',onMapPinMainButtonMousemove);
    document.removeEventListener('mouseup',onMapPinMainButtonMouseup);
  };

   var onSuccess = function (response) {
    window.data.setData(response);
   };

   var onError = function (errorMessage) {
    window.util.showErrorMessage(errorMessage);
   };

    var onMapPinMainButtonMousedown = function(evt) {
    evt.preventDefault();
    window.map.setActivePage(true);
    if (!window.data.dataLoad() && !window.backend.dataLoadingState) {
      window.backend.dataLoad (onSuccess, onError);
    }
    startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    document.addEventListener('mousemove', onMapPinMainButtonMousemove);
    document.addEventListener('mouseup', onMapPinMainButtonMouseup);
  }

  var onMapPinsBlockCLick = function(evt) {
    var target = evt.target;
    var currentPin;
    while (!target.classList.contains('map__pin') && target.parentElement !== null) {
      target = target.parentElement;
    }
    currentPin = target.dataset.index;
    if (isFinite(currentPin)) {
        window.card.createCard(window.data.nearestOffers,currentPin);
      }
  };


//Действие по активации страницы по нажатию на метку
  mapPinMainButton.addEventListener('keydown', function (evt) {
  window.util.onEnterPress(evt,onMapPinMainButtonMouseup);
});

//Действия по активации карточек объявлений
mapPinsBlock.addEventListener('click',onMapPinsBlockCLick);
mapPinsBlock.addEventListener('keydown', function (evt) {
  window.util.onEnterPress(evt,onMapPinsBlockCLick);
});

//По умолчанию страница недоступна
window.map.setActivePage(false);
mapPinMainButton.addEventListener('mousedown', onMapPinMainButtonMousedown);

})();
