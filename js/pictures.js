'use strict';

(function() {
  /* global pictures: true */
  function hiddenFormFilters() {
    var formFilters = document.forms[0];
    formFilters.classList.add('hidden');
  }
  hiddenFormFilters();

  var container = document.querySelector('.pictures');

  //Проходит по массиву файле data/pictures.js,  вставляет
  //созданные элементы в конец контейнера .pictures
  //(количество добавленных элементов равно количеству элементов в массиве)
  pictures.forEach(function(picture) {
    var element = getElementFormTemplate(picture);
    container.appendChild(element);
  });

  //для каждого элементвы создает DOM - элемент на основе шаблона
  function getElementFormTemplate(data) {
    var template = document.getElementById('picture-template');

    if ('content' in template) {
      var element = template.content.firstElementChild.cloneNode(true);
    } else {
      element = template.firstElementChild.cloneNode(true);
    }

    element.querySelector('.picture-comments').textContent = data.comments;
    element.querySelector('.picture-likes').textContent = data.likes;

    // создает изображение с помощью  объекта new Image()
    var backgroundImage = new Image();
    var innerPicture = element.querySelector('img');

   //если изображение не загружается в течении 10 с,
   //прекращает загрузку изображения
    var timeuotLoadImage = setTimeout(function() {
      backgroundImage.src = '';
      element.classList.add('picture-load-failure');
    }, 10000);

    //обработчик загрузки: после загрузки изображение, находящиеся
    //в шаблоне заменется на изображение new Image()
    //если изображение по прошествии 10 секунд загружается, отменяет
    //таймаут незагрузки изображения TimeuotLoadImage
    backgroundImage.onload = function() {
      clearTimeout(timeuotLoadImage);
      backgroundImage.width = 182;
      backgroundImage.height = 182;
      element.replaceChild(backgroundImage, innerPicture);
      visibleFormFilters();
    };

    //обработчик ошибки загрузки изображения
    backgroundImage.onerror = function() {
      element.classList.add('picture-load-failure');
    };

    //дбасляет атребут - src к изображению new Image()
    backgroundImage.src = data.url;
    return element;
  }

  //Отображает блок с фильтрами
  function visibleFormFilters() {
    var formFilters = document.forms[0];
    formFilters.classList.remove('hidden');
  }


})();
