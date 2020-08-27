const express = require("express");
const app = express();
const Sequelize = require("sequelize")
const routes = require('./routes')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: true}));

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

app.use(express.static("public"));
app.use(express.static("stylesheet"));

app.use(routes)
app.set('view engine', 'pug')

app.listen(3000)