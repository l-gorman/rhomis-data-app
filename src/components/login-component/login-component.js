/**/

import React, { useState, useContext } from 'react'
import { Button, Card, Form } from 'react-bootstrap'
import axios from 'axios'
import { useHistory } from 'react-router'
import "./login-component.css"

import AuthContext from '../authentication-component/AuthContext';
// import { set } from 'msw/lib/types/context';

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
        <Card className="card-style">
            <Card.Header className="bg-dark text-white">
                <h2>RHoMIS 2.0 Login</h2>
            </Card.Header>
            <Card.Body>
                <Form>
                    <Form.Group>
                        <Form.Label htmlFor="email">Email</Form.Label>
                        <Form.Control id="email" type="text" onChange={(event) => props.setEmail(event.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="password">Password</Form.Label>
                        <Form.Control type="password" onChange={(event) => props.setPassword(event.target.value)} />
                    </Form.Group>
                    {props.requestError ? <p className="warning">{props.requestError}</p> : null}
                    <div className="button-container">
                        <Button className="login-buttons"
                            variant="dark"
                            onClick={async (event) => {
                                const tokenResponse = await Login({
                                    event: event,
                                    email: props.email,
                                    password: props.password,
                                    requestError: props.requestError,
                                    setRequestError: props.setRequestError,


                                    // setAuthToken: props.setAuthToken
                                })
                                if (tokenResponse.status === 400) {
                                    return
                                }

                                if (tokenResponse.status === 200) {
                                    setAuthToken(tokenResponse.data)

                                    console.log("Setting token")

                                    console.log(tokenResponse.data)
                                    props.history.push("/")

                                }



                            }}>Login</Button>
                    </div>
                    <a href="#" onClick={(event) => { props.setCardType(!props.cardType) }}>Click here</a> for registration

                </Form>
            </Card.Body>
        </Card >
    )

}

function RegistrationCard(props) {

    return (
        <Card className="card-style">
            <Card.Header className="bg-dark text-white">
                <h2>Registration</h2>
            </Card.Header>
            <Card.Body>
                <Form>
                    <Form.Group>
                        <Form.Label htmlFor="email">Email</Form.Label>
                        <Form.Control id="email" type="text" onChange={(event) => props.setEmail(event.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="password">Password</Form.Label>
                        <Form.Control type="password" onChange={(event) => props.setPassword(event.target.value)} />
                    </Form.Group>
                    {props.requestError ? <p className="warning">{props.requestError}</p> : null}

                    <div className="button-container">
                        <Button className="login-buttons" variant="dark" onClick={(event) => {
                            RegisterUser({
                                event: event,
                                email: props.email,
                                password: props.password,
                                requestError: props.requestError,
                                setRequestError: props.setRequestError,
                                history: props.history,
                                setCardType: props.setCardType
                            })
                        }}>Register</Button>
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
            />

        )
    }
    return <h1>Error loading application</h1>
}

async function Login(props) {
    props.event.preventDefault()
    props.setRequestError(null)

    const credentialsGiven = CheckCredentials({ email: props.email, password: props.password, requestError: props.requestError, setRequestError: props.setRequestError })

    console.log("logging in user")
    try {
        const response = await axios({
            method: "post",
            url: process.env.REACT_APP_AUTHENTICATOR_URL + "api/user/login",
            data: {
                email: props.email,
                password: props.password
            }
        })

        return (response)

    } catch (err) {
        console.log(err.response)
        props.setRequestError(err.response.data)

        return (err.response)

    }
}

async function RegisterUser(props) {
    // Stop the page from refreshing
    props.event.preventDefault()
    props.setRequestError(null)

    // check all of the details given
    const credentialsGiven = CheckCredentials({ email: props.email, password: props.password, requestError: props.requestError, setRequestError: props.setRequestError })
    // const username = firstName + "_" + surname

    try {
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


    //console.log("Credentials given: " + credentialsGiven)

}

function LoginComponent(props) {
    // Note, cannot pass this into an event handler
    // const { authToken, setAuthToken } = useContext(AuthContext)

    // const [firstName, setFirstName] = useState(null);
    // const [surname, setSurname] = useState(null);

    const history = useHistory()

    const [requestError, setRequestError] = useState(null)

    const [cardType, setCardType] = useState(false)

    const [password, setPassword] = useState(null);
    const [email, setEmail] = useState(null);


    return (
        <div className="child-login-container">

            <RenderCard
                // setFirstName={setFirstName}
                // firstName={firstName}

                // setSurname={setSurname}
                // surname={surname}

                setEmail={setEmail}
                email={email}

                setPassword={setPassword}
                password={password}

                setCardType={setCardType}
                cardType={cardType}

                requestError={requestError}
                setRequestError={setRequestError}

                history={history}

            // setAuthToken={props.setAuthToken}
            // setAuthToken={setAuthToken}
            />


        </div >

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