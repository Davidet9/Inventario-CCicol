import React from 'react';
import { InventoryItem } from '../types/inventory';
import { CATEGORY_DEFINITIONS } from '../data/areasCatalog';
import { 
  ArrowLeftRight, 
  Pencil, 
  Trash2, 
  ArchiveX, 
  MapPin, 
  User, 
  Sparkles,
  AlertTriangle,
  Calendar,
  DollarSign
} from 'lucide-react';

interface InventoryCardsViewProps {
  items: InventoryItem[];
  onEditItem: (item: InventoryItem) => void;
  onDeleteItem: (id: string) => void;
  onTransferItem: (item: InventoryItem) => void;
  onDisposeItem: (item: InventoryItem) => void;
}

export const InventoryCardsView: React.FC<InventoryCardsViewProps> = ({
  items,
  onEditItem,
  onDeleteItem,
  onTransferItem,
  onDisposeItem,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => {
        return (
          <div
            key={item.id}
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              {/* Header: Code & Status */}
              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-900">
                  <span>{item.code}</span>
                  {item.isNew && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] text-teal-700 bg-teal-50 px-1 py-0.5 rounded-sm font-semibold">
                      <Sparkles className="w-2.5 h-2.5" />
                      Nuevo
                    </span>
                  )}
                  {item.isPendingAreaConfirmation && (
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-1 py-0.5 rounded-sm font-bold">
                      SD
                    </span>
                  )}
                </div>

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
              </div>

              {/* Title & Brand */}
              <div className="mt-3">
                <h3 className="text-sm font-bold text-slate-900 line-clamp-1" title={item.name}>
                  {item.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {item.brand || 'Genérico'} {item.model ? `· ${item.model}` : ''}
                </p>
              </div>

              {/* Metadata Details */}
              <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate" title={item.area}>
                    {item.area} ({item.location})
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate text-slate-600">
                    {item.responsible || 'Sin responsable asignado'}
                  </span>
                </div>

                {item.serial && (
                  <div className="text-[11px] text-slate-400 font-mono truncate">
                    Serial: <span className="text-slate-600">{item.serial}</span>
                  </div>
                )}

                {item.purchaseDate && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>Fecha: {item.purchaseDate}</span>
                  </div>
                )}

                {item.observations && (
                  <div className="p-2 bg-amber-50/70 border border-amber-100/80 rounded-md text-[11px] text-amber-800 mt-2 line-clamp-2">
                    {item.observations}
                  </div>
                )}

                {item.decommissionReason && (
                  <div className="p-2 bg-rose-50 border border-rose-100 rounded-md text-[11px] text-rose-800 mt-2">
                    <strong>Motivo de baja:</strong> {item.decommissionReason}
                    {item.decommissionResponsible && (
                      <span className="block text-[10px] text-rose-600 mt-0.5">
                        Técnico: {item.decommissionResponsible}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Footer with Price & Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                {item.purchaseValue ? (
                  <span className="text-xs font-bold text-slate-900 font-mono-numbers">
                    ${item.purchaseValue.toLocaleString('es-CO')}
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">Sin valor reg.</span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onTransferItem(item)}
                  title="Reubicar activo"
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors cursor-pointer"
                >
                  <ArrowLeftRight className="w-3 h-3" />
                  <span>Reubicar</span>
                </button>

                <button
                  onClick={() => onEditItem(item)}
                  title="Editar"
                  className="p-1 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-md transition-colors cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>

                {item.category !== 'bajas' && (
                  <button
                    onClick={() => onDisposeItem(item)}
                    title="Dar de baja"
                    className="p-1 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                  >
                    <ArchiveX className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => onDeleteItem(item.id)}
                  title="Eliminar"
                  className="p-1 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
