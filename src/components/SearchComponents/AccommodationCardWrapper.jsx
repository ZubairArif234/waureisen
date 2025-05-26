import React, { useEffect, useState } from "react";
import OriginalAccommodationCard from "../../components/HomeComponents/AccommodationCard";
import { fetchInterhomePrices } from "../../api/interhomeAPI";

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
  console.log(Code)
  const [formattedPricePerNight, setFormattedPricePerNight] = useState(null);

  useEffect(() => {
    const fetchPrice = async () => {
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
    };

    fetchPrice();
  }, [Code, price, pricePerNight, listingSource, provider]);

  return (
    <div className="h-full">
      <OriginalAccommodationCard
        id={id}
        images={images || []}
        price={formattedPricePerNight?.price || 0}
        location={location || "Accommodation"}
        provider={provider || "Unknown"}
        listingSource={listingSource}
        isFavorited={isFavorited || false}
        pricePerNight={formattedPricePerNight}
        code={Code}
      />
      {distance && (
        <div className="mt-1 text-xs text-gray-500">{distance}</div>
      )}
    </div>
  );
};

export default AccommodationCardWrapper;
