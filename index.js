if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRoute = require('./routes/listings.js');
const reviewRoute = require('./routes/review.js');
const userRoute = require('./routes/user.js');

const path = require("path");
const app = express();


main().then(()=>{console.log("connected to Db")}).catch((err)=>{console.log(err);})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
app.engine('ejs',ejsMate); 
app.set("view engine", 'ejs');
app.set("views", path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "/public")));

const sessionOption = {
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now()+ 7 * 24 * 60 * 60 *1000 ,
        maxAge: 7 * 24 * 60 * 60 *1000 ,
        httpOnly: true, 
    }
};
app.get("/", (req, res)=>{
    res.send("hi from server");
});

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.use("/listings", listingRoute);
app.use("/listings/:id/reviews", reviewRoute);
app.use("/", userRoute);



app.listen(8080, ()=>{
    console.log(`server started at port 8080`);
})