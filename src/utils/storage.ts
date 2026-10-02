import { InventoryItem } from '../types/inventory';
import { INITIAL_INVENTORY } from '../data/initialInventory';

const STORAGE_KEY = 'cicol_inventory_items_v2';

export function loadInventory(): InventoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveInventory(INITIAL_INVENTORY);
      return INITIAL_INVENTORY;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    saveInventory(INITIAL_INVENTORY);
    return INITIAL_INVENTORY;
  } catch (err) {
    console.error('Error loading inventory from localStorage:', err);
    return INITIAL_INVENTORY;
  }
}

export function saveInventory(items: InventoryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Error saving inventory to localStorage:', err);
  }
}

export function resetInventoryToSeed(): InventoryItem[] {
  saveInventory(INITIAL_INVENTORY);
  return INITIAL_INVENTORY;
}

export function exportBackupJSON(items: InventoryItem[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(items, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `cicol_inventario_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
