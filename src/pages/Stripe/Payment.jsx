import React, { useEffect, useState } from "react";
import CheckoutForm from "../../components/Stripe/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";

import { loadStripe } from "@stripe/stripe-js";
import { createPaymentIntent } from "../../api/paymentAPI";
import { useLocation } from "react-router-dom";
import moment from "moment";
import logo from "../../assets/logo.png";
import { changeMetaData } from "../../utils/extra";

const stripePromise = loadStripe(
  "pk_live_51QPmjyRuFURKkwuQNbUR2Wyy4J5ZPIyFQmZ7FlsnlbXDu2qqrGWpQkZPbm2YbCKtd0jDjQ6DGr4GE1iEQfW58Hj600b2XlHbLb"
);

const Payment = () => {
  useEffect(() => {
    changeMetaData(`Pay - Waureisen`);
  }, []);

  const location = useLocation();
  const { price, data, details } = location?.state;
  const [loading, setLoading] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState({
    clientSecret: "",
    paymentIntentId: "",
  });

  console.log(location);

  // Helper function to get the correct booking price
  const getCorrectBookingPrice = () => {
    // First check if finalBookingPrice is set (from AccommodationPage)
    if (data?.pricePerNight?.finalBookingPrice) {
      return data.pricePerNight.finalBookingPrice;
    }
    
    // Fallback to the same logic as AccommodationPage
    if (data?.pricePerNight?.isDiscountActivate && data?.pricePerNight?.discount) {
      return data.pricePerNight.discount;
    }
    
    return data?.pricePerNight?.price || 0;
  };

  // Get pricing values - prioritize pre-calculated values from details
  const pricePerNight = getCorrectBookingPrice();
  const numberOfDays = details?.noOfDays > 0 ? details.noOfDays : 1;
  
  // Use pre-calculated values from AccommodationPage if available, otherwise calculate
  const baseAmount = details?.totalAmount || (pricePerNight * numberOfDays);
  const serviceChargeAmount = details?.serviceCharge || (baseAmount * 0.029);
  const finalAmount = details?.finalAmount || (baseAmount + serviceChargeAmount);

  const getPaymentIntent = async () => {
    if (!pricePerNight) return;

    // payment delay days
    const today = moment().startOf("day");
    const checkInDate = moment(details?.startDate).startOf("day");
    const diffDays = checkInDate.diff(today, "days");
    
    setLoading(true);
    
    try {
      const res = await createPaymentIntent({
        amount: Math.round(finalAmount), // Use the final calculated amount
        currency: data?.pricePerNight?.currency,
        listingId: data?._id,
        providerId: data?.owner?._id,
        checkInDate: moment(details.startDate).startOf("day").utc().toDate(),
        checkOutDate: moment(details.endDate).endOf("day").utc().toDate(),
        providerAccountId: data?.owner?.stripeAccountId,
        paymentDelayDays: diffDays,
      });
      
      setPaymentIntent({
        clientSecret: res.data.clientSecret,
        paymentIntentId: res.data.paymentIntentId, // Fixed typo: was paymentIntentIday
      });
    } catch (error) {
      console.error("Payment intent creation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPaymentIntent();
  }, []);

  const options = {
    clientSecret: paymentIntent.clientSecret,
  };

  return (
    <div className="grid grid-cols-2 gap-4 items-start h-screen py-10 px-20">
      <div>
        <img src={logo} alt="Wau Logo" className="h-16 mb-6" />
        <p className="text-xl font-medium mb-2">
          {data?.title}{" "}
          <span className="text-slate-400 font-light text-sm">
            {data?.Code}
          </span>
        </p>
        <p className="text-slate-400 font-light text-sm">
          {data?.description?.general}
        </p>

        {data?.provider !== "Interhome" && (
          <div className="my-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-700">No of guests</p>
              <p>{details?.guests?.people || 0}</p>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-700">No of dogs</p>
              <p>{details?.guests?.dogs || 0}</p>
            </div>

            <div className="border-t border-gray-200 my-4"></div>

            {/* Updated pricing display using correct values */}
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-700">
                {pricePerNight} x {numberOfDays}
              </p>
              <p>{baseAmount.toFixed(2)}</p>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-700">Service charge (2.9%)</p>
              <p className="text-sm text-gray-700">
                {serviceChargeAmount.toFixed(2)}
              </p>
            </div>

            <div className="border-t border-gray-200 my-4"></div>

            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>
                {finalAmount.toFixed(2)} {data?.pricePerNight?.currency || "CHF"}
              </span>
            </div>

            {/* Optional: Show discount information if applicable */}
            {data?.pricePerNight?.isDiscountActivate && data?.pricePerNight?.discount && (
              <div className="mt-2 text-sm text-green-600">
                <span className="line-through text-gray-400">
                  Original: {data?.pricePerNight?.price} {data?.pricePerNight?.currency}
                </span>
                <span className="ml-2 font-medium">
                  Discounted: {data?.pricePerNight?.discount} {data?.pricePerNight?.currency}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {paymentIntent?.clientSecret && !loading && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
};

export default Payment;