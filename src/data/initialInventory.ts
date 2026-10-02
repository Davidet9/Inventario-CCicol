import { InventoryItem } from '../types/inventory';
import { SEED_BIOMEDICOS } from './seedBiomedicos';
import { SEED_TECNOLOGICOS } from './seedTecnologicos';
import { SEED_MOBILIARIO } from './seedMobiliario';
import { SEED_PAPELERIA } from './seedPapeleria';
import { SEED_BAJAS } from './seedBajas';

export const INITIAL_INVENTORY: InventoryItem[] = [
  ...SEED_BIOMEDICOS,
  ...SEED_TECNOLOGICOS,
  ...SEED_MOBILIARIO,
  ...SEED_PAPELERIA,
  ...SEED_BAJAS,
];
