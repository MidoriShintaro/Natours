const express = require("express");
const reviewController = require("../controllers/reviewController");
const authController = require("./../controllers/authController");

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route("/")
  .get(authController.protect, reviewController.getAllReview)
  .post(
    authController.restrictTo("user"),
    reviewController.setUserTourIds,
    reviewController.createNewReview
  );

router
  .route("/:id")
  .get(reviewController.getReview)
  .delete(
    authController.restrictTo("admin", "user"),
    reviewController.deleteReview
  )
  .patch(
    authController.restrictTo("admin", "user"),
    reviewController.updateReview
  );

module.exports = router;
