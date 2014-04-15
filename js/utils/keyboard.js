(function(ionic) {

ionic.Platform.ready(function() {
  if (ionic.Platform.isAndroid()) {
    androidKeyboardFix();
  }
  else if (ionic.Platform.isIOS()) {
    iOSKeyboardFix();
  }
});

function androidKeyboardFix() {
  var rememberedDeviceWidth = window.innerWidth;
  var rememberedDeviceHeight = window.innerHeight;
  var keyboardHeight;
  var rememberedActiveEl;
  var alreadyOpen = false;

  if (ionic.Platform.isWebView() && window.cordova && cordova.plugins && cordova.plugins.Keyboard){
    window.addEventListener('native.showkeyboard', resizeOnKeyboardShow);
    window.addEventListener('native.hidekeyboard', resizeOnKeyboardHide);
  }
  else {
    window.addEventListener('resize', resizeWebWorld);
    window.addEventListener('focusin', fixScrollTop);
  }

  function fixScrollTop(e){
    if (e.srcElement.tagName == 'INPUT' || e.srcElement.tagName == 'TEXTAREA' || e.srcElement.isContentEditable){
      //setTimeout(function(){
        document.body.scrollTop = 0;
      //});
    }
  }

  function resizeWebWorld() {

    //If the width of the window changes, we have an orientation change
    if (rememberedDeviceWidth !== window.innerWidth) {
      rememberedDeviceWidth = window.innerWidth;
      rememberedDeviceHeight = window.innerHeight;


    //If the height changes, and it's less than before, we have a keyboard open
    } else if (rememberedDeviceHeight !== window.innerHeight &&
               window.innerHeight < rememberedDeviceHeight) {
      document.body.classList.add('footer-hide');

      keyboardHeight = rememberedDeviceHeight - window.innerHeight;
      setTimeout(function(){
      ionic.trigger('scrollChildIntoView', {
          target: document.activeElement
        }, true);
      }, 100);
    } else {
      //Otherwise we have a keyboard close or a *really* weird resize
      document.body.classList.remove('footer-hide');
    }
  }

  function resizeOnKeyboardShow(e){
    rememberedActiveEl = document.activeElement;
    if (rememberedActiveEl) {
      //This event is caught by the nearest parent scrollView
      //of the activeElement
      if (cordova.plugins.Keyboard.isVisible){
        document.body.classList.add('footer-hide');
        ionic.trigger('scrollChildIntoView', {
          keyboardHeight: e.keyboardHeight,
          target: rememberedActiveEl,
          firstKeyboardShow: !alreadyOpen
        }, true);
        if (!alreadyOpen) alreadyOpen = true;
      }
    }
  }

  function resizeOnKeyboardHide(){
    //wait to see if we're just switching inputs
    setTimeout(function(){
      if (!cordova.plugins.Keyboard.isVisible){
        document.body.classList.remove('footer-hide');
        alreadyOpen = false;
        ionic.trigger('resetScrollView', {
          target: rememberedActiveEl
        }, true);
      }
    }, 100);
  }
}
 
function iOSKeyboardFix(){
  var rememberedActiveEl;
  var alreadyOpen = false;
 
  //for now
  if (ionic.Platform.isWebView() && cordova && cordova.plugins && cordova.plugins.Keyboard){
    window.addEventListener('focusin', fixScrollTop);
    window.addEventListener('native.showkeyboard', resizeOnKeyboardShow);
    window.addEventListener('native.hidekeyboard', resizeOnKeyboardHide);
  }
 
  function fixScrollTop(e){
    if (e.srcElement.tagName == 'INPUT' || e.srcElement.tagName == 'TEXTAREA' || e.srcElement.isContentEditable){
      //setTimeout(function(){
        document.body.scrollTop = 0;
      //});
    }
  }
 
  function resizeOnKeyboardShow(e){
    rememberedActiveEl = document.activeElement;
    if (rememberedActiveEl) {
      //This event is caught by the nearest parent scrollView
      //of the activeElement
      if (cordova.plugins.Keyboard.isVisible){
        document.body.classList.add('footer-hide');
        ionic.trigger('scrollChildIntoView', {
          keyboardHeight: e.keyboardHeight,
          target: rememberedActiveEl,
          firstKeyboardShow: !alreadyOpen
        }, true);
        if (!alreadyOpen) alreadyOpen = true;
      }
    }
  }
     
  function resizeOnKeyboardHide(){
    //wait to see if we're just switching inputs
    setTimeout(function(){
      if (!cordova.plugins.Keyboard.isVisible){
        document.body.classList.remove('footer-hide');
        alreadyOpen = false;
        ionic.trigger('resetScrollView', {
          target: rememberedActiveEl
        }, true);
      }
    }, 100);
  }
}

})(window.ionic);
