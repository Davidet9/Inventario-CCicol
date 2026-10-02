import React, { useState } from 'react';
import { InventoryItem } from '../types/inventory';
import { ArchiveX, X, AlertTriangle } from 'lucide-react';

interface DisposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  onConfirmDispose: (
    itemId: string,
    reason: string,
    technician: string,
    date: string
  ) => void;
}

export const DisposeModal: React.FC<DisposeModalProps> = ({
  isOpen,
  onClose,
  item,
  onConfirmDispose,
}) => {
  if (!isOpen || !item) return null;

  const [reason, setReason] = useState<string>('Daño irreversible de tarjeta / componentes');
  const [technician, setTechnician] = useState<string>('Ing. Javier Rincón');
  const [date, setDate] = useState<string>(new Date().toLocaleDateString('es-CO'));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmDispose(item.id, reason, technician, date);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-rose-50 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
              <ArchiveX className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-900">
                Dar de Baja Activo
              </h3>
              <p className="text-xs text-rose-600">
                Traslado a la hoja oficial de 'Equipos Dados de Baja'
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
            <div className="font-mono font-bold text-slate-900">{item.code}</div>
            <div className="font-medium text-slate-800">{item.name}</div>
            <div className="text-slate-500">
              {item.brand} {item.model ? `· ${item.model}` : ''} ({item.area})
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Motivo Oficial de la Baja *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-rose-600"
              required
            >
              <option value="Daño irreversible de tarjeta / componentes">Daño irreversible de tarjeta / componentes</option>
              <option value="Daño de puerto de configuración">Daño de puerto de configuración</option>
              <option value="Daño de programación">Daño de programación</option>
              <option value="Se quemó / Cortocircuito">Se quemó / Cortocircuito</option>
              <option value="Descalibrado irreversible">Descalibrado irreversible</option>
              <option value="Daño de conexión de cable en puntas">Daño de conexión de cable en puntas</option>
              <option value="Error de conexión continuo">Error de conexión continuo</option>
              <option value="Pastas y soportes plásticos dañados">Pastas y soportes plásticos dañados</option>
              <option value="Obsolescencia técnica por fin de vida útil">Obsolescencia técnica por fin de vida útil</option>
              <option value="Reemplazo por equipo nuevo">Reemplazo por equipo nuevo</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Responsable de Mantenimiento / Dictamen Técnico *
            </label>
            <input
              type="text"
              value={technician}
              onChange={(e) => setTechnician(e.target.value)}
              placeholder="Ej. Ing. Javier Rincón / Germar / Intecmedics"
              required
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-rose-600"
            />
          </div>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              El activo dejará de figurar en el inventario activo de su consultorio y pasará a la hoja oficial de 'Equipos Dados de Baja' para trazabilidad contable.
            </span>
          </div>

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
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Confirmar Baja
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
