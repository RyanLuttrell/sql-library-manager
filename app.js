//Import all of the necessary dependencies for the app
const express = require("express");
const app = express();
const path = require('path')
const Sequelize = require("sequelize")
const routes = require('./routes/books')
const bodyParser = require('body-parser');
const router = express.Router();


app.use(bodyParser.urlencoded({extended: true}));

//Set the parameters for the type of database and the database file
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './library.db',
  logging: false
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

  sequelize.sync({ force: true })
  .then(() => {
    console.log('We are cooking with fire now');
  })
  .catch(err => {
    console.error('Looks like we still have some work to do')
  }) 

app.use(router)

app.use(express.static(path.join(__dirname, "public")));


app.use(routes)
app.set('view engine', 'pug')

//404 Error handling
app.use((req, res, next) => {
  console.log("404 error handler called");
  res.status(404).render("page-not-found");
});

//Global Error Handling
app.use((err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).render("page-not-found", { err });
  } else {
    err.message = err.message || "Something went wrong on the server side.";
    res.status(err.status || 500).render("error", { err });
  }
});

//Listening at local host port 3000
app.listen(3000)