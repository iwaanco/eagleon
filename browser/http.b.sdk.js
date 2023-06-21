export class EagleonSDKHttp {
  ApiUrl = 'http://127.0.0.1:3001/';
  ClientID;
  SecretKey;
  http;
  internalUrl = true;
  constructor(obj = {}) {
    this.ClientID = obj.ClientID;
    this.SecretKey = obj.SecretKey;
  }
  httpRequest(prop = {}) {
    let {
      url,
      method = 'GET',
      data = {},
      contentType = 'application/json',
      async = true,
      basicAuth = true,
      responseType = 'Object',
    } = prop;
    url = this.internalUrl ? this.ApiUrl + url : url;
    let prom = new Promise((resolve, reject) => {
      try {
        var request = new XMLHttpRequest();
        request.open(method, url, async);
        request.setRequestHeader('Content-Type', contentType);
        if (basicAuth) {
          let auth = 'Bearer ' + this.ClientID + '.' + this.SecretKey;
          request.setRequestHeader('Authorization', auth);
        }
        request.onreadystatechange = function () {
          if (this.readyState == 4) {
            let res = this.responseText;
            if (responseType == 'Object') {
              res = JSON.parse(res);
            }
            resolve(res);
          }
        };
        if (method != 'GET') {
          request.send(JSON.stringify(data));
        } else {
          request.send();
        }
      } catch (error) {
        reject(error);
      }
    });
    return prom;
  }
}
