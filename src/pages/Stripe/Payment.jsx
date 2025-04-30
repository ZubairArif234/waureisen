import React, { useEffect, useState } from "react";
import CheckoutForm from "../../components/Stripe/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";

import { loadStripe } from "@stripe/stripe-js";
import { createPaymentIntent } from "../../api/paymentAPI";
import { useLocation } from "react-router-dom";
import moment from "moment";
import logo from "../../assets/logo.png";
const stripePromise = loadStripe(
  "pk_test_51QPmjyRuFURKkwuQO9cccKtZGjlFh5ULmjUIxPWlpCj3zKdUk3MAnKnntIB5hIzNUOp6qHJHbxjRCosLzQW0TNKG00Z6iVynXH"
);
const Payment = () => {
  const location = useLocation();
  const { price, data, details } = location?.state;
  const [loading, setLoading] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState({
    clientSecret: "",
    paymentIntentId: "",
  });
  const getPaymentIntent = async () => {
    if (!data?.pricePerNight?.price) return;

    const noOfDays = details?.noOfDays > 0 ? details.noOfDays : 1;
    const pricePerNight = data.pricePerNight.price;

    const amount = pricePerNight * noOfDays * 1.029;

    // payment delay days
    const today = moment().startOf("day");
    const checkInDate = moment(details?.startDate).startOf("day");

    const diffDays = checkInDate.diff(today, "days");
    setLoading(true);
    const res = await createPaymentIntent({
      amount: Math.round(amount),
      currency: data?.pricePerNight?.currency,
      listingId: data?._id,
      checkInDate: new Date(details?.startDate),
      checkOutDate: new Date(details?.endDate),
      providerAccountId: "809jujj9ehfhjf99g",
      paymentDelayDays: diffDays,
      
    });
    setPaymentIntent({
      clientSecret: res.data.clientSecret,
      paymentIntentId: res.data.paymentIntentIday,
    });
    setLoading(false);
  };

  useEffect(() => {
    getPaymentIntent();
  }, []);

  console.log(location, details?.pricePerNight?.currency);

  const options = {
    clientSecret: paymentIntent.clientSecret,
  };
  return (
    <div className="grid grid-cols-2 gap-4  items-start h-screen py-10 px-20">
      <div>
      <img src={logo} alt="Wau Logo" className="h-16 mb-6" />
        <p className="text-xl font-medium  mb-2 ">
          {data?.title}{" "}
          <span className="text-slate-400 font-light text-sm">
            {data?.Code}
          </span>
        </p>
        <p className="text-slate-400 font-light text-sm ">
          {data?.description?.general}{" "}
          
        </p>
       
        {data?.provider != "Interhome" && (
          <div className="my-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-700">
                No of guests
              </p>
              <p>
                {details?.guests?.people 
                  || 0}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-700">
                No of dogs
              </p>
              <p>
                {details?.guests?.dogs || 0}
              </p>
            </div>

            <div className="border-t border-gray-200 my-4"></div>


            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-700">
                {data?.pricePerNight?.price} x{" "}
                {details?.noOfDays > 0 ? details?.noOfDays : 1}
              </p>
              <p>
                {data?.pricePerNight?.price *
                  (details?.noOfDays > 0 ? details?.noOfDays : 1)}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-700">Service charge (2.9%)</p>
              <p className="text-sm text-gray-700">
                {(
                  data?.pricePerNight?.price *
                  (details?.noOfDays > 0 ? details?.noOfDays : 1) *
                  0.029
                ).toFixed(2)}
              </p>
            </div>

            <div className="border-t border-gray-200 my-4"></div>

            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>
                {(
                  data?.pricePerNight?.price *
                  (details?.noOfDays > 0 ? details?.noOfDays : 1) *
                  1.029
                ).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>
      {/* <div className="w-full md:w-2/3 lg:w-1/2   h-screen  px-20"> */}

      {paymentIntent?.clientSecret && !loading && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm />
        </Elements>
      )}
      {/* </div> */}
    </div>
  );
};

export default Payment;
