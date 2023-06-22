declare class EagleonSDKHttp {
  ApiUrl?: string;
  ClientID: string;
  SecretKey: string;
  internalUrl?: boolean;
  constructor(data: { ClientID: string; SecretKey: string }): void;
  httpRequest(prop: {
    url: sting;
    method: string;
    data?: any;
    contentType?: string;
    async: boolean;
    basicAuth: boolean;
    responseType: boolean;
  }): Promise<any>;
}
