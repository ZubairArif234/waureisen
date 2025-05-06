import React from 'react'
import { useLanguage } from '../../utils/LanguageContext';

const AccomodarionFilters = ({ isOpen, onClose, filterData }) => {


       const { t } = useLanguage();
  if (!isOpen) return null;



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 h-[65vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t('details')}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
   
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
                        <div key={subIndex} className='mb-4'>
                          <h3 className="text-[#4D484D] md:text-lg text-md font-semibold mb-2">
                            {subsubsection.name}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {subsubsection.filters.map(
                              (filter, filterIndex) => (
                                <div
                                  key={filterIndex}
                                  className="flex items-center gap-3 p-3 border rounded-lg"
                                >
                                  {/* {React.createElement(
                                    getAmenityIcon(filter.name?.toLowerCase()),
                                    { className: "w-5 h-5 text-[#767676]" }
                                  )} */}
                                  <span className="text-gray-700 text-sm">
                                    {filter.name}
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