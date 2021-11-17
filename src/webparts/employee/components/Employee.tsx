import * as React from 'react';
import styles from './Employee.module.scss';
import { IEmployeeProps } from './IEmployeeProps';
import { IEmployeeState } from './IEmployeeState';
import { escape } from '@microsoft/sp-lodash-subset';
import { AadHttpClient, HttpClientResponse } from '@microsoft/sp-http';
import { SPOperations } from "../Services/SPServices";
import { TextField } from '@fluentui/react/lib/TextField';
import { Dropdown, IDropdownOption, Pivot, PivotItem, PrimaryButton, DefaultButton, List, IChoiceGroupOption, ChoiceGroup, format } from "office-ui-fabric-react";
import { Label } from "@fluentui/react"

const regularExpression = RegExp(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/);
export default class Employee extends React.Component<IEmployeeProps, IEmployeeState, {}> {
  public _spOps: SPOperations;
  public selectedListTitle: string;
  public selectedLeaveSettings: string;
  //public static HolidaysNameExport: IDropdownOption[];

  constructor(props: IEmployeeProps) {
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

      publicHolidays:[""],

      submitSuccess:""
    };

    this.SubmitData = this.SubmitData.bind(this);

    //console.log(this.state);

    // this._spOps.GetAllHolidayList(this.props.context).then((result: IDropdownOption[]) => {
    //   this.setState({ listTitle: result })
    //   console.log(this.state.listTitle)
    //   Employee.HolidaysNameExport=this.state.listTitle;

