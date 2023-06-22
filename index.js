import { EagleonSDK } from './eagleon.js';
import { EagleonSDKStructuredData } from './structureddata.js';
import { EagleonSDKActivitylogs } from './activitylogs.js';
import { EagleonSDKCms } from './cms.js';
window.EagleonSDK = {
  sdk: EagleonSDK,
  structuredData: EagleonSDKStructuredData,
  activitylogs: EagleonSDKActivitylogs,
  cms: EagleonSDKCms,
};
