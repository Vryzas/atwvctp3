//react app (frontend)
import React, { useState } from 'react';
import { useHistory /*, useParams*/ } from 'react-router-dom';
import Axios from 'axios';
import votonline from './votonline.jpg';

function Login() {
  let history = useHistory();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [loginStatus, setLoginStatus] = useState('');

  Axios.defaults.withCredentials = true;

  const login = () => {
    Axios.post('http://localhost:3001/login', {
      // Axios.post('https://atwvc.herokuapp.com/login', {
      username: username,
      password: password,
    }).then((response) => {
      if (response.data.message) {
        setLoginStatus(response.data.message);
      } else {
        let id = response.data[0].id_user;
        history.push(`/profile/${id}`);
      }
    });
  };

  return (
    <div className="App">
      <h1>Login</h1>
      <img className="image" src={votonline} alt="Votrónico" />
      <div className="form">
        <label>Utilizador</label>
        <input
          type="text"
          name="username"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <h5 className="alertmsg">{loginStatus}</h5>
        <label>Password</label>
        <input
          type="password"
          name="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button className="submit" onClick={login}>
          Entrar
        </button>
        <div className="rodape">
          <p>Votrónico+ - Vitor Costa 2021</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
