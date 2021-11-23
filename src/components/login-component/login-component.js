/**/

import React, { useState, useContext, useEffect } from 'react'
import { Button, Card, Form, Spinner, Row, Col } from 'react-bootstrap'
import Fade from 'react-bootstrap/Fade'
import { FaUserCircle } from 'react-icons/fa'
import axios from 'axios'
import { useHistory } from 'react-router'
import "./login-component.css"
import ReCAPTCHA from "react-google-recaptcha";
import PasswordStrengthBar from 'react-password-strength-bar';

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
                        <a href="#" onClick={(event) => { props.setCardType(!props.cardType) }}>Click here</a> for registration
                    </div>
                </Form>
            </Card.Body>
        </Card >
    )

}

function RegistrationCard(props) {
    // console.log("site key")
    // console.log(process.env)

    console.log(props)

    const [title, setTitle] = useState("")

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [email, setEmail] = useState("")
    const [confirmEmail, setConfirmEmail] = useState("")

    const [firstName, setfirstName] = useState("")
    const [surname, setSurname] = useState("")
    // const [institution, setInstitution] = useState("")
    // const [description, setDescription] = useState("")

    const [loading, setLoading] = useState(false)
    const [requestError, setRequestError] = useState(null)

    const [captchaToken, setCaptchaToken] = useState(null)


    let passwordsMatch = password === confirmPassword
    let bothPasswordsEntered = (password.length > 0 && confirmPassword.length > 0)

    let emailsMatch = email === confirmEmail
    let bothEmailsEntered = (email.length > 0 && confirmEmail.length > 0)

    let registrationEnabled = true

    console.log(passwordsMatch)
    console.log(bothPasswordsEntered)
    console.log(emailsMatch)
    console.log(bothEmailsEntered)
    console.log(title.length > 0)
    console.log(firstName.length > 0)
    console.log(surname.length > 0)
    console.log(emailsMatch)
    console.log(bothEmailsEntered)
    console.log(title.length > 0)
    console.log(firstName.length > 0)
    console.log(surname.length > 0)
    console.log(captchaToken)


    if (passwordsMatch &&
        bothPasswordsEntered &&
        emailsMatch &&
        bothEmailsEntered &&
        title.length > 0 &&
        firstName.length > 0 &&
        surname.length > 0 &&
        captchaToken) {
        registrationEnabled = false
    }

    return (
        <Card className="card-style border-0 registration-card">
            <Card.Header className="bg-dark text-white">
                <h2>Signup</h2>
            </Card.Header>
            <Card.Body>
                {/* <div className="icon-container">
                    <FaUserCircle size={60} />
                </div> */}
                <Form style={{ "marginLeft": "3em", "marginRight": "3em" }}>
                    <Row>
                        <Col xs={3}>
                            <Form.Group className="form-group-spaced">
                                <Form.Label htmlFor="email">Title</Form.Label>
                                <Form.Select id="title" defaultValue="Select" onChange={(event) => setTitle(event.target.value)} >
                                    <option disabled="true">Select</option>
                                    <option value="ms">Ms</option>
                                    <option value="misss">Miss</option>
                                    <option value="mrs">Mrs</option>
                                    <option value="dr">Dr</option>
                                    <option value="mr">Mr</option>
                                    <option value="mx">Mx</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col xs={4}>
                            <Form.Group className="form-group-spaced">
                                <Form.Label htmlFor="name">First Name</Form.Label>
                                <Form.Control id="name" type="text" onChange={(event) => setfirstName(event.target.value)} />
                            </Form.Group>
                        </Col>
                        <Col xs={5}>
                            <Form.Group className="form-group-spaced">
                                <Form.Label htmlFor="surname">Surname</Form.Label>
                                <Form.Control id="surname" type="text" onChange={(event) => setSurname(event.target.value)} />
                            </Form.Group>
                        </Col>

                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="form-group-spaced">
                                <Form.Label htmlFor="email">Email</Form.Label>
                                <Form.Control id="email" type="text" onChange={(event) => setEmail(event.target.value)} />
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group className="form-group-spaced">
                                <Form.Label htmlFor="email">Confirm Email</Form.Label>
                                <Form.Control id="confirmemail" type="text" onChange={(event) => setConfirmEmail(event.target.value)} />
                            </Form.Group>
                            {bothEmailsEntered ?
                                <Form.Text style={{ "textAlign": "end" }}>{emailsMatch ? "Emails match" : "Emails don't match"}</Form.Text> :
                                <></>}
                        </Col>
                    </Row>
                    <Row>
                        <Col>

                            <Form.Group className="form-group-spaced">
                                <Form.Label htmlFor="password">Password</Form.Label>
                                <Form.Control type="password" onChange={(event) => {
                                    setPassword(event.target.value)
                                }} />

                            </Form.Group>

                            <PasswordStrengthBar password={password} />
                        </Col>
                        <Col>
                            <Form.Group className="form-group-spaced">
                                <Form.Label htmlFor="password">Confirm Password</Form.Label>
                                <Form.Control type="password" onChange={(event) => {
                                    setConfirmPassword(event.target.value)
                                }} />
                                {bothPasswordsEntered ?
                                    <Form.Text style={{ "textAlign": "end" }}>{passwordsMatch ? "Passwords match" : "Passwords don't match"}</Form.Text> :
                                    <></>}

                            </Form.Group>
                        </Col>




                    </Row>
                    {requestError ? <p className="warning">{requestError}</p> : null}
                    <div className="icon-container">

                        <ReCAPTCHA
                            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                            onChange={async (value) => {
                                setCaptchaToken(value)
                            }}
                        />
                    </div>

                    <div className="button-container">
                        {loading ? <Button className="login-buttons" variant="dark">
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                            Loading...</Button> : <Button disabled={registrationEnabled} className="login-buttons" variant="dark" onClick={async (event) => {
                                setLoading(true)

                                const registrationResult = await RegisterUser({
                                    event: event,
                                    title: title,
                                    firstName: firstName,
                                    surname: surname,
                                    email: email,
                                    password: password,
                                    captchaToken: captchaToken,
                                    requestError: requestError,
                                    setRequestError: setRequestError,
                                    setCardType: props.setCardType
                                })
                                setLoading(false)

                                if (registrationResult.status > 199 || registrationResult.status < 300) {
                                    props.setCardType(!props.cardType)

                                }
                                console.log("registrationResult")
                                console.log(registrationResult)

                            }}>Register</Button>
                        }
                    </div>
                    <div style={{ textAlign: "center", width: "100%" }}>
                        Already got an account?&nbsp;
                        <a href="#" onClick={(event) => { props.setCardType(!props.cardType) }}>Click here</a> for login
                    </div>
                </Form>
            </Card.Body>
        </Card >
    )
}

