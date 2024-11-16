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
    return this.http.httpRequest({
      url: 'uep/structured-data-storage/' + id,
      method: 'DELETE'
    });
  }
  get(id) {
    return this.http.httpRequest({
      url: 'uep/structured-data-storage/' + id,
      method: 'GET',
      data: data,
    });
  }
  async sendForm(formId, data = {}) {
    let form = document.querySelector("#" + formId);
    if (form) {
      //vaild form
      if (form.tagName == 'FORM') {
        let sendData = {};
        sendData.name = (data.name) ? data.name : "form_" + location.pathname;
        sendData.type = (data.type) ? data.type : "json";
        sendData.groupName = (data.type) ? data.type : "form_" + location.host;
        sendData.permission = (data.permission) ? data.permission : "private";
        //metadata
        if (data.metadata) sendData.metadata = data.metadata;
        let fd = new FormData(form);
        let sdsData = fd;
        sendData.dataText = sdsData;
        return await this.create(sendData)
      } else {
        //form
        return { statusCode: 400, message: ["Invalid form Id"] }
      }
    } else {
      //error Invalid
      return { statusCode: 400, message: ["Invalid form Id"] }
    }
  }
  async fillform(formId, id) {
    let data = await this.get(id);
    let form = document.getElementById(formId);
    if (data.statusCode == 200) {
      try {
        if (data.data.type == 'json') {
          let formData;
          if (typeof data.data.dataText == 'string') {
            formData = JSON.stringify(data.data.dataText);
          } else {
            formData = data.data.dataText;
          }
          let keys = Object.keys(formData);
          for (let i = 0; i < keys.length; i++) {
            if (form.elements[keys[i]]) {
              if (form.elements[keys[i]].length > 0) {
                for (let j = 0; j < form.elements[keys[i]].length; j++) {
                  form.elements[keys[i]] = formData[keys[i]][j];
                }
              } else {
                form.elements[keys[i]].value = formData[keys[i]];
              }
            }
          }
        } else {
          return { statusCode: 400, message: ["Invalid SDS Data type"] }
        }
      } catch (error) {
        return { statusCode: 400, message: [error.message] }
      }
    } else {
      return data;
    }
  }
}