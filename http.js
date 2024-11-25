export class EagleonHttp {
  ApiUrl = 'http://127.0.0.1:3001/';
  InitUrl = 'http://127.0.0.1:5000/'
  ClientID;
  SecretKey;
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
      init = false,
      externalUrl = false
    } = prop;
    if (externalUrl) {
      basicAuth = false;
    } else {
      url = this.internalUrl ? ((init) ? this.InitUrl : this.ApiUrl) + url : url;
    }
    let prom = new Promise((resolve, reject) => {
      try {
        var request = new XMLHttpRequest();
        request.open(method, url, async);
        request.setRequestHeader('Content-Type', contentType);
        request.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        request.setRequestHeader("Pragma", 'no-cache');
        request.setRequestHeader('Expires', '0');
        request.setRequestHeader("Cache-Control", "public, max-age=0");
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
        if (method == 'POST' || method == 'PATCH') {
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
