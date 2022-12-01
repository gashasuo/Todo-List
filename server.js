if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const passport = require("passport");
const localStrategy = require("passport-local");
const session = require("express-session");
const { isLoggedIn, isProjectOwner, isItemOwner } = require("./middleware");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo");

const Item = require("./models/item");
const Project = require("./models/project");
const User = require("./models/user");
const AppError = require("./utils/AppError");

const projectRoutes = require("./routes/projectRoutes");
const itemRoutes = require("./routes/itemRoutes");
const authRoutes = require("./routes/authRoutes");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));

// const dbURL = process.env.DB_URL;
const dbURL = "mongodb://localhost:27017/todo";

const store = MongoStore.create({
	mongoUrl: dbURL,
	crypto: { secret: "secretkey" },
	touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
	console.log("SESSION STORE ERROR", e);
});

const sessionConfig = {
	store,
	name: "session",
	secret: "secretkey",
	resave: false,
	saveUninitialized: false,
};

app.use(session(sessionConfig));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect(dbURL);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database connected");
});

app.use((req, res, next) => {
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	res.locals.currentUser = req.user;
	next();
});

app.use("/projects", projectRoutes);
app.use("/items", itemRoutes);
app.use("/", authRoutes);

app.get("*", (req, res, next) => {
	next(new AppError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
	const { status = 500, message = "Something Went Wrong" } = err;
	res.status(status).send(message);
});

app.listen(3000, () => {
	console.log("App is listening on port 3000!");
});
