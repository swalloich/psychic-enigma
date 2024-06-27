/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const session = require("express-session");
const pool = require('./database/')
const express = require("express")
const expressLayouts = require('express-ejs-layouts');
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const { Util } = require("./utilities/index");

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}));

app.use(require('connect-flash')())
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

/* ***********************
 * View Engine and Templates
 *************************/
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/layout')

/* ***********************
 * Routes
 *************************/
app.use(static)
app.get('/', Util.handleErrors(baseController.buildHome));
// handleErrors for non-index routes called in route file.
app.use('/inv', inventoryRoute);
app.use('/account', accountRoute);

/* 404 Handler */
app.use(async (req, res, next) => {
  let nav = await Util.getNav();
  res.status(404).render("errors/error", {
    title: "404 - Page Not Found",
    message: "The page you're looking for does not exist.",
    nav
  });
});

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  const status = err.status || 500;
  let nav = await Util.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  res.status(status).render("errors/error", {
    title: (status == 404) ? "404 - Page Not Found" : `${status} - Server Error`,
    message: err.message,
    nav
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
