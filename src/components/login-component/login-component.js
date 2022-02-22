/**/

import React, { useState, useContext, useEffect } from 'react'
import { Button, Card, Form, Spinner } from 'react-bootstrap'
import Fade from 'react-bootstrap/Fade'
import { FaUserCircle } from 'react-icons/fa'
import axios from 'axios'
import { useHistory } from 'react-router'
import "./login-component.css"

import AuthContext from '../authentication-component/AuthContext';




function CheckCredentials(props) {
    if (props.email === null) {
        props.setRequestError("No email given")
        return false
    }
    if (props.password === null) {
        props.setRequestError("No password given")
        return false
    }

    return true
}

function LoginCard(props) {
    const [authToken, setAuthToken] = useContext(AuthContext)

    const history = useHistory()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [requestError, setRequestError] = useState("")
    const [loading, setLoading] = useState("")


    useEffect(() => {
        const localToken = localStorage.getItem("userToken")
        console.log("Local Token")
        console.log(localToken)

        const currentDate = new Date()
        const localTokenCreationTime = new Date(localStorage.getItem("createdAt"))
        console.log("Current date")
        console.log(currentDate)
        console.log("Token time")
        console.log(localTokenCreationTime)

        console.log("Difference")
        console.log(currentDate.getTime() - localTokenCreationTime.getTime())

        const timeDifference = currentDate.getTime() - localTokenCreationTime.getTime()
        if (timeDifference < 60 * 60 * 1000) {
            setAuthToken(localToken)
            history.push("/")
            return
        }
    }, [])



    return (
        <Card className="card-style border-0 login-card">
            <Card.Header className="bg-dark text-white">
                <h2>Login</h2>
            </Card.Header>

            <Card.Body>
                <div className="icon-container">
                    <FaUserCircle size={60} />
                </div>
                <Form style={{ "marginLeft": "2em", "marginRight": "2em" }}>
                    <Form.Group className="form-group-spaced">
                        <Form.Label htmlFor="email">Email</Form.Label>
                        <Form.Control id="email" type="text" onChange={(event) => setEmail(event.target.value)} />
                    </Form.Group>
                    <Form.Group className="form-group-spaced">
                        <Form.Label htmlFor="password">Password</Form.Label>
                        <Form.Control type="password" onChange={(event) => setPassword(event.target.value)} />
                    </Form.Group>
                    {requestError ? <p className="warning">{requestError}</p> : null}
                    <div className="button-container">
                        {loading ? <Button className="login-buttons" variant="dark">
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                            Loading</Button> :
                            <Button className="login-buttons"
                                variant="dark"
                                onClick={async (event) => {
                                    setLoading(true)

                                    const tokenResponse = await Login({
                                        event: event,
                                        email: email,
                                        password: password,
                                        requestError: requestError,
                                        setRequestError: setRequestError,


                                        // setAuthToken: props.setAuthToken
                                    })
                                    setLoading(false)

                                    if (tokenResponse.status === 400) {
                                        history.push("/login")
                                        return
                                    }

                                    if (tokenResponse.status === 200) {

                                        setAuthToken(tokenResponse.data)
                                        localStorage.setItem('userToken', tokenResponse.data)
                                        const tokenDate = new Date()
                                        localStorage.setItem('createdAt', tokenDate)
                                        history.push("/")

                                    }



                                }}>Login</Button>}
                    </div>
                    <div style={{ textAlign: "center", width: "100%" }}>
                        Don't have an account?&nbsp;
                        <a href="/#/register">Click here</a> for registration
                    </div>
                </Form>
            </Card.Body>
        </Card >
    )

}






async function Login(props) {
    props.event.preventDefault()
    props.setRequestError(null)


    const credentialsGiven = CheckCredentials({ email: props.email, password: props.password, requestError: props.requestError, setRequestError: props.setRequestError })

    try {
        // await timeout(2000)

        const response = await axios({
            method: "post",
            url: process.env.REACT_APP_AUTHENTICATOR_URL + "api/user/login",
            data: {
                email: props.email,
                password: props.password
            }
        })
        console.log(response)
        return (response)
    } catch (err) {
        props.setRequestError(err.response.data)
        return (err.response)

    }
}



function LoginComponent(props) {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        setOpen(true)
    }, [])

    return (
        <Fade in={open}>

            <div className="child-login-container">
                <LoginCard />
            </div >
        </Fade>
    )
}

export {
    LoginComponent,
    CheckCredentials,
    LoginCard,
    Login
}