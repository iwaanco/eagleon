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
declare class EagleonSDKActivitylogs extends EagleonSDKEvent {
  ClientID: string;
  SecretKey: string;
  private identityKey?: string;
  private usageIdentityId: string;
  http: any;
  logModules: LogModules;
  constructor(data: LogSettings): void;
  get cookie(): { write: function; read: function; remove: function };
  async logInfo(): Promise<Object<any>>;
  async sendLog(addOninfo = {}): Promise<void>;
  isDayLogged(): boolean;
  theWatcher(): void;
  findFullURL(ev?: { url: string | any }): string;
  visitLog(ev?: { url: string | any }): void;
  dateTimeLog(): void;
  screenLog(): void;
  locationLog(data?: any): void;
}
