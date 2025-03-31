export class Order {
  applicant!: string;
  application_date!: string;
  client!: string;
  clientEmail!: string;
  codOrder!: string;
  cod_product!: string;
  coordinator_concrete!: string;
  dispatch_frequency!: number;
  final_destination!: string;
  frequency_radial!: string;
  idorders!: number;
  m3!: number;
  observation!: string;
  point_delivery!: string;
  product!: string;
  thunder!: string;
  time_delivery!: string;
  status!: {
    id: number;
    name: string;
  };
  statusRequests!: Array<{
    id: number;
    m3: number;
    shift: string;
    timeDelivery: string;
    dispatchTime: string;
    status: {
      id: number;
      name: string;
    };
  }>;


}
