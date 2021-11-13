const http = require('http');
const express = require('express');
const chalk = require('chalk');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const config = require('./config');
const { getIP, skipLog, getTime } = require('./utils');

const App = express();
const Server = http.createServer(App);

morgan.token('ip', function(req,res){ return getIP(req); });
morgan.token('time', function(req,res){ return getTime(); });

App.disable('etag');

App.set('view engine', 'ejs');
App.set('trust proxy', true);
App.set('views', path.join(__dirname, 'views'));

App.use(morgan(`[${chalk.bold.blue('Web')}] :ip - :status - :method - :url - :response-time ms`, { skip: skipLog }));
App.use(express.json());
App.use(express.urlencoded({ extended: false }));
App.use(cookieParser());
App.use(session({ secret: '', resave: false, saveUninitialized: true }));

App.use('/assets', express.static(path.join(__dirname, 'assets')));

// Routers
App.use('/', require('./routers/Index'));

Server.listen(config.Server.Port ? config.Server.Port : 3000);
Server.on('listening', () => {
  console.log(`[${chalk.bold.blue('Server')}] Server has started successfully!`);

  if (config.Data.Status == true) {
      mongoose.connect(config.Data.URL ? `${config.Data.URL}/${config.Data.Name}` : `mongodb://${config.Data.IP}:${config.Data.Port}/${config.Data.Name}`, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: true
      }, function (err, status) {
          if (!err) return console.log(`[${chalk.bold.blue('MongoDB')}] Connection successful!`);
          if (err) return console.log(`[${chalk.bold.blue('MongoDB')}] ${chalk.bold.red('Connection Error: ')} ${err}`);
      });
  }
});
