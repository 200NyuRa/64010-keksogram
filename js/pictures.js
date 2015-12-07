'use strict';

(function() {
  var container = document.querySelector('.pictures');
  var formFilters = document.forms[0];
  function hiddenFormFilters() {
    formFilters.classList.add('hidden');
  }

  hiddenFormFilters();

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
  function renderPictures(pictures) {
    container.innerHTML = '';
    pictures.forEach(function(picture) {
      var element = getElementFormTemplate(picture);
      container.appendChild(element);
    });
  }


//Фильтрация фотографий

  var formFilterPicture = document.querySelectorAll('.filters-radio');

  var pictureList = [];
  var activeFilter = 'filter-popular';

  for (var i = 0; i < formFilterPicture.length; i++ ) {
    formFilterPicture[i].onclick = function(evt) {
      var clickElementID = evt.target.id;
      setActiveFilterPicture(clickElementID);
    };
  }

  //установка выбранного фильтра
  function setActiveFilterPicture(id, force) {
    if (activeFilter === id && !force) {
      return;
    }

    //копирование массива с отелями
    var pictureListFiltered = pictureList.slice(0);
    switch (id) {
      case 'filter-new':
         //сортировка списока фотографий, сделанных за последние три месяца,
         //отсортированных по убыванию даты (поле date)

        // сначала отсортируем фоторгафии  по убыванию даты
        pictureListFiltered = pictureList.sort(function(a, b) {
          var dateB = new Date(b.date);
          var dateA = new Date(a.date);
          return dateB - dateA;
        });

        //фильтрация фотографий, сделанных за последние три месяца
        pictureListFiltered = pictureListFiltered.filter(function(dateItem) {

          //фотография с самой поздней датой - первый элемент в массиве pictureListFiltered
          var lasterPictureDate = new Date(pictureListFiltered[0].date);
          //
          var threeMonthsLaster = lasterPictureDate.setMonth(lasterPictureDate.getMonth() - 3);


          dateItem = new Date(dateItem.date);

          //уменьшаем дату фотографии сделанной позже всех на 3 месяца,
          //сравним с полученной датой даты других фотографий в массиве,
         // результат запишем в новый массив
          return dateItem > threeMonthsLaster;
        });
        break;

      case 'filter-discussed':
        // сортировка списка фотографий по убыванию количества комментариев (поле comments)
        pictureListFiltered = pictureList.sort(function(a, b) {
          return b.comments - a.comments;
        });
        break;
    }

    renderPictures(pictureListFiltered);
  }



  function uploadPicture(loadPictures) {
    pictureList = loadPictures;
    setActiveFilterPicture(activeFilter, true);
  }

  //Отображает блок с фильтрами
  function visibleFormFilters() {
    formFilters.classList.remove('hidden');
  }

})();