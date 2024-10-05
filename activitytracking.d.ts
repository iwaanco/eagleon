export interface eagleon_actModules {
  NavigatePageURL: boolean;
  RefererUrl: boolean;
  SystemTime: boolean;
  ScreenInfo: boolean;
  GpsInfo: boolean;
}
export interface eagleon_actSettings {
  ClientID: string;
  SecretKey: string;
  modules?: eagleon_actModules;
}
import { EagleonEvent } from './event';
declare class EagleonActivityTracking extends EagleonEvent {
  ClientID: string;
  SecretKey: string;
  private identityKey?: string;
  private usageIdentityId: string;
  http: any;
  modules: eagleon_actModules;
  constructor(data: eagleon_actSettings);
  get cookie(): { write: Function; read: Function; remove: Function };
  getUserId(): Promise<any>;
  save(addOninfo: any): Promise<void>;
  isDayLogged(): boolean;
  init(): Promise<void>;
  recorder(): void;
  findFullURL(ev?: { url: string | any }): string;
  act_navigatePageURL(ev?: { url: string | any }): void;
  act_refererUrl(): Promise<void>;
  act_inputValue(selectorString: string): Promise<void>;
  act_clickArea(callFn: Function): void;
  act_htmlTag(selectorString: string, valueArea: string): Promise<void>;
  act_dateTime(): Promise<void>;
  act_screenInfo(): Promise<void>;
  act_gpsInfo(data?: any): Promise<void>;
  act_CustomTracking(custom_title: string, string_value: string, json_data: Object): Promise<void>;
}
