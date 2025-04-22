
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CheckoutForm = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const { state } = useLocation();
  const elements = useElements();
  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        // return_url: "http://localhost:5173/payment",
      },
      redirect: "if_required",
    });
    console.log(result);

    if (result.error) {
      console.error("Payment Failed:", result.error.message);
      // navigate("/payment-success", {
      //   state: { status: "failed", plan: state?.data },
      // });
    } else if (
      result.paymentIntent &&
      result.paymentIntent.status === "succeeded"
    ) {
      // navigate("/payment-success", {
      //   state: {
      //     status: "success",
      //     plan: state?.data,
      //     intent: result.paymentIntent,
      //   },
      // });
      console.log("🎉 Payment Successful:", result.paymentIntent);
    } else {
      console.log("⚠️ Payment Status:", result.paymentIntent.status);
    }
  };

  return (
    <div className=" bg-white p-10 rounded-xl shadow-lg">
      <form onSubmit={handleSubmit}>
        {/* <p className="text-xl font-medium ">Pay Now</p>
        <Divider my={20} /> */}
        <PaymentElement />

        <button type="submit" size="lg"  className="w-full mt-10 bg-brand text-white py-3 rounded-lg font-medium hover:bg-brand-dark transition-colors"
               disabled={!stripe}>
          Pay
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;