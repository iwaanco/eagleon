import { EagleonSDK } from './eagleon';
import { EagleonStructuredData } from './structureddata';
import { EagleonActivityTracking } from './activitytracking';
import { EagleonCms } from './cms';
//module window
window.Eagleon = {
  SDK: EagleonSDK,
  StructuredData: EagleonStructuredData,
  ActivityTracking: EagleonActivityTracking,
  Cms: EagleonCms,
}
