const express = require('express');
const router = express.Router();
const Listing = require("../models/listing");  
const {isloggedIn,isOwner,validateListing} = require("../middleware.js");
const multer = require("multer");
const{storage}= require("../../routes/cloudconfig.js")
const upload = multer({storage});

const listingController = require("../controller/listing.js");

router.route("/")
    .get( listingController.index)
    .post(isloggedIn, 
        upload.single('listing[image]'),
        validateListing, 
        listingController.createListing,
    );

router.get("/new",isloggedIn, listingController.renderNewForm);  

router.route("/:id")
    .get( listingController.showListing)
    .put(isloggedIn,isOwner,listingController.updateListing)
    .delete(isloggedIn, isOwner, listingController.deleteListing);
 
router.get('/:id/edit',isloggedIn, isOwner, listingController.editPage);

 module.exports= router;