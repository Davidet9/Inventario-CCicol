export type ItemCategory = 'biomedicos' | 'tecnologicos' | 'mobiliario' | 'papeleria' | 'bajas';

export type ItemStatus = 'Bueno' | 'Regular' | 'Reparación' | 'Baja' | 'Nuevo';

export interface LocationMovement {
  id: string;
  date: string;
  fromLocation: string;
  fromArea: string;
  toLocation: string;
  toArea: string;
  responsible: string;
  reason: string;
  user: string;
}

export interface InventoryItem {
  id: string;
  code: string; // e.g., 001-IMG-BM
  name: string; // Nombre del equipo / artículo / tipo
  category: ItemCategory;
  categoryLabel?: string;
  type?: string; // Escritorio, Silla, Camilla, Computador, Ecografo, etc.
  property: string; // IPS, Edificio Atenas, Alquilada, Tecnocopias, etc.
  quantity: number;
  brand?: string; // Marca
  model?: string; // Modelo
  serial?: string; // Serial / Placa
  material?: string; // Madera, Metalico, Plastico, Vidrio, etc.
  invima?: string; // Registro Sanitario / INVIMA
  accessories?: string; // Accesorios
  location: string; // e.g. "101", "205", "OFICINA ADMIN LOCAL 1", "RECEPCIÓN"
  area: string; // e.g. "CONSULTORIO 101-GINECO-IMÁGENES"
  service?: string; // e.g. "Gineco-Imágenes", "Pediatría", "Gerencia"
  responsible: string; // Responsable
  status: ItemStatus;
  purchaseDate?: string; // DD/MM/AAAA
  purchaseValue?: number; // Valor numérico en COP
  purchaseValueFormatted?: string;
  supplier?: string; // Proveedor / Alkosto / Makiimport / etc.
  usefulLifeYears?: number; // Vida útil
  depreciationMethod?: string; // Línea recta, etc.
  warranty?: string; // Sí / No
  maintenanceFrequency?: string; // Semestral, Anual, etc.
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  maintenanceCompany?: string; // LAS Electromedicina, Germar, Ing. Javier, etc.
  observations?: string; // Observaciones
  lastReviewNotes?: string; // Observación de última revisión
  decommissionReason?: string; // Motivo de la baja
  decommissionResponsible?: string; // Responsable mantenimiento en baja
  isNew?: boolean; // Adquirido recientemente (2024-2026)
  isPendingAreaConfirmation?: boolean; // SD - Ubicación por confirmar
  movementsHistory?: LocationMovement[];
  createdAt: string;
  updatedAt: string;
}

export interface LocationAreaDef {
  code: string;
  name: string;
  floor?: string;
  description: string;
  isProvisional?: boolean;
}

export type ViewMode = 'table' | 'cards' | 'locations' | 'alerts';

export interface FilterState {
  search: string;
  category: ItemCategory | 'all';
  locationArea: string; // specific area code or 'all'
  status: ItemStatus | 'all';
  property: string; // 'all' or specific
  onlyAlerts: boolean;
  onlyNew: boolean;
  onlyPendingSD: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}
