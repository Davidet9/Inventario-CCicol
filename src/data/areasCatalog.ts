import { LocationAreaDef, ItemCategory } from '../types/inventory';

export const OFFICIAL_AREAS: LocationAreaDef[] = [
  { code: 'GE', name: 'Gerencia y Contabilidad', floor: 'Piso 1 - Oficina 103', description: 'Dirección general, gerencia administrativa y contabilidad' },
  { code: 'ADM1', name: 'Oficina Admin Local 1', floor: 'Piso 1 - Local 1', description: 'Administración, escáner, agendas y radicación' },
  { code: 'IMG', name: 'Consultorio 101 - Gineco-Imágenes', floor: 'Piso 1', description: 'Ecografía ginecológica y consulta especializada' },
  { code: 'CE102', name: 'Consultorio 102 - Eco TE', floor: 'Piso 1', description: 'Ecocardiograma transesofágico y signos vitales' },
  { code: 'CE104', name: 'Consultorio 104 - Pediatría', floor: 'Piso 1', description: 'Atención pediátrica, ecocardiografía pediátrica y pesabebés' },
  { code: 'CE205', name: 'Consultorio 205 - PDE', floor: 'Piso 2', description: 'Pruebas de esfuerzo, monitoreo y reanimación' },
  { code: 'CE206', name: 'Consultorio 206 - Ecos TT', floor: 'Piso 2', description: 'Ecocardiograma transtorácico' },
  { code: 'CE207', name: 'Consultorio 207 - Holter / MAPAs / Mesa', floor: 'Piso 2', description: 'Monitoreo de presión arterial y arritmias, mesa basculante' },
  { code: 'CE208', name: 'Consultorio 208 - Consulta', floor: 'Piso 2', description: 'Consulta médica especializada y toma de EKG' },
  { code: 'CE305', name: 'Consultorio 305 - EKG', floor: 'Piso 3', description: 'Electrocardiogramas y procedimientos ambulatorios' },
  { code: 'ALM', name: 'Almacén - Bodega 306', floor: 'Piso 3', description: 'Bodega de almacenamiento de insumos y equipos' },
  { code: 'ARC', name: 'Archivo', floor: 'Piso 1/2', description: 'Custodia de historias clínicas y archivo general' },
  { code: 'REP', name: 'Recepción Edificio', floor: 'Piso 1 - Entrada', description: 'Atención al usuario, citas y control de cámaras' },
  { code: 'SE1', name: 'Sala de Espera y Pasillos - Piso 1', floor: 'Piso 1', description: 'Área común de pacientes y pasillos' },
  { code: 'SE2', name: 'Sala de Espera - Piso 2', floor: 'Piso 2', description: 'Área común y espera de pacientes piso 2' },
  { code: 'SE3', name: 'Sala de Espera - Piso 3', floor: 'Piso 3', description: 'Área común de pacientes piso 3' },
  { code: 'PARQ', name: 'Parqueadero / Sótano', floor: 'Sótano', description: 'Estacionamiento, carro de aseo y sillas de ruedas' },
  { code: 'CON', name: 'Contratación', floor: 'Administrativo', description: 'Oficina de contratación médica y convenios' },
  { code: 'CP', name: 'Carro de Paro', floor: 'Móvil Asistencial', description: 'Equipos críticos de respuesta inmediata y resucitación' },
  { code: 'ASIS', name: 'Asistencial General', floor: 'Clínica', description: 'Equipos asistenciales sin consultorio exclusivo asignado' },
  { code: 'BOG', name: 'Bogotá / Sede BTA', floor: 'Sede Externa', description: 'Equipos en sede Bogotá o personal en desplazamiento' },
  { code: 'SD', name: 'Ubicación por Confirmar (Provisional)', floor: 'Pendiente', description: 'Activos en proceso de validación física o sin área definitiva', isProvisional: true },
];

export const CATEGORY_DEFINITIONS: Record<ItemCategory, { name: string; prefix: string; description: string; color: string; badgeColor: string }> = {
  biomedicos: {
    name: 'Equipos Biomédicos',
    prefix: 'BM',
    description: 'Equipos clínicos, transductores, ecógrafos, monitores y dispositivos médicos',
    color: 'emerald',
    badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  },
  tecnologicos: {
    name: 'Equipos Tecnológicos',
    prefix: 'ET',
    description: 'Computadores todo en uno, torres, impresoras, UPS, escáneres y periféricos',
    color: 'indigo',
    badgeColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
  },
  mobiliario: {
    name: 'Mobiliario',
    prefix: 'MOB',
    description: 'Camillas, escritorios, sillas ejecutivas, mesas, extintores y canecas',
    color: 'amber',
    badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
  },
  papeleria: {
    name: 'Papelería y Útiles',
    prefix: 'PAP',
    description: 'Cosedoras, perforadoras, sellos, calculadoras, huelleros y consumibles de oficina',
    color: 'slate',
    badgeColor: 'text-slate-700 bg-slate-100 border-slate-200',
  },
  bajas: {
    name: 'Equipos Dados de Baja',
    prefix: 'BAJA',
    description: 'Activos desincorporados del servicio activo por daño, obsolescencia o desgaste',
    color: 'rose',
    badgeColor: 'text-rose-700 bg-rose-50 border-rose-200',
  },
};

/**
 * Generates an asset code in the format: NNN-AREA-TYPE (e.g., 001-IMG-BM)
 */
export function generateSuggestedCode(
  areaCode: string,
  category: ItemCategory,
  existingCodes: string[]
): string {
  const typePrefix = CATEGORY_DEFINITIONS[category]?.prefix || 'ACT';
  const prefixPattern = new RegExp(`^(\\d{3})-${areaCode}-${typePrefix}$`);

  let maxNum = 0;
  for (const code of existingCodes) {
    const match = code.match(prefixPattern);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }

  const nextNum = (maxNum + 1).toString().padStart(3, '0');
  return `${nextNum}-${areaCode}-${typePrefix}`;
}
