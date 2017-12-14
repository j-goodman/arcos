// Mobile swipe control set.

var initTouchControls = function () {
  // Setup swipe controls for mobile devices.
  window.touchLog = {};
  document = document.getElementsByClassName('lang-course-details')[0];
  document.addEventListener('touchstart', touchStart, false);
  document.addEventListener('touchend', touchEnd, false);
}

var touchStart = function (evt) {
   // Fires when the user touches the screen.
   document.body.style.background = '#fff';
   console.log('Touchstart.');
   window.touchLog.startX = evt.changedTouches[0].screenX;
}

var touchEnd = function (evt) {
    // Fires when the user picks their finger up.
    document.body.style.background = '#000';
    window.touchLog.endX = evt.changedTouches[0].screenX;
    if (window.touchLog.endX < window.touchLog.startX - 20) {
        console.log('Swipe right.');
        document.body.style.background = '#a00';
        window.swipeRight();
    } else if (window.touchLog.endX > window.touchLog.startX + 20) {
        console.log('Swipe left.');
        document.body.style.background = '#00a';
        window.swipeLeft();
    }
}
