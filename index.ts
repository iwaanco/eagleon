import { EagleonSDK } from './eagleon';
import { EagleonStructuredData } from './structureddata';
import { EagleonActivityTracking } from './activitytracking';
import { EagleonCms } from './cms';
//module window
window.EagleonSDK = {
  EagleonSDK: EagleonSDK,
  EagleonStructuredData: EagleonStructuredData,
  EagleonActivityTracking: EagleonActivityTracking,
  EagleonCms: EagleonCms,
}
