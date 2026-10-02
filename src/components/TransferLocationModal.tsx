import React, { useState } from 'react';
import { InventoryItem, LocationMovement } from '../types/inventory';
import { OFFICIAL_AREAS, generateSuggestedCode } from '../data/areasCatalog';
import { 
  ArrowLeftRight, 
  X, 
  MapPin, 
  User, 
  Calendar, 
  CheckCircle2, 
  History,
  AlertCircle
} from 'lucide-react';

interface TransferLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemsToTransfer: InventoryItem[];
  allInventoryItems: InventoryItem[];
  onConfirmTransfer: (
    itemIds: string[],
    newAreaCode: string,
    newAreaName: string,
    newLocationName: string,
    newResponsible: string,
    reason: string,
    updateCode: boolean
  ) => void;
}

export const TransferLocationModal: React.FC<TransferLocationModalProps> = ({
  isOpen,
  onClose,
  itemsToTransfer,
  allInventoryItems,
  onConfirmTransfer,
}) => {
  if (!isOpen || itemsToTransfer.length === 0) return null;

  const isMultiple = itemsToTransfer.length > 1;
  const singleItem = itemsToTransfer[0];

  const [selectedAreaCode, setSelectedAreaCode] = useState<string>(OFFICIAL_AREAS[0].code);
  const [responsible, setResponsible] = useState<string>(
    isMultiple ? '' : singleItem.responsible || ''
  );
  const [keepExistingResponsible, setKeepExistingResponsible] = useState<boolean>(isMultiple);
  const [reason, setReason] = useState<string>('Reasignación operativa de consultorio');
  const [updateAssetCode, setUpdateAssetCode] = useState<boolean>(false);

  const selectedAreaDef = OFFICIAL_AREAS.find((a) => a.code === selectedAreaCode) || OFFICIAL_AREAS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const itemIds = itemsToTransfer.map((i) => i.id);
    onConfirmTransfer(
      itemIds,
      selectedAreaDef.code,
      selectedAreaDef.name,
      selectedAreaDef.code,
      keepExistingResponsible ? '' : responsible,
      reason,
      updateAssetCode
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {isMultiple
                  ? `Trasladar ${itemsToTransfer.length} Activos de Ubicación`
                  : 'Reubicar Activo entre Consultorios / Áreas'}
              </h3>
              <p className="text-xs text-slate-500">
                Cambio directo de ubicación física sin alterar el historial
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Active Items summary */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              {isMultiple ? 'Activos a Reubicar' : 'Activo Seleccionado'}
            </div>

            {!isMultiple ? (
              <div className="text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900">{singleItem.code}</span>
                  <span className="text-slate-500">Ubicación actual: <strong>{singleItem.area}</strong></span>
                </div>
                <p className="text-slate-700 font-medium">{singleItem.name}</p>
                <p className="text-slate-500">
                  {singleItem.brand} {singleItem.model ? `· ${singleItem.model}` : ''}
                </p>
              </div>
            ) : (
              <div className="max-h-28 overflow-y-auto divide-y divide-slate-200 pr-1 text-xs">
                {itemsToTransfer.map((item) => (
                  <div key={item.id} className="py-1 flex items-center justify-between">
                    <span className="font-mono font-medium text-slate-800">{item.code} - {item.name}</span>
                    <span className="text-[11px] text-slate-500">{item.location}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Destination Area Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              <span>Nueva Ubicación / Área de Destino *</span>
            </label>
            <select
              value={selectedAreaCode}
              onChange={(e) => setSelectedAreaCode(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
              required
            >
              {OFFICIAL_AREAS.map((area) => (
                <option key={area.code} value={area.code}>
                  [{area.code}] {area.name} — {area.floor || ''}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500">
              {selectedAreaDef.description}
            </p>
          </div>

          {/* New Responsible */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-600" />
                <span>Nuevo Responsable</span>
              </label>

              {isMultiple && (
                <label className="flex items-center gap-1 text-[11px] text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={keepExistingResponsible}
                    onChange={(e) => setKeepExistingResponsible(e.target.checked)}
                    className="rounded-xs text-indigo-600"
                  />
                  <span>Mantener los actuales</span>
                </label>
              )}
            </div>

            {(!isMultiple || !keepExistingResponsible) && (
              <input
                type="text"
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                placeholder="Ej. Todas las Enfermeras / Dra. Gómez / Dr. Pablo"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
              />
            )}
          </div>

          {/* Transfer Reason */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Motivo del Traslado / Movimiento *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-600 mb-1"
            >
              <option value="Reasignación operativa de consultorio">Reasignación operativa de consultorio</option>
              <option value="Mantenimiento preventivo en taller/bodega">Mantenimiento preventivo en taller/bodega</option>
              <option value="Préstamo temporal de apoyo">Préstamo temporal de apoyo</option>
              <option value="Renovación de equipos">Renovación de equipos</option>
              <option value="Reorganización física de sede">Reorganización física de sede</option>
              <option value="Otro motivo especificado">Otro motivo</option>
            </select>
          </div>

          {/* Code Update Option (Rule NNN-AREA-TIPO) */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={updateAssetCode}
                onChange={(e) => setUpdateAssetCode(e.target.checked)}
                className="mt-0.5 rounded-xs text-indigo-600 focus:ring-indigo-500"
              />
              <div className="text-xs">
                <span className="font-semibold text-slate-800">
                  Actualizar código de activo al formato del área destino
                </span>
                <p className="text-[11px] text-slate-500">
                  Aplica la regla de codificación Cicol (ej: cambiándolo de 001-IMG-BM al siguiente consecutivo de {selectedAreaCode}). Si no se marca, se conserva la placa física original.
                </p>
              </div>
            </label>
          </div>

          {/* Movement history preview if single item */}
          {!isMultiple && singleItem.movementsHistory && singleItem.movementsHistory.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 uppercase flex items-center gap-1 mb-1">
                <History className="w-3 h-3" />
                Historial de Traslados Anteriores ({singleItem.movementsHistory.length})
              </span>
              <div className="max-h-20 overflow-y-auto space-y-1 text-[11px] text-slate-600">
                {singleItem.movementsHistory.map((mov) => (
                  <div key={mov.id} className="p-1.5 bg-slate-50 rounded-sm">
                    {mov.date}: De <strong>{mov.fromArea}</strong> a <strong>{mov.toArea}</strong> ({mov.reason})
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Confirmar Reubicación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
