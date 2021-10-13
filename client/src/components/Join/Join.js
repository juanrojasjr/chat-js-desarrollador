import React, { useState } from 'react';
import { Link, Redirect } from "react-router-dom";
import io from "socket.io-client";

import './Join.css';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);

let socket = io("localhost:5000");

export default function SignIn() {
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');
  // const [room, setRoom] = useState('');

  const shoot = () => {
    let result = true;
    const userData = {
      name,
      pass
    }
    console.log(name, pass);
    socket.emit("validLogin", userData , (data) => {
      if (data) {
        console.log('yes');
        return !result;
      } else {
        console.log('no');
        MySwal.fire({
          icon: 'error',
          title: 'Oops',
          text: 'El usuario no existe'
        });
        return result;
      }
    });
    
  }

  return (
    <Redirect to="" />,
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">¡Bienvenido!</h1>
        <p>Inicia sesión o regístrate para entrar a la sala</p>
        <div>
          <input placeholder="Nombre de usuario" className="joinInput" type="text" onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <input placeholder="Contraseña" className="joinInput mt-20" type="password" onChange={(e) => setPass(e.target.value)} />
        </div>
        <div className="btnGroup">
          <Link onClick={e => (shoot() && !name && !pass) ? e.preventDefault() : null} to={`/chat?name=${name}&room=default`}>
            <button className={'button mt-20'} type="submit">Inciar sesión</button>
          </Link>
          <Link to='/registro'>
            <button className={'button mt-20'}>Registrarse</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
