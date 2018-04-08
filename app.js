var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var shellfs = require('shelljs');
var fs = require('fs');
var app = express();





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let createTableUsers = async function () {
  let Sqlite = require('./libs/sqliteOrm');
  try{
      let  response= await Sqlite.createTable('users',{
          username:"TEXT PRIMARY KEY",
          email:"TEXT UNIQUE",
          firstname:"TEXT",
          lastname:"TEXT",
          password:"TEXT",
          
      });
      return response;
  }
  catch (err){
   console.log(err);
   return err;
  }

};

/*let createTableSearchData = async function(){
  let Sqlite = require('./libs/sqlite_orm');
  try{
      let  response= await Sqlite.createTable('searches',{
          uid:"TEXT PRIMARY KEY",
          location_name:"TEXT NOT NULL UNIQUE",
          latitude:"TEXT",
          longitude:"TEXT",
          location_id:"TEXT",
      });
      return response;
  }
  catch (err){
   console.log(err);
   return err;
  }
}*/
if (!fs.existsSync(path.resolve(__dirname,'../data1/app/app.db'))) {
  var dirname = path.resolve(__dirname,'../data1/app/app.db');
  dirname = dirname.split('/');
  delete dirname[dirname.length-1];
  dirname = dirname.join('/');
  shellfs.mkdir('-p', dirname);
  createTableUsers().then(res=>{
      console.log(res);
  }).catch(err=>{
      console.log(err);
  });
 /* createTableUserData().then(res=>{
      console.log(res);
  }).catch(err=>{
      console.log(err);
  });*/


}

app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
