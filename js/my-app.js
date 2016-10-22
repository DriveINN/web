// Initialize your app
var myApp = new Framework7();

// Export selectors engine
var $ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true,
    domCache: true,
    smartSelectOpenIn:'picker'
});

// myApp.loginScreen();
// myApp.popup('.popup-userinfo');
// mainView.router.loadPage('#order-info');

var inputL = 0;
$('input#phone').on('keyup keydown change', function () { 
    var curchr = this.value.length;
    var curval = $(this).val();
    if(inputL < this.value.length) {
        if (curchr == 3 && curval.indexOf('(') == -1) {
            $("input#phone").val("(" + curval + ")" + "-");
        } else if (curchr == 4 && curval.indexOf(')') == -1){
            $("input#phone").val(curval + ")" + "-");
        } else if (curchr == 9) {
            $("input#phone").val(curval + "-");
        } else if (curchr == 12) {
            $("input#phone").val(curval + "-");
        }
        inputL = this.value.length;
    } else {
        inputL = this.value.length;
    }
    if($('input#phone').val().length = 14) $('#get-code-btn').removeClass('disabled'); else $('#get-code-btn').addClass('disabled');
});

$('#get-code-btn').on('click', function(){
    $('.item-phone, #login-btns').hide();
    $('.login-sub-title').html('Код полученный в СМС');
    $('.item-code, #code-btns').show();
    $('#login-title').html('Регистрация<br> в DRIVE-INN');
});
$('#get-password').on('click', function () {
  var popupHTML = '<div class="popup"><div class="login-screen-title">Введите пароль</div><div class="list-block"><ul><li><div class="item-content"><div class="item-inner"><div class="item-input"><input type="password" placeholder=""></div></div></div></li></ul></div>';
  myApp.popup(popupHTML);
});  
$('#get-password-2').on('click', function () {
  var popupHTML = '<div class="popup"><div class="login-screen-title">Создайте пароль</div><div class="list-block"><ul><li><div class="item-content"><div class="item-inner"><div class="item-input"><input type="password" placeholder=""></div></div></div></li></ul></div>';
  myApp.popup(popupHTML);
});  
$('#get-password-3').on('click', function () {
  var popupHTML = '<div class="popup"><div class="login-screen-title">Подтвердите пароль</div><div class="list-block"><ul><li><div class="item-content"><div class="item-inner"><div class="item-input"><input type="password" placeholder=""></div></div></div></li></ul></div>';
  myApp.popup(popupHTML);
});  
$('#regist-finish').on('click', function () {
  var popupHTML = '<div class="popup"><div class="login-screen-title">Регистрация завершена успешно!</div><a class="button-custom">Начать использование</a></div>';
  myApp.popup(popupHTML);
});  
$('#success-buy').on('click', function () {
  var popupHTML = '<div class="popup"><div class="login-screen-title">Топливная карта<br> успешно пополнена</div><div class="title-custom"><span>+200</span> <i class="icon icon-fire icon-fire-blue"></i> АИ-95</div><div class="label">Пригласи друга и получите по 5 литров топлива каждый!<a>Выбрать друга</a></div><a class="button-custom">Закрыть</a></div>';
  myApp.popup(popupHTML);
});  

$('#map-page-link, #refuel-page-link').on('click', function () {
    myApp.closeModal('.popover-gas');
});