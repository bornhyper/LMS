declare interface IEmployeeWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
}

declare module 'EmployeeWebPartStrings' {
  const strings: IEmployeeWebPartStrings;
  export = strings;
}
