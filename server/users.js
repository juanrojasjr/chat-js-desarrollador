const users = [];

const addUser = ({ id, name, room, role, nameFull }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();
  role = role.trim().toLowerCase();

  const existingUser = users.find((user) => user.room === room && user.name === name);

  if(!name || !room) return { error: 'Username and contraseña son requeridos.' };
  if(existingUser) return { error: 'Username está en uso' };

  const user = { id, name, room, role, nameFull };

  users.push(user);

  return { user };
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if(index !== -1) return users.splice(index, 1)[0];
}

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };