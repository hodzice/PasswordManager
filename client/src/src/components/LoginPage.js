import React from "react";
import {useState} from 'react';

function LoginPage({ login, Error}) {
    const [details, setDetails] = useState({name: "", email: "", password: ""});
    const submit = event => {
        event.preventDefault();
        login(details);
    }

    return (
        <form onSubmit={submit}>
            <div className="form-inner">
                <h2>Login</h2>
                {(Error !== "") ? (<div className="error">{Error}</div>) : ""}
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input type="text" name="name" id="name" onChange={event => setDetails({...details, name: event.target.value})} value={details.name}/>
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="text" name="email" id="email" onChange={event => setDetails({...details, email: event.target.value})} value={details.email}/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" id="password" onChange={event => setDetails({...details, password: event.target.value})} value={details.password}/>
                </div>
                <input type="submit" value="Login"/>
            </div>
        </form>
    )
}

export default LoginPage;