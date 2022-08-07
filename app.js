var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const cors = require('cors');

app.use(cors({origin: '*'}));

let x = true;
// require socket.io
const io = require('socket.io')(); //<------
require('./socket')(io)         

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

io.sockets.on('connection', (socket) => {
  console.log(`new connection id: ${socket.id}`);
  io.socketsJoin("room1");
  io.socketsJoin("room2");
  sendData(socket);
  console.log(sendData(socket))
})

function sendData(socket){
    
  if(x){
      socket.to("room1").emit('data1', Array.from({length: 8}, () => Math.floor(Math.random() * 590)+ 10));
      x = !x;
  }else{
      socket.to("room2").emit('data2', Array.from({length: 8}, () => Math.floor(Math.random() * 590)+ 10));
      x = !x;
  }

  console.log(`data is ${x}`);
  setTimeout(() => {
      sendData(socket);
  }, 5000);
}
module.exports = { app, io }; 
