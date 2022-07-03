const stripe = require("stripe")(process.env.SECRET_API_KEY);
const Tour = require("./../models/tourModels");
const Booking = require("./../models/bookingModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handleFactory");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/?${req.params.tourId}&${
      req.user.id
    }&${tour.price}`,
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        amount: tour.price * 100,
        currency: "usd",
        quantity: 1,
      },
    ],
  });

  res.status(200).json({
    status: "success",
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, price, user } = req.query;

  if (!tour && !price && !user) return next();

  await Booking({ tour, price, user });

  res.redirect(req.originalUrl.split("?")[0]);
});

exports.getAllBooking = factory.getAll(Booking);
exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.UpdateBooking = factory.updateOne(Booking);
exports.DeleteBooking = factory.deleteOne(Booking);
