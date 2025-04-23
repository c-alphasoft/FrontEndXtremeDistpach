import { Customer } from './customer';
import { Roles } from './roles';

export class EmailCustomer {
  id!: number;
  name!: string;
  lastname!: string;
  email!: string;
  username!: string;
  roles!: Roles[];
  customers!: Customer[];
}
