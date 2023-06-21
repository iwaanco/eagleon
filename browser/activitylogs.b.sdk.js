import { EagleonSDKEvent } from './event.b.sdk.js';
import { EagleonSDKHttp } from './http.b.sdk.js';

export class EagleonSDKActivitylogs extends EagleonSDKEvent {
  ClientID;
  SecretKey;
  identityKey = '_eagleon_id';
  usageIdentityId;
  http;
  logModules = {
    visitPages: true,
    systemDateTime: true,
    screenInfo: true,
    userLocation: true,
  };
  constructor(obj = {}) {
    super();
    this.ClientID = obj.ClientID;
    this.SecretKey = obj.SecretKey;
    this.logModules = obj.logModules ? obj.logModules : this.logModules;
    this.http = new EagleonSDKHttp(obj);
    this.theWatcher();
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
  async logInfo() {
    let info = {
      url: location.href,
      oscpu: navigator.oscpu,
      user_agent: navigator.userAgent,
    };
    if (!this.usageIdentityId) {
      let id = this.cookie.read(this.identityKey);
      if (id) {
        this.usageIdentityId = id;
      } else {
        info.type = 'NewUser';
        info.activity = 'New user visit the website';
        info.more_information = JSON.stringify({ referrer: document.referrer });
        info.more_information_type = 'MOREINFO';
        let res = await this.http.httpRequest({
          url: 'uep/usage-activity',
          method: 'POST',
          data: info,
        });
        this.usageIdentityId = res.data.usageIdentiy;
        this.cookie.write(
          this.identityKey,
          this.usageIdentityId,
          7,
          location.hostname,
          '/',
        );
      }
    }
    info.logUsageIdentiyId = this.usageIdentityId;
    return info;
  }
  async sendLog(addOninfo = {}) {
    let log = await this.logInfo();
    log.url = addOninfo.url ? addOninfo.url : log.url;
    log.activity = addOninfo.activity ? addOninfo.activity : 'unknown';
    log.type = addOninfo.type ? addOninfo.type : 'Unknown';
    log.more_information = addOninfo.more_information
      ? addOninfo.more_information
      : undefined;
    log.more_information_type = addOninfo.more_information_type
      ? addOninfo.more_information_type
      : undefined;
    let res = await this.http.httpRequest({
      url: 'uep/usage-activity',
      method: 'POST',
      data: log,
    });
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
  theWatcher() {
    this.logInfo();
    if (this.logModules.visitPages) {
      this.ready(this.visitLog.bind(this));
      this.pushstate = this.visitLog.bind(this);
    }
    if (!this.isDayLogged()) {
      if (this.logModules.systemDateTime) {
        this.dateTimeLog();
      }
      if (this.logModules.screenInfo) {
        this.screenLog();
      }
      if (this.logModules.userLocation) {
        this.geoLocation(this.locationLog.bind(this));
      }
    }
  }
  findFullURL(ev = {}) {
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
  visitLog(ev = {}) {
    try {
      let log = { activity: 'Page visit', type: 'Navigate' };
      log.url = this.findFullURL(ev);
      this.sendLog(log);
    } catch (error) {
      console.error(error);
    }
  }
  dateTimeLog() {
    try {
      let d = new Date().toString();
      let log = { activity: 'System date and time: ' + d, type: 'Others' };
      this.sendLog(log);
    } catch (error) {
      console.error(error);
    }
  }
  screenLog() {
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
        activity: `Screen height: ${window.screen.height}, Screen width: ${window.screen.width}`,
        type: 'Others',
        more_information: JSON.stringify(scr),
        more_information_type: 'FULLINFO',
      };
      this.sendLog(log);
    } catch (error) {
      console.error(error);
    }
  }
  locationLog(data = {}) {
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
          activity: `User location latitude :${data.coords.latitude},  longitude: ${data.coords.longitude}`,
          type: 'Others',
          more_information: JSON.stringify(info),
          more_information_type: 'FULLINFO',
        };
        this.sendLog(log);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
