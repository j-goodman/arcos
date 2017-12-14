// Mobile swipe control set.

var initTouchControls = function () {
  // Setup swipe controls for mobile devices.
  var section;
  window.touchLog = {};
  section = document.getElementsByClassName('lang-course-details')[0];
  section.addEventListener('touchstart', touchStart, false);
  section.addEventListener('touchend', touchEnd, false);
}

var touchStart = function () {
   // Fires when the user touches the screen.
   console.log('Touchstart.');
   window.touchLog.startX = event.changedTouches[0].screenX;
}

var touchEnd = function () {
    // Fires when the user picks their finger up.
    window.touchLog.endX = event.changedTouches[0].screenX;
    if (window.touchLog.endX < window.touchLog.startX - 20) {
        console.log('Swipe right.');
        window.swipeRight();
    } else if (window.touchLog.endX > window.touchLog.startX + 20) {
        console.log('Swipe left.');
        window.swipeLeft();
    }
}
