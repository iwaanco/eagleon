import { EagleonHttp } from './http.js';
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
}
