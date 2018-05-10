// Файл pin.js
'use strict';

(function () {

  var template = document.querySelector('template');
  var mapPinButtonTemplate = template.content.querySelector('.map__pin');

  // создание DOM-элементов, соответствующих меткам на карте
  window.pin = {

    createMarkerForOffer: function (offer) {
      var mapPinElement = mapPinButtonTemplate.cloneNode(true);
      var image = mapPinElement.querySelector('img');
      mapPinElement.tabindex = '0';
      mapPinElement.style.left = offer.location.x - image.width / 2 + 'px';
      mapPinElement.style.top = offer.location.y - image.height + 'px';
      image.src = offer.author.avatar;
      image.alt = offer.title;
      mapPinElement.dataset.offer = JSON.stringify(offer);
      return mapPinElement;
    }
  };
})();