    //   console.log(Employee.HolidaysNameExport,'1');
    // });

  }

  public componentDidMount() {

    this._spOps.GetAllHolidayList(this.props.context).then((result: IDropdownOption[]) => {
      this.setState({ listTitle: result })
      console.log(this.state.listTitle)
      //Employee.HolidaysNameExport=this.state.listTitle;

      //console.log(Employee.HolidaysNameExport,'1');
    });

    this._spOps.GetAllLeaveSettings(this.props.context).then((result: IChoiceGroupOption[]) => {
      this.setState({ leaveSettings: result })
    });
  }

  //validating the form
  public isValid() {
    if (this.state.leaveType != "" && this.state.sDate != "" && this.state.eDate != "" && this.state.reason != "" && this.state.errorEmail == "" && this.state.errorEndDate == "") {
      this.setState({ errorLeaveType: "", errorStartDate: "", errorEndDate: "", errorReason: "", errorEmail: "" })
      console.log("Accepted form");
      return true;
    }

    if (this.state.leaveType == "")
      this.setState({ errorLeaveType: "Leave type can not be empty" });
    else
      this.setState({ errorLeaveType: "" });

    if (this.state.sDate == "")
      this.setState({ errorStartDate: "Start Date can not be empty" });
    else
      this.setState({ errorStartDate: "" });

    if (this.state.errorEndDate != "Start Date Changed. please update the End Date") {
      if (this.state.eDate == "")
        this.setState({ errorEndDate: "End Date can not be empty" });
      else
        this.setState({ errorEndDate: "" });
    }

    if (this.state.reason == "")
      this.setState({ errorReason: "Reason can not be empty" });
    else
      this.setState({ errorReason: "" });
    return false;
  }

  public getDayDifference(sDate: string, eDate: string) {
    var date1 = new Date(sDate);
    var day1=date1.getUTCDay();
    var date2 = new Date(eDate);
    var diffTime = Math.abs(date1.getDate() - date2.getDate()) + 1;
    console.log(diffTime + "days");
    var weekdays=2*Math.floor(diffTime/7)
    var additional= Math.floor(diffTime % 7);
    diffTime=diffTime-weekdays
    if(day1+additional-1>=7)
      diffTime=diffTime-2
    console.log(diffTime + "days");
    
    for(let i=date1;i<=date2;i.setDate(i.getDate()+1))
    {
      //console.log(i.getDate());
      let tempDate=i.getFullYear() + '-' + (i.getMonth() + 1) + '-' + i.getDate()
      if(!(i.getUTCDay()==0 || i.getUTCDay()==6) && this.state.publicHolidays.indexOf(tempDate)!=-1)
        diffTime--;
    }

    console.log(diffTime + "days");
    return diffTime;
  }

  public leaveBalanceDaysCheck(tempDays)
  {
    let days=tempDays;
    let index=0;
    let isTrue=false;
    this.state.leaveSettings.map((item)=>{
      index++;
      if(this.state.leaveType===item.text)
      {
        //console.log(this.state.leaveBalance[index].text+" "+days.toString())
        if(parseInt(this.state.leaveBalance[index].text)>=days)
        {
          this.setState({errorLeaveType:""})
          isTrue=true;
        }
        else
        {
          this.setState({errorLeaveType:"Requested days are greater than your Available day on "+this.state.leaveType})
        }
      }
    })
    return isTrue;
  }
  //submitting the form data
  public SubmitData() {
    //console.log(this.state);
    if (this.isValid()) {
      //console.log(this.leaveBalanceDaysCheck());
      var tempDays=this.getDayDifference(this.state.sDate, this.state.eDate)
      if(this.leaveBalanceDaysCheck(tempDays))
      {
        //console.log("valid form");
        let formInfo = {
          user_id: this.props.userid,
  
          type: this.state.leaveType,
  
          comment: this.state.reason,
  
          status: this.state.status,
  
          start_date: this.state.sDate,
  
          end_date: this.state.eDate,
  
          cc: this.state.emailCc,
  
          days: tempDays
        }
        //console.log(formInfo);
        fetch("https://contosofunctions.azurewebsites.net/api/postitem/", {
          method: 'POST',
          headers: {
            'Accept': 'Application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formInfo)
        }).then((result) => {
          result.json().then((resp) => {
            console.warn(resp)
          })
        })
        
        this.setState({submitSuccess:"Request Submitted Successfully. Check Request Status."})
      }
    }
  }


  public render(): React.ReactElement<IEmployeeProps> {

    // this.context.aadHttpClientFactory.getClient('https://tenant.onmicrosoft.com/aca97a6f-dc1b-4d93-b126-c7ea317eb49c')
    // .then((client: AadHttpClient): void =>{
    //   fetch("https://contosofunctions.azurewebsites.net/api/getitem/")
    //   .then((res) => res.json())
    //   .then((json) => {
    //     this.setState({ dataBaseExtracts: json });
    //   });
    // })

    fetch("https://contosofunctions.azurewebsites.net/api/getitem/")
      .then((res) => res.json())
      .then((json) => {
        this.setState({ dataBaseExtracts: json })
      });

    const ChangeLeaveType = (ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption) => {
      console.dir(option);
      this.setState({ leaveType: option.text},()=>{});
    }

    const changeStartDate = (e) => {
      this.setState({ sDate: e.target.value},()=>{
        var day=new Date(this.state.sDate).getUTCDay();
        console.log(day)
        if(day==6 || day==0){
          this.setState({errorStartDate:"Start Date can't be assigned to Weekends"});
        }
        else if(this.state.publicHolidays.indexOf(this.state.sDate)!=-1){
          this.setState({errorStartDate:"Start Date can't be assigned to public Holidays"});
        }
        else
        this.setState({errorStartDate:""});
      })
      if (this.state.eDate != "") {
        this.setState({ errorEndDate: "Start Date Changed. please update the End Date" })
      }
    }

    const changeEndDate = (e) => {
      this.setState({ eDate: e.target.value, errorEndDate: "" },()=>{
        var day=new Date(this.state.eDate).getUTCDay();
        if(day==6 || day==0){
          this.setState({errorEndDate:"End Date can't be assigned to Weekends"});
        }
        else if(this.state.publicHolidays.indexOf(this.state.eDate)!=-1){
          this.setState({errorEndDate:"End Date can't be assigned to public Holidays"});
        }
        else
        this.setState({errorEndDate:""});
      })
    }

    const changeReason = (e) => {
      this.setState({ reason: e.target.value }, () => {
        if (this.state.reason === "")
          this.setState({ errorReason: "Reason can not be empty" })
        else
          this.setState({ errorReason: "" })
      })
    }

    const changeEmailCc = e => {
      this.setState({ emailCc: e.target.value, errorEmail: "" }, () => {
        if (this.state.emailCc != "" && !regularExpression.test(this.state.emailCc))
          this.setState({ errorEmail: "Enter Email in proper format or Leave it Blank" })
      })
    }

    const getCurrentDate = () => {
      var today = new Date();
      var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
      return date.toString();
    }

    const checkUser = escape(this.props.userid);
    // const LeaveType = this.state.leaveSettings.map(item => <p>{item.text}</p>);
    // const printHolidayName = this.state.listTitle.map(item => <p>{item.text}</p>);
    // const printHolidayDate = this.state.listTitle.map(item => <p>{item.key.toString().substr(0, 10)}</p>);

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

    this.state.listTitle.map((item) => {
      // console.log(item)
      this.state.publicHolidays.push(item.key.toString().substr(0, 10));
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

    // const LeaveDays = this.state.leaveBalance.slice(0,this.state.leaveSettings.length+1).map((item) => <p>{item.text}</p>);

    return (
      <div className={styles.employee}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <span className={styles.title}>Welcome to Contosso Leave Management System!</span>
            </div>

          </div>

        </div>
        <div className={styles.container}>
          <Pivot aria-label="Basic Pivot Example" >
            {/* <PivotItem
              headerText="Public Holidays"
              headerButtonProps={{
                'data-order': '1',
                'data-title': 'My Files Title',
              }}
            >

              <div className={styles.grid}>
                <div className={styles.gridRow}>
                  <div className={styles.gridHeading1}>
                    <p>Occasion</p>
                  </div>
                  <div className={styles.gridHeading2}>
                    <p>Date</p>
                  </div>
                  <div className={styles.smallCol}>
                    {printHolidayName}
                  </div>
                  <div className={styles.largeCol}>
                    {printHolidayDate}
                  </div>
                </div>
              </div>

            </PivotItem> */}

            {/* <PivotItem

              headerText="Holidays"

              headerButtonProps={{
                'data-order': '1',
                'data-title': 'My Files Title',
              }}>

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
            </PivotItem> */}

            <PivotItem headerText="Create new">

              <div className={styles.title}>New application Form!</div>
              <div id="id_customForm" className={styles.formBg}>
                <div className={styles.grid}>
                  <div className={styles.gridRow}>

                    <div className={styles.smallCol}>
                      <Label>Type of leave <span className={styles.validation}>*</span></Label>
                    </div>
                    <div className={styles.largeCol}>
                      <ChoiceGroup defaultSelectedKey="B" options={this.state.leaveSettings} onChange={ChangeLeaveType} label="" required={true} />
                      <p className={styles.error}>{this.state.errorLeaveType}</p>
                    </div>


                    <div className={styles.smallCol}>
                      <Label>Start Date <span className={styles.validation}>*</span></Label>
                    </div>
                    <div className={styles.largeCol}>
                      <TextField min={format(getCurrentDate(), "YYYY-MM-DD")} id="sDate" onChange={changeStartDate} type="date" required={true} />
                      <p className={styles.error}>{this.state.errorStartDate}</p>
                    </div>

                    <div className={styles.smallCol}>
                      <Label>End Date <span className={styles.validation}>*</span></Label>
                    </div>
                    <div className={styles.largeCol}>
                      <TextField min={format(this.state.sDate, "YYYY-MM-DD")} type="date" required={true} onChange={changeEndDate} />
                      <p className={styles.error}>{this.state.errorEndDate}</p>
                    </div>


                    <div className={styles.smallCol}>
                      <Label>Reason <span className={styles.validation}>*</span></Label>
                    </div>
                    <div className={styles.largeCol}>
                      <TextField type="text" placeholder="Enter the reason for leave" onChange={changeReason} required={true} ></TextField>
                      <p className={styles.error}>{this.state.errorReason}</p>
                    </div>

                    <div className={styles.smallCol}>
                      <Label>CC <span className={styles.validation}>*</span></Label>
                    </div>
                    <div className={styles.largeCol}>
                      <TextField type="email" placeholder="Enter email" onChange={changeEmailCc} />
                      <p className={styles.error}>{this.state.errorEmail}</p>
                    </div>

                    <div className={styles.largeCol}>
                      <PrimaryButton text="Request Leave" className={styles.button} onClick={this.SubmitData} />
                    </div>

                    <div className={styles.largeCol}>
                      <p className={styles.success}>{this.state.submitSuccess}</p>
                    </div>

                  </div>
                </div>
              </div>
            </PivotItem>

            <PivotItem headerText="Request Status">
              <div className={styles.grid}>
                <div className={styles.gridRow}>
                  <div className={styles.smallColm}>
                    Start Date
                  </div>
                  <div className={styles.smallColm}>
                    End Date
                  </div>
                  <div className={styles.smallColm}>
                    Type
                  </div>
                  <div className={styles.smallColm}>
                    Comment
                  </div>
                  <div className={styles.smallColm}>
                    Days
                  </div>
                  <div className={styles.smallColm}>
                    Status
                  </div>

                  <div className={styles.smallColm}>
                    {startDateHistory}
                  </div>
                  <div className={styles.smallColm}>
                    {endDateHistory}
                  </div>
                  <div className={styles.smallColm}>
                    {typeHistory}
                  </div>
                  <div className={styles.smallColm}>
                    {commentHistory}
                  </div>
                  <div className={styles.smallColm}>
                    {daysHistory}
                  </div>
                  <div className={styles.smallColm}>
                    {statusHistory}
                  </div>
                </div>
              </div>

            </PivotItem>
          </Pivot>
        </div>
      </div>
    );



  }
}