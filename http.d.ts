export class EagleonHttp {
  private ApiUrl?: string;
  ClientID: string;
  SecretKey: string;
  internalUrl?: boolean;
  constructor(data: { ClientID: string; SecretKey: string });
  httpRequest(prop: {
    url: string;
    method: string;
    data?: any;
    contentType?: string;
    async: boolean;
    basicAuth: boolean;
    responseType: boolean;
    init?: boolean;
  }): Promise<any>;
}
