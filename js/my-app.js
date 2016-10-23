var F7 = new Framework7();
var $ = Dom7;
F7.addView('.view-main', { dynamicNavbar: true, domCache: true, smartSelectOpenIn:'picker'});
if (localStorage.getItem('phone') !== null) {
  window.phone = localStorage.getItem('phone');
  F7.popup('#popup-login');
  //$('#input-login').focus();
} else F7.loginScreen();
function init() {
  run(api, 'transactions/my', {}, function(data) {
    allert(data);
  });
}
var inputL = 0;
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
      $('#input-sms').focus();
      $('#login-next').hide();
      $('#login-retry').show();
    }
  });
});
$('#input-login').keyup(function () {
  if ($('#input-login').val().length == 4) {
    run(api, 'users/authenticate', {method: 'POST', phone: window.phone, pin: $('#input-login').val()}, function(data) {
      if (data.errorCode == 0) {
        localStorage.setItem('phone', window.phone);
        F7.closeModal('#popup-login');
        $('#input-login').blur();
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
    run(api, 'users/changeUserAndSetPin', {method: 'POST', sessionId: window.sessionId, email: $('#userinfo-email').val(), firstName: $('#userinfo-name').val().split(' ')[0], lastName: $('#userinfo-name').val().split(' ')[1], pin: $('#input-register').val()}, function(data) {
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
    run(api, 'users/register_complete', {method: 'POST', phone: window.phone, sessionId: window.sessionId, verificationCode: $('#input-sms').val()}, function(data) {
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

$('#map-page-link').on('click', function () {
    F7.closeModal('.popover-gas');
});
function allert(data) {
  alert(JSON.stringify(data));
}
function run(func) {
  var args = [], that = {error: function() { navigator.notification.alert('', function() { func.apply(that, args); }, 'No Connection To Instagram', 'Retry'); }};
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
                balloonContentBody: 'балун <strong>метки ' + index + '</strong>',
                clusterCaption: 'метка <strong>' + index + '</strong>'
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
            [55.831903,37.411961], [55.763338,37.565466], [55.763338,37.565466], [55.744522,37.616378], [55.780898,37.642889], [55.793559,37.435983], [55.800584,37.675638], [55.716733,37.589988], [55.775724,37.560840], [55.822144,37.433781], [55.874170,37.669838], [55.716770,37.482338], [55.780850,37.750210], [55.810906,37.654142], [55.865386,37.713329], [55.847121,37.525797], [55.778655,37.710743], [55.623415,37.717934], [55.863193,37.737000], [55.866770,37.760113], [55.698261,37.730838], [55.633800,37.564769], [55.639996,37.539400], [55.690230,37.405853], [55.775970,37.512900], [55.775777,37.442180], [55.811814,37.440448], [55.751841,37.404853], [55.627303,37.728976], [55.816515,37.597163], [55.664352,37.689397], [55.679195,37.600961], [55.673873,37.658425], [55.681006,37.605126], [55.876327,37.431744], [55.843363,37.778445], [55.875445,37.549348], [55.662903,37.702087], [55.746099,37.434113], [55.838660,37.712326], [55.774838,37.415725], [55.871539,37.630223], [55.657037,37.571271], [55.691046,37.711026], [55.803972,37.659610], [55.616448,37.452759], [55.781329,37.442781], [55.844708,37.748870], [55.723123,37.406067], [55.858585,37.484980]
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