var F7 = new Framework7();
var $ = Dom7;
var mainView = F7.addView('.view-main', { dynamicNavbar: true, domCache: true, smartSelectOpenIn:'picker'});
if (localStorage.getItem('phone') !== null) {
  window.phone = localStorage.getItem('phone');
  F7.popup('#popup-login');
  //$('#input-login').focus();
} else F7.loginScreen();
function init(data) {
  $('#my-bonus').text(data.bonus);
  $('#my-bonus2').text(data.bonus);
  $('#my-f').text(data.f95);
  $('#my-f92').text(data.f92);
  $('#my-f95').text(data.f95);
  $('#my-f95U').text(data.f95U);
  $('#my-f98').text(data.f98);
  $('#my-fd').text(data.fd);
  run(api, 'transactions/my', {}, function(data) {
    for (var i = 0; i < data.length; i++) {
      var goods = [];
      for (var j = 0; j < data[i].goods.length; j++) goods.push(data[i].goods[j].ammount + ' ' + data[i].goods[j].description);
      $('#activity').append('<li><div class="list-item '+ (data[i].total > 0 ? 'sell' : data[i].card === 'creditcard' ? 'station' : 'gas')  +'"><a href="#order-info"><div class="list-item-title">' + goods.join(', ') + '</div></a></div></li>');
    }
  });
  $.ajax({url: 'https://driveinn.ru/getcards.php', data: {phone: window.phone}, dataType: 'json', success: function(data) {
    allert(data);
  }, error: function() { alert('error') }});
  //<option value="1" selected>0000 00** **00 0000</option>
  //<option value="2">0000 00** **00 0000</option>
}
var inputL = 0;
var currentUser = null;

