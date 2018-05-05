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
var typeCheckboxSelect = adForm.querySelectorAll('[type="checkbox"]');

var mapPinsBlock = document.querySelector('.map__pins');
var mapPinMainButton = document.querySelector('.map__pin--main');

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
};


 var setFieldsetDisabled = function (status) {
  fieldset.forEach(function(it){it.disabled = status;});
};

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

 var onTimeSelectorChange =  function (evt) {
  timeinSelector.value = evt.target.value;
  timeoutSelector.value = evt.target.value;
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

// Кнопка "очистить" обновляет карту, данные полей обнуляет, закрывает активную карточку объявления
var onResetFormClick = function () {
for (let key in formDefaults) {
  adForm.querySelector('[name="'+ key +'"]').value = formDefaults[key];
}
typeCheckboxSelect.forEach(function(checkbox) {
  checkbox.checked = false;
});
window.card.closeCard();
window.map.setActivePage(false);
};

window.form = {
  setFieldsetDisabled: setFieldsetDisabled,
  onRoomsSelectorChange: onRoomsSelectorChange,
  onTimeSelectorChange: onTimeSelectorChange,
  onTypeSelectorChange: onTypeSelectorChange,
  onResetFormClick: onResetFormClick
};

roomsSelector.addEventListener('change', onRoomsSelectorChange);
typeSelector.addEventListener('change', onTypeSelectorChange);
timeinSelector.addEventListener('change', onTimeSelectorChange);
timeoutSelector.addEventListener('change', onTimeSelectorChange);
resetForm.addEventListener('click', onResetFormClick);

})();
