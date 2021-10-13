const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

/* DB connection */
mongoose.connect('mongodb://127.0.0.1/chattest', {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
.then(db => console.log('DB is connected.'))
.catch(err => console.log(err));

require('./sockets')(io);

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));