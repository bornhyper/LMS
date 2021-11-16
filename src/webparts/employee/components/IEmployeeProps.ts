import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IEmployeeProps {
  description: string;
  context: WebPartContext;
  userid: string;
}
