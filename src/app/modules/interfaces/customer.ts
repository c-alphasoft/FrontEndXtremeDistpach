import { Product } from './product';

export class Customer {
  id!: string;
  customer!: string;
  applicant!: string;
  concreteCoordinator!: string;
  radialFrequency!: string;
  deliveryPoint!: string;
  finalDestination!: string | null;
  products!: Product[];
}
