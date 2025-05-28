import React, { useEffect, useState } from "react";
import {  useLanguage } from "../../src/utils/LanguageContext";
import {
  Utensils,
  Dog,
  Briefcase,
  Wind,
  Sparkles,
  Wifi,
  Waves,
  Tv,
} from "lucide-react";
import API from "../api/config";
import AccomodarionFilters from "./HomeComponents/AccomodarionFilters";

const getAmenityIcon = (amenityName) => {
  const iconMap = {
    kitchen: Utensils,
    dogs_allowed: Dog,
    workspace: Briefcase,
    air_conditioning: Wind,
    firework_free: Sparkles,
    wifi: Wifi,
    swimming_pool: Waves,
    tv: Tv,
  };

  return iconMap[amenityName?.toLowerCase()] || Sparkles;
};

const AccommodationDetails = ({ accommodation }) => {
  
    const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { t } = useLanguage();
  const [filterData, setFilterData] = useState(null);
  const [allFilters, setAllFilters] = useState([]);

  // console.log(accommodation);

  const fetchFilters = async () => {
    try {
      if (accommodation?.filters) {
        const response = await API.get(`/filters/${accommodation.filters}`);
        // console.log(response);

        // const data = await response.json();
        setFilterData(response?.data);
      }
    } catch (error) {
      console.error("Error fetching filters:", error);
    }
  };
  useEffect(() => {
    fetchFilters();
  }, [accommodation?.filters]);

  useEffect(() => {
    if (filterData) {
      // const filters = [];
  
      const amenityNames =
  filterData?.subsections
    ?.filter((sub) => sub.name === "Amenities")
    ?.flatMap((sub) =>
      sub.subsubsections?.flatMap((subsub) =>
        subsub.filters?.map((filter) => filter.name) || []
      ) || []
    ) || [];
  
      setAllFilters(amenityNames);
    }
  }, [filterData]);
  


  const description = accommodation?.description;

  const formattedDescription =
    description && typeof description === "object"
      ? Object.values(description).join(" ")
      : description || "No description available.";

  return (
    <section className="mb-10">
      <h2 className="text-[#4D484D] md:text-xl text-lg font-semibold mb-4">
        {t("description")}
      </h2>
      <p className="text-gray-600 whitespace-pre-line text-sm">
        {formattedDescription}
      </p>

      <h2 className="text-[#4D484D] md:text-xl text-lg font-semibold mb-4 mt-6">
        {t("details")}
      </h2>
{/* 
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
                        <div key={subIndex}>
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
                                  {React.createElement(
                                    getAmenityIcon(filter.name?.toLowerCase()),
                                    { className: "w-5 h-5 text-[#767676]" }
                                  )}
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
                {React.createElement(getAmenityIcon(attr.name?.toLowerCase()), {
                  className: "w-5 h-5 text-[#767676]",
                })}
                <span className="text-gray-700 text-sm">{attr.name}</span>
              </div>
            ))}
          </div>
        )} */}
        <div className="grid grid-cols-2 gap-4">

        { allFilters?.slice(0,6)?.map((item,i)=>{
          return(
            <p className="text-gray-700 text-md py-2 " key={i}>{t(item)}</p>
          )
        })}
        </div>
        {allFilters?.length > 6 && 
        <button onClick={() => setIsFilterOpen(true)} className="bg-brand text-white px-8 py-2 rounded-lg font-medium hover:bg-brand-dark transition-colors">See All</button>
        }
       {filterData && (
  <div className="absolute z-10 mt-2 w-full">

         <AccomodarionFilters
         isOpen={isFilterOpen}
         onClose={() => setIsFilterOpen(false)}
         
         filterData={filterData || []} // Pass available dates
         />
         </div>
        )}
    </section>
  );
};

export default AccommodationDetails;
