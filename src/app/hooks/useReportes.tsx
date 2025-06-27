import React from 'react'
import { MovimientosDTO } from '../models/MovimientosDTO'
import * as XLSX from 'xlsx';


const useReportes = () => {

    const ExportReport = (moviemientos: MovimientosDTO[], fileName: string = 'reporte_movimientos') => {
        try {
            const woorkbook = XLSX.utils.book_new();
            const woorksheet = moviemientos.map(item => ({
                'FECHA': item.fecha,
                'NOMBRE': item.nombre,
                'INGRESO': item.ingresos,
                'SALIDA': item.salidas,
                'STOCK': item.stock,
                'REFERENCIA': item.referencia,
                'USUARIO': item.usuario_master
            }));

            const woorksheets = XLSX.utils.json_to_sheet(woorksheet);
            const columnWidths = [
                { wch: 12 },
                { wch: 20 },
                { wch: 10 },
                { wch: 10 },
                { wch: 10 },
                { wch: 15 },
            ];

            woorksheets['!cols'] = columnWidths;
            XLSX.utils.book_append_sheet(woorkbook, woorksheet, "Movimientos");
            XLSX.writeFile(woorkbook, `${fileName}.xlsx`);

            return { success: true, message: "Archivo exportado exitosamente" };
        } catch (error) {
            console.error('ERROR AL EXPORTAR EL EXCEL: ' + error);
            return { success: false, message: 'Error al exportar el archivo' };
        }
    }

    const ExportTableToExcel = (tableId: string, fileName: string = 'reporte_movimientos') => {
        try {
            console.log(tableId)
            const table = document.getElementById(tableId);
            if (!table) {
                throw new Error("Tabla no encontrada");
            }
            const workbook = XLSX.utils.table_to_book(table, { sheet: 'Movimientos' });
            XLSX.writeFile(workbook, `${fileName}.xlsx`);

            return { success: true, message: 'Archivo exportado exitosamente' };
        } catch (error) {
            console.error('Error al exportar:', error);
            return { success: false, message: 'Error al exportar el archivo' };
        }
    }
    return {
        ExportReport,
        ExportTableToExcel
    }
}

export default useReportes