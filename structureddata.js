import { EagleonSDKHttp } from './http.js';
export class EagleonSDKStructuredData {
  ClientID;
  SecretKey;
  http;
  constructor(obj = {}) {
    this.ClientID = obj.ClientID;
    this.SecretKey = obj.SecretKey;
    this.http = new EagleonSDKHttp(obj);
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
}
