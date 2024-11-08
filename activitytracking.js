import { EagleonEvent } from './event.js';
import { EagleonHttp } from './http.js';
import { EagleonConsole } from './console.js';
const _eagleonActWrn = {
  debugWaring: {
    msg: '%cEagleon Activity Tracking -> Running  is a debug mode. Do not use it in a production deployment.',
    style: 'font-weight: bold;  font-size: 25px; color:#ffce0c;'
  },
  idMissMsg: "Activity Id is missing",
  consolePrint: `Printed by EagleonActivityTracking`,
}
export class EagleonActivityTracking extends EagleonEvent {
  ClientID;
  SecretKey;
  usrCookieIdKey = '_eagleon_id';
  usrDayFlagKey = '_eagleon_day';
  usageIdentityId;
  http;
  repeatActivities = {
    NavigatePageURL: true,
    RefererUrl: true,
    SystemTime: true,
    ScreenInfo: true,
    //GpsInfo: { tiggerTime: 4000 },
  };
  routineActivities = {
    SystemTime: true,
    ScreenInfo: true,
    GpsInfo: { tiggerTime: 4000 },
  };
  lifeCycle = {
    userLifeTime: 7,
    routineTime: 1,
  };
  debug = true;
  constructor(obj = {}) {
    super();
    this.ClientID = obj.ClientID;
    this.SecretKey = obj.SecretKey;
    this.repeatActivities = obj.repeatActivities ? obj.repeatActivities : this.repeatActivities;
    this.routineActivities = obj.routineActivities ? obj.routineActivities : this.routineActivities;
    this.lifeCycle = obj.lifeCycle ? obj.lifeCycle : this.lifeCycle;
    this.debug = obj.debug ? true : this.debug;
    this.http = new EagleonHttp(obj);
    this.print = new EagleonConsole();
    this.print.debug = this.debug;
    if (this.debug) console.log(_eagleonActWrn.debugWaring.msg, _eagleonActWrn.debugWaring.style);
    this.recorder();
  }
  get _cookie() {
    var cookie = {
      write: function (name, value, days, domain, path) {
        var date = new Date();
        days = days || 730; // two years
        path = path || '/';
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        var expires = '; expires=' + date.toGMTString();
        var cookieValue = name + '=' + value + expires + '; path=' + path;
        if (domain) {
          cookieValue += '; domain=' + domain;
        }
        document.cookie = cookieValue;
      },
      read: function (name) {
        var allCookie = '' + document.cookie;
        var index = allCookie.indexOf(name);
        if (name === undefined || name === '' || index === -1) return '';
        var ind1 = allCookie.indexOf(';', index);
        if (ind1 == -1) ind1 = allCookie.length;
        return unescape(allCookie.substring(index + name.length + 1, ind1));
      },
      remove: function (name) {
        if (this.read(name)) {
          this.write(name, '', -1, '/');
        }
      },
    };
    return cookie;
  }
  async _getUserId() {
    let info = {
      url: this._findFullURL(),
    };
    if (!this.usageIdentityId) {
      let id = this._cookie.read(this.usrCookieIdKey);
      if (id) {
        this.usageIdentityId = id;
      } else {
        let uid = await this._init();
        this.usageIdentityId = (uid) ? uid : undefined;
      }
    }
    info.usageIdentiyId = this.usageIdentityId;
    info.activitis = [];
    return info;
  }
  async _init() {
    let print = new EagleonConsole(this.debug);
    print.name1("Init Activity");
    try {
      print.vaildInput2('-');
      print.gotIt3("Collect information from headers http-request " + "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers");
      let res = await this.http.httpRequest({
        url: 'uep/usage-activity/init',
        method: 'GET',
        init: true
      });
      if (res.statusCode == 200) {
        this.usageIdentityId = res.data.usageIdentiy
        this._cookie.write(
          this.usrCookieIdKey,
          this.usageIdentityId,
          this.lifeCycle.userLifeTime,
          location.hostname,
          '/',
        );
        print.response5(res);
        return res.data.usageIdentiy;
      } else {
        print.response5(res);
      }
    } catch (error) {
      print.error("error", error);
    }
  }
  async _save(addOninfo = {}, print) {
    let log = await this._getUserId();
    if (this.usageIdentityId) {
      log.activitis.push(addOninfo);
      print.sendData4(log);
      let res = await this.http.httpRequest({
        url: 'uep/usage-activity',
        method: 'POST',
        data: log,
      });
      return res;
    } else {
      return { statusCode: 400, message: idMissMsg };
    }
  }
  _isDayLogged() {
    let id = this._cookie.read(this.usrDayFlagKey);
    if (id) {
      return true;
    } else {
      this._cookie.write(this.usrDayFlagKey, 1, this.lifeCycle.routineTime, location.hostname, '/');
      return false;
    }
  }
  async _caller(tasks) {
    if (this.usageIdentityId) {
      if (tasks.NavigatePageURL) {
        this.event_ready(this.act_navigatePageURL.bind(this));
        this.event_pushstate = this.act_navigatePageURL.bind(this);
      }
      if (tasks.RefererUrl) {
        await this.act_refererUrl()
      }
      if (tasks.InputValue) {
        await this.act_inputValue(tasks.InputValue.selectorString);
      }
      if (tasks.ClickArea) {
        if (tasks.ClickArea.callBack == 'function') {
          await this.act_clickArea(tasks.ClickArea.callBack);
        }
      }
      if (tasks.HtmlTag) {
        await this.act_htmlTag(tasks.HtmlTag.selectorString, tasks.HtmlTag.valueArea);
      }
      if (tasks.SystemTime) {
        await this.act_dateTime();
      }
      if (tasks.ScreenInfo) {
        await this.act_screenInfo();
      }
      if (tasks.GpsInfo) {
        setTimeout(async function () {
          await this.act_gpsInfo();
        }.bind(this), tasks.GpsInfo.tiggerTime)
      }
    }
  }
  async recorder() {
    await this._getUserId();
    await this._caller(this.repeatActivities);
    if (!this._isDayLogged()) {
      await this._caller(this.routineActivities);
    }
  }
  _findFullURL(ev = {}) {
    //advance
    let url;
    url = ev && typeof ev.url == 'string' ? ev.url : undefined;
    url = ev && typeof ev.url == 'object' ? ev.url.href : url;
    url = (url) ? url : location.href;
    if (url) {
      if (!(/https:\/\//.test(url) || /http:\/\//.test(url))) {
        if (url[0] == '/') {
          url = location.origin + url;
        } else {
          url = location.origin + '/' + url;
        }
      }
    }
    return url;
  }
  async act_navigatePageURL(ev = {}) {
    let print = new EagleonConsole(this.debug);
    print.name1("NavigatePageURL Activity");
    try {
      print.vaildInput2('-');
      let log = { type: 'NavigatePageURL' };
      log.url = this._findFullURL(ev);
      print.gotIt3(log.url);
      let res = await this._save(log, print);
      print.response5(res);
    } catch (error) {
      print.error("error", error);
    }
  }
  async act_refererUrl() {
    let print = new EagleonConsole(this.debug);
    print.name1("RefererUrl Activity");
    try {
      let d = document.referrer;
      print.gotIt3(d);
      let log = { string_value: d, type: 'RefererUrl' };
      let res = await this._save(log, print);
      print.response5(res);
    } catch (error) {
      print.response5(error);
      print.error("error", error);
    }
  }
  async act_inputValue(selectorString) {
    let print = new EagleonConsole(this.debug);
    print.name1("InputValue Activity");
    let input = document.querySelector(selectorString);
    print.vaildInput2(input);
    if (input) {
      try {
        let d = input.value;
        print.gotIt3(d);
        let log = { string_value: d, type: 'InputValue' };
        let res = await this._save(log, print);
        print.response5(res);
      } catch (error) {
        print.response5(error);
        print.error("error", error);
      }
    } else {
      print.vaildInput2("Invaild " + selectorString + " selector");
    }
  }
  act_clickArea(callFn) {
    let print = new EagleonConsole(this.debug);
    print.name1("ClickArea Activity");
    try {
      let sfn = async function (string_value, json_data) {
        print.vaildInput2("-");
        print.gotIt3(string_value, json_data);
        let info = {};
        info.string_value = string_value;
        info.json_data = json_data;
        info.type = 'ClickArea';
        let res = await this._save(info, print);
        print.response5(res);
      }.bind(this);
      this.event_clickArea(callFn, sfn);
    } catch (error) {
      print.error("error", error);
    }
  }
  async act_htmlTag(selectorString, valueArea) {
    let print = new EagleonConsole(this.debug);
    print.name1("HtmlTag Activity");
    let values = ['innerText', 'innerHTML', 'outerHTML', 'outerText'];
    if (values.includes()) {
      let tag = document.querySelector(selectorString);
      if (tag) {
        try {
          let d = tag[valueArea];
          print.gotIt3(d);
          let log = { string_value: d, type: 'HtmlTag' };
          let res = await this._save(log, print);
          print.response5(res);
        } catch (error) {
          print.error("error", error);
        }
      } else {
        this.http.warning(this.debug, "HtmlTag", "Invaild " + selectorString + " selector");
      }
    } else {
      print.vaildInput2("Invalid valueArea parameter", valueArea);
    }
  }
  async act_dateTime() {
    let print = new EagleonConsole(this.debug);
    print.name1("SystemTime Activity");
    try {
      print.vaildInput2('-');
      let d = new Date().toString();
      print.gotIt3(d);
      let log = { string_value: d, type: 'SystemTime' };
      let res = await this._save(log, print);
      print.response5(res);
    } catch (error) {
      print.error("error", error);
    }
  }
  async act_screenInfo() {
    let print = new EagleonConsole(this.debug);
    print.name1("ScreenInfo Activity");
    try {
      let scr = {
        availHeight: window.screen.availHeight,
        availLeft: window.screen.availLeft,
        availTop: window.screen.availTop,
        availWidth: window.screen.availWidth,
        colorDepth: window.screen.colorDepth,
        height: window.screen.height,
        left: window.screen.left,
        orientation: {
          angle: window.screen.orientation.angle,
          type: window.screen.orientation.type,
        },
        pixelDepth: window.screen.pixelDepth,
        top: window.screen.top,
        width: window.screen.width,
      };
      let log = {
        json_data: scr,
        type: 'ScreenInfo',
      };
      print.vaildInput2('-');
      let res = await this._save(log, print);
      print.response5(res);
    } catch (error) {
      print.error("error", error);
    }
  }
  async act_gpsInfo() {
    let print = new EagleonConsole(this.debug);
    print.name1("GpsInfo Activity");
    let eagleonInstance = this;
    let gps_callFn = function (data) {
      print.vaildInput2("-");
      try {
        if (data && data.coords) {
          let info = {
            accuracy: data.coords.accuracy.accuracy,
            altitude: data.coords.altitude,
            altitudeAccuracy: data.coords.altitudeAccuracy,
            heading: data.coords.heading,
            latitude: data.coords.latitude,
            longitude: data.coords.longitude,
            speed: data.coords.speed,
            timestamp: data.timestamp,
          };
          print.gotIt3(info);
          let log = {
            json_data: info,
            type: 'GpsInfo',
          };
          let res = eagleonInstance._save(log), print;
          print.response5(res);
        } else {
          print.error("GPS permission Error", data);
        }
      } catch (error) {
        print.error("error", error);
      }
    }.bind(eagleonInstance, print);
    this.event_geoLocation(gps_callFn)
  }
  async act_CustomTracking(custom_title, string_value = '', json_data = null) {
    let print = new EagleonConsole(this.debug);
    print.name1("CustomTracking Activity");
    try {
      print.vaildInput2("-");
      print.gotIt3(string_value, json_data);
      obj = {};
      obj.custom_title = custom_title;
      obj.string_value = string_value;
      obj.json_data = json_data;
      obj.type = 'CustomTracking';
      let res = await this._save(obj, print);
      print.response5(res);
    } catch (error) {
      print.error("error", error);
    }
  }
}
