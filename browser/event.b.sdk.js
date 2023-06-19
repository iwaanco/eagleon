export class EagleonSDKEvent {
  pushstate;
  XMLHttpRequest;
  constructor() {
    const EagleonDkEvent = this;
    //history event
    (function (history) {
      var pushState = history.pushState;
      history.pushState = function (state, unused, url) {
        if (typeof EagleonDkEvent.pushstate == 'function') {
          EagleonDkEvent.pushstate({
            state: state,
            unused: unused,
            url: url,
          });
        }
        return pushState.apply(history, arguments);
      };
    }.bind(EagleonDkEvent)(window.history));
  }
  ready(fn) {
    if (document.readyState != 'loading') {
      fn();
    } else if (window.addEventListener) {
      // window.addEventListener('load', fn);
      window.addEventListener('DOMContentLoaded', fn);
    } else {
      window.attachEvent('onreadystatechange', function () {
        if (document.readyState != 'loading') fn();
      });
    }
  }
  geoLocation(fn) {
    if (typeof fn == 'function') navigator.geolocation.getCurrentPosition(fn);
  }
}
