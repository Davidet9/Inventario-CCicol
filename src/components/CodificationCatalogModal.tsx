import React from 'react';
import { OFFICIAL_AREAS, CATEGORY_DEFINITIONS } from '../data/areasCatalog';
import { X, BookOpen, CheckCircle, Info, MapPin } from 'lucide-react';

interface CodificationCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodificationCatalogModal: React.FC<CodificationCatalogModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-3xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-teal-100 text-teal-800 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Manual y Criterios de Codificación Institucional
              </h3>
              <p className="text-xs text-slate-500">
                Estructura de siglas, prefijos y nomenclatura oficial CICOL IPS
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
        <div className="p-6 space-y-6 overflow-y-auto text-xs">
          {/* Format Rule Formula Box */}
          <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-200/80 space-y-2">
            <h4 className="font-bold text-teal-950 flex items-center gap-1.5 text-xs">
              <CheckCircle className="w-4 h-4 text-teal-700" />
              <span>Regla Universal de Formato de Código de Activo</span>
            </h4>
            <div className="flex items-center gap-2 font-mono text-sm font-bold text-teal-900 bg-white px-3 py-2 rounded-lg border border-teal-200">
              <span>NNN</span>
              <span className="text-slate-400">-</span>
              <span>ÁREA</span>
              <span className="text-slate-400">-</span>
              <span>TIPO</span>
              <span className="text-xs font-sans font-normal text-slate-500 ml-auto">
                Ejemplo: <strong className="text-teal-800 font-mono">001-IMG-BM</strong>
              </span>
            </div>
            <ul className="space-y-1 text-slate-600 list-disc list-inside">
              <li><strong>Consecutivo de tres dígitos (NNN):</strong> Por área y tipo, en orden correlativo de inventario.</li>
              <li><strong>Área:</strong> Sigla oficial de la ubicación física o consultorio asignado.</li>
              <li><strong>Tipo:</strong> Categoría del activo (BM: Biomédico, ET: Tecnológico, MOB: Mobiliario, PAP: Papelería).</li>
              <li><strong>Bajas:</strong> Continúan la misma secuencia con indicación en la hoja de bajas.</li>
            </ul>
          </div>

          {/* Types Table */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Prefijos por Tipo de Activo
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-mono font-bold text-emerald-700 text-sm">BM</span>
                <p className="font-semibold text-slate-800 mt-0.5">Equipo Biomédico</p>
                <p className="text-[11px] text-slate-500">Ecógrafos, monitores, Holters, tensiómetros</p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-mono font-bold text-indigo-700 text-sm">ET</span>
                <p className="font-semibold text-slate-800 mt-0.5">Equipo Tecnológico</p>
                <p className="text-[11px] text-slate-500">Computadores, impresoras, escáneres, UPS</p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-mono font-bold text-amber-700 text-sm">MOB</span>
                <p className="font-semibold text-slate-800 mt-0.5">Mobiliario</p>
                <p className="text-[11px] text-slate-500">Camillas, escritorios, sillas, estantes, aires</p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-mono font-bold text-slate-700 text-sm">PAP</span>
                <p className="font-semibold text-slate-800 mt-0.5">Papelería y Útiles</p>
                <p className="text-[11px] text-slate-500">Cosedoras, perforadoras, sellos, calculadoras</p>
              </div>
            </div>
          </div>

          {/* Areas Catalog Table */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center justify-between">
              <span>Directorio Oficial de Siglas de Áreas y Consultorios</span>
              <span className="text-slate-400 font-normal">22 Áreas codificadas</span>
            </h4>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-600 text-[11px] uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Sigla</th>
                    <th className="py-2 px-3">Área / Consultorio</th>
                    <th className="py-2 px-3">Nivel / Piso</th>
                    <th className="py-2 px-3">Descripción Funcional</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {OFFICIAL_AREAS.map((a) => (
                    <tr key={a.code} className="hover:bg-slate-50/60">
                      <td className="py-2 px-3 font-mono font-bold text-teal-800">{a.code}</td>
                      <td className="py-2 px-3 font-semibold text-slate-800">{a.name}</td>
                      <td className="py-2 px-3 text-slate-500">{a.floor || '-'}</td>
                      <td className="py-2 px-3 text-slate-600">{a.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200/80 rounded-lg transition-colors cursor-pointer"
          >
            Cerrar Manual
          </button>
        </div>
      </div>
    </div>
  );
};
