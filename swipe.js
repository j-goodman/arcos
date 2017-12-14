// Mobile swipe control set.

var initTouchControls = function () {
  // Setup swipe controls for mobile devices.
  window.touchLog = {};
  var el = document.getElementsByTagName("canvas")[0];
  el.addEventListener("touchstart", touchStart, false);
  el.addEventListener("touchend", touchEnd, false);}

var touchStart = function (evt) {
   // Fires when the user touches the screen.
   window.touchLog.startX = evt.changedTouches[0].screenX;
}

var touchEnd = function (evt) {
    // Fires when the user picks their finger up.
    window.touchLog.endX = evt.changedTouches[0].screenX;
    if (window.touchLog.endX < window.touchLog.startX - 40) {
        window.swipeLeft();
    } else if (window.touchLog.endX > window.touchLog.startX + 40) {
        window.swipeRight();
    }
}
