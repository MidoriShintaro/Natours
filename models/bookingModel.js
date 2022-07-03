const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  tour: {
    typeof: mongoose.Schema.ObjectId,
    ref: "tour",
    require: [true, "Booking must belong to Tour"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    require: [true, "Booking must belong to User"],
  },
  price: {
    type: Number,
    require: [true, "Booking must have a price"],
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

bookingSchema.pre(/^find/, function (next) {
  this.populate("user").populate({
    path: "tour",
    select: "name",
  });
  next();
});

const booking = mongoose.model("Booking", bookingSchema);

module.exports = booking;
