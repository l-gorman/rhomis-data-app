/**/

import React, { useState, useContext, useEffect } from 'react'
import { Button, Card, Form, Spinner } from 'react-bootstrap'
import Fade from 'react-bootstrap/Fade'
import { FaUserCircle } from 'react-icons/fa'
import axios from 'axios'
import { useHistory } from 'react-router'
import "./login-component.css"

import AuthContext from '../authentication-component/AuthContext';

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


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
    return (
        <Card className="card-style border-0">
            <Card.Header className="bg-dark text-white">
                <h2>Login</h2>
            </Card.Header>

            <Card.Body>
                <div className="icon-container">
                    <FaUserCircle size={60} />
                </div>
                <Form>
                    <Form.Group className="form-group-spaced">
                        <Form.Label htmlFor="email">Email</Form.Label>
                        <Form.Control id="email" type="text" onChange={(event) => props.setEmail(event.target.value)} />
                    </Form.Group>
                    <Form.Group className="form-group-spaced">
                        <Form.Label htmlFor="password">Password</Form.Label>
                        <Form.Control type="password" onChange={(event) => props.setPassword(event.target.value)} />
                    </Form.Group>
                    {props.requestError ? <p className="warning">{props.requestError}</p> : null}
                    <div className="button-container">
                        {props.loading ? <Button className="login-buttons" variant="dark">
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
                                    props.setLoading(true)

                                    const tokenResponse = await Login({
                                        event: event,
                                        email: props.email,
                                        password: props.password,
                                        requestError: props.requestError,
                                        setRequestError: props.setRequestError,


                                        // setAuthToken: props.setAuthToken
                                    })
                                    props.setLoading(false)

                                    if (tokenResponse.status === 400) {
                                        return
                                    }

                                    if (tokenResponse.status === 200) {

                                        setAuthToken(tokenResponse.data)

                                        props.history.push("/")

                                    }



                                }}>Login</Button>}
                    </div>
                    <a href="#" onClick={(event) => { props.setCardType(!props.cardType) }}>Click here</a> for registration

                </Form>
            </Card.Body>
        </Card >
    )

}

function RegistrationCard(props) {

    return (
        <Card className="card-style border-0">
            <Card.Header className="bg-dark text-white">
                <h2>Signup</h2>
            </Card.Header>
            <Card.Body>
                <div className="icon-container">
                    <FaUserCircle size={60} />
                </div>
                <Form>
                    <Form.Group className="form-group-spaced">
                        <Form.Label htmlFor="email">Email</Form.Label>
                        <Form.Control id="email" type="text" onChange={(event) => props.setEmail(event.target.value)} />
                    </Form.Group>
                    <Form.Group className="form-group-spaced">
                        <Form.Label htmlFor="password">Password</Form.Label>
                        <Form.Control type="password" onChange={(event) => props.setPassword(event.target.value)} />
                    </Form.Group>
                    {props.requestError ? <p className="warning">{props.requestError}</p> : null}

                    <div className="button-container">
                        {props.loading ? <Button className="login-buttons">
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                            Loading...</Button> : <Button className="login-buttons" variant="dark" onClick={(event) => {
                                props.setLoading(true)

                                RegisterUser({
                                    event: event,
                                    email: props.email,
                                    password: props.password,
                                    requestError: props.requestError,
                                    setRequestError: props.setRequestError,
                                    history: props.history,
                                    setCardType: props.setCardType
                                })
                                props.setLoading(false)

                            }}>Register</Button>
                        }
                    </div>
                    <a href="#" onClick={(event) => { props.setCardType(!props.cardType) }}>Click here</a> for login

                </Form>
            </Card.Body>
        </Card >
    )
}

function RenderCard(props) {
    if (props.cardType === true) {
        return (
            <RegistrationCard


                cardType={props.cardType}
                setCardType={props.setCardType}


                setEmail={props.setEmail}
                email={props.email}

                setPassword={props.setPassword}
                password={props.password}

                requestError={props.requestError}
                setRequestError={props.setRequestError}

                history={props.history}

                loading={props.loading}
                setLoading={props.setLoading}

            />

        )
    }

    if (props.cardType === false) {
        return (
            <LoginCard
                cardType={props.cardType}
                setCardType={props.setCardType}

                setEmail={props.setEmail}
                email={props.email}

                setPassword={props.setPassword}
                password={props.password}

                requestError={props.requestError}
                setRequestError={props.setRequestError}

                history={props.history}
                loading={props.loading}
                setLoading={props.setLoading}
            />

        )
    }
    return <h1>Error loading application</h1>
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

async function RegisterUser(props) {
    // Stop the page from refreshing
    props.event.preventDefault()
    props.setRequestError(null)

    // check all of the details given
    const credentialsGiven = CheckCredentials({
        email: props.email,
        password: props.password,
        requestError: props.requestError,
        setRequestError: props.setRequestError
    })
    try {
        // await timeout(2000)

        const response = await axios({
            method: "post",
            url: process.env.REACT_APP_AUTHENTICATOR_URL + "api/user/register",
            data: {
                // username: username,
                email: props.email,
                password: props.password
            }
        })
        props.setCardType(!props.cardType)
        console.log(response)

    } catch (err) {
        console.log(err)
        props.setRequestError(err.response.data)
        return (err.response.data)

    }
}

function LoginComponent(props) {
    const history = useHistory()

    const [requestError, setRequestError] = useState(null)
    const [cardType, setCardType] = useState(true)
    const [password, setPassword] = useState(null);
    const [email, setEmail] = useState(null);
    const [open, setOpen] = useState(false)

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setOpen(true)
    }, [])

    return (
        <Fade in={open}>



            <div className="child-login-container">

                <RenderCard

                    setEmail={setEmail}
                    email={email}

                    setPassword={setPassword}
                    password={password}

                    setCardType={setCardType}
                    cardType={cardType}

                    requestError={requestError}
                    setRequestError={setRequestError}

                    history={history}

                    loading={loading}
                    setLoading={setLoading}

                />


            </div >
        </Fade>
    )
}

export {
    LoginComponent,
    CheckCredentials,
    LoginCard,
    RegistrationCard,
    RenderCard,
    Login,
    RegisterUser

}