$('#input-phone').keydown(function () {
  var curchr = this.value.length;
  var curval = $(this).val();
  if(inputL < this.value.length) {
    if (curchr == 3 && curval.indexOf('(') == -1) { $("#input-phone").val("(" + curval + ")" + "-"); }
    else if (curchr == 4 && curval.indexOf(')') == -1){ $("#input-phone").val(curval + ")" + "-"); }
    else if (curchr == 9) { $("#input-phone").val(curval + "-"); }
    else if (curchr == 12) { $("#input-phone").val(curval + "-"); }
    inputL = this.value.length;
  } else { inputL = this.value.length; }
});
$('#input-phone').keyup(function () {
  window.phone = '7' + $("#input-phone").val().replace(/[^\d]/g, '');
  if ($('#input-phone').val().length == 15) $('#button-next').removeClass('disabled'); else $('#button-next').addClass('disabled');
});
$('#input-phone').keypress(function (e) {  if (e.which === 13 && $('#input-phone').val().length == 15) $('#button-next').click(); });
$('#get-code-btn').click(function() {
    $('.item-phone, #login-btns').hide();
    $('.login-sub-title').html('Код полученный в СМС');
    $('.item-code, #code-btns').show();
});
$('#button-сhange').click(function () {
  F7.closeModal('#popup-login');
  F7.loginScreen();
});
$('#button-next').click(function () {
  run(api, 'users/register', {method: 'POST', phone: window.phone}, function(data) {
    if (data.errorCode != 0) {
      F7.closeModal('.login-screen');
      F7.popup('#popup-login');
      $('#input-login').focus();
    } else {
      $('#login-descr').text('Код полученный в СМС');
      $('#login-phone').hide();
      $('#login-sms').show();
      $('#input-sms')[0].removeAttribute('disabled');
      $('#input-sms').focus();
      $('#login-next').hide();
      $('#login-retry').show();
    }
  });
});
$('#input-login').keyup(function () {
  if ($('#input-login').val().length == 4){
    run(api, 'users/authenticate', {method: 'POST', phone: window.phone, pin: $('#input-login').val()}, function(data) {
      if (data.errorCode == 0) {
        localStorage.setItem('phone', window.phone);
        F7.closeModal('#popup-login');
        $('#input-login').blur();
        currentUser = data.user;
        init();
      } else {
        $('#input-login').val('');
        alert(data.message);
      }
    });
  }
});
$('#input-register').keyup(function () {
  if ($('#input-register').val().length == 4) {
    run(api, 'users/changeUserAndSetPin', {method: 'POST', sessionId: window.sessionId, email: $('#userinfo-email').val(), firstName: $('#userinfo-name').val().split(' ')[0], lastName: $('#userinfo-name').val().split(' ')[1] || 'Anonymous', pin: $('#input-register').val()}, function(data) {
      if (data.errorCode == 0) {
        localStorage.setItem('phone', window.phone);
        F7.closeModal('#popup-register');
      } else {
        $('#input-register').val('');
        alert(data.message);
      }
    });
  }
});
$('#input-sms').keyup(function () {
  if ($('#input-sms').val().length == 6) {
    $('#input-sms')[0].setAttribute('disabled', true);
    run(api, 'users/register_complete', {method: 'POST', phone: window.phone, sessionId: window.sessionId, verificationCode: $('#input-sms').val()}, function(data) {
      $('#input-sms')[0].removeAttribute('disabled');
      if (data.errorCode == 0) {
        F7.closeModal('.login-screen');
        F7.popup('#popup-userinfo');
      } else {
        alert(data.message);
      }
    });
  }
});
$('#userinfo-register').click(function() {
  F7.closeModal('#popup-userinfo');
  F7.popup('#popup-register');
});
$('#get-password-3').click(function () {
  var popupHTML = '<div class="popup"><div class="login-screen-title">Подтвердите пароль</div><div class="list-block"><ul><li><div class="item-content"><div class="item-inner"><div class="item-input"><input type="password" placeholder=""></div></div></div></li></ul></div>';
  F7.popup(popupHTML);
});  
$('#regist-finish').click(function () {
  var popupHTML = '<div class="popup"><div class="login-screen-title">Регистрация завершена успешно!</div><a class="button-custom">Начать использование</a></div>';
  F7.popup(popupHTML);
});
$('#success-buy').on('click', function () {
  var popupHTML = '<div class="popup"><div class="login-screen-title">Топливная карта<br> успешно пополнена</div><div class="title-custom"><span>+200</span> <i class="icon icon-fire icon-fire-blue"></i> АИ-95</div><div class="label">Пригласи друга и получите по 5 литров топлива каждый!<a>Выбрать друга</a></div><a class="button-custom">Закрыть</a></div>';
  F7.popup(popupHTML);
});  
$('#add-car-save').on('click', function(){
  run(api, 'cars/', {
    method: 'POST',
    fuel: $('#add-car-fuel').val(),
    label: $('#add-car-label').val(),
    number: $('#add-car-number').val(),
    ammount: $('#add-car-ammount').val()
  }, function(data) {
    mainView.router.load({pageName: 'cars'});
  });
});

var loadCarsList = function()
{
  var $listBlock = $('.list-cars ul');
  $listBlock.hide();
  $.ajax({
    url: 'https://driveinn.ru/api/cars/my',
    method: 'GET',
    dataType: 'json',
    headers: {
      Authorization: 'Bearer ' + window.Authorization
    },
    success: function(data) {

      $listBlock.html('');

      data.forEach(function (d) {
        $listBlock.html(  $listBlock.html() + '<li><a href="" class="item-link item-content"> <div class="item-inner"> <div class="item-title">' + d.label + '</div> </div> </a> </li>');
      });

      $listBlock.show();
    },
    error: function () {
      $listBlock.show();
    }
  });
};

F7.onPageReinit('cars', loadCarsList);
F7.onPageInit('cars', loadCarsList);

// $('[data-bind-click="carsPage"]').on('click', function () {
//
// });

$('#map-page-link').on('click', function () {
    F7.closeModal('.popover-gas');
});
$('#map-page-link, #refuel-page-link').on('click', function () {
  F7.closeModal('.popover-gas');
});

