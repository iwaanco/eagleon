/*
EagleonSDK v1.0
*/
import { EagleonActivityTracking, eagleon_actSettings } from './activitytracking.js';
import { EagleonCms } from './cms.js';
import { EagleonStructuredData } from './structureddata.js';
/**
 * Eagleon SDK
 * @type {class}
 */
declare class EagleonSDK {
  ClientID: string;
  SecretKey: string;
  /**
   * @param {object} data
   * @param {string} data.ClientID Eagleon Client Id
   * @param {string} data.SecretKey Eagleon Secret key
   */
  constructor(data: { ClientID: string; SecretKey: string });
  cms(settings: { ClientID: string; SecretKey: string }): EagleonCms;
  activityTracking(data: eagleon_actSettings): EagleonActivityTracking;
  structuredData(settings: { ClientID: string; SecretKey: string }): EagleonStructuredData;
}
