export type MenuItem =
  | {
      type: 'link';
      label: string;
      path: string;
      claim: string;
    }
  | {
      type: 'module';
      title: string;
      claim: string;
      children: {
        label: string;
        path: string;
        claim: string;
      }[];
    };


export type ServiceMasterItems = 
{
  title: string;
  description: string;
  path: string;
}