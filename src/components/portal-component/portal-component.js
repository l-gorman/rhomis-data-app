import React, { Component, useState, useEffect, useContext } from 'react'
import { Form, Card, Table, Button } from 'react-bootstrap'

import AuthContext from '../authentication-component/AuthContext';

import axios from 'axios';

import { Redirect, useHistory } from 'react-router';

import { PortalDataAll, PortalDataNewUser } from './portal-data'

import './portal-component.css'
import '../../App.css'





async function FetchProjectInformation(authToken) {

    console.log("Auth Token: " + authToken)
    // Basic get request for metadata
    const response = await axios({
        method: "get",
        url: process.env.REACT_APP_API_URL + "api/meta-data/form-data",
        headers: {
            'Authorization': authToken
        }
    })
    console.log(response.data)

    return (response.data)
}

// function RedirectUser(props) {
//     history.push(props.link)

// }


function PortalCard(props) {
    console.log(props.data)
    const Icon = props.data.icon


    if (props.data.external === false) {
        return (
            <div onClick={() => { props.history.push(props.data.link) }}
            >
                < Card className="sub-card portal-card border-0">
                    <div className="portal-card-header-container">
                        <h4 className="portal-card-header">{props.data.name}</h4>
                    </div>
                    <div className="portal-icon-container">
                        <Icon classname="portal-icon" size={100} color="white" />
                    </div>
                </Card >
            </div>
        )
    }

    if (props.data.external) {
        return (
            <div>
                <a href={props.data.link} style={{ 'text-decoration': 'none' }}>
                    < Card className="sub-card portal-card border-0">
                        <div className="portal-card-header-container">
                            <h4 className="portal-card-header">{props.data.name}</h4>
                        </div>
                        <div className="portal-icon-container">

                            <Icon classname="portal-icon" size={100} color="white" />
                        </div>
                    </Card >
                </a >
            </div >
        )
    }
}


function RenderPortalCards(props) {

    return (
        <>
            {props.data.map((PortalItem) => {
                return <PortalCard data={PortalItem} history={props.history} />
            })
            }
        </>
    )

}

export default function PortalComponent() {

    const [userData, setUserData] = useState([])
    const [authToken, setAuthToken] = useContext(AuthContext)
    const history = useHistory()

    useEffect(async () => {
        const newUserData = await FetchProjectInformation(authToken
        )
        console.log(newUserData)
        setUserData(newUserData)
    }, [])

    return (
        <div className="sub-page-container">
            <Card className="main-card border-0">
                <Card.Header className="bg-dark text-white">
                    <h3 >Portal</h3>
                </Card.Header>
                <Card.Body className="main-card-body">
                    {userData.length > 0 ? <RenderPortalCards data={PortalDataAll} history={history} /> : <RenderPortalCards data={PortalDataNewUser} history={history} />}

                </Card.Body>
            </Card>

        </div >
    )

}
