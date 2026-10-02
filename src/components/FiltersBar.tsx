import React from 'react';
import { FilterState, ItemCategory, ViewMode } from '../types/inventory';
import { OFFICIAL_AREAS, CATEGORY_DEFINITIONS } from '../data/areasCatalog';
import { 
  Search, 
  Filter, 
  X, 
  LayoutList, 
  LayoutGrid, 
  Kanban, 
  AlertTriangle, 
  Sparkles,
  MapPin
} from 'lucide-react';

interface FiltersBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalFiltered: number;
  totalAll: number;
  activeCategory: ItemCategory | 'all';
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange,
  totalFiltered,
  totalAll,
  activeCategory,
}) => {
  const hasActiveFilters =
    filters.search !== '' ||
    filters.locationArea !== 'all' ||
    filters.status !== 'all' ||
    filters.property !== 'all' ||
    filters.onlyAlerts ||
    filters.onlyNew ||
    filters.onlyPendingSD;

  const handleResetFilters = () => {
    onFilterChange({
      ...filters,
      search: '',
      locationArea: 'all',
      status: 'all',
      property: 'all',
      onlyAlerts: false,
      onlyNew: false,
      onlyPendingSD: false,
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
      {/* Primary search bar & View layout mode toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por código, nombre, serial, marca, responsable..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-teal-600 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ ...filters, search: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View Switcher and Total counter */}
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
          <span className="text-xs text-slate-500 whitespace-nowrap">
            Mostrando <strong className="font-semibold text-slate-900 font-mono-numbers">{totalFiltered}</strong> de {totalAll}
          </span>

          <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200/80">
            <button
              onClick={() => onViewModeChange('table')}
              title="Vista en Tabla Compacta"
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs font-medium'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('cards')}
              title="Vista en Tarjetas Técnicas"
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-slate-900 shadow-xs font-medium'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('locations')}
              title="Vista Tablero de Ubicaciones / Consultorios"
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                viewMode === 'locations'
                  ? 'bg-white text-slate-900 shadow-xs font-medium'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filter Selectors */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
        {/* Location selector */}
        <div className="flex items-center">
          <select
            value={filters.locationArea}
            onChange={(e) => onFilterChange({ ...filters, locationArea: e.target.value })}
            className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-teal-600 cursor-pointer max-w-[200px] truncate"
          >
            <option value="all">Todas las Ubicaciones / Áreas</option>
            {OFFICIAL_AREAS.map((a) => (
              <option key={a.code} value={a.code}>
                [{a.code}] {a.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status selector */}
        <div className="flex items-center">
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value as any })}
            className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-teal-600 cursor-pointer"
          >
            <option value="all">Todos los Estados</option>
            <option value="Bueno">Bueno</option>
            <option value="Nuevo">Nuevo</option>
            <option value="Regular">Regular</option>
            <option value="Reparación">En Reparación / Falla</option>
            <option value="Baja">Dado de Baja</option>
          </select>
        </div>

        {/* Property / Ownership selector */}
        <div className="flex items-center">
          <select
            value={filters.property}
            onChange={(e) => onFilterChange({ ...filters, property: e.target.value })}
            className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-teal-600 cursor-pointer"
          >
            <option value="all">Toda Propiedad</option>
            <option value="IPS">Propiedad IPS</option>
            <option value="Edificio Atenas">Edificio Atenas</option>
            <option value="Alquilada">Alquilada / Terceros</option>
          </select>
        </div>

        {/* Quick Toggles */}
        <button
          type="button"
          onClick={() => onFilterChange({ ...filters, onlyAlerts: !filters.onlyAlerts })}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
            filters.onlyAlerts
              ? 'bg-amber-100/80 border-amber-300 text-amber-900 font-semibold'
              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>Alertas / Daños</span>
        </button>

        <button
          type="button"
          onClick={() => onFilterChange({ ...filters, onlyNew: !filters.onlyNew })}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
            filters.onlyNew
              ? 'bg-teal-100/80 border-teal-300 text-teal-900 font-semibold'
              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Nuevos (2024-2026)</span>
        </button>

        <button
          type="button"
          onClick={() => onFilterChange({ ...filters, onlyPendingSD: !filters.onlyPendingSD })}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
            filters.onlyPendingSD
              ? 'bg-blue-100/80 border-blue-300 text-blue-900 font-semibold'
              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span>Por Confirmar (SD)</span>
        </button>

        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer ml-auto"
          >
            <X className="w-3.5 h-3.5" />
            <span>Limpiar Filtros</span>
          </button>
        )}
      </div>
    </div>
  );
};
