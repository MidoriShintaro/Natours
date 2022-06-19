const path = require("path");
const express = require("express");
const app = express();
const moment = require("moment");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const ErrorHandle = require("./controllers/errorController");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");

const tourRoute = require("./router/tourRoute");
const userRoute = require("./router/userRoute");
const reviewRoute = require("./router/reviewRoute");

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
// 1) GLOBAL MIDDLEWARES
app.use(express.static(path.join(__dirname, "public")));
// Set security HTTP headers
app.use(helmet());

// Development logging
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message:
    "Too many accounts created from this IP, please try again after an hour",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent params pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "maxGroupSize",
      "ratingsAverage",
      "ratingsQuantity",
      "difficulty",
      "price",
    ],
  })
);

app.use((req, res, next) => {
  req.CurrentTime = moment().format("MMMM Do YYYY, h:mm:ss a");
  // console.log(req.headers)
  next();
});

// Route
app.use("/", (req, res) => {
  res.status(200).render("base", {
    tour: 'The Forest Hiker',
    user: 'Raito'
  });
});

app.use("/api/v1/tours", tourRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/reviews", reviewRoute);

app.all("*", (req, res, next) => {
  next(
    new AppError(`Can't find the url ${req.originalUrl} in the server`, 404)
  );
});

app.use(ErrorHandle);

module.exports = app;
