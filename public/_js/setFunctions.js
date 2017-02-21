function setDevice() {

  var device = screenSim.activeDevice

  //hide all submenus
  $('#menu .submenu').hide();
  //show selected menu
  $('#menu .'+device).show();
  //clear old web/tablet/mobile class, add selected
  $('#screenWrapper').removeClass().addClass(device);

  //set default selected menu item
  switch (device) {
    case 'web':
      $('#deviceArrow').css('left','27%');
    break;
    case 'tablet':
      $('#deviceArrow').css('left','66.5%');
    break;
    case 'mobile':
      $('#deviceArrow').css('left','89.5%');
    break;
  }

  $('#ofUsers').html('of '+device+' users');

  setOption();
}



function setOption() {

  var option = screenSim[screenSim.activeDevice].option;
  var $thisOption = $('#menu .'+screenSim.activeDevice+' .option').eq(option);

  $('.option.selected').removeClass('selected');
  $thisOption.addClass('selected');


  var width = $thisOption.attr('data-width');
  var height = $thisOption.attr('data-height');

  //console.log('width: '+width+' height: '+height);

  resizeScreen(width,height);

  updateAddress();

  var newPercent = $thisOption.attr('data-users');
  var oldPercent = $('#userPercent').html();

  if (newPercent == 'NA') {
    $('#userPercentHolder').css('opacity','0');
  } else {
    $('#userPercentHolder').css('opacity','1');
    animatePercent(oldPercent, newPercent);
  }
  
  
}




function setScale() {

  var windowHeight = $(window).height();
  var windowWidth = $(window).width();

  //determine wether to use width or height to scale screen
  //so when used resizes window wide or tall, it will measure by the longest side
  if (windowWidth*0.65 > windowHeight)
    imageScale = windowHeight
  else
    imageScale = windowWidth*0.65

  imageScale = imageScale*0.00059
  bezelPadding = Math.round(imageScale*60);

//console.log('imageScale: '+imageScale)

  var fontSize = Math.round(imageScale*16);
  var menuFontSize = Math.round(imageScale*32);

//console.log('font-size: '+fontSize);
//console.log('menuFontSize: '+menuFontSize);

  if (menuFontSize > 14)
    menuFontSize = 14
  if (menuFontSize < 10)
    menuFontSize = 10

  //scale font sizes
  $('body').css('font-size',fontSize+'px');
  $('.option').css('font-size',menuFontSize+'px');

  //get width/height from menu and send into resize function
  var width = $('#menu .option.selected').attr('data-width');
  var height = $('#menu .option.selected').attr('data-height');
  resizeScreen(width,height);

}




function setLink() {

  var link = $('#navUrl').val();

  //console.log('setLink(); link: '+link);

  
  //no link in address bar, go back home
  if (link == false || link == '') {
    console.log('no link');
    link = 'screensim.com/home';
    $('#navUrl').val(link);
  }

  //remove http from link, if present
  if ( link.indexOf('http://') > -1 ) {
    link = link.replace('http://','');
    $('#navUrl').val(link);
  }




  var blackList = [
    'google.com',
    'youtube.com',
    'facebook.com',
    'yahoo.com',
    'msn.com',
    'amazon.com',
    'twitter.com',
    'craigslist.org',
    'wordpress.com',
    'linkedin.com',
    'live.com',
    'blogspot.com',
    'tumblr.com',
    'pinterest.com',
    'gmail',
    'store.apple.com',
    'paypal.com',
    'instagram.com',
    'stackoverflow.com',
    'netflix.com'
  ];


  if( (new RegExp( '\\b' + blackList.join('\\b|\\b') + '\\b') ).test(link) ){
    messageModal('Sorry, '+link+' cannot be loaded in Screensim.');
  }
  else{
    $('#webView').attr('src', 'http://'+link);
  }

  updateAddress();
}




function updateAddress() {

  var link = $('#navUrl').val();

  //if all settings are default, then dont put url params on the url
  if (link == 'screensim.com/home' && screenSim.activeDevice == 'web' && screenSim.web.option == 8) {
    var urlParams = ''
  }
  else {
    link = encodeURIComponent(link);
    var urlParams = '?link='+link+'&device='+screenSim.activeDevice+'&option='+screenSim[screenSim.activeDevice].option;
  }



  if (window.history.replaceState)
    window.history.replaceState({},'', urlParams);

}