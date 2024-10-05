import { EagleonHttp } from './http';
export class EagleonStructuredData {
  ClientID: string;
  SecretKey: string;
  http: EagleonHttp;
  constructor(data: { ClientID: string; SecretKey: string });
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
}
