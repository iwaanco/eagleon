declare class EagleonSDKCms {
  ClientID: string;
  SecretKey: string;
  http: any;
  constructor(obj: { ClientID: string; SecretKey: string }): void;
  findOne(id: string): Promise<any>;
  elementRender(selector: string, content: string, renderHtml: boolean): void;
  async render(settings: {
    id: string;
    renderName: string;
    renderShort: string;
    renderContent: string;
    renderHtml: boolean;
    beforeRender: function;
    afterRender: function;
  }): Promise<void>;
}
