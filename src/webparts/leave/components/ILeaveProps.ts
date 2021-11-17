import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface ILeaveProps {
  description: string;
  context: WebPartContext;
  userid: string;
}
