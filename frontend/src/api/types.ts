import { AccessLevel } from '../utils';

export interface Company {
  companyID: number;
  companyName: string;
}

export interface Person {
  uuid: string;
  username: string;
  fName: string;
  lName: string;
  email: string;
  title: string;
  companies: Array<Company>;
  accessLevelID: AccessLevel;
  signature: string | null;
}
