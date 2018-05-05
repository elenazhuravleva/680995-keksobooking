// Файл util.js
'use strict';
(function () {

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

var successElement = document.querySelector('.success');

var createErrorMessage = function () {
  var errorElement = document.createElement('div');
  var errorText = document.createElement('p');
  errorText.textContent = message;
  errorText.style.fontSize = '30px';
  errorText.style.textAlign = 'center';
  errorElement.style.position = 'absolute';
  errorElement.style.width = '700px';
  errorElement.style.height = '100px';
  errorElement.appendChild(errorText);
  document.body.insertAdjacentElement('afterbegin', errorElement);
  return errorElement;
};

  window.util = {

    onEscPress : function(evt,action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action(evt);
      }
    },

    onEnterPress : function(evt,action) {
      if (evt.keyCode === ENTER_KEYCODE) {
        action(evt);
      }
    },

    showSuccessMessage: function () {
      successElement.classList.remove('hidden');
      setTimeout(function () {
        successElement.classList.add('hidden');
        }, 30000);
    },
    showErrorMessage: function (message) {
      var errorElement = createErrorMessage(message);
      setTimeout(function () {
        document.body.removeChild(errorElement);
        }, 100000000);
    }
  }
})();
