import React, { Component } from "react";
import { FormErrors } from "./FormErrors";
import { Link } from "react-router-dom";
import io from "socket.io-client";

import "./Register.css";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

let socket = io("localhost:5000");

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      username: "",
      email: "",
      password: "",
      role: "student",
      formErrors: { email: "", name: "", username: "", password: "" },
      emailValid: false,
      passwordValid: false,
      formValid: false,
    };
  }

  handleUserInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value }, () => {
      this.validateField(name, value);
    });
  };

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let nameValid = this.state.nameValid;
    let userNameValid = this.state.userNameValid;
    let emailValid = this.state.emailValid;
    let passwordValid = this.state.passwordValid;

    switch (fieldName) {
      case "name":
        nameValid = value.length >= 6;
        fieldValidationErrors.name = nameValid ? "" : "El nombre es muy corto.";
        break;
      case "username":
        userNameValid = value.length >= 6;
        fieldValidationErrors.username = userNameValid
          ? ""
          : "El nombre de usuario es muy corto.";
        break;
      case "email":
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        fieldValidationErrors.email = emailValid ? "" : "El email es inválido.";
        break;
      case "password":
        passwordValid = value.length >= 6;
        fieldValidationErrors.password = passwordValid
          ? ""
          : "La contraseña es muy corto.";
        break;
      default:
        break;
    }
    this.setState(
      {
        formErrors: fieldValidationErrors,
        nameValid: nameValid,
        userNameValid: userNameValid,
        emailValid: emailValid,
        passwordValid: passwordValid,
      },
      this.validateForm
    );
  }

  handleClick = (e) => {
    e.preventDefault();
    socket.emit("validUsername", this.state.username, (data) => {
      if (data) {
        MySwal.fire({
          icon: "error",
          title: "Oops",
          text: "El usuario ya existe, intente con otro.",
        });
      } else {
        MySwal.fire({
          icon: "success",
          title: "¡Todo listo!",
          text: "El usuario ha sido creado.",
        });
        // Inputs reset
        Array.from(document.querySelectorAll("input")).forEach(
          (input) => (input.value = "")
        );
        //create user in db
        socket.emit("createUser", this.state);
      }
    });
  };

  validateForm() {
    this.setState({
      formValid:
        this.state.nameValid &&
        this.state.userNameValid &&
        this.state.emailValid &&
        this.state.passwordValid,
    });
  }

  errorClass(error) {
    return error.length === 0 ? "" : "has-error";
  }

  render() {
    return (
      <div className="joinOuterContainer">
        <form className="formRegister" autoComplete="off">
          <h2>Registro</h2>
          <p>
            Completa el siguiente formulario para registrarte en la plataforma.
          </p>
          <div className="panel-errors">
            <FormErrors formErrors={this.state.formErrors} />
          </div>
          <div className="formContainer">
            <div
              className={`joinInput ${this.errorClass(
                this.state.formErrors.name
              )}`}
            >
              <label htmlFor="name">Nombre</label>
              <input
                type="text"
                required
                className="joinInput"
                name="name"
                value={this.state.name}
                onChange={this.handleUserInput}
              />
            </div>
            <div
              className={`joinInput ${this.errorClass(
                this.state.formErrors.username
              )}`}
            >
              <label htmlFor="username">Nombre de usuario</label>
              <input
                type="text"
                required
                className="joinInput"
                name="username"
                value={this.state.username}
                onChange={this.handleUserInput}
              />
            </div>
            <div
              className={`joinInput ${this.errorClass(
                this.state.formErrors.email
              )}`}
            >
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                required
                className="joinInput"
                name="email"
                value={this.state.email}
                onChange={this.handleUserInput}
              />
            </div>
            <div
              className={`joinInput ${this.errorClass(
                this.state.formErrors.password
              )}`}
            >
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                className="joinInput"
                name="password"
                value={this.state.password}
                onChange={this.handleUserInput}
              />
            </div>
            <div className="joinInput">
              <label htmlFor="role">Rol</label>
              <select
                className="joinInput"
                name="role"
                defaultValue="student"
                onChange={this.handleUserInput}
              >
                <option value="student">Estudiante</option>
                <option value="mod">Moderador</option>
              </select>
            </div>
          </div>
          <div className="formBtns mt-20">
            <Link to="/">
              <button className={"button"}>Regresar</button>
            </Link>
            <button
              type="submit"
              className="button"
              disabled={!this.state.formValid}
              onClick={this.handleClick}
            >
              Registrarse
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default Register;
