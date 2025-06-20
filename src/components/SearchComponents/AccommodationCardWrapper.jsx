import React, { useEffect, useState } from "react";
import OriginalAccommodationCard from "../../components/HomeComponents/AccommodationCard";
import { fetchInterhomePrices } from "../../api/interhomeAPI";
import { useSearchFilters } from "../../context/SearchFiltersContext";
import SkeletonCard from "./SkeletonCard";

const AccommodationCardWrapper = ({
  id,
  Code, // Required for Interhome pricing
  images,
  price,
  location,
  provider,
  listingSource,
  isFavorited,
  pricePerNight,
  distance
}) => {
  const [formattedPricePerNight, setFormattedPricePerNight] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { searchFilters } = useSearchFilters();
console.log(price,pricePerNight,distance);

  useEffect(() => {
    const fetchPrice = async () => {
      setIsLoading(true);
      const isInterhome =
        (listingSource?.toLowerCase() === "interhome" ||
         provider?.toLowerCase() === "interhome") &&
        Code;

      if (isInterhome) {
        try {
          const today = new Date();
          const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

          const priceData = await fetchInterhomePrices({
            accommodationCode: Code,
            checkInDate: formattedDate,
            pax: 2,
            los: true,
          });

          if (priceData?.priceList?.prices?.price?.length > 0) {
            const duration7Options = priceData.priceList.prices.price
              .filter((option) => option.duration === 7)
              .sort((a, b) => a.paxUpTo - b.paxUpTo);

            if (duration7Options.length > 0) {
              const selectedOption = duration7Options[0];
              const calculatedPricePerNight = Math.round(selectedOption.price / 7);

              setFormattedPricePerNight({
                price: calculatedPricePerNight,
                currency: priceData.priceList.currency || "CHF",
                totalPrice: selectedOption.price,
                duration: 7,
                paxUpTo: selectedOption.paxUpTo,
              });
              setIsLoading(false);
              return;
            }
          }
        } catch (error) {
          console.warn(`Failed to fetch Interhome prices for ${Code}:`, error);
        }
      }

      // Fallback if not Interhome or if dynamic price fetch failed
      setFormattedPricePerNight(
        pricePerNight || { price: price || 0, currency: "CHF" }
      );
      setIsLoading(false);
    };

    fetchPrice();
  }, [Code, price, pricePerNight, listingSource, provider]);

  // Check if the listing should be visible based on price range
  const shouldShowListing = () => {
    const currentPrice = formattedPricePerNight?.price || pricePerNight?.price || price || 0;
    const { min, max } = searchFilters.ranges.price || { min: 0, max: 10000 };
    return currentPrice >= min && currentPrice <= max;
  };

  // Show skeleton while loading
  if (isLoading) {
    return <SkeletonCard />;
  }

  // If the listing price is outside the selected range, don't render it
  // if (!shouldShowListing()) {
  //   return null;
  // }

  return (
    <div className="h-full">
      <OriginalAccommodationCard
        id={id}
        images={images || []}
        price={ formattedPricePerNight?.price || 0}
        location={location || "Accommodation"}
        provider={provider || "Unknown"}
        listingSource={listingSource}
        isFavorited={isFavorited || false}
        pricePerNight={ formattedPricePerNight}
        code={Code}
      />
      {distance && (
        <div className="mt-1 text-xs text-gray-500">{distance}</div>
      )}
    </div>
  );
};

export default AccommodationCardWrapper;
