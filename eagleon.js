/*
EagleonSDK v1.0
*/
import { EagleonActivityTracking } from './activitytracking.js';
import { EagleonCms } from './cms.js';
import { EagleonStructuredData } from './structureddata.js';

/**
 * Eagleon SDK
 * @type {class}
 */
export class EagleonSDK {
  ClientID;
  SecretKey;
  /**
   * @param {object} data
   * @param {string} data.ClientID Eagleon Client Id
   * @param {string} data.SecretKey Eagleon Secret key
   */
  constructor(data = {}) {
    this.ClientID = data.ClientID;
    this.SecretKey = data.SecretKey;
  }
  cms(obj = {}) {
    obj.ClientID = this.ClientID;
    obj.SecretKey = this.SecretKey;
    let cms = new EagleonCms(obj);
    return cms;
  }
  activityTracking(obj = {}) {
    obj.ClientID = this.ClientID;
    obj.SecretKey = this.SecretKey;
    let activitylogs = new EagleonActivityTracking(obj);
    return activitylogs;
  }
  structuredData(obj = {}) {
    obj.ClientID = this.ClientID;
    obj.SecretKey = this.SecretKey;
    let sds = new EagleonStructuredData(obj);
    return sds;
  }
}
