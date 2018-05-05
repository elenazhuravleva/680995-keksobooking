// Файл util.js
'use strict';
(function () {

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

  window.util = {
     getRandom : function (min, max) {
      var rand = Math.floor(Math.random() * (max - min + 1) + min);
      return rand;
    },

    // Перемешанный массив
     getArrayShuffledNoDuplicate : function (array) {
      var newArray = array.slice(0,array.length);
      var k = 0;
      var temp = 0;
      for (var i = newArray.length -1; i > 0 ; i--) {
        k = Math.floor(Math.random()*(i+1));
        temp = newArray[i];
        newArray[i] = newArray[k];
        newArray[k] = temp;
      }
      return newArray;
    },

    // Массив случайной длины
     getArrayRandomLength : function (array) {
      return this.getArrayShuffledNoDuplicate(array).slice(0,this.getRandom(1,array.length));
    },

    onEscPress : function(evt,action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action(evt);
      }
    },

    onEnterPress : function(evt,action) {
      if (evt.keyCode === ENTER_KEYCODE) {
        action(evt);
      }
    }
  }
})();
