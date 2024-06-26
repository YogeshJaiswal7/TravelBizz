const Listing = require("../models/listing");

module.exports.index = async(req,res)=>{
    const allListings= await Listing.find({});
    res.render("./listings/index.ejs", {allListings});

};

module.exports.renderNewForm = async(req,res)=>{
    res.render('listings/new.ejs');
};

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate:{
       path: "author",
    },
   })
    .populate("owner");
    if(!listing){
       req.flash("error","Listing you are requested doesn't exist");
       res.redirect("/listings");
    }
    else{
       res.render("listings/show.ejs",{listing});
    }
};

module.exports.editPage = async(req,res)=>{
    let {id} = req.params;
   let listings = await Listing.findById(id);
   if(!listings){
       req.flash("error","Listing you are requested doesn't exist");
       res.redirect("/listings");
    }else{
       req.flash("success", "Listing updated ");
       res.render('./listings/edit.ejs',{listings});
    }
   
};

module.exports.createListing =async(req,res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing= new Listing(req.body.listing);
    newListing.image = {url,filename};
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "new listing created");
    res.redirect('/listings/');
     
 }

module.exports.updateListing =async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);

};

module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
    let deleteList = await Listing.findByIdAndDelete(id);
    req.flash("success", " Listing Deleted successfully");
    res.redirect('/listings');
}