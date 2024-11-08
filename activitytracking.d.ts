
type ClickAreaSaveCallBack = (string_value: string, json_data: any) => void;
export interface eagleon_actModules {
  NavigatePageURL: boolean,
  RefererUrl: boolean,
  InputValue: { selectorString: string },
  SystemTime: boolean,
  ScreenInfo: boolean,
  GpsInfo: { tiggerTime: number },
  ClickArea: { callBack(target: any, savefn: ClickAreaSaveCallBack, e: any) },
  HtmlTag: { callback?(selectorString: string, valueArea: 'innerText' | 'innerHTML' | 'outerHTML' | 'outerText'): Promise<void> }
  CustomTracking: { custom_title: string, string_value: string, json_data: any }
}
export interface eagleon_actSettings {
  ClientID: string;
  SecretKey: string;
  lifeCycle?: {
    userLifeTime?: number,
    routineTime?: number,
  },
  repeatActivities: eagleon_actModules,
  routineActivities: eagleon_actModules
}
import { EagleonEvent } from './event';
declare class EagleonActivityTracking extends EagleonEvent {
  ClientID: string;
  SecretKey: string;
  private usageIdentityId: string;
  private usrCookieIdKey: string;
  private usrDayFlagKey: string;
  http: any;
  repeatActivities: eagleon_actModules;
  routineActivities: eagleon_actModules;
  lifeCycle: { userLifeTime: number, routineTime: number };
  constructor(data: eagleon_actSettings);
  //get cookie(): { write: Function; read: Function; remove: Function };
  //getUserId(): Promise<any>;
  //save(addOninfo: any): Promise<void>;
  //isDayLogged(): boolean;
  //init(): Promise<void>;
  recorder(): Promise<void>;
  //findFullURL(ev?: { url: string | any }): string;
  act_navigatePageURL(ev?: { url: string | any }): void;
  act_refererUrl(): Promise<void>;
  act_inputValue(selectorString: string): Promise<void>;
  act_clickArea(callFn: function): void;
  act_htmlTag(selectorString: string, valueArea: string): Promise<void>;
  act_dateTime(): Promise<void>;
  act_screenInfo(): Promise<void>;
  act_gpsInfo(callFn?: function): Promise<void>;
  act_CustomTracking(custom_title: string, string_value: string, json_data: Object): Promise<void>;
}
