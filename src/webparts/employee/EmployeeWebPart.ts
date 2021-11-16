import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'EmployeeWebPartStrings';
import Employee from './components/Employee';
import { IEmployeeProps } from './components/IEmployeeProps';

export interface IEmployeeWebPartProps {
  description: string;
}

export default class EmployeeWebPart extends BaseClientSideWebPart<IEmployeeWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IEmployeeProps> = React.createElement(
      Employee,
      {
        description: this.properties.description,
        context: this.context,
        userid: this.context.pageContext.user.email
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
