import { EagleonHttp } from './http.js';
import { EagleonConsole } from './console.js';
export class EagleonStructuredData {
  ClientID;
  SecretKey;
  http;
  constructor(obj = {}) {
    this.ClientID = obj.ClientID;
    this.SecretKey = obj.SecretKey;
    this.http = new EagleonHttp(obj);
  }
  create(data) {
    return this.http.httpRequest({
      url: 'uep/structured-data-storage/',
      method: 'POST',
      data: data,
    });
  }
  update(id, data) {
    return this.http.httpRequest({
      url: 'uep/structured-data-storage/' + id,
      method: 'PATCH',
      data: data,
    });
  }
  delete(id) {

  }
  sendForm(selectorString, data = {}) {
    let form = document.querySelector(selectorString);
    if (form) {
      //vaild form
      let sendData = {};
      sendData.name = (data.name) ? data.name : ""
      if (form.tagName == 'FORM') {
        data.na
        let fd = new FormData(form);
        let sdsData = fd;
        sdsData
        this.create()
      } else {
        //form

      }
    } else {
      //error invaid
    }

  }
}