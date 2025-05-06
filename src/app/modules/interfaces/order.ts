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
  thunder!: string | null;
  time_delivery!: string;
  status!: {
    id: number;
    name: string;
  };
  statusRequests!: Array<{
    id: number;
    m3: number;
    shift: string;
    dispatchCode: string;
    timeDelivery: string;
    dispatchTime: string;
    modifiedBy?: number;
    status: {
      id: number;
      name: string;
    };
    additionalInformation?: {
      aprobado: {
        user?: string;
        confirmer?: string;
        observation?: string;
        confirmation_time?: string | Date;
        approveTime?: string | Date; // <-- faltaba esto
      };
      procesado?: {
        seal?: string;
        patent?: string;
        conduits?: string;
        conductorRut?: string;
        processedTime?: string | Date;
        usuarioProcess?: string;
      };
    };
  }>;
}
