// Файл util.js
'use strict';
(function () {

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
var timeout;

var successElement = document.querySelector('.success');

var createErrorMessage = function (message) {
  var errorElement = document.createElement('div');
  var errorText = document.createElement('p');
  errorText.textContent = message;
  errorText.style.fontSize = '30px';
  errorText.style.textAlign = 'center';
  errorElement.style.position = 'absolute';
  errorElement.style.width = '300px';
  errorElement.style.height = '100px';
  errorElement.style.left = 0;
  errorElement.style.top = 0;
  errorElement.style.right = 0;
  errorElement.style.bottom = 0;
  errorElement.style.margin = 'auto';
  errorElement.style.backgroundColor = 'red';
  errorElement.style.border = 'px solid #d4d4d4';
  errorElement.style.opacity = 0.9;
  errorElement.style.zIndex = 100;
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
        }, 3000);
    },
    showErrorMessage: function (message) {
      var errorElement = createErrorMessage(message);
      setTimeout(function () {
        document.body.removeChild(errorElement);
        }, 10000);
    },

    debounce: function (myfunction) {
     if (timeout) {
       window.clearTimeout(timeout);
     }
      timeout = window.setTimeout(myfunction, 300);
    }
  }
})();
