export interface MantenimientoFiltroDTO {
    id_mant: number,
    id_prod?: number,
    id_tipo: number,
    nombre: string,
    fecha: string,
    referencia: string,
    cantidad: number, // Cambiar de string a number
    estado: number,
    categoria?:string
    tipo?:number,
}