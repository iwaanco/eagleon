import { EagleonSDKHttp } from './http.js';
/**
 * Eagleon CMS SDK
 * @type {class}
 */
export class EagleonSDKCms {
  ClientID;
  SecretKey;
  http;
  /**
   * @param {object} data
   * @param {string} data.ClientID Eagleon Client Id
   * @param {string} data.SecretKey Eagleon Secret key
   */
  constructor(data = {}) {
    this.ClientID = data.ClientID;
    this.SecretKey = data.SecretKey;
    this.http = new EagleonSDKHttp(data);
  }
  findOne(id) {
    return this.http.httpRequest({
      url: 'uep/cms/' + id,
      method: 'GET',
    });
  }
  elementRender(selector, content, renderHtml = true) {
    let elm = document.querySelector(selector);
    if (elm) {
      if (renderHtml) {
        elm.innerHTML = content;
      } else {
        elm.innerText = content;
      }
    } else {
      console.warn('Missing element ' + selector);
    }
  }
  async render(settings = {}) {
    let {
      id,
      renderName,
      renderShort,
      renderContent,
      renderHtml = true,
      beforeRender,
      afterRender,
    } = settings;
    if (typeof beforeRender == 'function') beforeRender(id);
    let data = await this.findOne(id);
    if (data.statusCode == 200) {
      this.elementRender(renderName, data.data.name, renderHtml);
      this.elementRender(renderShort, data.data.short, renderHtml);
      this.elementRender(renderContent, data.data.content, renderHtml);
    } else {
      console.warn('CMS data error', data);
    }
    if (typeof afterRender == 'function') beforeRender(data);
  }
}
