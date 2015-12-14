'use strict';

function getMessage(a, b) {
  // переменные для разных типов данных
  var DataTypeBoolean = 'boolean';
  var DataTypeNamber = 'number';
  var DataTypeObject = 'object';

  //условие - первый аргумент имеет тип boolean и он true
  if (typeof a == DataTypeBoolean && a ) {
    var message = 'Переданное GIF-изображение анимировано и содержит ' + b + ' кадров';
  }

  //условие - первый аргумент имеет тип boolean и он false
  else if (typeof a == DataTypeBoolean && false){
    var message = 'Переданное GIF-изображение не анимировано';
  }

  //условие - первый аргумент имеет числовой тип
  else if (typeof a == DataTypeNamber){
    var message = 'Переданное SVG-изображение содержит ' + a + ' объектов и ' + (b * 4) + ' аттрибутов';
  }

  //условие - первый аргумент имеет тип объект
  else if (typeof a == DataTypeObject && a.length > 0 && typeof b !== DataTypeObject){
    var sum = 0;
    for (var i = 0; i < a.length; i++){
      sum += a[i];
    }
    var message = 'Количество красных точек во всех строчках изображения ' + sum;
  }

  //условие - оба аргумент имеют тип объект
  else if (typeof a == DataTypeObject && a.length > 0 && typeof b == DataTypeObject && b.length > 0){
    var square = 0;
    //сравниваем длину аргументов - массивов
    var minLengthArray = Math.min(a.length, b.length);

    //колличество перемножаемых элементов каждого массива равно количеству элеменнов в массиве меньшей длины
    for (var i = 0; i < minLengthArray; i++){
      square += a[i] * b[i];
    }

    var message = 'Общая площадь артефактов сжатия: ' + square + ' пикселей';
  }

  return message;
}


