import { EagleonSDKHttp } from './http.js';
export class EagleonSDKStructuredData {
  ClientID: string;
  SecretKey: string;
  http: EagleonSDKHttp;
  constructor(data: { ClientID: string; SecretKey: string }): void;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
}
