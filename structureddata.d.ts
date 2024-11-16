import { EagleonHttp } from './http';
export interface eaglonSDSDto {
  dataText: any | string,
  type: string;
  metadata: any,
  name: string;
  groupName: string;
  permission: "public" | "private";
}
export class EagleonStructuredData {
  ClientID: string;
  SecretKey: string;
  http: EagleonHttp;
  constructor(data: { ClientID: string; SecretKey: string });
  create(data: eaglonSDSDto): Promise<any>;
  update(id: string, data: eaglonSDSDto): Promise<any>;
  sendForm(id: string, data?: {
    name?: string,
    groupName?: string,
    metadata?: Object,
    permission?: 'public' | 'private',
  }): Promise<any>;
  fillform(formId: string, id: string): Promise<any>;
  dalete(id): Promise<any>;
}
