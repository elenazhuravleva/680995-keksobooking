'use strict';

(function () {

  var offersNumber = 5;

  var mapFilters = document.querySelector('.map__filters');
  var mapPinsBlock = document.querySelector('.map__pins');
  var housingType = mapFilters.querySelector('#housing-type');
  var housingPrice = mapFilters.querySelector('#housing-price');
  var housingRooms = mapFilters.querySelector('#housing-rooms');
  var housinGuests = mapFilters.querySelector('#housing-guests');
  var featuresSelector = mapFilters.querySelector('.map__features');
  var filterWifi = featuresSelector.querySelector('#filter-wifi');
  var filterDishwasher = featuresSelector.querySelector('#filter-dishwasher');
  var filterParking = featuresSelector.querySelector('#filter-parking');
  var filterWasher = featuresSelector.querySelector('#filter-washer');
  var filterElevator = featuresSelector.querySelector('#filter-elevator');
  var filterConditioner = featuresSelector.querySelector('#filter-conditioner');

  var typeCheckboxSelect = featuresSelector.querySelectorAll('[type="checkbox"]');

  var filtersDefaults = {
    'housing-type': 'any',
    'housing-price': 'any',
    'housing-rooms': 'any',
    'housing-guests': 'any'
  };

  var filtersFeaturesDefaults = {
    'filter-wifi': false,
    'filter-dishwasher': false,
    'filter-parking': false,
    'filter-washer': false,
    'filter-elevator' : false,
    'filter-conditioner': false
  };

  var featuresClassListMap = {
    'filter-wifi': 'wifi',
    'filter-dishwasher': 'dishwasher',
    'filter-parking': 'parking',
    'filter-washer': 'washer',
    'filter-elevator': 'elevator',
    'filter-conditioner': 'conditioner'
   };

  var resetFiltersDefaults = function () {
    for (let key in filtersDefaults) {
      mapFilters.querySelector('[name="'+ key +'"]').value = filtersDefaults[key];
    }
    typeCheckboxSelect.forEach(function(checkbox) {
      checkbox.checked = false;
    });
  };

  var updateFilter = function () {
    housingPrice.value = 'any';
    housingRooms.value = 'any';
    housingType.value = 'any';
    housinGuests.value = 'any';
    filterConditioner.checked = false;
    filterDishwasher.checked = false;
    filterElevator.checked = false;
    filterParking.checked = false;
    filterWasher.checked = false;
    filterWifi.checked = false;

    resetFiltersDefaults();
  };


  var filterForHousingPrice = function (offerPrice) {
    var minPrice = 0;
    var middlePrice = 10000;
    var maxPrice = 50000;
    var priceValue = false;

    switch (filtersDefaults['housing-price']) {
      case 'any':
        priceValue = true;
        break;
      case 'middle':
        priceValue = offerPrice >= middlePrice && offerPrice <= maxPrice;
        break;
      case 'low':
        priceValue = offerPrice <= middlePrice;
        break;
      case 'high':
        priceValue = offerPrice >= maxPrice;
        break;
      }
      return priceValue;
      };

      var checkFilterCheckbox = function (el, feature) {
        return !filtersFeaturesDefaults[feature] ||
          (filtersFeaturesDefaults[feature] &&
            el.offer.features &&
            el.offer.features.indexOf(featuresClassListMap[feature]) !== -1);
      };

      var tryFilter = function (element, feature, featureValue, isNumber) {
        return featureValue === 'any' || element.offer[feature] === (isNumber ? +featureValue : featureValue);
      };

      var setFilterOnOffers = function (element) {
        var filterType = tryFilter(element, 'type', filtersDefaults['housing-type'], false);
        var filterPrice = filterForHousingPrice(element.offer.price);

        var filterRooms = tryFilter(element, 'rooms', filtersDefaults['housing-rooms'], true);
        var filterGuests = tryFilter(element, 'guests', filtersDefaults['housing-guests'], true);

        var filterWifi = checkFilterCheckbox(element, 'filter-wifi');
        var filterDishwasher = checkFilterCheckbox(element, 'filter-dishwasher');
        var filterParking = checkFilterCheckbox(element, 'filter-parking');
        var filterWasher = checkFilterCheckbox(element, 'filter-washer');
        var filterElevator = checkFilterCheckbox(element, 'filter-elevator');
        var filterConditioner = checkFilterCheckbox(element, 'filter-conditioner');

        return filterType && filterPrice && filterRooms && filterGuests &&
          filterWifi && filterDishwasher && filterParking &&
          filterWasher && filterElevator && filterConditioner ? true: false;
      };

  var resetOffers = function () {
    window.map.resetPins();
    window.map.createMapPins(mapPinsBlock, window.data.nearestOffers.filter(setFilterOnOffers).slice(0,offersNumber));
  };

  var onMapFiltersChange = function (evt) {
    var element = evt.target;
    var value = null;
    while (!element.classList.contains('map__filter') && !element.classList.contains('map__checkbox') && element.parentElement !== null) {
      element = element.parentElement;
    }
    if (element.value) {
      if (element.type === 'checkbox') {value = element.checked;}
      else {
        value = element.value;
      }
      filtersDefaults[element.id] = value;
      filtersFeaturesDefaults[element.id] = value;
      window.map.resetPins();
      window.util.debounce(resetOffers);
    }

  };

  mapFilters.addEventListener('change', onMapFiltersChange);

  window.filter = {
    offersNumber: offersNumber,
    updateFilter: updateFilter
  };

})();
