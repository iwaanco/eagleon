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
  constructor(obj = {}) {
    this.ClientID = obj.ClientID;
    this.SecretKey = obj.SecretKey;
  }
  cms() {}
  http() {}
  activitylogs() {}
}

//export default EagleonSDK;
export const Cms = EagleonSDKCms;
export const Http = EagleonSDKHttp;
export const Activitylogs = EagleonSDKActivitylogs;