function allert(data) {
  alert(JSON.stringify(data));
}
function run(func) {
  var args = [], that = {error: function() { navigator.notification.alert('', function() { func.apply(that, args); }, 'No Connection', 'Retry'); }};
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  func.apply(that, args);
}
function api(method, query, callback, error) {
  if ('error' in this) error = this.error;
  F7.showPreloader();
  $.ajax({url: 'https://driveinn.ru/api/' + method, method: 'method' in query ? query.method : 'GET', data: query, dataType: 'json', headers: {Authorization: 'Bearer ' + window.Authorization}, success: function(data) {
    F7.hidePreloader();
    if ('sessionId' in data) window.sessionId = data.sessionId;
    if ('token' in data) window.Authorization = data.token;
    setTimeout(function() { callback(data); }, 0);
  }, error: error});
}






$('#map').css('width', window.innerWidth + 'px');
$('#map').css('height', (window.innerHeight - 40 / window.devicePixelRatio) + 'px');
ymaps.ready(function () {
    var addreses = [{
        name: 'AЗС №198',
        address: 'Ленинский проспект 3/1'
    }, {
        name: 'AЗС №200',
        address: 'Баррикадная 20'
    }];
    var myMap = new ymaps.Map('map', {
            center: [55.751574, 37.573856],
            zoom: 10,
            behaviors: ['default', 'scrollZoom']
        }, {
            searchControlProvider: 'yandex#search'
        }),
        /**
         * Создадим кластеризатор, вызвав функцию-конструктор.
         * Список всех опций доступен в документации.
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Clusterer.xml#constructor-summary
         */
            clusterer = new ymaps.Clusterer({
            /**
             * Через кластеризатор можно указать только стили кластеров,
             * стили для меток нужно назначать каждой метке отдельно.
             * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/option.presetStorage.xml
             */
            preset: 'islands#invertedVioletClusterIcons',
            /**
             * Ставим true, если хотим кластеризовать только точки с одинаковыми координатами.
             */
            groupByCoordinates: false,
            /**
             * Опции кластеров указываем в кластеризаторе с префиксом "cluster".
             * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/ClusterPlacemark.xml
             */
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        }),
        /**
         * Функция возвращает объект, содержащий данные метки.
         * Поле данных clusterCaption будет отображено в списке геообъектов в балуне кластера.
         * Поле balloonContentBody - источник данных для контента балуна.
         * Оба поля поддерживают HTML-разметку.
         * Список полей данных, которые используют стандартные макеты содержимого иконки метки
         * и балуна геообъектов, можно посмотреть в документации.
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/GeoObject.xml
         */
            getPointData = function (index) {
            return {
                balloonContentBody: '<b>' + addreses[index].name + '</b></br>' +  addreses[index].address
            };
        },
        /**
         * Функция возвращает объект, содержащий опции метки.
         * Все опции, которые поддерживают геообъекты, можно посмотреть в документации.
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/GeoObject.xml
         */
            getPointOptions = function () {
            return {
                preset: 'islands#violetIcon'
            };
        },
        points = [
            [55.831903,37.411961], [55.763338,37.565466]
        ],
        geoObjects = [];

    /**
     * Данные передаются вторым параметром в конструктор метки, опции - третьим.
     * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Placemark.xml#constructor-summary
     */
    for(var i = 0, len = points.length; i < len; i++) {
        geoObjects[i] = new ymaps.Placemark(points[i], getPointData(i), getPointOptions());
    }

    /**
     * Можно менять опции кластеризатора после создания.
     */
    clusterer.options.set({
        gridSize: 80,
        clusterDisableClickZoom: true
    });

    /**
     * В кластеризатор можно добавить javascript-массив меток (не геоколлекцию) или одну метку.
     * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Clusterer.xml#add
     */
    clusterer.add(geoObjects);
    myMap.geoObjects.add(clusterer);
});