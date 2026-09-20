import React from 'react';
import { Property } from '../types';
import { PropertyCard } from './PropertyCard';
import { Building2, PlusCircle, Sparkles } from 'lucide-react';

interface ManagePropertiesViewProps {
  userProperties: Property[];
  onSelectProperty: (property: Property) => void;
  onEditProperty: (property: Property) => void;
  onDeleteProperty: (propertyId: string) => void;
  onAddNewProperty: () => void;
}

export const ManagePropertiesView: React.FC<ManagePropertiesViewProps> = ({
  userProperties,
  onSelectProperty,
  onEditProperty,
  onDeleteProperty,
  onAddNewProperty,
}) => {
  return (
    <div id="manage-properties-section" className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>Seller Dashboard</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Listed Properties ({userProperties.length})
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            You can modify details, update pricing, or remove your listings at any time.
          </p>
        </div>

        <button
          id="add-new-property-dashboard-btn"
          onClick={onAddNewProperty}
          className="flex items-center space-x-2 px-5 py-2.5 bg-[#0B192C] hover:bg-[#1E3E62] text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-blue-400" />
          <span>Add New Property</span>
        </button>
      </div>

      {userProperties.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 shadow-xs max-w-xl mx-auto px-6">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">You Haven't Listed Any Properties</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            Put your House, Apartment, or Plot in front of qualified buyers with our seamless listing workflow.
          </p>
          <button
            onClick={onAddNewProperty}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0B192C] hover:bg-[#1E3E62] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-blue-400" />
            <span>List Your First Property</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {userProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onSelect={onSelectProperty}
              onEdit={onEditProperty}
              onDelete={onDeleteProperty}
              isOwner={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};
