import React from 'react';

// Aseguramos que `accessor` es una clave válida de T
export interface Column<T> {
  header: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
}
