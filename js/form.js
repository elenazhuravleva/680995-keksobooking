// Файл form.js
'use strict';

(function () {

  var adForm = document.querySelector('.ad-form');
  var fieldset = document.querySelectorAll('fieldset');
  var capacitySelector = adForm.querySelector('#capacity');
  var roomsSelector = adForm.querySelector('#room_number');
  var typeSelector = adForm.querySelector('#type');
  var priceSelector = adForm.querySelector('#price');
  var timeinSelector = adForm.querySelector('#timein');
  var timeoutSelector = adForm.querySelector('#timeout');
  var resetForm = adForm.querySelector('#form-reset');
  var submit = adForm.querySelector('#submit');
  var typeCheckboxSelect = adForm.querySelectorAll('[type="checkbox"]');
  var titleSelector = adForm.querySelector('#title');


  var FORM_DEFAULTS = {
    'title': '',
    'address': '',
    'type': 'flat',
    'price': 1000,
    'rooms': '1',
    'capacity': '1',
    'timein': '12:00',
    'timeout': '12:00',
    'description': ''
  };


  var setFieldsetDisabled = function (status) {
    fieldset.forEach(function (it) {
      it.disabled = status;
    });
  };

  var onRoomsSelectorChange = function () {
    var ALLOWED_VARIANTS = {
      '1': ['1'],
      '2': ['1', '2'],
      '3': ['1', '2', '3'],
      '100': ['0']
    };
    var rooms = roomsSelector.options[roomsSelector.selectedIndex].value;
    var capacity = capacitySelector.options;
    for (var i = 0; i < capacity.length; i++) {
      if (ALLOWED_VARIANTS[rooms].indexOf(capacity[i].value) === -1) {
        capacity[i].disabled = true;
        capacity[i].style.display = 'none';
      } else {
        capacity[i].disabled = false;
        capacity[i].selected = true;
        capacity[i].style.display = 'block';
      }
    }

  };

  var onTimeSelectorChange = function (evt) {
    timeinSelector.value = evt.target.value;
    timeoutSelector.value = evt.target.value;
  };

  var onTypeSelectorChange = function () {
    var ALLOWED_VARIANTS = {
      'palace': 10000,
      'flat': 1000,
      'house': 5000,
      'bungalo': 0
    };

    var type = typeSelector.options[typeSelector.selectedIndex].value;
    var minAllowedValue = ALLOWED_VARIANTS[type];
    priceSelector.placeholder = minAllowedValue;
    priceSelector.min = minAllowedValue;
  };
  var setErrors = function () {
    var errorElements = adForm.querySelectorAll('.error');
    for (var i = 0; i < errorElements.length; i++) {
      var element = errorElements[i];
      element.style.border = '1px solid red';
    }

  };

  var clearErrors = function () {
    var errorElements = adForm.querySelectorAll('.error');

    for (var i = 0; i < errorElements.length; i++) {
      var element = errorElements[i];
      element.style.border = '1px solid black';
      element.classList.remove('error');
    }
  };

  // Кнопка "очистить" обновляет карту, данные полей обнуляет, закрывает активную карточку объявления
  var onResetFormClick = function () {

    for (var key in FORM_DEFAULTS) {
      if (key !== '') {
        adForm.querySelector('[name="' + key + '"]').value = FORM_DEFAULTS[key];
      }
    }
    typeCheckboxSelect.forEach(function (checkbox) {
      checkbox.checked = false;
    });
    window.filter.resetFilter();
    window.card.closeCard();
    window.map.setActivePage(false);
    clearErrors();
  };

  var checkError = function (element) {
    if (!element.validity.valid) {
      element.classList.add('error');
    }
  };


  var onSubmitClick = function () {
    clearErrors();
    checkError(capacitySelector);
    checkError(priceSelector);
    checkError(titleSelector);
    setErrors();
  };

  adForm.addEventListener('submit', function (evt) {
    window.backend.dataUpload(new FormData(adForm), function (response) {
      if (response !== null) {
        window.util.showSuccessMessage();
        onResetFormClick();
      }
    }, function (errorMessage) {
      window.util.createErrorMessage(errorMessage);
    });
    evt.preventDefault();
  });

  window.form = {
    setFieldsetDisabled: setFieldsetDisabled,
    onRoomsSelectorChange: onRoomsSelectorChange,
    onTimeSelectorChange: onTimeSelectorChange,
    onTypeSelectorChange: onTypeSelectorChange,
    onResetFormClick: onResetFormClick,
    onSubmitClick: onSubmitClick
  };

  roomsSelector.addEventListener('change', onRoomsSelectorChange);
  typeSelector.addEventListener('change', onTypeSelectorChange);
  timeinSelector.addEventListener('change', onTimeSelectorChange);
  timeoutSelector.addEventListener('change', onTimeSelectorChange);
  resetForm.addEventListener('click', onResetFormClick);
  submit.addEventListener('click', onSubmitClick);

})();
