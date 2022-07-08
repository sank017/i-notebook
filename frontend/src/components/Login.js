import React, {useState} from "react";
import { useNavigate } from 'react-router-dom'


export default function Login(props) {
    const [credentials, setcredentials] = useState({email:"", password:""})
    let navigate = useNavigate();

    const handleSubmit = async (e)=>{
        e.preventDefault();
    const host = "http://localhost:5000"
    const response = await fetch(`${host}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email:credentials.email, password:credentials.password})
    });
    const json = await response.json() 
    console.log(json)
    if(json.success){
        //save the auth token and redirect
        localStorage.setItem('token', json.authtoken);
        navigate("/")
        props.showAlert("Logged in Successfully", "success")
    }
    else{
      props.showAlert("Invalid Details", "danger")
    }
  }
  const onChange = (e)=>{
    setcredentials({...credentials, [e.target.name]: e.target.value})
}

  return (
    <div className="container">
      <h2 className="my-5">Login to iNotebook</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={credentials.email}
            onChange={onChange}
            aria-describedby="emailHelp"
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={credentials.password}
            onChange={onChange}
            id="password"
          />
        </div>
        <button type="submit" className="btn btn-primary" >Login</button>
      </form>
    </div>
  );
}
