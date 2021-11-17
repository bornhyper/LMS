import * as React from 'react';
import styles from './PublicHolidays.module.scss';
import { IPublicHolidaysProps } from './IPublicHolidaysProps';
import { IPublicHolidaysState } from './IPublicHolidaysState';
import Employee from '../../employee/components/Employee';
import { escape } from '@microsoft/sp-lodash-subset';

export default class PublicHolidays extends React.Component<IPublicHolidaysProps,IPublicHolidaysState, {}> {

  constructor(props: IPublicHolidaysProps)
  {
    super(props);
    this.state={Days:[""],Dates:[""]}
  }

  public componentDidMount() {}

  public render(): React.ReactElement<IPublicHolidaysProps> {
   // console.log(Employee.HolidaysNameExport,'2');
   // const printHolidayName = Employee.HolidaysNameExport.map(item => <p>{item.text}</p>);
    //const printHolidayDate = Employee.HolidaysNameExport.map(item => <p>{item.key.toString().substr(0, 10)}</p>);
    return (
      <div className={ styles.publicHolidays }>
        <div className={styles.grid}>
                <div className={styles.gridRow}>
                  <div className={styles.gridHeading1}>
                    <p>Occasion</p>
                  </div>
                  <div className={styles.gridHeading2}>
                    <p>Date</p>
                  </div>
                  <div className={styles.smallCol}>
                    {/* {printHolidayName} */}
                  </div>
                  <div className={styles.largeCol}>
                    {/* {printHolidayDate} */}
                  </div>
                </div>
              </div>
      </div>
    );
  }
}
