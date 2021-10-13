import React from 'react';

import onlineIcon from '../../icons/onlineIcon.png';

import './UsersOnline.css';

const UsersOnline = ({ users }) => (
  <div className="textContainer">
    {
      users
        ? (
          <div className="usersConnect">
            <h3>Usuarios conectados:</h3>
            <div className="activeContainer">
                {users.map(({name, role}) => (
                  <div key={name} className={`activeItem ${role==='teacher' ? ('messageMod') : null}`}>
                    {name}
                    <img alt="Online Icon" src={onlineIcon}/>
                  </div>
                ))}
            </div>
          </div>
        )
        : null
    }
  </div>
);

export default UsersOnline;