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
  };
  routineActivities = {
    SystemTime: true,
    ScreenInfo: true,
    RefererUrl: true,
  };
  lifeCycle = {
    userLifeTime: 7,
    routineTime: 1,
  };
  debug = false;
  constructor(obj = {}) {
    super();
    this.debug = obj.debug ? true : false;
    this.ClientID = obj.ClientID;
    this.SecretKey = obj.SecretKey;
    this.repeatActivities = obj.repeatActivities ? obj.repeatActivities : this.repeatActivities;
    this.routineActivities = obj.routineActivities ? obj.routineActivities : this.routineActivities;
    this.lifeCycle = obj.lifeCycle ? obj.lifeCycle : this.lifeCycle;
    this.http = new EagleonHttp(obj);
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
    }
  }
  async startRecord() {
    if (this.debug) console.log(_eagleonActWrn.debugWaring.msg, _eagleonActWrn.debugWaring.style);
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
    try {
      print.name1("NavigatePageURL Activity");
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
  act_clickArea(selectorString, callFn) {
    let self = this;
    let print = new EagleonConsole(this.debug);
    print.name1("ClickArea Activity");
    function sfn(string_value, json_data) {
      try {
        print.gotIt3(string_value, json_data);
        let info = {};
        info.string_value = string_value;
        info.json_data = json_data;
        info.type = 'ClickArea';
        let save = self._save(info, print);
        save.then((data) => {
          print.response5(data);
        }).catch((error) => {
          print.error("error", error);
        });
      } catch (error) {
        print.error("error", error);
      }
    }//.bind(print, self); //EagleonConsole
    this.event_clickArea(selectorString, callFn, sfn, print);
  }
  async act_htmlTag(selectorString, valueArea) {
    let print = new EagleonConsole(this.debug);
    print.name1("HtmlTag Activity");
    let values = ['innerText', 'innerHTML', 'outerHTML', 'outerText'];
    if (values.includes(valueArea)) {
      let tag = document.querySelector(selectorString);
      if (tag) {
        try {
          //console.log("ok....")
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
      print.print();
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
  async act_gpsInfo(isSave = true) {
    let print = new EagleonConsole(this.debug);
    print.name1("GpsInfo Activity");
    try {
      let geo = await this.event_geoLocation();
      if (geo && geo.coords) {
        let info = {
          accuracy: geo.coords.accuracy.accuracy,
          altitude: geo.coords.altitude,
          altitudeAccuracy: geo.coords.altitudeAccuracy,
          heading: geo.coords.heading,
          latitude: geo.coords.latitude,
          longitude: geo.coords.longitude,
          speed: geo.coords.speed,
          timestamp: geo.timestamp,
        };
        print.gotIt3(info);
        let log = {
          json_data: info,
          type: 'GpsInfo',
        };
        if (isSave) {
          let res = eagleonInstance._save(log);
          print.response5(res);
          return res;
        }
        return geo;
      } else {
        print.error("GPS permission Error", geo);
      }
    } catch (error) {
      print.error("GPS permission Error", error);
      return { statusCode: 400, message: [error] }
    }
  }
  async act_customTracking(custom_title, string_value = '', json_data = null) {
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
