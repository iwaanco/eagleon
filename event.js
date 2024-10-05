export class EagleonEvent {
  event_pushstate;
  XMLHttpRequest;
  constructor() {
    const EagleonDkEvent = this;
    //history event
    (function (history) {
      var pushState = history.pushState;
      history.pushState = function (state, unused, url) {
        if (typeof EagleonDkEvent.pushstate == 'function') {
          EagleonDkEvent.event_pushstate({
            state: state,
            unused: unused,
            url: url,
          });
        }
        return pushState.apply(history, arguments);
      };
    }.bind(EagleonDkEvent)(window.history));
  }
  event_ready(fn) {
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
  event_clickArea(userfn, saveFn) {
    if (typeof userfn == 'function') {
      document.addEventListener('click', function (e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        userfn(target, saveFn, e);
      }, false);
    }
  }
  event_geoLocation(fn) {
    if (typeof fn == 'function') navigator.geolocation.getCurrentPosition(fn);
  }
}
