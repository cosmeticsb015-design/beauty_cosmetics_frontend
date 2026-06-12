export interface CheckoutFormData {
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  instrucciones: string;
}

export type DeliveryMethod = "domicilio" | "sucursal";
