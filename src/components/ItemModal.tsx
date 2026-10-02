import React, { useState, useEffect, useRef } from 'react';
import { InventoryItem, ItemCategory, ItemStatus } from '../types/inventory';
import { OFFICIAL_AREAS, CATEGORY_DEFINITIONS, generateSuggestedCode } from '../data/areasCatalog';
import { X, Sparkles, AlertCircle, Calendar } from 'lucide-react';

// Converts DD/MM/AAAA or AAAA to YYYY-MM-DD for native HTML5 date picker
function toIsoDate(dateStr: string): string {
  if (!dateStr) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  if (/^\d{4}$/.test(dateStr)) {
    return `${dateStr}-01-01`;
  }
  return '';
}

// Converts YYYY-MM-DD back to standard DD/MM/AAAA
function fromIsoDate(isoStr: string): string {
  if (!isoStr) return '';
  const parts = isoStr.split('-');
  if (parts.length === 3) {
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    return `${day}/${month}/${year}`;
  }
  return isoStr;
}

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<InventoryItem>) => void;
  initialItem?: InventoryItem | null;
  defaultCategory?: ItemCategory;
  defaultAreaCode?: string;
  allExistingCodes: string[];
}

export const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem,
  defaultCategory = 'biomedicos',
  defaultAreaCode,
  allExistingCodes,
}) => {
  if (!isOpen) return null;

  const isEditing = Boolean(initialItem);

  const [category, setCategory] = useState<ItemCategory>(
    initialItem?.category || defaultCategory
  );
  const [areaCode, setAreaCode] = useState<string>(
    defaultAreaCode || OFFICIAL_AREAS[0].code
  );
  const [code, setCode] = useState<string>(initialItem?.code || '');
  const [name, setName] = useState<string>(initialItem?.name || '');
  const [type, setType] = useState<string>(initialItem?.type || '');
  const [property, setProperty] = useState<string>(initialItem?.property || 'IPS');
  const [quantity, setQuantity] = useState<number>(initialItem?.quantity || 1);
  const [brand, setBrand] = useState<string>(initialItem?.brand || '');
  const [model, setModel] = useState<string>(initialItem?.model || '');
  const [serial, setSerial] = useState<string>(initialItem?.serial || '');
  const [material, setMaterial] = useState<string>(initialItem?.material || '');
  const [invima, setInvima] = useState<string>(initialItem?.invima || '');
  const [accessories, setAccessories] = useState<string>(initialItem?.accessories || '');
  const [responsible, setResponsible] = useState<string>(
    initialItem?.responsible || 'Todas las Enfermeras'
  );
  const [status, setStatus] = useState<ItemStatus>(initialItem?.status || 'Bueno');
  const [purchaseDate, setPurchaseDate] = useState<string>(initialItem?.purchaseDate || '');
  const [purchaseValue, setPurchaseValue] = useState<string>(
    initialItem?.purchaseValue ? String(initialItem.purchaseValue) : ''
  );
  const [supplier, setSupplier] = useState<string>(initialItem?.supplier || '');
  const [usefulLifeYears, setUsefulLifeYears] = useState<string>(
    initialItem?.usefulLifeYears ? String(initialItem.usefulLifeYears) : ''
  );
  const [depreciationMethod, setDepreciationMethod] = useState<string>(
    initialItem?.depreciationMethod || 'Línea recta'
  );
  const [observations, setObservations] = useState<string>(initialItem?.observations || '');

  // Auto-generate suggested code if creating a new item
  useEffect(() => {
    if (!isEditing && (!code || code === '')) {
      const suggested = generateSuggestedCode(areaCode, category, allExistingCodes);
      setCode(suggested);
    }
  }, [areaCode, category, isEditing]);

  const handleRegenerateCode = () => {
    const suggested = generateSuggestedCode(areaCode, category, allExistingCodes);
    setCode(suggested);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedAreaObj = OFFICIAL_AREAS.find((a) => a.code === areaCode);
    const areaName = selectedAreaObj ? selectedAreaObj.name : areaCode;

    const payload: Partial<InventoryItem> = {
      ...(initialItem || {}),
      code: code.trim(),
      name: name.trim(),
      category,
      type: type.trim(),
      property,
      quantity: Number(quantity) || 1,
      brand: brand.trim(),
      model: model.trim(),
      serial: serial.trim(),
      material: material.trim(),
      invima: invima.trim(),
      accessories: accessories.trim(),
      location: areaCode,
      area: areaName,
      responsible: responsible.trim(),
      status,
      purchaseDate: purchaseDate.trim(),
      purchaseValue: purchaseValue ? Number(purchaseValue) : undefined,
      supplier: supplier.trim(),
      usefulLifeYears: usefulLifeYears ? Number(usefulLifeYears) : undefined,
      depreciationMethod,
      observations: observations.trim(),
      isNew: status === 'Nuevo' || purchaseDate.includes('2025') || purchaseDate.includes('2026'),
      updatedAt: new Date().toISOString(),
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {isEditing ? `Editar Activo: ${initialItem?.code}` : 'Registrar Nuevo Activo en Inventario'}
            </h3>
            <p className="text-xs text-slate-500">
              Formulario técnico adaptado según los lineamientos de Codificación CICOL IPS
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Category & Area Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Categoría / Hoja *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-600"
                required
              >
                {(Object.keys(CATEGORY_DEFINITIONS) as ItemCategory[]).map((catKey) => (
                  <option key={catKey} value={catKey}>
                    {CATEGORY_DEFINITIONS[catKey].name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Área / Consultorio Asignado *
              </label>
              <select
                value={areaCode}
                onChange={(e) => setAreaCode(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-600"
                required
              >
                {OFFICIAL_AREAS.map((a) => (
                  <option key={a.code} value={a.code}>
                    [{a.code}] {a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Code and Helper */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">
                Código del Activo (Formato: NNN-ÁREA-TIPO) *
              </label>
              {!isEditing && (
                <button
                  type="button"
                  onClick={handleRegenerateCode}
                  className="text-[11px] text-teal-700 hover:text-teal-900 inline-flex items-center gap-1 font-medium cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  Sugerir siguiente código
                </button>
              )}
            </div>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ej: 001-IMG-BM"
              required
              className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-600"
            />
          </div>

          {/* Name & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Nombre del Equipo / Artículo *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Ecógrafo Portátil / Computador Todo en 1"
                required
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Cantidad *
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-600"
              />
            </div>
          </div>

          {/* Technical Specs: Brand, Model, Serial/Placa */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Marca</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Ej. Mindray, HP, Alpinion"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Modelo</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Ej. Consona N8, ProBook"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Serial / Placa</label>
              <input
                type="text"
                value={serial}
                onChange={(e) => setSerial(e.target.value)}
                placeholder="Ej. SN# 98765432"
                className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-600"
              />
            </div>
          </div>

          {/* Category specific fields */}
          {category === 'biomedicos' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-emerald-900">
                  Registro Sanitario INVIMA
                </label>
                <input
                  type="text"
                  value={invima}
                  onChange={(e) => setInvima(e.target.value)}
                  placeholder="Ej. 2022DM-0025396"
                  className="w-full px-3 py-2 text-xs bg-white border border-emerald-200 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-emerald-900">
                  Accesorios Incluidos
                </label>
                <input
                  type="text"
                  value={accessories}
                  onChange={(e) => setAccessories(e.target.value)}
                  placeholder="Ej. Cable EKG, palas adulto, cable de poder"
                  className="w-full px-3 py-2 text-xs bg-white border border-emerald-200 rounded-lg"
                />
              </div>
            </div>
          )}

          {category === 'mobiliario' && (
            <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-100">
              <label className="text-xs font-semibold text-amber-900">
                Material del Mobiliario
              </label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="Ej. Madera, Metálico, Plástico, Vidrio, Cuero, Malla"
                className="w-full px-3 py-2 text-xs bg-white border border-amber-200 rounded-lg mt-1"
              />
            </div>
          )}

          {/* Operational Status, Property & Responsible */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Estado Físico *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ItemStatus)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-600"
              >
                <option value="Bueno">Bueno</option>
                <option value="Nuevo">Nuevo</option>
                <option value="Regular">Regular</option>
                <option value="Reparación">En Reparación / Falla</option>
                <option value="Baja">Dado de Baja</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Propiedad</label>
              <select
                value={property}
                onChange={(e) => setProperty(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-600"
              >
                <option value="IPS">IPS (Propia)</option>
                <option value="Edificio Atenas">Edificio Atenas</option>
                <option value="Alquilada">Alquilada (Tecnocopias/Otros)</option>
                <option value="Prestada">Prestada (Ing. Javier/Otros)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Responsable</label>
              <input
                type="text"
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                placeholder="Ej. Todas las Enfermeras / Dra. Gómez"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-600"
              />
            </div>
          </div>

          {/* Financial details: Value, Date, Supplier */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Valor de Compra (COP)
              </label>
              <input
                type="number"
                value={purchaseValue}
                onChange={(e) => setPurchaseValue(e.target.value)}
                placeholder="Ej. 2500000"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-600 font-mono-numbers"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-teal-700" />
                  <span>Fecha de Compra</span>
                </label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      const today = new Date();
                      const d = String(today.getDate()).padStart(2, '0');
                      const m = String(today.getMonth() + 1).padStart(2, '0');
                      const y = today.getFullYear();
                      setPurchaseDate(`${d}/${m}/${y}`);
                    }}
                    className="text-[10px] font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 px-1.5 py-0.5 rounded cursor-pointer"
                  >
                    Hoy
                  </button>
                  {purchaseDate && (
                    <button
                      type="button"
                      onClick={() => setPurchaseDate('')}
                      className="text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      Limpiar
                    </button>
                  )}
                </div>
              </div>
              <div className="relative flex items-center">
                <input
                  type="date"
                  value={toIsoDate(purchaseDate)}
                  onChange={(e) => {
                    if (e.target.value) {
                      setPurchaseDate(fromIsoDate(e.target.value));
                    } else {
                      setPurchaseDate('');
                    }
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-600 cursor-pointer"
                />
              </div>
              {purchaseDate && (
                <span className="text-[10px] text-slate-500 block">
                  Formato registrado: <strong className="font-mono text-slate-700">{purchaseDate}</strong>
                </span>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Proveedor / Empresa
              </label>
              <input
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="Ej. Alkosto, LAS Electromedicina"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-600"
              />
            </div>
          </div>

          {/* Observations */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Observaciones Técnicas / Estado de Mantenimiento
            </label>
            <textarea
              rows={2}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Detalles sobre averías, perillas, cables, garantías o notas de revisión..."
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-600"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              {isEditing ? 'Guardar Cambios' : 'Registrar Activo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
