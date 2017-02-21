//global object to set default values and store user selections
screenSim = {
  activeDevice : 'web',
  web: {
    option: 8
  },
  tablet: {
    option: 0
  },
  mobile: {
    option: 1
  }
};


$(document).ready(function(){

//show user's scren resolution
$('#footer .yourRes span').html(screen.width+'x'+screen.height);

console.log(screen.width);

//if console is undefined (IE), make it an empty object so it wont fail
if (typeof console === "undefined" || typeof console.log === "undefined") {
  console = {};
  console.log = function() {};
}



if(!window.history.replaceState)
  messageModal('Sorry, Screensim does not support your web browser. Please try again with Firefox, Chrome, Safari, or Internet Explorer 10');



//sets site size based off of user's screen
setScale();
$(window).resize(function() {
  setScale();
});


//EVALUATE URL PARAMETERS

var link = urlParam('link');
var device = urlParam('device');
var option = urlParam('option');

console.log('---urlParams---');
console.log('link: '+link);
console.log('device: '+device);
console.log('option: '+option);
console.log('---------------');





if (link != false || link != '') {
  $('#navUrl').val(link);
}
else {
  $('#navUrl').val('screensim.com/home');
}

setLink();



//if device urlparam is valid, then set it
if (device == 'web' || device == 'tablet' || device == 'mobile')
  screenSim.activeDevice = device;

//if urlParam 'option' is a number, greater than 0
//less or equal to the length of this device's option list
//then set it; it is valid
option = parseInt(option);
var thisOptionListLength = $('#menu .'+screenSim.activeDevice+' .option').length-1;

if (!isNaN(option) && option >= 0 && option <= thisOptionListLength)
  screenSim[screenSim.activeDevice].option = option


setDevice();




//*********************************************************
//  EVENT LISTENERS
//*********************************************************


$('#navGo').click(function() {
  setLink();
});

$('#navBack').click(function() {
  window.history.back();
});

$('#navForward').click(function() {
  window.history.forward();
});

//device selection
$('.icon').click(function() {
  screenSim.activeDevice = $(this).attr('data-type');
  setDevice();
})

//option election
$('.option').click(function() {
  screenSim[screenSim.activeDevice].option = $(this).index();
  setOption();
});


// fade in, then remove event listener
$('#screen').on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend mozTransitionEnd', function() {
  $('#wrapper').css('opacity','1');
  $('#screen').off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend mozTransitionEnd');
});

// dismiss messageDodal
$('#messageModal .dismiss, #messageScreen').click(function() {
  messageModalDismiss();
});

// dismiss messageDodal or set link if modal is not showing
$('body').on('keyup', function(e) {
  if( e.keyCode==27 && $('#messageModal').hasClass('show') || e.keyCode==13 && $('#messageModal').hasClass('show') )
    messageModalDismiss();

  else if ( e.keyCode==13 )
    setLink();
});



}); //doc ready



function urlParam(name) {
  if (location.search && location.search.match(new RegExp(name + "=([^&]*)"))) {
    return unescape(RegExp.$1);
  } else {
    return false
  }
}




