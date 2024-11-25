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
  event_clickArea(selectorString, userfn, saFn, print) {
    if (typeof userfn == 'function') {
      let elm = document.querySelector(selectorString);
      if (elm) {
        print.vaildInput2(elm);
        elm.addEventListener('click', function (e) {
          e = e || window.event;
          var target = e.target || e.srcElement;
          userfn(target, saFn, e);
        }, false);
      } else {
        print.vaildInput2("Invaild " + selectorString + " selector");
      }
    }
  }
  event_geoLocation() {
    let gpsPs = new Promise(function (resolve, reject) {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };
      function success(pos) {
        const crd = pos.coords;
        console.log("Your current position is:");
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        console.log(`More or less ${crd.accuracy} meters.`);
        resolve(pos);
      }
      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        reject(err);
      }
      navigator.geolocation.getCurrentPosition(success, error, options);
    });
    return gpsPs;
  }
}
