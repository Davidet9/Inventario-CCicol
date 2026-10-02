import React from 'react';
import { InventoryItem, ItemCategory } from '../types/inventory';
import { CATEGORY_DEFINITIONS, OFFICIAL_AREAS } from '../data/areasCatalog';
import { 
  Activity, 
  Cpu, 
  Armchair, 
  FileText, 
  ArchiveX, 
  TrendingUp, 
  AlertTriangle, 
  Sparkles, 
  MapPin, 
  DollarSign, 
  ArrowUpRight,
  ArrowLeftRight,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface DashboardViewProps {
  items: InventoryItem[];
  onNavigateToCategory: (category: ItemCategory) => void;
  onFilterAlerts: () => void;
  onFilterNew: () => void;
  onFilterPendingSD: () => void;
  onOpenTransfer: (item?: InventoryItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  items,
  onNavigateToCategory,
  onFilterAlerts,
  onFilterNew,
  onFilterPendingSD,
  onOpenTransfer,
}) => {
  // Global Metrics
  const totalAssets = items.length;
  const activeAssets = items.filter((i) => i.category !== 'bajas');
  const decommissionedCount = items.filter((i) => i.category === 'bajas').length;

  const totalValuation = items.reduce((sum, item) => sum + (item.purchaseValue || 0), 0);

  const newItems = items.filter((i) => i.isNew || i.status === 'Nuevo');
  const alertItems = items.filter(
    (i) =>
      i.status === 'Reparación' ||
      i.status === 'Regular' ||
      (i.observations && /dañad|error|falla|fuga|interferencia|desgastad|oxidado|revis/i.test(i.observations))
  );
  const pendingSDItems = items.filter((i) => i.isPendingAreaConfirmation || i.code.includes('SD') || i.location === 'SD');

  // Counts by category
  const categoryCounts: Record<ItemCategory, { count: number; totalValue: number }> = {
    biomedicos: { count: 0, totalValue: 0 },
    tecnologicos: { count: 0, totalValue: 0 },
    mobiliario: { count: 0, totalValue: 0 },
    papeleria: { count: 0, totalValue: 0 },
    bajas: { count: 0, totalValue: 0 },
  };

  items.forEach((item) => {
    if (categoryCounts[item.category]) {
      categoryCounts[item.category].count += 1;
      categoryCounts[item.category].totalValue += item.purchaseValue || 0;
    }
  });

  // Location breakdown
  const locationCounts: Record<string, number> = {};
  activeAssets.forEach((item) => {
    const loc = item.area || item.location || 'Sin Asignar';
    locationCounts[loc] = (locationCounts[loc] || 0) + 1;
  });

  const topLocations = Object.entries(locationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const categoryIcons: Record<ItemCategory, React.ReactNode> = {
    biomedicos: <Activity className="w-5 h-5 text-emerald-600" />,
    tecnologicos: <Cpu className="w-5 h-5 text-indigo-600" />,
    mobiliario: <Armchair className="w-5 h-5 text-amber-600" />,
    papeleria: <FileText className="w-5 h-5 text-slate-600" />,
    bajas: <ArchiveX className="w-5 h-5 text-rose-600" />,
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Strategic Header & Highlights */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Dashboard Estratégico de Activos Clínicos
              </h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Monitoreo ejecutivo de inventarios, valorizaciones económicas, ciclo de vida y control de traslados físicos entre sedes y consultorios.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenTransfer()}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors cursor-pointer"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Traslado Rápido de Ubicación</span>
            </button>
          </div>
        </div>

        {/* Primary KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500">Total Activos Registrados</span>
            <div className="text-2xl font-bold text-slate-900 font-mono-numbers">
              {totalAssets}
            </div>
            <div className="text-xs text-slate-400">
              {activeAssets.length} activos en servicio
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500">Valorización Estimada</span>
            <div className="text-2xl font-bold text-emerald-700 font-mono-numbers">
              ${(totalValuation / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-slate-400 font-mono-numbers">
              ${totalValuation.toLocaleString('es-CO')} COP
            </div>
          </div>

          <div 
            onClick={onFilterNew}
            className="space-y-1 cursor-pointer group hover:bg-teal-50/50 p-1.5 -m-1.5 rounded-lg transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-teal-800">Nuevas Adquisiciones</span>
              <Sparkles className="w-3.5 h-3.5 text-teal-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-bold text-teal-800 font-mono-numbers">
              {newItems.length}
            </div>
            <div className="text-xs text-teal-600">
              Compras recientes (2024-2026)
            </div>
          </div>

          <div 
            onClick={onFilterAlerts}
            className="space-y-1 cursor-pointer group hover:bg-amber-50/50 p-1.5 -m-1.5 rounded-lg transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-amber-800">Alertas / Falla / Revisión</span>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-bold text-amber-700 font-mono-numbers">
              {alertItems.length}
            </div>
            <div className="text-xs text-amber-600">
              Requieren atención técnica
            </div>
          </div>

          <div 
            onClick={onFilterPendingSD}
            className="space-y-1 cursor-pointer group hover:bg-blue-50/50 p-1.5 -m-1.5 rounded-lg transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">Áreas por Confirmar (SD)</span>
              <MapPin className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-bold text-slate-800 font-mono-numbers">
              {pendingSDItems.length}
            </div>
            <div className="text-xs text-slate-500">
              Código provisorio pendiente
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-600">
            Inventario Clasificado por Hojas del Libro Maestro
          </h2>
          <span className="text-xs text-slate-500">
            Haga clic en una categoría para gestionar sus registros
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {(Object.keys(CATEGORY_DEFINITIONS) as ItemCategory[]).map((catKey) => {
            const def = CATEGORY_DEFINITIONS[catKey];
            const data = categoryCounts[catKey];
            const percent = totalAssets > 0 ? ((data.count / totalAssets) * 100).toFixed(0) : 0;

            return (
              <div
                key={catKey}
                onClick={() => onNavigateToCategory(catKey)}
                className="bg-white border border-slate-200 hover:border-teal-500/60 rounded-xl p-4 shadow-xs hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-teal-50 transition-colors">
                      {categoryIcons[catKey]}
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 transition-colors" />
                  </div>

                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-teal-900 transition-colors">
                    {def.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                    {def.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-bold text-slate-900 font-mono-numbers">
                      {data.count}
                    </span>
                    <span className="text-xs text-slate-400 font-mono-numbers">
                      {percent}% total
                    </span>
                  </div>
                  {data.totalValue > 0 && (
                    <div className="text-[11px] text-emerald-700 font-medium font-mono-numbers mt-0.5">
                      ${data.totalValue.toLocaleString('es-CO')}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section: New Items Spotlight & Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spotlight: Nuevas Adquisiciones (2024-2026) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Nuevas Adquisiciones y Equipos Recientes
              </h3>
            </div>
            <button
              onClick={onFilterNew}
              className="text-xs font-medium text-teal-700 hover:text-teal-900"
            >
              Ver todos ({newItems.length})
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2 max-h-80 overflow-y-auto pr-1">
            {newItems.slice(0, 6).map((item) => (
              <div key={item.id} className="py-2.5 flex items-start justify-between gap-3 group">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-slate-800">
                      {item.code}
                    </span>
                    <span className="text-[11px] font-medium text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded-sm">
                      {item.purchaseDate || 'Nuevo'}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-900 leading-snug">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    {item.brand} {item.model ? `· ${item.model}` : ''} · <span className="font-medium text-slate-700">{item.area}</span>
                  </p>
                </div>
                {item.purchaseValue && (
                  <div className="text-right shrink-0">
                    <span className="text-xs font-semibold text-slate-900 font-mono-numbers">
                      ${item.purchaseValue.toLocaleString('es-CO')}
                    </span>
                    <p className="text-[10px] text-slate-500">
                      {item.supplier || 'IPS'}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Attention: Items with Technical Alerts or Decommission Risks */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Control de Alertas Técnicas y Observaciones
              </h3>
            </div>
            <button
              onClick={onFilterAlerts}
              className="text-xs font-medium text-amber-700 hover:text-amber-900"
            >
              Ver todas ({alertItems.length})
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2 max-h-80 overflow-y-auto pr-1">
            {alertItems.slice(0, 6).map((item) => (
              <div key={item.id} className="py-2.5 flex items-start justify-between gap-3 group">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-slate-800">
                      {item.code}
                    </span>
                    <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-sm ${
                      item.status === 'Reparación' 
                        ? 'text-rose-700 bg-rose-50' 
                        : 'text-amber-800 bg-amber-50'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-900 leading-snug">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-amber-900 bg-amber-50 border border-amber-200/80 p-1.5 rounded-md leading-normal">
                    {item.observations || 'Requiere inspección técnica'}
                  </p>
                </div>
                <button
                  onClick={() => onOpenTransfer(item)}
                  title="Reubicar o enviar a taller/bodega"
                  className="px-2.5 py-1 text-[11px] font-medium text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-md transition-colors cursor-pointer shrink-0"
                >
                  Trasladar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Multi-Location Overview */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Distribución de Activos por Consultorios y Áreas Físicas
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            {Object.keys(locationCounts).length} áreas activas registradas
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {topLocations.map(([areaName, count]) => {
            return (
              <div 
                key={areaName}
                className="p-3 bg-slate-50/80 rounded-lg border border-slate-100 flex items-center justify-between"
              >
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-semibold text-slate-800 truncate" title={areaName}>
                    {areaName}
                  </p>
                  <span className="text-[11px] text-slate-500">
                    Sede Principal
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-bold text-slate-900 font-mono-numbers">
                    {count}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    ítems
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
