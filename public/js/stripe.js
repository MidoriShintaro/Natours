import axios from "axios";
import { showAlert } from "./alerts";
import Stripe from "stripe";
const stripe = Stripe(
  "pk_test_51LGkiWJHX6KYk8ZM2ZYcRjQrFKWjtSrNw6Oc7M3WBn1ORg4PXs0FXQQwgEmODY0nAC19DVlOg506EE25R1bW3ZrI00ic0CBMlD"
);
// const stripe = require("stripe-client")(
//   "pk_test_51LGkiWJHX6KYk8ZM2ZYcRjQrFKWjtSrNw6Oc7M3WBn1ORg4PXs0FXQQwgEmODY0nAC19DVlOg506EE25R1bW3ZrI00ic0CBMlD"
// );

export const bookTour = async (tourId) => {
  try {
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/booking/booking-checkout-session/${tourId}`
    );
    console.log(session);

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert("error", err);
  }
};
