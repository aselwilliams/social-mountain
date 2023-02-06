import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../store/authContext";

const Auth = () => {
  const authCtx = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [register, setRegister] = useState(true);
  const [message, setMessage] = useState('')
  const [display, setDisplay] = useState('none')

  const submitHandler = (e) => {
    e.preventDefault();

    let query
    register===true ? query = 'register' : query = 'login';
    let url=`http://localhost:4014/${query}`
// let url=`https://socialmtn.devmountain.com/${query}`
    axios
      .post(url, {
        username, password
      })
      .then(({ data }) => {
        console.log("After Auth", data);
        const { token, exp, userId } = data;
        authCtx.login(token, exp, userId);
      })
      .catch((err) => {
        console.log(err);
        setMessage(err.response.data)
        setDisplay('block')
      });
    setUsername("");
    setPassword("");

    console.log("submitHandler called");
    console.log(username, password, register);
  };

  return (
    <main>
      <h1>Welcome!</h1>
      <form className="form auth-form" onSubmit={submitHandler}>
        <input
          className="form-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="form-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="form-btn">{register ? "Sign Up" : "Login"}</button>
      </form>
      <p style={{display: display}} className='auth-msg'>{message}</p>
      <button className="form-btn" onClick={() => setRegister(false)}>
        Need to {register ? "Login" : "Sign Up"}?
      </button>
    </main>
  );
};

export default Auth;
