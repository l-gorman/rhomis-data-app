/**/

import React, { useState, useContext } from 'react'
import { Button, Card, Form } from 'react-bootstrap'
import axios from 'axios'

import "./login-component.css"

import AuthContext from '../authentication-component/AuthContext';

function CheckCredentials(email, password) {

    // if (firstName === null) {
    //     alert("No first name given")
    //     return false
    // }
    // if (surname === null) {
    //     alert("No surname given")
    //     return false
    // }
    if (email === null) {
        alert("No email given")
        return false
    }
    if (password === null) {
        alert("No password given")
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
                    <div className="button-container">
                        <Button className="login-buttons"
                            variant="dark"
                            onClick={async (event) => {
                                const token = await Login({
                                    event: event,
                                    email: props.email,
                                    password: props.password,
                                    // setAuthToken: props.setAuthToken
                                })


                                setAuthToken(token)


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
                    {/* <Form.Group>
                        <Form.Label htmlFor="firstName">First Name</Form.Label>
                        <Form.Control id="firstName" type="text" onChange={(event) => props.setFirstName(event.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="surname">Surname</Form.Label>
                        <Form.Control id="surname" type="text" onChange={(event) => props.setSurname(event.target.value)} />
                    </Form.Group> */}
                    <Form.Group>
                        <Form.Label htmlFor="email">Email</Form.Label>
                        <Form.Control id="email" type="text" onChange={(event) => props.setEmail(event.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="password">Password</Form.Label>
                        <Form.Control type="password" onChange={(event) => props.setPassword(event.target.value)} />
                    </Form.Group>
                    <div className="button-container">
                        <Button className="login-buttons" variant="dark" onClick={(event) => RegisterUser(event, props.email, props.password)}>Register</Button>
                    </div>
                    <a href="#" onClick={(event) => { props.setCardType(!props.cardType) }}>Click here</a> for login

                </Form>
            </Card.Body>
        </Card>
    )
}

function RenderCard(props) {
    if (props.cardType === true) {
        return (
            <RegistrationCard

                cardType={props.cardType}
                setCardType={props.setCardType}

                // setFirstName={props.setFirstName}
                // firstName={props.firstName}

                // setSurname={props.setSurname}
                // surname={props.surname}

                setEmail={props.setEmail}
                email={props.email}

                setPassword={props.setPassword}
                password={props.password}


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

            // setAuthToken={props.setAuthToken}
            />

        )
    }
    return "x"
}

async function Login(props) {
    props.event.preventDefault()
    //const credentialsGiven = CheckCredentials(email, password)

    const response = await axios({
        method: "post",
        url: process.env.REACT_APP_AUTHENTICATOR_URL + "api/user/login",
        data: {
            email: props.email,
            password: props.password
        }
    })

    if (response.status === 200) {
        // sessionStorage.setItem('token', response.data);
        // props.setAuthToken(response.data)
        return (response.data)

    }
    console.log(response)
}

async function RegisterUser(event, email, password) {
    // Stop the page from refreshing
    event.preventDefault()
    // check all of the details given
    //const credentialsGiven = CheckCredentials(firstName, surname, email, password)
    // const username = firstName + "_" + surname

    const response = await axios({
        method: "post",
        url: process.env.REACT_APP_AUTHENTICATOR_URL + "api/user/register",
        data: {
            // username: username,
            email: email,
            password: password
        }
    })


    console.log(response)
    //console.log("Credentials given: " + credentialsGiven)

}


export default function LoginComponent(props) {
    // Note, cannot pass this into an event handler
    // const { authToken, setAuthToken } = useContext(AuthContext)

    // const [firstName, setFirstName] = useState(null);
    // const [surname, setSurname] = useState(null);

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


            // setAuthToken={props.setAuthToken}
            // setAuthToken={setAuthToken}
            />


        </div >

    )
}
