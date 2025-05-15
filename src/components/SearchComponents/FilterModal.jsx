import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../../utils/LanguageContext';
import API from '../../api/config';

const FilterModal = ({ 
  isOpen, 
  onClose, 
  title, 
  activeModal,
  selectedFilters,
  onFilterChange,
  onApply,
  onClear
}) => {
  const [subsubsectionFilters, setSubsubsectionFilters] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const filterNameToTranslationKey = {
    "Dog Facilities": "dog_facilities",
    "Facilities Parking": "facilities_parking",
    "Facilities Wellness": "facilities_wellness",
  };

  const filterOptionNameToTranslationKey = {
    "Private Garden": "private_garden",
    "No Leash Required": "no_leash_required",
    "Fenced Garden 100 cm": "fenced_garden_100_cm",
    "Fenced Terrace": "fenced_terrace",
    "Dog Stays Free of Charge": "dog_stays_free_of_charge",
    "Fenced Garden": "fenced_garden",
    "Off-leash Meadow": "off_leash_meadow",
    "Dog-friendly Beach Nearby": "dog_friendly_beach_nearby",
    "Dog-friendly Restaurants": "dog_friendly_restaurants",
    "Firework Free Zone": "firework_free_zone",
    "Allowed at the Pool Area": "allowed_at_the_pool_area",
    "Fenced Garden 150 cm": "fenced_garden_150_cm",
    "Leash Required": "leash_required",
    "Fenced Garden 200 cm": "fenced_garden_200_cm",
    "Poop Bags for Free": "poop_bags_for_free",
    "Dog School": "dog_school",
    "Organized Hiking Tours with Dogs": "organized_hiking_tours_with_dogs",
    "Food Bowl": "food_bowl",
    "Water Bowl": "water_bowl",
    "Dog Bed": "dog_bed",
    "Fenced Dog Park": "fenced_dog_park",
    "Service Dog": "service_dog",
    "Allowed in the Restaurant": "allowed_in_the_restaurant",
    "Agility park nearby": "agility_park_nearby",
    "Dog sitter on site": "dog_sitter_on_site",
    "Fenced Garden 120cm": "fenced_garden_120cm",
    "Dog blanket": "dog_blanket",
    "Dog mat": "dog_mat",
    "Dog shower": "dog_shower",
    "Dog treats": "dog_treats",
    "Mantrailing": "mantrailing",
    "BARF menus available": "barf_menus_available",
    "Dog forest nearby": "dog_forest_nearby",
    "Dog park (not fenced)": "dog_park_not_fenced",
    "Permitted on the bed": "permitted_on_the_bed",
    "Permitted on the sofa": "permitted_on_the_sofa",
    "Dog menu available": "dog_menu_available",
    "Dog crate": "dog_crate",
    "Dog kennel": "dog_kennel",
    "Dog room service": "dog_room_service",
    "Physiotherapy for dogs": "physiotherapy_for_dogs",
    "Dog shop on site": "dog_shop_on_site",
    "Dog trainer": "dog_trainer",
    "Dog towels": "dog_towels",
    "Cage": "cage",
    "Sign for \"Dog is a guest here\"": "sign_dog_is_a_guest_here",
    "Wellness for dogs": "wellness_for_dogs",
    "Outdoor": "outdoor",
    "Parking at the Accommodation": "parking_at_the_accommodation",
    "Underground": "underground",
    "Parking Street": "parking_street",
    "E Charge": "e_charge",
    "Sauna": "sauna",
    "Thermal Bath": "thermal_bath",
    "Steambath": "steambath",
    "Hamam": "hamam",
    "Massage": "massage",
    "Relaxation Zone": "relaxation_zone",
    "Aquafitt": "aquafitt",
  };

  useEffect(() => {
    if (isOpen && title) {
      setLoading(true);
      API.get(`/filters/template?title=${encodeURIComponent(title)}`)
        .then(response => response.data)
        .then(data => {
          const filters = data.subsections
            .flatMap(section => section.subsubsections)
            .find(sub => sub.name === title)?.filters;
          setSubsubsectionFilters(filters);
        })
        .catch(error => console.error('Error fetching filters:', error))
        .finally(() => setLoading(false));
    }
  }, [isOpen, title]);

  if (!isOpen) return null;

  const handleFilterToggle = (filterName) => {
    const isSelected = selectedFilters.includes(filterName);
    onFilterChange(filterName, !isSelected);
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-[100]"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-white rounded-t-2xl md:rounded-2xl shadow-xl z-[100] max-h-[90vh] md:max-h-[75vh] md:w-[400px] w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-3 border-b">
          <h2 className="text-base font-semibold text-gray-900">{t(filterNameToTranslationKey[title] || title)}</h2>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 min-h-0">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand"></div>
            </div>
          ) : (
            (subsubsectionFilters || activeModal?.subsubsection?.filters)?.map(filter => (
              <div key={filter._id} className="space-y-3">
                <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFilters.includes(filter.name)}
                    onChange={() => handleFilterToggle(filter.name)}
                    className="w-5 h-5 rounded border-gray-300 text-brand focus:ring-brand"
                  />
                  <span className="text-gray-700">{t(filterOptionNameToTranslationKey[filter.name] || filterNameToTranslationKey[filter.name] || filter.name)}</span>
                </label>
              </div>
            ))
          )}
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="flex-shrink-0 p-3 border-t bg-white mt-auto">
          <div className="flex gap-2 safe-bottom">
            <button
              onClick={onClear}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {t('clear')}
            </button>
            <button
              onClick={onApply}
              className="flex-1 px-3 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand/90 transition-colors"
            >
              {t('apply')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterModal;