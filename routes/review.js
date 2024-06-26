const express = require('express');
const router = express.Router({mergeParams: true});

const reviewController = require("../controller/review.js")
const {validateReview, isloggedIn, isReviewAuthor} = require("../middleware.js");
 
router.post('/',isloggedIn ,validateReview, reviewController.createReview );


router.delete("/:reviewId",isloggedIn, isReviewAuthor, reviewController.deleteReview);

module.exports = router;

