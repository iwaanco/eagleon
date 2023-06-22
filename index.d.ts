import { EagleonSDK } from './eagleon';
import { EagleonSDKStructuredData } from './structureddata';
import { EagleonSDKActivitylogs } from './activitylogs';
import { EagleonSDKCms } from './cms';
window.EagleonSDK = {
  sdk: EagleonSDK,
  structuredData: EagleonSDKStructuredData,
  activitylogs: EagleonSDKActivitylogs,
  cms: EagleonSDKCms,
};
