/*
EagleonSDK v1.0
*/
import { EagleonSDKActivitylogs } from './activitylogs.b.sdk.js';
import { EagleonSDKCms } from './cms.b.sdk.js';
import { EagleonSDKHttp } from './http.b.sdk.js';
/* Eagleon sdk */
export class EagleonSDK {
  ClientID;
  SecretKey;
  http;
  constructor(obj = {}) {
    this.ClientID = obj.ClientID;
    this.SecretKey = obj.SecretKey;
    this.http = new EagleonSDKHttp(obj);
  }
  async cms(settings = {}) {
    let cms = new EagleonSDKCms({
      ClientID: this.ClientID,
      SecretKey: this.SecretKey,
    });
    cms.render(settings);
    return cms;
  }
  activitylogs(obj = {}) {
    obj.ClientID = this.ClientID;
    obj.SecretKey = this.SecretKey;
    let activitylogs = new EagleonSDKActivitylogs();
    return activitylogs;
  }
}

//export default EagleonSDK;
export const Cms = EagleonSDKCms;
export const Http = EagleonSDKHttp;
export const Activitylogs = EagleonSDKActivitylogs;
