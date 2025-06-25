import React from 'react'
import { useLanguage } from '../../utils/LanguageContext';
import { Baby, Car, Coffee, Dog, Dumbbell, Eye, Filter, Flame, Home, MapPin } from 'lucide-react';

const AccomodarionFilters = ({ isOpen, onClose, filterData }) => {


       const { t } = useLanguage();
  if (!isOpen) return null;

  const getSubsectionIcon = (subsectionName) => {
  const iconMap = {
    'Dog Facilities': Dog,
    'Facilities Parking': Car,
    'Facilities Wellness': Dumbbell,
    'Facilities Accommodation Features': Home,
    'Facilities Kids': Baby,
    'Facilities Kitchen': Coffee,
    'Facilities Main Filters': Filter,
    'Facilities Smoking': Flame,
    'Facilities Sport': Dumbbell,
    'Facilities To Do Nearby': MapPin,
    'Facilities View': Eye,
  };

  return iconMap[subsectionName]  || ""; // Default to Lock if no match
};

// Subsection Icon component
const SubsectionIcon = ({ name }) => {
  const Icon = getSubsectionIcon(name);
  if (Icon !== ""){

    return <Icon className="w-4 h-4 text-[#767676]" />;
  }
  else{
    return;
  }
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 h-[65vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t('details')}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        <div className=" flex-col md:flex-row gap-4">
   
      {filterData &&
        filterData.subsections &&
        filterData.subsections.map(
          (subsection, index) =>
            subsection &&
            subsection.name === "Amenities" && (
              <div key={index}>
                {subsection.subsubsections &&
                  subsection.subsubsections.map(
                    (subsubsection, subIndex) =>
                      subsubsection &&
                      subsubsection.filters &&
                      subsubsection.filters.length > 0 && (
                        <div key={subIndex} className='mb-4 !w-full'>
                          <h3 className="text-[#4D484D] flex items-center gap-2 md:text-lg text-md font-semibold mb-2">
                          <SubsectionIcon name={subsubsection.name} />  {t(subsubsection.name) }
                          </h3>
                          <div className="!w-full ">
                            {subsubsection.filters.map(
                              (filter, filterIndex) => (
                                <div
                                  key={filterIndex}
                                  className="  px-3 py-5 border-b border-slate-300"
                                >
                                  {/* {React.createElement(
                                    getAmenityIcon(filter.name?.toLowerCase()),
                                    { className: "w-5 h-5 text-[#767676]" }
                                  )} */}
                                  <span className="text-gray-700 text-sm">
                                    {t(filter.name)}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )
                  )}
              </div>
            )
        )}

      {(!filterData ||
        !filterData.subsections ||
        filterData.subsections.length === 0) &&
        accommodation?.attributes && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {accommodation.attributes.map((attr, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 border rounded-lg"
              >
                {/* {React.createElement(getAmenityIcon(attr.name?.toLowerCase()), {
                  className: "w-5 h-5 text-[#767676]",
                })} */}
                <span className="text-gray-700 text-sm">{attr.name}</span>
              </div>
            ))}
          </div>
        )}
        </div>

       
      </div>
    </div>
  );

  
}

export default AccomodarionFilters