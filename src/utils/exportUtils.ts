import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { InventoryItem, ItemCategory } from '../types/inventory';
import { CATEGORY_DEFINITIONS } from '../data/areasCatalog';

export function exportToExcel(items: InventoryItem[], filenamePrefix = 'Inventario_Cicol_IPS'): void {
  // Format items into clean spreadsheet rows
  const rows = items.map((item, idx) => ({
    '#': idx + 1,
    'Código Activo': item.code,
    'Categoría': CATEGORY_DEFINITIONS[item.category]?.name || item.category,
    'Nombre / Tipo': item.name,
    'Cantidad': item.quantity,
    'Marca': item.brand || 'N/A',
    'Modelo': item.model || 'N/A',
    'Serial / Placa': item.serial || 'N/A',
    'Propiedad': item.property || 'IPS',
    'Ubicación': item.location,
    'Área Asignada': item.area,
    'Servicio': item.service || 'N/A',
    'Responsable': item.responsible || 'N/A',
    'Estado': item.status,
    'Fecha Compra': item.purchaseDate || 'N/A',
    'Valor Compra (COP)': item.purchaseValue || 0,
    'Proveedor': item.supplier || 'N/A',
    'Vida Útil (Años)': item.usefulLifeYears || '',
    'Método Depreciación': item.depreciationMethod || '',
    'Registro Sanitario / INVIMA': item.invima || 'N/A',
    'Accesorios': item.accessories || '',
    'Motivo de Baja': item.decommissionReason || '',
    'Responsable Mant. Baja': item.decommissionResponsible || '',
    'Observaciones': item.observations || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventario');

  // Auto-size columns
  const colWidths = [
    { wch: 4 },  // #
    { wch: 16 }, // Código
    { wch: 22 }, // Categoría
    { wch: 32 }, // Nombre
    { wch: 10 }, // Cantidad
    { wch: 16 }, // Marca
    { wch: 18 }, // Modelo
    { wch: 20 }, // Serial
    { wch: 15 }, // Propiedad
    { wch: 18 }, // Ubicación
    { wch: 35 }, // Área
    { wch: 20 }, // Servicio
    { wch: 25 }, // Responsable
    { wch: 12 }, // Estado
    { wch: 14 }, // Fecha Compra
    { wch: 18 }, // Valor
    { wch: 20 }, // Proveedor
    { wch: 12 }, // Vida Útil
    { wch: 16 }, // Método
    { wch: 20 }, // INVIMA
    { wch: 30 }, // Accesorios
    { wch: 30 }, // Motivo Baja
    { wch: 24 }, // Responsable Baja
    { wch: 40 }, // Observaciones
  ];
  worksheet['!cols'] = colWidths;

  const dateStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `${filenamePrefix}_${dateStr}.xlsx`);
}

export function exportToPDF(
  items: InventoryItem[],
  reportTitle = 'Reporte Oficial de Inventario de Activos',
  category?: ItemCategory | 'all'
): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const categoryName = category && category !== 'all' ? CATEGORY_DEFINITIONS[category]?.name : 'Inventario General Multicategoría';
  const totalValue = items.reduce((acc, curr) => acc + (curr.purchaseValue || 0), 0);

  // Header banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 297, 24, 'F');

  // Title text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('CICOL IPS  ·  Escucha tu corazón', 14, 11);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text(`${reportTitle} — ${categoryName}`, 14, 18);

  const dateStr = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.text(`Generado: ${dateStr}`, 240, 18);

  // Summary indicators box
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  const summaryY = 30;
  doc.text(`Total Activos Registrados: ${items.length}`, 14, summaryY);
  doc.text(`Valorización Total: $${totalValue.toLocaleString('es-CO')} COP`, 90, summaryY);
  const goodCount = items.filter((i) => i.status === 'Bueno' || i.status === 'Nuevo').length;
  doc.text(`Estado Operativo (Bueno/Nuevo): ${goodCount} / ${items.length}`, 200, summaryY);

  // Prepare table data
  const tableHeaders = [
    'Código',
    'Categoría',
    'Nombre / Tipo',
    'Marca / Modelo',
    'Serial',
    'Área / Ubicación',
    'Responsable',
    'Estado',
    'Valor (COP)',
  ];

  const tableData = items.map((item) => [
    item.code,
    CATEGORY_DEFINITIONS[item.category]?.name.replace('Equipos ', '').replace(' y Útiles', '') || item.category,
    item.name,
    [item.brand, item.model].filter(Boolean).join(' - ') || 'N/A',
    item.serial || 'N/A',
    item.area,
    item.responsible || 'N/A',
    item.status,
    item.purchaseValue ? `$${item.purchaseValue.toLocaleString('es-CO')}` : '-',
  ]);

  autoTable(doc, {
    head: [tableHeaders],
    body: tableData,
    startY: 34,
    theme: 'grid',
    styles: {
      fontSize: 7.5,
      cellPadding: 2,
      lineColor: [226, 232, 240], // slate-200
      lineWidth: 0.2,
      textColor: [30, 41, 59],
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [30, 41, 59], // slate-800
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // slate-50
    },
    columnStyles: {
      0: { cellWidth: 26, fontStyle: 'bold' },
      1: { cellWidth: 24 },
      2: { cellWidth: 50 },
      3: { cellWidth: 35 },
      4: { cellWidth: 28 },
      5: { cellWidth: 46 },
      6: { cellWidth: 32 },
      7: { cellWidth: 18 },
      8: { cellWidth: 24, halign: 'right' },
    },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      // Footer page numbers
      const pageCount = (doc as any).internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text(
        `Página ${data.pageNumber} de ${pageCount}  ·  Sistema de Gestión de Inventario CICOL IPS`,
        14,
        202
      );
    },
  });

  const fileDate = new Date().toISOString().split('T')[0];
  doc.save(`${reportTitle.replace(/\s+/g, '_')}_${fileDate}.pdf`);
}
