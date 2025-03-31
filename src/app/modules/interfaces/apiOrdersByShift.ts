export interface Status {
    id: number;
    name: string;
  }
  
  export interface StatusRequest {
    id: number;
    dispatchTime: string;
    timeDelivery: string;
    m3: number;
    status: Status;
    shift: string;
  }
  
  export interface OrderResponse {
    idorders: number;
    codOrder: string;
    client: string;
    clientEmail: string;
    applicant: string;
    product: string;
    thunder: string;
    cod_product: string;
    application_date: string;
    coordinator_concrete: string;
    frequency_radial: string;
    point_delivery: string;
    final_destination: string;
    observation: string;
    time_delivery: string;
    m3: number;
    status: Status;
    dispatch_frequency: number;
    statusRequests: StatusRequest[];
  }
  
  export interface apiOrdersByShift {
    'Turno A': OrderResponse[];
    'Turno B': OrderResponse[];
  }