function resizeScreen(widthPx,heightPx) {

  width = Math.round(widthPx*imageScale);
  height = Math.round(heightPx*imageScale);



//WEB
  if ( $('#screenWrapper').hasClass('web') ) {

    //just some arbitrary ratios that make the screen stand feel like the proper width and height
    var standScale = 0.15; 
    var standWidth = Math.round(width*standScale*1.25);
    var standHeight = Math.round(width*standScale*0.4);

    //scale browser bar proportionally, then position creative holder down correct amount
    barHeight = 116 //px height of mac os bar and google chrome bar
    barHeight = Math.round(barHeight*imageScale);
    $('#browserBar').css('height', barHeight);

    $('#creativeHolder').css({
      top: barHeight+'px'
    });

    $('#screen').css({
      'width': width,
      'height': height
    });

    $('#screenStand').css({
      'width': standWidth,
      'height': standHeight
    });


    //apply appropriate thickness to screen bezel
    $('#screenFrame').css('padding',bezelPadding);


    //scale iframe
    $('#webView').css({
      '-webkit-transform': 'scale('+imageScale+')',
      '-moz-transform': 'scale('+imageScale+')',
      '-o-transform': 'scale('+imageScale+')',
      'zoom': imageScale
    }).attr({
      'width': 100/imageScale+'%',
      'height': 100/imageScale+'%'
    })

  } //END WEB



//TABLET
  if ( $('#screenWrapper').hasClass('tablet') ) {


    //scale browser bar proportionally, then position creative holder down correct amount
    barHeight = Math.round(98*imageScale);
    if (barHeight > 98) //98 is pixel height of iphone top chrome at 100% scale
        barHeight = 98

    $('#browserBar').css('height', barHeight);

    $('#creativeHolder').css({
      top: barHeight+'px'
    });

    //set maximum size and scaling, so the mobile device does not become bigger than 100% and look blurry
    var finalWidth = Math.round(width);
    if (finalWidth > widthPx)
        finalWidth = widthPx

    var finalHeight = Math.round(height);
    if (finalHeight > heightPx)
        finalHeight = heightPx

    var finalScale = imageScale*mobileScale
        finalScale = finalScale.toFixed(4);
    if (finalScale > 1)
        finalScale = 1

    var finalOffset = Math.round(100/imageScale);
    if (finalOffset < 100)
        finalOffset = 100

    var shortestSide = finalWidth
    if (finalHeight < finalWidth)
        shortestSide = finalHeight



    $('#iPhoneHomeBtn').css({
      width: Math.round(shortestSide/9),
      height: Math.round(shortestSide/9)
    });

    $('#screen').css({
      'width': finalWidth,
      'height': finalHeight
    });

    //apply appropriate thickness to screen bezel, depending on option's data-orientation
    if (width >= height) {
      $('#screenFrame').css('padding', bezelPadding/1.4+'px '+bezelPadding*2+'px '+bezelPadding/1.4+'px '+bezelPadding*2+'px');
      $('#screenWrapper').addClass('landscape');
    }
    else {
      $('#screenFrame').css('padding', bezelPadding*2+'px '+bezelPadding/1.4+'px '+bezelPadding*2+'px '+bezelPadding/1.4+'px');
      $('#screenWrapper').removeClass('landscape');
    }


    //scale iframe css, then .attr to center it
    $('#webView').css({
      '-webkit-transform': 'scale('+finalScale+')',
      '-moz-transform': 'scale('+finalScale+')',
      '-o-transform': 'scale('+finalScale+')',
      'zoom': finalScale
    }).attr({
      'width': finalOffset+1+'%', //add +1 to keep iframe fullbleed even with rounding down
      'height': finalOffset+1+'%'
    });


  } //END TABLET



//MOBILE
  if ( $('#screenWrapper').hasClass('mobile') ) {

    //mobileScale effectively zooms in the device.
    //ex: Normal iPhone 4 size is 320x480, but that is too small for the user
    //to work with, so we multiply those dimensions by mobileScale to enlarge the iPhone
    var mobileScale = 1.8

    //scale browser bar proportionally, then position creative holder down correct amount
    barHeight = Math.round(64*imageScale*mobileScale);
    if (barHeight > 64) //64 is pixel height of iphone top chrome at 100% scale
        barHeight = 64

    $('#browserBar').css('height', barHeight);

    $('#creativeHolder').css({
      top: barHeight+'px'
    });


    //set maximum size and scaling, so the mobile device does not become bigger than 100% and look blurry
    var finalWidth = Math.round(width*mobileScale);
    if (finalWidth > widthPx)
        finalWidth = widthPx

    var finalHeight = Math.round(height*mobileScale);
    if (finalHeight > heightPx)
        finalHeight = heightPx

    var finalScale = imageScale*mobileScale
        finalScale = finalScale.toFixed(4);
    if (finalScale > 1)
        finalScale = 1

    var finalOffset = Math.round(100/imageScale/mobileScale);
    if (finalOffset < 100)
        finalOffset = 100

    var shortestSide = finalWidth
    if (finalHeight < finalWidth)
        shortestSide = finalHeight



    $('#iPhoneHomeBtn').css({
      width: Math.round(shortestSide/4.4),
      height: Math.round(shortestSide/4.4)
    });


    $('#screen').css({
      'width': finalWidth,
      'height': finalHeight
    });


    //apply appropriate thickness to screen bezel, depending on option's data-orientation
    if (width >= height) {
      $('#screenFrame').css('padding', bezelPadding/1.8+'px '+bezelPadding*3+'px '+bezelPadding/1.8+'px '+bezelPadding*3+'px');
      $('#screenWrapper').addClass('landscape');
    }
    else {
      $('#screenFrame').css('padding', bezelPadding*3+'px '+bezelPadding/1.8+'px '+bezelPadding*3+'px '+bezelPadding/1.8+'px');
      $('#screenWrapper').removeClass('landscape');
    }

    //console.log('sum: '+(100/imageScale)/mobileScale);

    //scale iframe css, then .attr to center it
    $('#webView').css({
      '-webkit-transform': 'scale('+finalScale+')',
      '-moz-transform': 'scale('+finalScale+')',
      '-o-transform': 'scale('+finalScale+')',
      'zoom': finalScale
    }).attr({
      'width': finalOffset+1+'%', //add +1 to keep iframe fullbleed even with rounding down
      'height': finalOffset+1+'%'
    });


  } //END MOBILE





}



function messageModal(message) {
  $('#messageModal, #messageScreen').addClass('show');
  $('#messageModal .message').html(message);
  $('#messageScreen').css('opacity','1');
}


function messageModalDismiss() {
  $('#messageModal').removeClass('show');
  $('#messageScreen').css('opacity','0');
  setTimeout(function() {
    $('#messageScreen').removeClass('show');
  }, 300);
}


function animatePercent(oldPercent, newPercent) {

  if (oldPercent > newPercent) {
    oldPercent--
    setTimeout(function(){
      animatePercent(oldPercent, newPercent)
    }, 20);
  }

  if (oldPercent < newPercent) {
    oldPercent++
    setTimeout(function(){
      animatePercent(oldPercent, newPercent)
    }, 20);
  }

  $('#userPercent').html(oldPercent);
  
}