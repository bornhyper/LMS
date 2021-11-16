import * as React from 'react';
//import ReactTable from "react-table";  
import styles from './HelloWorld.module.scss';
import { IHelloWorldProps } from './IHelloWorldProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IHelloWorldState } from './IHelloWorldState';
import {SPOperations} from "../Services/SPServices";
import { TextField} from '@fluentui/react/lib/TextField';
import { Dropdown, IDropdownOption, Label, Pivot, PivotItem, PrimaryButton,DefaultButton, List, IChoiceGroupOption, ChoiceGroup} from "office-ui-fabric-react";

import * as jquery from "jquery";

export default class HelloWorld extends React.Component<IHelloWorldProps, IHelloWorldState, {}> {
  
  public _spOps: SPOperations;
  public selectedListTitle:string;
  public selectedLeaveSettings: string;

  constructor(props: IHelloWorldProps){
    super(props);
    this._spOps= new SPOperations();
    this.state= {listTitle:[], leaveSettings:[] ,status: ""};
     
  }
public getListTitle=(event:any, data:any)=>{
  this.selectedListTitle=data.text;
};
public getLeaveSettings=(event:any, data:any)=>{
  this.selectedLeaveSettings=data.text;
};
public componentDidMount(){
  this._spOps.GetAllHolidayList(this.props.context).then((result:IDropdownOption[])=>{
    this.setState({listTitle:result})

  this._spOps.GetAllLeaveSettings(this.props.context).then((result:IChoiceGroupOption[])=>{
    this.setState({leaveSettings: result})
  })
  })
}

  public render(): React.ReactElement<IHelloWorldProps> {
    let option: IDropdownOption[]=[];

    const printList= this.state.listTitle.map( item=>
        <p>{item.text}&emsp;{item.key}</p>)

    return (
      <div className={ styles.helloWorld }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to Contosso Leave Management System!</span>     
            </div>
            
            </div>

          </div>
          <div className={styles.container}>
      <Pivot aria-label="Basic Pivot Example" >
        <PivotItem
          headerText="Public Holidays"
          headerButtonProps={{
            'data-order': 1,
            'data-title': 'My Files Title',
          }}
        >

          <Label className={styles.label}>Event</Label><Label className={styles.label}>Date</Label>
    <div>{printList}</div>

        <Dropdown           
           placeholder="Select" className={styles.dropdown}
           options={this.state.listTitle}
           onChange={this.getListTitle}>
          </Dropdown>

          <TextField label="Date" type="date"/>

          <TextField label="New Event Name" />

          <PrimaryButton text="Create List Item" className={styles.button}
           onClick={()=>
            this._spOps
            .CreateHolidayList(this.props.context,this.selectedListTitle)
            .then((result:string)=>{
             this.setState({ status: result});
           })
           }>             
           </PrimaryButton>
           

           <PrimaryButton text="Update List Item" className={styles.button}
           >             
           </PrimaryButton>

           <PrimaryButton text="Delete List Item" className={styles.button}
           onClick={()=>this._spOps.DeleteItemHolidayList(
             this.props.context,
             this.selectedListTitle)}
           >             
           </PrimaryButton>  
           <div>{this.state.status}</div>     
        </PivotItem>

        


        <PivotItem headerText="Leave Settings">
          <Label className={styles.label}>Pivot #2</Label>
          <ChoiceGroup defaultSelectedKey="B" options={this.state.leaveSettings} onChange={_onChange} label="Pick one" required={true} />
          
        </PivotItem> 
        
    </Pivot>
        </div>
      </div>
    );
    
function _onChange(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption): void {
  console.dir(option);
}
  }
  
}
