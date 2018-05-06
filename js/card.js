// Файл card.js
'use strict';

(function () {

  var typeTranslate = {
      'palace': 'Дворец',
      'flat': 'Квартира',
      'house': 'Дом',
      'bungalo': 'Бунгало'
    };

  var map = document.querySelector('.map');
  var template = document.querySelector('template');
  var mapCardArticleTemplate = template.content.querySelector('.map__card');
  var docFragment = document.createDocumentFragment();
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var mapCardElement = mapCardArticleTemplate.cloneNode(true);
  var closeButton = mapCardElement.querySelector('.popup__close');

  var makePopupPhoto = function (parent, photo) {
    if (parent.querySelector('img')) {
      var image = parent.querySelector('img').cloneNode(true);
    } else {
      var image = parent.appendChild(document.createElement('img'));
      image.classList.add('popup__photo');
      image.width = 45;
      image.height = 40;
    }
    image.src = photo;
    image.classList.remove('hidden');
    return image;
  };

  var makePopupPhotos = function (parent, photos) {
    photos.forEach(function(it){docFragment.appendChild(makePopupPhoto(parent, it))});
    var images = parent.querySelectorAll('img:not(.hidden)');
    if (images.length !==0 ) {
    images.forEach(function(it) {parent.removeChild(it)});
    parent.removeChild(parent.querySelector('img'));}
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

    if (popupPhotosElement.querySelector('img')) {
    popupPhotosElement.querySelector('img').classList.add('hidden');
    popupPhotosElement.dataset.hasimage = 0;
    } else {
      popupPhotosElement.dataset.hasimage = 1;
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
  // Создание карточки объявления
  var createCard = function (offersArray,id) {
  openCard();
  docFragment.appendChild(fillCard(offersArray[id]));
  map.insertBefore(docFragment, mapFiltersContainer);
  };

  var onCloseButtonClick = function () {
     closeCard();
  };


  var closeCard = function() {
    mapCardElement.classList.add('hidden');
    document.removeEventListener('keydown', function (evt) { window.util.onEscPress(evt,closeCard)});
    closeButton.removeEventListener('click', onCloseButtonClick);
    closeButton.removeEventListener('keydown', function (evt) {
      window.util.onEnterPress(evt, closeCard)
    });
  };

  var openCard = function() {
    mapCardElement.classList.remove('hidden');
    document.addEventListener('keydown', function (evt) {window.util.onEscPress(evt,closeCard)});

    if (closeButton !== null) {
      closeButton.tabindex = '0';
      closeButton.addEventListener('click', onCloseButtonClick);
      closeButton.addEventListener('keydown', function (evt) {
        window.util.onEnterPress(evt,closeCard);
      });
    }
  };

  window.card = {
    closeCard: closeCard,
    openCard: openCard,
    createCard: createCard,
    setCardVisible : function (flag) {
      if (flag) {
        mapCardElement.classList.remove('hidden');
      } else {
        mapCardElement.classList.add('hidden');
      }
    }
  };
})();
