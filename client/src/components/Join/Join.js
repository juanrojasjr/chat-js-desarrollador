import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import io from "socket.io-client";

import "./Join.css";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

let socket = io("localhost:5000");
let disabled = false;

export default function SignIn() {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");

  const shoot = () => {
    let result = true;
    const userData = {
      name,
      pass,
    };

    socket.emit("validLogin", userData, (data) => {
      if (data) {
        return !result;
      } else {
        MySwal.fire({
          icon: "error",
          title: "Oops",
          text: "El usuario no existe",
        });
        return result;
      }
    });
  };

  function onChangeValue(e) {
    if (e.target.name === "name") {
      setName(e.target.value);
    } else if (e.target.name === "pass") {
      setPass(e.target.value);
    }
    if (e.target.value.length > 4 && name && pass) {
      disabled = true;
    }
  }

  return (
    (<Redirect to="" />),
    (
      <div className="joinOuterContainer">
        <div className="joinInnerContainer">
          <h1 className="heading">¡Bienvenido!</h1>
          <p>Inicia sesión o regístrate para entrar a la sala</p>
          <div>
            <input
              placeholder="Nombre de usuario"
              name="name"
              className="joinInput"
              type="text"
              onChange={(e) => onChangeValue(e)}
            />
          </div>
          <div>
            <input
              placeholder="Contraseña"
              name="pass"
              className="joinInput mt-20"
              type="password"
              onChange={(e) => onChangeValue(e)}
            />
          </div>
          <div className="btnGroup">
            <Link
              onClick={(e) =>
                shoot() && !name && !pass ? e.preventDefault() : null
              }
              to={`/chat?name=${name}&room=default`}
            >
              <button
                className={"button mt-20"}
                disabled={!disabled}
                type="submit"
              >
                Inciar sesión
              </button>
            </Link>
            <Link to="/registro">
              <button className={"button mt-20"}>Registrarse</button>
            </Link>
          </div>
        </div>
      </div>
    )
  );
}
