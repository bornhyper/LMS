import * as React from 'react';
import styles from '../../employee/components/Employee.module.scss';
import { ILeaveProps } from './ILeaveProps';
// import { ILeaveState } from './ILeaveState';
import { IEmployeeState } from '../../employee/components/IEmployeeState';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPOperations } from '../../employee/Services/SPServices';
import { IDropdownOption, IChoiceGroupOption } from "office-ui-fabric-react";

export default class Leave extends React.Component<ILeaveProps, IEmployeeState, {}> {
  public _spOps: SPOperations;
  public selectedListTitle: string;
  public selectedListTitle2: string;
  public selectedLeaveSettings: string;

  constructor(props: ILeaveProps) {
    super(props);
    this._spOps = new SPOperations();
    this.state = {
      listTitle: [],
      leaveSettings: [],
      status: "pending",
      sDate: "",
      emailCc: "",
      reason: "",
      eDate: "",
      leaveType: "",
      errorLeaveType: "",
      errorStartDate: "",
      errorEndDate: "",
      errorReason: "",
      errorEmail: "",

      dataBaseExtracts: [{
        id: "",
        user_id: "",
        start_date: "",
        end_date: "",
        type: "",
        cc: "",
        comment: "",
        status: "",
        days: ""
      }],

      leaveBalance: [{ id: "", text: "" }],

      publicHolidays: [""],

      submitSuccess: ""
    };
  };

  public componentDidMount() {
    
    this._spOps.GetAllLeaveSettings(this.props.context).then((result: IChoiceGroupOption[]) => {
      this.setState({ leaveSettings: result })
    });
  }

  public render(): React.ReactElement<ILeaveProps> {

    fetch("https://contosofunctions.azurewebsites.net/api/getitem/")
    .then((res) => res.json())
    .then((json) => {
      this.setState({ dataBaseExtracts: json })
    });

    const checkUser = escape(this.props.userid);
    const LeaveType = this.state.leaveSettings.map(item => <p>{item.text}</p>);
    const printHolidayDate = this.state.listTitle.map(item => <p>{item.key.toString().substr(0, 10)}</p>);

    var startDateHistory: JSX.Element[] = [], endDateHistory: JSX.Element[] = [], typeHistory: JSX.Element[] = [], daysHistory: JSX.Element[] = [], ccHistory: JSX.Element[] = [], commentHistory: JSX.Element[] = [], statusHistory: JSX.Element[] = [];
    if (this.state.dataBaseExtracts.length) {
      this.state.dataBaseExtracts.map((item) => {
        if (item.user_id === checkUser.toString()) {
          startDateHistory.push(<p key={item.id}>{item.start_date}</p>),
            endDateHistory.push(<p key={item.id}>{item.end_date}</p>), typeHistory.push(<p key={item.id}>{item.type}</p>),
            ccHistory.push(<p key={item.id}>{item.cc}</p>), commentHistory.push(<p key={item.id}>{item.comment}</p>),
            statusHistory.push(<p key={item.id}>{item.status}</p>), daysHistory.push(<p key={item.id}>{item.days}</p>)
        };
      }
      );
    }

    this.state.leaveSettings.map((item) => {
      // console.log(item)
      this.state.leaveBalance.push({ id: item.text, text: item.key });
    })

    if (this.state.dataBaseExtracts.length) {
      this.state.dataBaseExtracts.map((item) => {
        if (item.user_id === checkUser.toString()) {
          this.state.leaveSettings.map((newItem) => {
            this.state.leaveBalance.map((nItem) => {
              if (item.status === "approved".toString() && item.type.toString() === newItem.text.toString() && nItem.id === item.type) {
                //console.log(newItem.key+" "+item.days);
                nItem.text = (parseInt(newItem.key) - parseInt(item.days)).toString();
              }
            })
          })
        }
      });
    }

    const LeaveDays = this.state.leaveBalance.slice(0, this.state.leaveSettings.length + 1).map((item) => <p>{item.text}</p>);

    //console.log(printHolidayDate);

    return (
      <div className={styles.employee}>
        <div className={styles.container}>

        <div className={styles.grid}>
                <div className={styles.gridRow}>
                  <div className={styles.gridHeading1}>
                    Leave Type
                  </div>
                  <div className={styles.gridHeading2}>
                    Total Number of Days
                  </div>
                  <div className={styles.smallCol}>
                    {LeaveType}
                  </div>
                  <div className={styles.largeCol}>
                    {LeaveDays}
                  </div>
                </div>
              </div>
        </div>
      </div>
    );
  }
}