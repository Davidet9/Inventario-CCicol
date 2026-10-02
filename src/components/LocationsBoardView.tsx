import React from 'react';
import { InventoryItem } from '../types/inventory';
import { OFFICIAL_AREAS, CATEGORY_DEFINITIONS } from '../data/areasCatalog';
import { 
  MapPin, 
  ArrowLeftRight, 
  Plus, 
  Layers, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface LocationsBoardViewProps {
  items: InventoryItem[];
  onTransferItem: (item: InventoryItem) => void;
  onEditItem: (item: InventoryItem) => void;
  onAddNewToLocation: (areaCode: string) => void;
}

export const LocationsBoardView: React.FC<LocationsBoardViewProps> = ({
  items,
  onTransferItem,
  onEditItem,
  onAddNewToLocation,
}) => {
  // Group items by official area code or friendly area name
  const groupedByArea: Record<string, InventoryItem[]> = {};

  // Initialize official areas
  OFFICIAL_AREAS.forEach((area) => {
    groupedByArea[area.code] = [];
  });

  // Group items
  items.forEach((item) => {
    // Determine which area code this item matches
    let matchedCode = 'SD';
    for (const area of OFFICIAL_AREAS) {
      if (
        item.area.toLowerCase().includes(area.code.toLowerCase()) ||
        item.code.includes(`-${area.code}-`) ||
        item.location === area.code ||
        item.area.toLowerCase().includes(area.name.toLowerCase().slice(0, 10))
      ) {
        matchedCode = area.code;
        break;
      }
    }
    if (!groupedByArea[matchedCode]) {
      groupedByArea[matchedCode] = [];
    }
    groupedByArea[matchedCode].push(item);
  });

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Tablero de Control de Múltiples Ubicaciones
            </h2>
            <p className="text-xs text-slate-500">
              Visualice los activos por consultorio físico. Puede mover cualquier elemento inmediatamente a otra ubicación sin eliminar ni duplicar registros.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md self-start sm:self-auto font-mono-numbers">
            {items.length} activos distribuidos
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {OFFICIAL_AREAS.filter((area) => (groupedByArea[area.code] || []).length > 0).map((area) => {
          const areaItems = groupedByArea[area.code] || [];
          return (
            <div
              key={area.code}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col h-[480px]"
            >
              {/* Column Header */}
              <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-slate-200 text-slate-800 rounded-xs">
                      {area.code}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 truncate max-w-[190px]" title={area.name}>
                      {area.name}
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {area.floor || 'Ubicación'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-bold font-mono-numbers bg-teal-100 text-teal-900 rounded-md">
                    {areaItems.length}
                  </span>
                  <button
                    onClick={() => onAddNewToLocation(area.code)}
                    title={`Agregar activo a ${area.name}`}
                    className="p-1 text-slate-500 hover:text-teal-700 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Items List inside Area */}
              <div className="p-3 space-y-2.5 overflow-y-auto flex-1 divide-y divide-slate-100">
                {areaItems.map((item) => {
                  return (
                    <div
                      key={item.id}
                      className="pt-2 first:pt-0 group flex items-start justify-between gap-2"
                    >
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 font-mono text-[11px]">
                          <span className="font-semibold text-slate-900">{item.code}</span>
                          {item.isNew && (
                            <span className="text-teal-600">
                              <Sparkles className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-medium text-slate-800 truncate" title={item.name}>
                          {item.name}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {item.brand} {item.model ? `· ${item.model}` : ''}
                        </p>
                        <div className="text-[10px] text-slate-400">
                          Resp: <span className="text-slate-600">{item.responsible || 'N/A'}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-xs font-medium ${
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

                        <button
                          onClick={() => onTransferItem(item)}
                          title="Trasladar a otra área"
                          className="inline-flex items-center gap-1 px-1.5 py-1 text-[11px] font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors cursor-pointer"
                        >
                          <ArrowLeftRight className="w-3 h-3" />
                          <span>Mover</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
