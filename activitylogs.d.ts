export interface LogModules {
  visitPages: boolean;
  systemDateTime: boolean;
  screenInfo: boolean;
  userLocation: boolean;
}
export interface LogSettings {
  ClientID: string;
  SecretKey: string;
  logModules?: LogModules;
}
import { EagleonSDKEvent } from './event';
declare class EagleonSDKActivitylogs extends EagleonSDKEvent {
  ClientID: string;
  SecretKey: string;
  private identityKey?: string;
  private usageIdentityId: string;
  http: any;
  logModules: LogModules;
  constructor(data: LogSettings);
  get cookie(): { write: Function; read: Function; remove: Function };
  logInfo(): Promise<any>;
  sendLog(addOninfo:any): Promise<void>;
  isDayLogged(): boolean;
  theWatcher(): void;
  findFullURL(ev?: { url: string | any }): string;
  visitLog(ev?: { url: string | any }): void;
  dateTimeLog(): void;
  screenLog(): void;
  locationLog(data?: any): void;
}
