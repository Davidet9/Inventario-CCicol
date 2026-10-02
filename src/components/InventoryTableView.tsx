import React, { useState } from 'react';
import { InventoryItem, ItemCategory } from '../types/inventory';
import { CATEGORY_DEFINITIONS } from '../data/areasCatalog';
import { 
  ArrowLeftRight, 
  Pencil, 
  Trash2, 
  ArchiveX, 
  AlertTriangle, 
  Plus, 
  ArrowUpDown,
  CheckSquare,
  Square,
  Sparkles
} from 'lucide-react';

interface InventoryTableViewProps {
  items: InventoryItem[];
  selectedItemIds: string[];
  onToggleSelectItem: (id: string) => void;
  onSelectAll: (all: boolean) => void;
  onEditItem: (item: InventoryItem) => void;
  onDeleteItem: (id: string) => void;
  onTransferItem: (item: InventoryItem) => void;
  onDisposeItem: (item: InventoryItem) => void;
  onAddNew: () => void;
  onBulkTransfer: () => void;
  category: ItemCategory | 'all';
}

export const InventoryTableView: React.FC<InventoryTableViewProps> = ({
  items,
  selectedItemIds,
  onToggleSelectItem,
  onSelectAll,
  onEditItem,
  onDeleteItem,
  onTransferItem,
  onDisposeItem,
  onAddNew,
  onBulkTransfer,
  category,
}) => {
  const [sortField, setSortField] = useState<keyof InventoryItem>('code');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof InventoryItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    const valA = a[sortField] ?? '';
    const valB = b[sortField] ?? '';
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    }
    return sortDirection === 'asc'
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const isAllSelected = items.length > 0 && selectedItemIds.length === items.length;

  if (items.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900">
          No se encontraron activos
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          No hay elementos que coincidan con los filtros aplicados o la categoría seleccionada.
        </p>
        <button
          onClick={onAddNew}
          className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-md transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Registrar Primer Activo</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      {/* Bulk action toolbar when items are selected */}
      {selectedItemIds.length > 0 && (
        <div className="bg-indigo-50 border-b border-indigo-100 px-4 py-2.5 flex items-center justify-between transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-indigo-900 font-mono-numbers">
              {selectedItemIds.length} activo(s) seleccionado(s)
            </span>
            <span className="text-xs text-indigo-600">para acciones masivas</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBulkTransfer}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-xs transition-colors cursor-pointer"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Trasladar de Ubicación ({selectedItemIds.length})</span>
            </button>
            <button
              onClick={() => onSelectAll(false)}
              className="px-2 py-1 text-xs text-indigo-700 hover:text-indigo-900 cursor-pointer"
            >
              Deseleccionar
            </button>
          </div>
        </div>
      )}

      {/* Scroll indicator & table container */}
      <div className="relative">
        <div 
          id="inventory-table-container"
          className="overflow-x-auto custom-scrollbar border border-slate-200 rounded-xl"
        >
          <table className="w-full text-left border-collapse text-xs min-w-[1360px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3 w-10 text-center">
                  <button
                    onClick={() => onSelectAll(!isAllSelected)}
                    className="cursor-pointer text-slate-400 hover:text-slate-600 focus:outline-hidden"
                  >
                    {isAllSelected ? (
                      <CheckSquare className="w-4 h-4 text-teal-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>

                <th 
                  onClick={() => handleSort('code')} 
                  className="py-3 px-3 cursor-pointer hover:text-slate-900 whitespace-nowrap w-36"
                >
                  <div className="flex items-center gap-1">
                    <span>Código Activo</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                <th 
                  onClick={() => handleSort('name')} 
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 min-w-[260px]"
                >
                  <div className="flex items-center gap-1">
                    <span>Nombre / Tipo</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {category === 'all' && (
                  <th className="py-3 px-3 whitespace-nowrap w-36">
                    <span>Categoría</span>
                  </th>
                )}

                <th 
                  onClick={() => handleSort('area')} 
                  className="py-3 px-3 cursor-pointer hover:text-slate-900 min-w-[220px]"
                >
                  <div className="flex items-center gap-1">
                    <span>Ubicación / Área</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                <th className="py-3 px-3 whitespace-nowrap min-w-[180px]">
                  <span>Marca / Modelo / Serial</span>
                </th>

                <th 
                  onClick={() => handleSort('status')} 
                  className="py-3 px-3 cursor-pointer hover:text-slate-900 whitespace-nowrap w-28"
                >
                  <div className="flex items-center gap-1">
                    <span>Estado</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                <th className="py-3 px-3 whitespace-nowrap min-w-[160px]">
                  <span>Responsable</span>
                </th>

                <th 
                  onClick={() => handleSort('purchaseValue')} 
                  className="py-3 px-3 cursor-pointer hover:text-slate-900 text-right whitespace-nowrap w-32"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Valor Compra</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* Sticky Actions Header (Never hidden off-screen) */}
                <th className="py-3 px-4 text-center whitespace-nowrap sticky right-0 bg-slate-100/95 z-20 shadow-[-5px_0_10px_-3px_rgba(0,0,0,0.08)] border-l border-slate-200 w-44">
                  <span>Acciones</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {sortedItems.map((item) => {
                const isSelected = selectedItemIds.includes(item.id);

                return (
                  <tr
                    key={item.id}
                    className={`group hover:bg-slate-50/90 transition-colors ${
                      isSelected ? 'bg-indigo-50/50' : 'bg-white'
                    }`}
                  >
                    {/* Select Checkbox */}
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => onToggleSelectItem(item.id)}
                        className="cursor-pointer text-slate-400 hover:text-slate-600 focus:outline-hidden"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-teal-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    {/* Code */}
                    <td className="py-3 px-3 font-mono font-medium text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span>{item.code}</span>
                        {item.isNew && (
                          <span title="Equipo Adquirido Recientemente" className="text-teal-600">
                            <Sparkles className="w-3 h-3" />
                          </span>
                        )}
                        {item.isPendingAreaConfirmation && (
                          <span title="Ubicación provisional pendiente de confirmar" className="text-amber-500 font-bold text-[10px]">
                            [SD]
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Name and Observations (Unclipped, properly formatted) */}
                    <td className="py-3 px-4 min-w-[260px]">
                      <div className="font-semibold text-slate-900 leading-snug">
                        {item.name}
                      </div>
                      {item.observations && (
                        <div className="text-[11px] text-amber-800 bg-amber-50/60 border border-amber-200/60 rounded px-1.5 py-0.5 mt-1 leading-normal">
                          {item.observations}
                        </div>
                      )}
                      {item.decommissionReason && (
                        <div className="text-[11px] text-rose-800 bg-rose-50/60 border border-rose-200/60 rounded px-1.5 py-0.5 mt-1 font-medium leading-normal">
                          Baja: {item.decommissionReason}
                        </div>
                      )}
                    </td>

                    {/* Category (if all) */}
                    {category === 'all' && (
                      <td className="py-3 px-3 whitespace-nowrap text-slate-600">
                        {CATEGORY_DEFINITIONS[item.category]?.name.replace('Equipos ', '').replace(' y Útiles', '') || item.category}
                      </td>
                    )}

                    {/* Area and Location */}
                    <td className="py-3 px-3 min-w-[220px]">
                      <div className="font-medium text-slate-800 leading-snug">
                        {item.area}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Ubicación: <span className="font-mono font-medium text-slate-700">{item.location}</span>
                      </div>
                    </td>

                    {/* Brand / Model / Serial */}
                    <td className="py-3 px-3 min-w-[180px]">
                      <div className="text-slate-800 font-medium">
                        {item.brand || 'N/A'} {item.model ? `· ${item.model}` : ''}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {item.serial ? `S/N: ${item.serial}` : (item.material ? `Material: ${item.material}` : 'Sin serial')}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[11px] font-medium ${
                          item.status === 'Bueno'
                            ? 'text-emerald-700 bg-emerald-50'
                            : item.status === 'Nuevo'
                            ? 'text-teal-700 bg-teal-50 font-semibold'
                            : item.status === 'Regular'
                            ? 'text-amber-700 bg-amber-50'
                            : item.status === 'Reparación'
                            ? 'text-rose-700 bg-rose-50'
                            : 'text-slate-600 bg-slate-100'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* Responsible */}
                    <td className="py-3 px-3 text-slate-700 min-w-[160px]">
                      <span className="leading-snug block">
                        {item.responsible || 'Sin Asignar'}
                      </span>
                    </td>

                    {/* Value */}
                    <td className="py-3 px-3 text-right font-mono-numbers font-medium text-slate-900 whitespace-nowrap">
                      {item.purchaseValue
                        ? `$${item.purchaseValue.toLocaleString('es-CO')}`
                        : '-'}
                    </td>

                    {/* STICKY ACTIONS COLUMN (Always visible on the right) */}
                    <td className="py-3 px-4 text-center whitespace-nowrap sticky right-0 bg-white group-hover:bg-slate-50 z-10 shadow-[-5px_0_10px_-3px_rgba(0,0,0,0.08)] border-l border-slate-200">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onTransferItem(item)}
                          title="Reubicar activo a otro consultorio o área"
                          className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors cursor-pointer"
                        >
                          <ArrowLeftRight className="w-3 h-3" />
                          <span>Mover</span>
                        </button>

                        <button
                          onClick={() => onEditItem(item)}
                          title="Editar información del activo"
                          className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-md transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        {item.category !== 'bajas' && (
                          <button
                            onClick={() => onDisposeItem(item)}
                            title="Dar de baja este activo"
                            className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          >
                            <ArchiveX className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => onDeleteItem(item.id)}
                          title="Eliminar registro definitivamente"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
