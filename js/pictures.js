'use strict';

(function() {
  var container = document.querySelector('.pictures');
  var formFilters = document.forms[0];
  var pictureList = [];
  var pictureListFiltered = [];
  var currentPage = 0;
  var PAGE_SIZE = 12;//константа обозначает,что на странице будет показанно по 12 отелейБ длz отрисовки списка постранично

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
    };

    //обработчик ошибки загрузки изображения
    backgroundImage.onerror = function() {
      element.classList.add('picture-load-failure');
    };

    //добасляет атребут - src к изображению new Image()
    backgroundImage.src = data.url;
    return element;
  }

  /**
   * Загрузка списка с фотографиями
   */
  function getPicture() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'data/pictures.json');
    xhr.timeout = 10000;

    //пока длится загрузка файла, отображается прелоадер
    container.classList.add('pictures-loading');

    xhr.onload = function(evt) {
      var rawData = evt.target.response;
      var loadPictures = JSON.parse(rawData);
      uploadPicture(loadPictures);
      container.classList.remove('pictures-loading');
    };

    //функция ошибка при загрузке
    var getError = function() {
      // Убираем прелоадер, если есть.
      if (container.classList.contains('pictures-loading')) {
        container.classList.remove('pictures-loading');
      }
      container.classList.add('pictures-failure');
    };

    xhr.onerror = getError;
    xhr.ontimeout = getError;

    xhr.send();
  }

  getPicture();

  //выводит фотографии на экран
  function renderPictures(pictures, pageNamber, replace) {
    if (replace) {
      container.innerHTML = ' ';
    }

    //переменные для отрисовки списка фотографий постранично
    var from = pageNamber * PAGE_SIZE; // первый отель на новой отрисованной станице
    var to = from + PAGE_SIZE; // последний отель на новой отрисованной странице
    var pagePictures = pictures.slice(from, to); // массив для отрисовки n-ой страницы


    pagePictures.forEach(function(picture) {
      var element = getElementFormTemplate(picture);
      container.appendChild(element);
    });

    //Отображает блок с фильтрами
    if (formFilters.classList.contains('hidden')) {
      formFilters.classList.remove('hidden');
    }
  }

  //отрисовка фотографий при скроле
  window.addEventListener('scroll', function() {
    var scrollTimeout;
    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(function() {
      if (container.getBoundingClientRect().bottom <= window.innerHeight) {
        if (currentPage < Math.ceil(pictureListFiltered.length / PAGE_SIZE)) {
          renderPictures(pictureListFiltered, ++currentPage);
        }
      }
    }, 100);
  });

//Фильтрация фотографий
  var formFilterPicture = document.querySelector('.filters');

  formFilterPicture.addEventListener('click', function(evt) {
    var clickElement = evt.target;
    if (clickElement.classList.contains('filters-radio')) {
      var clickElementID = clickElement.id;
      setActiveFilterPicture(clickElementID);
    }
  });

  //установка выбранного фильтра
  function setActiveFilterPicture(id) {

    //копирование массива с картинками
    pictureListFiltered = pictureList.slice(0);

    switch (id) {
      case 'filter-new':
        //фильтрация списока фотографий, в новый массив попадают фотографии,
        // сделанные за последние три месяца
        pictureListFiltered = pictureListFiltered.filter(function(Item) {
          //уменьшаем сегодняшнюю дату на 3 месяца,
          //в новый массив запишем фотографии сделанные позже полученной даты
          var dateNow = new Date();
          var threeMonthBefore = dateNow.setMonth(dateNow.getMonth() - 3);
          var dateItem = new Date(Item.date);
          return dateItem > threeMonthBefore;
        });

        //сортировка отфильторованных фотографий  по убыванию даты
        pictureListFiltered = pictureListFiltered.sort(function(a, b) {
          var dateA = new Date(a.date);
          var dateB = new Date(b.date);
          return dateB - dateA;
        });
        break;

      case 'filter-discussed':
        // сортировка списка фотографий по убыванию количества комментариев (поле comments)
        pictureListFiltered = pictureListFiltered.sort(function(a, b) {
          return b.comments - a.comments;
        });
        break;

      case 'filter-popular':
        pictureListFiltered = pictureList;
    }

    currentPage = 0;
    renderPictures(pictureListFiltered, currentPage, true);
  }

  function uploadPicture(loadPictures) {
    pictureList = loadPictures;
    setActiveFilterPicture('filter-popular');
  }
})();
