import React, { useState, useEffect } from 'react'

import "./login-component.css"


function CheckCredentials(username, password) {

    if (password === "" & username === "") {
        alert("No username or password given")
        return false
    }

    if (username === "") {
        alert("No username given")
        return false
    }
    if (password === "") {
        alert("No password given")
        return false
    }

    return true
}


function RegisterUser(event, username, password) {
    event.preventDefault()
    const credentialsGiven = CheckCredentials(username, password)

    console.log("RegisterUser pressed")
    console.log("Credentials given: " + credentialsGiven)

}

function Login(event, username, password) {
    event.preventDefault()
    const credentialsGiven = CheckCredentials(username, password)
    console.log("Login pressed")
    console.log("Credentials given: " + credentialsGiven)

}

export default function LoginComponent() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("")

    useEffect(() => {
        console.log("Username = " + username);

    }, [username]);

    useEffect(() => {
        console.log("Password = " + password);

    }, [password]);



    return (
        <div className="child-login-container">
            <h1>Login</h1>
            <form>
                <label htmlFor="username">Username</label>
                <input id="username" type="text" onChange={(event) => setUsername(event.target.value)} />
                <label htmlFor="password">Password</label>
                <input type="password" onChange={(event) => setPassword(event.target.value)} />
                <div>
                    <button onClick={(event) => Login(event, username, password)}>Login</button>
                    <button onClick={(event) => RegisterUser(event, username, password)}>Register</button>
                </div>

            </form>
        </div>

    )
}