function RenderCard(props) {

    const [cardType, setCardType] = useState(false)

    if (cardType === true) {
        return (
            <RegistrationCard
                cardType={cardType}
                setCardType={setCardType}

            />

        )
    }

    if (cardType === false) {
        return (
            <LoginCard
                cardType={cardType}
                setCardType={setCardType}

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


    // RegisterUser({
    //     event: event,
    //     title: title,
    //     firstName: firstName,
    //     surname: surname,
    //     email: email,
    //     password: password,
    //     captchaToken: captchaToken,
    //     requestError: requestError,
    //     setRequestError: setRequestError,
    //     setCardType: props.setCardType
    // })

    // check all of the details given
    const credentialsGiven = CheckCredentials({
        title: props.title,
        firstName: props.firstName,
        surname: props.surname,
        email: props.email,
        password: props.password,
        requestError: props.requestError,
        setRequestError: props.setRequestError,
        captchaToken: props.captchaToken

    })
    try {
        // await timeout(2000)

        const response = await axios({
            method: "post",
            url: process.env.REACT_APP_AUTHENTICATOR_URL + "api/user/register",
            data: {
                // username: username,
                title: props.title,
                firstName: props.firstName,
                surname: props.surname,
                email: props.email,
                password: props.password,
                captchaToken: props.captchaToken

            }
        })
        props.setCardType(!props.cardType)
        console.log(response)
        return (response)

    } catch (err) {
        console.log(err)
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

                <RenderCard />


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