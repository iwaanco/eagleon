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
  async create(data) {
    return await this.http.httpRequest({
      url: 'uep/structured-data-storage/',
      method: 'POST',
      data: data,
    });
  }
  async update(id, data) {
    return await this.http.httpRequest({
      url: 'uep/structured-data-storage/' + id,
      method: 'PATCH',
      data: data,
    });
  }
  async delete(id) {
    return await this.http.httpRequest({
      url: 'uep/structured-data-storage/' + id,
      method: 'DELETE'
    });
  }
  async get(id) {
    return await this.http.httpRequest({
      url: 'uep/structured-data-storage/' + id,
      method: 'GET',
    });
  }
  async sendForm(formId, data = {}) {
    let form = document.querySelector("#" + formId);
    if (form) {
      //vaild form
      if (form.tagName == 'FORM') {
        let sendData = {};
        sendData.name = (data.name) ? data.name : "form " + location.pathname;
        sendData.type = "json";
        sendData.groupName = (data.type) ? data.type : "form " + location.host;
        sendData.permission = (data.permission) ? data.permission : "private";
        //metadata
        if (data.metadata) sendData.metadata = data.metadata;
        let fd = new FormData(form);
        let sdsData = this.arrayObjectEntries(fd)//Object.fromEntries(fd);
        sendData.dataText = sdsData;
        return await this.create(sendData);
      } else {
        //form
        return { statusCode: 400, message: ["Invalid form Id"] }
      }
    } else {
      //error Invalid
      return { statusCode: 400, message: ["Invalid form Id"] }
    }
  }
  arrayObjectEntries(fd) {
    let fdArr = Array.from(fd);
    let obj = {};
    //console.log(fdArr);
    for (let i = 0; i < fdArr.length; i++) {
      if (Array.isArray(obj[fdArr[i][0]])) {
        //console.log(obj, fdArr[i][0], fdArr[i][1]);
        obj[fdArr[i][0]].push(fdArr[i][1]);
      } else {
        obj[fdArr[i][0]] = [fdArr[i][1].toString()];
      }
    }
    //console.log(obj);
    //remove
    let keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      if (obj[keys[i]].length == 1) {
        obj[keys[i]] = obj[keys[i]][0];
      }
    }
    return obj;
  }
  async fillform(formId, id) {
    let data = await this.get(id);
    let jsonData = JSON.parse(JSON.stringify(data));
    // console.log("bata", data)
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
          //console.log("formData", formData);
          for (let i = 0; i < form.elements.length; i++) {
            if (formData[form.elements[i].name]) {
              if (Array.isArray(formData[form.elements[i].name])) { //array
                if (form.elements[i].tagName == 'INPUT') {
                  if (form.elements[i].type == 'checkbox') {
                    let indexof = formData[form.elements[i].name].indexOf(form.elements[i].value);
                    if (indexof != -1) {
                      let value = formData[form.elements[i].name].splice(indexof, 1);
                      form.elements[i].checked = true;
                    }
                  } if (form.elements[i].type == 'radio') {
                    let indexof = formData[form.elements[i].name].indexOf(form.elements[i].value);
                    if (indexof != -1) {
                      let value = formData[form.elements[i].name].splice(indexof, 1);
                      form.elements[i].checked = true;
                    }
                  } else {
                    if (form.elements[i].name && (form.elements[i].type != 'checkbox' && form.elements[i].type != 'radio')) {
                      let value = formData[form.elements[i].name].shift();
                      form.elements[i].value = value;
                    }
                  }
                } else {
                  if (formData[form.elements[i].name]) { //unwanted value
                    let value = formData[form.elements[i].name].shift();
                    form.elements[i].value = value;
                  }
                }
              } else { //single value
                let value = formData[form.elements[i].name];
                if (form.elements[i].tagName == 'INPUT') {
                  if (form.elements[i].type == 'checkbox') {
                    if (value == form.elements[i].value) {
                      form.elements[i].checked = true;
                    }
                  } if (form.elements[i].type == 'radio') {
                    if (value == form.elements[i].value) {
                      form.elements[i].checked = true;
                    }
                  } else {
                    form.elements[i].value = value;
                  }
                } else {
                  form.elements[i].value = value;
                }
                delete formData[form.elements[i].name];
              }
            }
          }
          return jsonData;
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
  async updateForm(sdsId, formId, data = {}) {
    let form = document.querySelector("#" + formId);
    if (form) {
      if (form.tagName == 'FORM') {
        let sendData = {};
        sendData.name = (data.name) ? data.name : "form " + location.pathname;
        sendData.type = "json";
        sendData.groupName = (data.type) ? data.type : "form " + location.host;
        sendData.permission = (data.permission) ? data.permission : "private";
        //metadata
        if (data.metadata) sendData.metadata = data.metadata;
        let fd = new FormData(form);
        let sdsData = this.arrayObjectEntries(fd)//Object.fromEntries(fd);
        sendData.dataText = sdsData;
        return await this.update(sdsId, sendData);
      } else {
        return { statusCode: 400, message: ["Invalid form Id"] }
      }
    } else {
      //error Invalid
      return { statusCode: 400, message: ["Invalid form Id"] }
    }
  }
}