import { EagleonEvent } from './event.js';
import { EagleonHttp } from './http.js';

export class EagleonActivityTracking extends EagleonEvent {
  ClientID;
  SecretKey;
  identityKey = '_eagleon_id';
  usageIdentityId;
  http;
  modules = {
    NavigatePageURL: true,
    RefererUrl: true,
    SystemTime: true,
    ScreenInfo: true,
    GpsInfo: true,
  };
  constructor(obj = {}) {
    super();
    this.ClientID = obj.ClientID;
    this.SecretKey = obj.SecretKey;
    this.modules = obj.modules ? obj.modules : this.modules;
    this.http = new EagleonHttp(obj);
    this.recorder();
  }
  get cookie() {
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
  async getUserId() {
    if (!this.usageIdentityId) {
      let id = this.cookie.read(this.identityKey);
      if (id) {
        this.usageIdentityId = id;
      } else {
        this.usageIdentityId = await this.init();
      }
    }
    info.usageIdentiyId = this.usageIdentityId;
    info.activitis = [];
    return info;
  }
  async init() {
    let res = await this.http.httpRequest({
      url: 'uep/ativity-init',
      method: 'GET',
      init: true
    });
    //this.usageIdentityId = res.data.usageIdentiy
    this.cookie.write(
      this.identityKey,
      this.usageIdentityId,
      7,
      location.hostname,
      '/',
    );
    return res.data.usageIdentiy;
  }
  async save(addOninfo = {}) {
    let log = await this.getUserId();
    log.activitis.push(addOninfo);
    let res = await this.http.httpRequest({
      url: 'uep/usage-activity',
      method: 'POST',
      data: log,
    });
  }
  async _customSave(obj) {
    await this.save(obj)
  }
  isDayLogged() {
    let key = '_eagleon_day';
    let id = this.cookie.read(key);
    if (id) {
      return true;
    } else {
      this.cookie.write(key, 1, 1, location.hostname, '/');
      return false;
    }
  }
  recorder() {
    this.getUserId();
    if (this.modules.NavigatePageURL) {
      this.event_ready(this.act_navigatePageURL.bind(this));
      this.event_pushstate = this.act_navigatePageURL.bind(this);
    }
    if (!this.isDayLogged()) {
      if (this.modules.SystemTime) {
        this.act_dateTime();
      }
      if (this.modules.ScreenInfo) {
        this.act_screenInfo();
      }
      if (this.modules.GpsInfo) {
        this.event_geoLocation(this.act_gpsInfo.bind(this));
      }
    }
  }
  findFullURL(ev = {}) {
    //advance
    let url;
    url = ev && typeof ev.url == 'string' ? ev.url : undefined;
    url = ev && typeof ev.url == 'object' ? ev.url.href : url;
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
    try {
      let log = { type: 'NavigatePageURL' };
      log.url = this.findFullURL(ev);
      await this.save(log);
    } catch (error) {
      console.error(error);
    }
  }
  async act_refererUrl() {
    try {
      let d = document.referrer;
      let log = { string_value: d, type: 'RefererUrl' };
      await this.save(log);
    } catch (error) {
      console.error(error);
    }
  }
  async act_inputValue(selectorString) {
    let input = document.querySelector(selectorString);
    if (input) {
      try {
        let d = input.value;
        let log = { string_value: d, type: 'InputValue' };
        await this.save(log);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.warn("Invaild " + selectorString + " selector")
    }
  }
  act_clickArea(callFn) {
    let sfn = async function (string_value, json_data) {
      let info = {};
      info.string_value = string_value;
      info.json_data = json_data;
      info.type = 'ClickArea';
      await this.save(info);
    }.bind(this);
    this.event_clickArea(callFn, sfn);
  }
  async act_htmlTag(selectorString, valueArea) {
    values = ['innerText', 'innerHTML', 'outerHTML', 'outerText'];
    let tag = document.querySelector(selectorString);
    if (tag) {
      try {
        let d = tag[valueArea];
        let log = { string_value: d, type: 'HtmlTag' };
        await this.save(log);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.warn("Invaild " + selectorString + " selector")
    }

  }
  async act_dateTime() {
    try {
      let d = new Date().toString();
      let log = { string_value: d, type: 'SystemTime' };
      await this.save(log);
    } catch (error) {
      console.error(error);
    }
  }
  async act_screenInfo() {
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
      await this.save(log);
    } catch (error) {
      console.error(error);
    }
  }
  async act_gpsInfo(data = {}) {
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
        let d = new Date().toString();
        let log = {
          json_data: info,
          type: 'GpsInfo',
        };
        await this.save(log);
      }
    } catch (error) {
      console.error(error);
    }
  }
  async act_CustomTracking(custom_title, string_value = '', json_data = null) {
    obj = {};
    obj.custom_title = custom_title;
    obj.string_value = string_value;
    obj.json_data = json_data;
    await this.save(obj);
  }
}
