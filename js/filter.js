'use strict';

(function () {

  var OFFERS_NUMBER = 5;

  var mapFilters = document.querySelector('.map__filters');
  var mapPinsBlock = document.querySelector('.map__pins');
  var housingType = mapFilters.querySelector('#housing-type');
  var housingPrice = mapFilters.querySelector('#housing-price');
  var housingRooms = mapFilters.querySelector('#housing-rooms');
  var housingGuests = mapFilters.querySelector('#housing-guests');
  var featuresSelector = mapFilters.querySelector('.map__features');
  var filterWifiSelector = featuresSelector.querySelector('#filter-wifi');
  var filterDishwasherSelector = featuresSelector.querySelector('#filter-dishwasher');
  var filterParkingSelector = featuresSelector.querySelector('#filter-parking');
  var filterWasherSelector = featuresSelector.querySelector('#filter-washer');
  var filterElevatorSelector = featuresSelector.querySelector('#filter-elevator');
  var filterConditionerSelector = featuresSelector.querySelector('#filter-conditioner');


  var FiltersDefaults = {
    'housing-type': 'any',
    'housing-price': 'any',
    'housing-rooms': 'any',
    'housing-guests': 'any'
  };

  var FiltersFeaturesDefaults = {
    'filter-wifi': false,
    'filter-dishwasher': false,
    'filter-parking': false,
    'filter-washer': false,
    'filter-elevator': false,
    'filter-conditioner': false
  };

  var FeaturesClassListMap = {
    'filter-wifi': 'wifi',
    'filter-dishwasher': 'dishwasher',
    'filter-parking': 'parking',
    'filter-washer': 'washer',
    'filter-elevator': 'elevator',
    'filter-conditioner': 'conditioner'
  };


  var resetFilter = function () {
    housingPrice.value = 'any';
    housingRooms.value = 'any';
    housingType.value = 'any';
    housingGuests.value = 'any';
    filterConditionerSelector.checked = false;
    filterDishwasherSelector.checked = false;
    filterElevatorSelector.checked = false;
    filterParkingSelector.checked = false;
    filterWasherSelector.checked = false;
    filterWifiSelector.checked = false;
  };


  var filterForHousingPrice = function (offerPrice) {
    var MIDDLE_PRICE = 10000;
    var MAX_PRICE = 50000;
    var priceValue = false;

    switch (FiltersDefaults['housing-price']) {
      case 'any':
        priceValue = true;
        break;
      case 'middle':
        priceValue = offerPrice >= MIDDLE_PRICE && offerPrice <= MAX_PRICE;
        break;
      case 'low':
        priceValue = offerPrice <= MIDDLE_PRICE;
        break;
      case 'high':
        priceValue = offerPrice >= MAX_PRICE;
        break;
    }
    return priceValue;
  };

  var checkFilterCheckbox = function (el, feature) {
    return !FiltersFeaturesDefaults[feature] ||
      (FiltersFeaturesDefaults[feature] &&
        el.offer.features &&
        el.offer.features.indexOf(FeaturesClassListMap[feature]) !== -1);
  };

  var tryFilter = function (element, feature, featureValue, isNumber) {
    return featureValue === 'any' || element.offer[feature] === (isNumber ? +featureValue : featureValue);
  };

  var setFilterOnOffers = function (element) {
    var filterType = tryFilter(element, 'type', FiltersDefaults['housing-type'], false);
    var filterPrice = filterForHousingPrice(element.offer.price);

    var filterRooms = tryFilter(element, 'rooms', FiltersDefaults['housing-rooms'], true);
    var filterGuests = tryFilter(element, 'guests', FiltersDefaults['housing-guests'], true);

    var filterWifi = checkFilterCheckbox(element, 'filter-wifi');
    var filterDishwasher = checkFilterCheckbox(element, 'filter-dishwasher');
    var filterParking = checkFilterCheckbox(element, 'filter-parking');
    var filterWasher = checkFilterCheckbox(element, 'filter-washer');
    var filterElevator = checkFilterCheckbox(element, 'filter-elevator');
    var filterConditioner = checkFilterCheckbox(element, 'filter-conditioner');

    return filterType && filterPrice && filterRooms && filterGuests &&
    filterWifi && filterDishwasher && filterParking &&
    filterWasher && filterElevator && filterConditioner ? true : false;
  };

  var resetOffers = function () {
    window.map.resetPins();
    window.map.createMapPins(mapPinsBlock, window.data.nearestOffers.filter(setFilterOnOffers).slice(0, OFFERS_NUMBER));
  };

  var onMapFiltersChange = function (evt) {

    window.card.setCardVisible(false);
    var element = evt.target;
    var value = null;
    while (!element.classList.contains('map__filter') && !element.classList.contains('map__checkbox') && element.parentElement !== null) {
      element = element.parentElement;
    }
    if (element.value) {
      if (element.type === 'checkbox') {
        value = element.checked;
      } else {
        value = element.value;
      }
      FiltersDefaults[element.id] = value;
      FiltersFeaturesDefaults[element.id] = value;
      window.map.resetPins();
      window.util.debounce(resetOffers);
    }

  };

  mapFilters.addEventListener('change', onMapFiltersChange);

  window.filter = {
    OFFERS_NUMBER: OFFERS_NUMBER,
    resetFilter: resetFilter
  };

})();
