import { IDropdownOption, ChoiceGroup, IChoiceGroupOption } from "office-ui-fabric-react";



export interface IEmployeeState{
    listTitle: IDropdownOption[];
    status: string;
    leaveSettings: IChoiceGroupOption[];
    sDate: string;
    eDate: string;
    emailCc: string;
    leaveType: string;
    reason: string;

    errorLeaveType:string;
    errorStartDate:string;
    errorEndDate:string;
    errorReason:string;
    errorEmail:string;

    dataBaseExtracts: [{id: string,
        user_id: string,
        start_date: string,
        end_date: string,
        type: string,
        cc: string,
        comment: string,
        status: string,
        days: string}],
    leaveBalance: [{ id: string, text: string }]

    submitSuccess:string;
}