import React from 'react';
import { ItemCategory } from '../types/inventory';
import { 
  Plus, 
  FileSpreadsheet, 
  FileText, 
  ArrowLeftRight, 
  BookOpen, 
  RotateCcw
} from 'lucide-react';

interface HeaderProps {
  currentTab: 'dashboard' | ItemCategory;
  onSelectTab: (tab: 'dashboard' | ItemCategory) => void;
  onOpenNewItem: () => void;
  onOpenTransfer: () => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
  onOpenCodification: () => void;
  onResetData: () => void;
  totalCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenNewItem,
  onOpenTransfer,
  onExportExcel,
  onExportPDF,
  onOpenCodification,
  onResetData,
  totalCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Row 1: Top Bar Contract (Brand - Nav Links - Primary Actions) */}
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onSelectTab('dashboard')}
              className="text-left group cursor-pointer focus:outline-hidden"
            >
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
                  CICOL IPS
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-sm">
                  Inventario Clínico
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-normal">
                Base de Datos y Gestión Integral de Activos
              </p>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Text with active underlines) */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                currentTab === 'dashboard'
                  ? 'text-teal-800 bg-teal-50/80 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Dashboard Estratégico
            </button>
            <button
              onClick={() => onSelectTab('biomedicos')}
              className={`px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                currentTab === 'biomedicos'
                  ? 'text-teal-800 bg-teal-50/80 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Equipos Biomédicos
            </button>
            <button
              onClick={() => onSelectTab('tecnologicos')}
              className={`px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                currentTab === 'tecnologicos'
                  ? 'text-teal-800 bg-teal-50/80 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Equipos Tecnológicos
            </button>
            <button
              onClick={() => onSelectTab('mobiliario')}
              className={`px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                currentTab === 'mobiliario'
                  ? 'text-teal-800 bg-teal-50/80 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Mobiliario
            </button>
            <button
              onClick={() => onSelectTab('papeleria')}
              className={`px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                currentTab === 'papeleria'
                  ? 'text-teal-800 bg-teal-50/80 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Papelería y Útiles
            </button>
            <button
              onClick={() => onSelectTab('bajas')}
              className={`px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                currentTab === 'bajas'
                  ? 'text-rose-800 bg-rose-50 font-semibold'
                  : 'text-slate-600 hover:text-rose-700 hover:bg-rose-50/50'
              }`}
            >
              Dados de Baja
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCodification}
              title="Manual y Diccionario de Codificación de Áreas"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-md transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Codificación</span>
            </button>

            <button
              onClick={onOpenTransfer}
              title="Reubicar elemento entre consultorios y áreas"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors cursor-pointer border border-indigo-200"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reubicar</span>
            </button>

            <div className="hidden md:flex items-center border-l border-slate-200 pl-2 ml-1 gap-1.5">
              <button
                onClick={onExportExcel}
                title="Exportar listado a Excel (.xlsx)"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-md border border-emerald-200 transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Excel</span>
              </button>
              <button
                onClick={onExportPDF}
                title="Exportar reporte a PDF"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-rose-500" />
                <span>PDF</span>
              </button>
            </div>

            <button
              onClick={onOpenNewItem}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-md shadow-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Activo</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 space-x-1 border-t border-slate-100 scrollbar-none">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-2.5 py-1 text-xs whitespace-nowrap rounded-md ${
              currentTab === 'dashboard' ? 'bg-teal-50 text-teal-800 font-semibold' : 'text-slate-600'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onSelectTab('biomedicos')}
            className={`px-2.5 py-1 text-xs whitespace-nowrap rounded-md ${
              currentTab === 'biomedicos' ? 'bg-teal-50 text-teal-800 font-semibold' : 'text-slate-600'
            }`}
          >
            Biomédicos
          </button>
          <button
            onClick={() => onSelectTab('tecnologicos')}
            className={`px-2.5 py-1 text-xs whitespace-nowrap rounded-md ${
              currentTab === 'tecnologicos' ? 'bg-teal-50 text-teal-800 font-semibold' : 'text-slate-600'
            }`}
          >
            Tecnológicos
          </button>
          <button
            onClick={() => onSelectTab('mobiliario')}
            className={`px-2.5 py-1 text-xs whitespace-nowrap rounded-md ${
              currentTab === 'mobiliario' ? 'bg-teal-50 text-teal-800 font-semibold' : 'text-slate-600'
            }`}
          >
            Mobiliario
          </button>
          <button
            onClick={() => onSelectTab('papeleria')}
            className={`px-2.5 py-1 text-xs whitespace-nowrap rounded-md ${
              currentTab === 'papeleria' ? 'bg-teal-50 text-teal-800 font-semibold' : 'text-slate-600'
            }`}
          >
            Papelería
          </button>
          <button
            onClick={() => onSelectTab('bajas')}
            className={`px-2.5 py-1 text-xs whitespace-nowrap rounded-md ${
              currentTab === 'bajas' ? 'bg-rose-50 text-rose-800 font-semibold' : 'text-slate-600'
            }`}
          >
            Bajas
          </button>
        </div>
      </div>
    </header>
  );
};
