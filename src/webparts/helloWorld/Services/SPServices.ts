import { WebPartContext } from "@microsoft/sp-webpart-base";
import {  ISPHttpClientOptions,SPHttpClient,SPHttpClientResponse } from '@microsoft/sp-http';
import { IChoiceGroupOption, IDropdownOption } from "office-ui-fabric-react";

import {  } from "@pnp/common";



export class SPOperations{
    public GetAllHolidayList(context: WebPartContext): Promise<IDropdownOption[]>{
        let restApiUrl: string= context.pageContext.web.absoluteUrl+"/_api/web/lists/getByTitle('PublicHolidays')/items";
        var listTitle: IDropdownOption[]=[];

        return new Promise<IDropdownOption[]>(async(resolve, reject)=>{
            context.spHttpClient.get(restApiUrl, SPHttpClient.configurations.v1)
        .then((response: SPHttpClientResponse)=>{
            response.json().then((results:any)=>{
                console.log(results);
                results.value.map((result:any)=>{
                    listTitle.push({
                        key: result.Date,
                        text: result.Title,
                    });
                });
            });
            resolve(listTitle);
        },
        (error:any):void=>{
            reject("error occured" + error)
        }); 
        
        });

       
    }
    public GetAllLeaveSettings(context: WebPartContext): Promise<IChoiceGroupOption[]>{
        let restApiUrl: string= context.pageContext.web.absoluteUrl+"/_api/web/lists/getByTitle('LeaveSettings')/items";
        var listTitle: IChoiceGroupOption[]=[];
        return new Promise<IChoiceGroupOption[]>(async(resolve, reject)=>{
            context.spHttpClient.get(restApiUrl, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse)=>{
                response.json().then((results:any)=>{
                    console.log(results);
                    results.value.map((result:any)=>{
                        listTitle.push({
                            key: result.Title,
                            text: result.Title 
                        });
                    });
                });
                resolve(listTitle);
            },
            (error:any):void=>{
                reject("error occured" + error)
            }); 
        });
    }

    public CreateHolidayList(context:WebPartContext, listTitle:string):Promise<string>{
        let restApiUrl:string=context.pageContext.web.absoluteUrl+ "/_api/web/lists/getByTitle('"+listTitle+"')/items";
        const body: string=JSON.stringify({Title:"New item Created"});
        const options: ISPHttpClientOptions={
            headers:{
                Accept: "application/json; odata=nometadata",
                "content-type": "application/json; odata=nometadata",
                "odata-version": "",
            }, 
            body: body
        };
        return new Promise<string>(async(resolve, reject)=>{
            context.spHttpClient
            .post(restApiUrl, SPHttpClient.configurations.v1,options)
            .then((response: SPHttpClientResponse)=>{
                response.json().then(
                    (result:any)=>{
                        resolve("Item with ID "+ result.ID + " created successfuly.");
                    },
                    (error:any)=>{
                        reject("error occured" + error)
                    });
                
            });
        });
    }



    public DeleteItemHolidayList(context:WebPartContext, listTitle:string){

         
    }
    
}