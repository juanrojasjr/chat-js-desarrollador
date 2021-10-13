const Msgs = require("./models/Messages");
const Users = require("./models/Users");

const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");

module.exports = function (io) {
  io.on("connect", (socket) => {
    socket.on("join", async ({ name, room }, callback) => {
      const userRole = await Users.findOne({ username: name });
      let role = userRole.typeuser;
      let nameFull = userRole.name;

      const { error, user } = addUser({
        id: socket.id,
        name,
        room,
        role,
        nameFull,
      });

      if (error) callback(error);

      socket.join(user.room);

      socket.emit("message", {
        user: "admin",
        text: `¡Bienvenido/a ${user.nameFull}!`,
      });

      socket.broadcast
        .to(user.room)
        .emit("message", { user: "admin", text: `${user.name} ha entrado` });

      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });

      callback(role);
    });

    socket.on("createUser", async (data) => {
      /* Add user in DB */
      let newUser = new Users({
        name: data.name,
        username: data.username,
        password: data.password,
        typeuser: data.role,
      });
      await newUser.save();
    });

    socket.on("validLogin", async (data, callBack) => {
      const userValid = await Users.findOne({
        username: data.name,
        password: data.pass,
      });
      userValid ? callBack(true) : callBack(false);
    });

    socket.on("validUsername", async (data, callBack) => {
      const nameuserValid = await Users.findOne({ username: data });
      nameuserValid ? callBack(true) : callBack(false);
    });

    socket.on("sendMessage", async (message, callback) => {
      const user = getUser(socket.id);

      let newMsg = new Msgs({
        username: user.name,
        namefull: user.nameFull,
        role: user.role,
        msg: message,
      });
      newMsg.save();

      io.emit("message", { user: user.name, text: message, roles: user.role });

      callback();
    });

    socket.on("disconnect", () => {
      const user = removeUser(socket.id);

      if (user) {
        io.to(user.room).emit("message", {
          user: "admin",
          text: `${user.name} ha salido`,
        });
        io.to(user.room).emit("roomData", {
          room: user.room,
          users: getUsersInRoom(user.room),
        });
      }
    });
  });
};
