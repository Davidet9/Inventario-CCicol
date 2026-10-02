import React, { useState, useEffect, useMemo } from 'react';
import { InventoryItem, ItemCategory, FilterState, ViewMode, LocationMovement } from './types/inventory';
import { loadInventory, saveInventory, resetInventoryToSeed } from './utils/storage';
import { exportToExcel, exportToPDF } from './utils/exportUtils';
import { CATEGORY_DEFINITIONS } from './data/areasCatalog';

// Components
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { FiltersBar } from './components/FiltersBar';
import { InventoryTableView } from './components/InventoryTableView';
import { InventoryCardsView } from './components/InventoryCardsView';
import { LocationsBoardView } from './components/LocationsBoardView';
import { TransferLocationModal } from './components/TransferLocationModal';
import { ItemModal } from './components/ItemModal';
import { DisposeModal } from './components/DisposeModal';
import { CodificationCatalogModal } from './components/CodificationCatalogModal';

export default function App() {
  const [items, setItems] = useState<InventoryItem[]>(() => loadInventory());
  const [currentTab, setCurrentTab] = useState<'dashboard' | ItemCategory>('dashboard');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  // Modals state
  const [isItemModalOpen, setIsItemModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [defaultCategoryForNew, setDefaultCategoryForNew] = useState<ItemCategory>('biomedicos');
  const [defaultAreaCodeForNew, setDefaultAreaCodeForNew] = useState<string | undefined>(undefined);

  const [isTransferModalOpen, setIsTransferModalOpen] = useState<boolean>(false);
  const [itemsToTransfer, setItemsToTransfer] = useState<InventoryItem[]>([]);

  const [isDisposeModalOpen, setIsDisposeModalOpen] = useState<boolean>(false);
  const [itemToDispose, setItemToDispose] = useState<InventoryItem | null>(null);

  const [isCodificationModalOpen, setIsCodificationModalOpen] = useState<boolean>(false);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'all',
    locationArea: 'all',
    status: 'all',
    property: 'all',
    onlyAlerts: false,
    onlyNew: false,
    onlyPendingSD: false,
    sortBy: 'code',
    sortOrder: 'asc',
  });

  // Sync with LocalStorage on state changes
  useEffect(() => {
    saveInventory(items);
  }, [items]);

  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification((prev) => (prev === message ? null : prev));
    }, 4000);
  };

  // Filtered items computation
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Tab Category Constraint
      if (currentTab !== 'dashboard') {
        if (item.category !== currentTab) return false;
      } else if (filters.category !== 'all') {
        if (item.category !== filters.category) return false;
      }

      // Location / Area filter
      if (filters.locationArea !== 'all') {
        const needle = filters.locationArea.toLowerCase();
        const matchesArea =
          item.area.toLowerCase().includes(needle) ||
          item.location.toLowerCase() === needle ||
          item.code.toLowerCase().includes(`-${needle}-`);
        if (!matchesArea) return false;
      }

      // Status filter
      if (filters.status !== 'all') {
        if (item.status !== filters.status) return false;
      }

      // Property filter
      if (filters.property !== 'all') {
        if (!item.property.toLowerCase().includes(filters.property.toLowerCase())) return false;
      }

      // Quick Toggles
      if (filters.onlyAlerts) {
        const isAlert =
          item.status === 'Reparación' ||
          item.status === 'Regular' ||
          (item.observations && /dañad|error|falla|fuga|interferencia|desgastad|oxidado/i.test(item.observations));
        if (!isAlert) return false;
      }

      if (filters.onlyNew) {
        if (!item.isNew && item.status !== 'Nuevo') return false;
      }

      if (filters.onlyPendingSD) {
        if (!item.isPendingAreaConfirmation && !item.code.includes('SD') && item.location !== 'SD') return false;
      }

      // Search Query
      if (filters.search.trim() !== '') {
        const query = filters.search.toLowerCase();
        const matchesQuery =
          item.code.toLowerCase().includes(query) ||
          item.name.toLowerCase().includes(query) ||
          (item.brand && item.brand.toLowerCase().includes(query)) ||
          (item.model && item.model.toLowerCase().includes(query)) ||
          (item.serial && item.serial.toLowerCase().includes(query)) ||
          (item.responsible && item.responsible.toLowerCase().includes(query)) ||
          item.area.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query) ||
          (item.observations && item.observations.toLowerCase().includes(query));
        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [items, currentTab, filters]);

  // Handlers for Item Actions
  const handleAddNewItem = (categoryHint?: ItemCategory, areaHint?: string) => {
    setEditingItem(null);
    setDefaultCategoryForNew(
      categoryHint || (currentTab !== 'dashboard' ? currentTab : 'biomedicos')
    );
    setDefaultAreaCodeForNew(areaHint);
    setIsItemModalOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const handleSaveItem = (savedData: Partial<InventoryItem>) => {
    if (editingItem) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id ? ({ ...item, ...savedData } as InventoryItem) : item
        )
      );
      showToast(`Activo ${savedData.code} actualizado exitosamente.`);
    } else {
      const newItem: InventoryItem = {
        id: `item-${Date.now()}`,
        code: savedData.code || '001-ACT-BM',
        name: savedData.name || 'Nuevo Activo',
        category: savedData.category || 'biomedicos',
        property: savedData.property || 'IPS',
        quantity: savedData.quantity || 1,
        brand: savedData.brand || 'N/A',
        model: savedData.model || '',
        serial: savedData.serial || '',
        material: savedData.material || '',
        invima: savedData.invima || '',
        accessories: savedData.accessories || '',
        location: savedData.location || '101',
        area: savedData.area || 'CONSULTORIO 101',
        responsible: savedData.responsible || 'Personal Asignado',
        status: savedData.status || 'Bueno',
        purchaseDate: savedData.purchaseDate || '',
        purchaseValue: savedData.purchaseValue,
        supplier: savedData.supplier || '',
        usefulLifeYears: savedData.usefulLifeYears || 5,
        depreciationMethod: savedData.depreciationMethod || 'Línea recta',
        observations: savedData.observations || '',
        isNew: savedData.isNew || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        movementsHistory: [],
      };
      setItems((prev) => [newItem, ...prev]);
      showToast(`Activo ${newItem.code} incorporado al inventario.`);
    }
  };

  const handleDeleteItem = (id: string) => {
    const itemToDelete = items.find((i) => i.id === id);
    if (!itemToDelete) return;
    if (window.confirm(`¿Confirma eliminar definitivamente el activo ${itemToDelete.code} - ${itemToDelete.name}?`)) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      setSelectedItemIds((prev) => prev.filter((itemId) => itemId !== id));
      showToast(`Activo ${itemToDelete.code} eliminado.`);
    }
  };

  // Reubicación / Transferencia Rápida
  const handleOpenTransferSingle = (item?: InventoryItem) => {
    if (item) {
      setItemsToTransfer([item]);
    } else if (selectedItemIds.length > 0) {
      const selected = items.filter((i) => selectedItemIds.includes(i.id));
      setItemsToTransfer(selected);
    } else if (filteredItems.length > 0) {
      setItemsToTransfer([filteredItems[0]]);
    }
    setIsTransferModalOpen(true);
  };

  const handleOpenBulkTransfer = () => {
    const selected = items.filter((i) => selectedItemIds.includes(i.id));
    if (selected.length > 0) {
      setItemsToTransfer(selected);
      setIsTransferModalOpen(true);
    }
  };

  const handleConfirmTransfer = (
    itemIds: string[],
    newAreaCode: string,
    newAreaName: string,
    newLocationName: string,
    newResponsible: string,
    reason: string,
    updateCode: boolean
  ) => {
    const dateStr = new Date().toLocaleDateString('es-CO');

    setItems((prev) =>
      prev.map((item) => {
        if (!itemIds.includes(item.id)) return item;

        const movement: LocationMovement = {
          id: `mov-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          date: dateStr,
          fromLocation: item.location,
          fromArea: item.area,
          toLocation: newLocationName,
          toArea: newAreaName,
          responsible: newResponsible || item.responsible,
          reason,
          user: 'Coordinador Inventario',
        };

        let newCode = item.code;
        if (updateCode) {
          // Replace area token in code: e.g. 001-IMG-BM -> 001-CE205-BM
          const parts = item.code.split('-');
          if (parts.length === 3) {
            newCode = `${parts[0]}-${newAreaCode}-${parts[2]}`;
          }
        }

        return {
          ...item,
          code: newCode,
          location: newLocationName,
          area: newAreaName,
          responsible: newResponsible ? newResponsible : item.responsible,
          isPendingAreaConfirmation: false,
          movementsHistory: [movement, ...(item.movementsHistory || [])],
          updatedAt: new Date().toISOString(),
        };
      })
    );

    setSelectedItemIds([]);
    showToast(`${itemIds.length} activo(s) reubicado(s) exitosamente a ${newAreaName}.`);
  };

  // Dar de Baja
  const handleOpenDispose = (item: InventoryItem) => {
    setItemToDispose(item);
    setIsDisposeModalOpen(true);
  };

  const handleConfirmDispose = (
    itemId: string,
    reason: string,
    technician: string,
    date: string
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        return {
          ...item,
          category: 'bajas',
          status: 'Baja',
          decommissionReason: reason,
          decommissionResponsible: technician,
          observations: `Dado de baja el ${date}: ${reason}. Técnico: ${technician}`,
          updatedAt: new Date().toISOString(),
        };
      })
    );
    showToast(`El activo ha sido trasladado a la hoja de 'Equipos Dados de Baja'.`);
  };

  // Selection handlers
  const handleToggleSelectItem = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (all: boolean) => {
    if (all) {
      setSelectedItemIds(filteredItems.map((i) => i.id));
    } else {
      setSelectedItemIds([]);
    }
  };

  // Reset to initial seed
  const handleResetData = () => {
    if (window.confirm('¿Desea restaurar el inventario a la versión base original de los archivos Excel?')) {
      const reset = resetInventoryToSeed();
      setItems(reset);
      setSelectedItemIds([]);
      showToast('Inventario restaurado a los datos oficiales base.');
    }
  };

  // Exports
  const handleExportExcel = () => {
    const filename =
      currentTab === 'dashboard'
        ? 'Inventario_General_CICOL_IPS'
        : `Inventario_${CATEGORY_DEFINITIONS[currentTab]?.name.replace(/\s+/g, '_')}`;
    exportToExcel(filteredItems, filename);
    showToast(`Archivo Excel exportado (${filteredItems.length} registros).`);
  };

  const handleExportPDF = () => {
    const title =
      currentTab === 'dashboard'
        ? 'Reporte Maestro de Activos e Inventario'
        : `Reporte Oficial - ${CATEGORY_DEFINITIONS[currentTab]?.name}`;
    exportToPDF(filteredItems, title, currentTab === 'dashboard' ? 'all' : currentTab);
    showToast(`Reporte PDF generado (${filteredItems.length} registros).`);
  };

  const allCodes = items.map((i) => i.code);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-2.5 rounded-lg shadow-lg border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {notification}
        </div>
      )}

      {/* Main Top Header (3-zone contract) */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setSelectedItemIds([]);
        }}
        onOpenNewItem={() => handleAddNewItem()}
        onOpenTransfer={() => handleOpenTransferSingle()}
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
        onOpenCodification={() => setIsCodificationModalOpen(true)}
        onResetData={handleResetData}
        totalCount={items.length}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'dashboard' ? (
          <DashboardView
            items={items}
            onNavigateToCategory={(cat) => {
              setCurrentTab(cat);
              setSelectedItemIds([]);
            }}
            onFilterAlerts={() => {
              setFilters((prev) => ({ ...prev, onlyAlerts: true, onlyNew: false, onlyPendingSD: false }));
              setViewMode('table');
            }}
            onFilterNew={() => {
              setFilters((prev) => ({ ...prev, onlyNew: true, onlyAlerts: false, onlyPendingSD: false }));
              setViewMode('table');
            }}
            onFilterPendingSD={() => {
              setFilters((prev) => ({ ...prev, onlyPendingSD: true, onlyAlerts: false, onlyNew: false }));
              setViewMode('table');
            }}
            onOpenTransfer={handleOpenTransferSingle}
          />
        ) : (
          <div className="space-y-4 pb-12">
            {/* Sheet Banner */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-sm">
                    {CATEGORY_DEFINITIONS[currentTab]?.prefix || 'ACT'}
                  </span>
                  <h1 className="text-base font-bold text-slate-900">
                    {CATEGORY_DEFINITIONS[currentTab]?.name}
                  </h1>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {CATEGORY_DEFINITIONS[currentTab]?.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAddNewItem(currentTab)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-md transition-colors cursor-pointer"
                >
                  <span>+ Agregar Elemento</span>
                </button>
              </div>
            </div>

            {/* Filter toolbar */}
            <FiltersBar
              filters={filters}
              onFilterChange={setFilters}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              totalFiltered={filteredItems.length}
              totalAll={items.filter((i) => i.category === currentTab).length}
              activeCategory={currentTab}
            />

            {/* Visualizations according to viewMode */}
            {viewMode === 'table' && (
              <InventoryTableView
                items={filteredItems}
                selectedItemIds={selectedItemIds}
                onToggleSelectItem={handleToggleSelectItem}
                onSelectAll={handleSelectAll}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
                onTransferItem={handleOpenTransferSingle}
                onDisposeItem={handleOpenDispose}
                onAddNew={() => handleAddNewItem(currentTab)}
                onBulkTransfer={handleOpenBulkTransfer}
                category={currentTab}
              />
            )}

            {viewMode === 'cards' && (
              <InventoryCardsView
                items={filteredItems}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
                onTransferItem={handleOpenTransferSingle}
                onDisposeItem={handleOpenDispose}
              />
            )}

            {viewMode === 'locations' && (
              <LocationsBoardView
                items={filteredItems}
                onTransferItem={handleOpenTransferSingle}
                onEditItem={handleEditItem}
                onAddNewToLocation={(areaCode) => handleAddNewItem(currentTab, areaCode)}
              />
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <ItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSave={handleSaveItem}
        initialItem={editingItem}
        defaultCategory={defaultCategoryForNew}
        defaultAreaCode={defaultAreaCodeForNew}
        allExistingCodes={allCodes}
      />

      <TransferLocationModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        itemsToTransfer={itemsToTransfer}
        allInventoryItems={items}
        onConfirmTransfer={handleConfirmTransfer}
      />

      <DisposeModal
        isOpen={isDisposeModalOpen}
        onClose={() => setIsDisposeModalOpen(false)}
        item={itemToDispose}
        onConfirmDispose={handleConfirmDispose}
      />

      <CodificationCatalogModal
        isOpen={isCodificationModalOpen}
        onClose={() => setIsCodificationModalOpen(false)}
      />
    </div>
  );
}
