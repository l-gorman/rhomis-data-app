import React, { Component, useState, useEffect, useContext } from 'react'
import { Form, Card, Table, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import AuthContext from '../authentication-component/AuthContext';

import axios from 'axios';

import { Redirect, useHistory } from 'react-router';

import { PortalDataAll } from './portal-data'

import './portal-component.css'
import '../../App.css'





async function FetchProjectInformation(authToken) {

    // Basic get request for metadata
    const response = await axios({
        method: "get",
        url: process.env.REACT_APP_AUTHENTICATOR_URL + "api/user/",
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
    const Icon = props.data.icon
    console.log("props portal card")
    console.log(props)
    console.log(props.data.label)



    if (props.data.external === false) {
        return (
            <div onClick={() => { props.history.push(props.data.link) }}
            >
                < Card key={"card-" + props.data.name} className="sub-card portal-card border-0">
                    <div key={"header-container-" + props.data.name} className="portal-card-header-container">
                        <h4 key={"card-header-" + props.data.name} className="portal-card-header">{props.data.name}</h4>
                    </div>
                    <div key={"icon-container-" + props.data.name} className="portal-icon-container">
                        <Icon size={100} color="white" />
                    </div>
                </Card >
            </div>
        )
    }

    if (props.data.external === true & props.data.label === "surveyBuilder") {
        console.log("Auth token")

        console.log(props.authToken)
        return (
            <div>
                <form method="post" action={props.data.link} class="inline">
                    <input type="hidden" name="token" value={props.authToken} />
                    {/* <input type="hidden" name="X-XSRF-TOKEN" value={"eyJpdiI6IndJR29DYUNDbjQ5eG1taWJUVjJ1NVE9PSIsInZhbHVlIjoiVisvTVNCc2puS1ZsZWlhYnZBbHpMd01odksyWm9laG9UdE45N3dHcWp5c3hNRWNuK3FCbVRPa0xTcEZoNXhPSWxtbUFZUFdxbTY3a0RrVU5UWUQwOG0wTGRQL1lINC9kT3NndkVGeWtPVTFtTlc5clBnYWN4NmF0MGxxTGhtcUciLCJtYWMiOiIxZTUyMjJhZDFhZjNiNzMwZTZlZTQxZTM4NTJhNzk2OTY5OGM3ODUwZDU1NzliNTUwYjRiNTVlYmM3ZjJkNzc4IiwidGFnIjoiIn0%3D"} /> */}
                    <input type="hidden" name="redirect_url" value="/admin/xlsform/create" />
                    <button type="submit" style={{ margin: 0, padding: 0, border: 0, backgroundColor: "white" }}>


                        < Card key={"card-" + props.data.name} className="sub-card portal-card border-0">
                            <div key={"header-container-" + props.data.name} className="portal-card-header-container">
                                <h4 key={"card-header-" + props.data.name} className="portal-card-header">{props.data.name}</h4>
                            </div>
                            <div key={"icon-container-" + props.data.name} className="portal-icon-container">
                                <Icon size={100} color="white" />
                            </div>
                        </Card >
                    </button >
                </form>

            </div >
        )
    }



    if (props.data.external === true & props.data.label !== "surveyBuilder") {
        return (
            <div>
                <Link style={{ 'textDecoration': 'none' }} target="_blank" to={{ pathname: props.data.link }}>
                    < Card className="sub-card portal-card border-0">
                        <div className="portal-card-header-container">
                            <h4 className="portal-card-header">{props.data.name}</h4>
                        </div>
                        <div className="portal-icon-container">

                            <Icon size={100} color="white" />
                        </div>
                    </Card >
                </Link>

            </div >
        )
    }
}


function RenderPortalCards(props) {

    const portalCardData = []
    console.log(props.data[0])
    console.log(props.userData)

    if (props.userData) {
        if (props.userData.basic === true) {
            const cardToAdd = props.data.filter(item => item.label === "surveyBuilder")
            portalCardData.push(...cardToAdd)
        }
        if (props.userData.dataCollector.length > 0) {
            const cardToAdd = props.data.filter(item => item.label === "dataCollector")
            portalCardData.push(...cardToAdd)
        }

        if (props.userData.projectManager.length > 0 | props.userData.analyst.length > 0) {
            const cardToAdd = props.data.filter(item => item.label === "projectManager")
            portalCardData.push(...cardToAdd)
        }

        if (props.userData.researcher.length > 0) {
            const cardToAdd = props.data.filter(item => item.label === "globalData")
            portalCardData.push(...cardToAdd)
        }

        if (props.userData.administrator === true) {
            const cardToAdd = props.data.filter(item => item.label === "administrator")
            portalCardData.push(...cardToAdd)
        }


        if (props.userData.basic === true) {
            const cardToAdd = props.data.filter(item => item.label === "help")
            portalCardData.push(...cardToAdd)
        }

    }

    if (!props.userData) {
        portalCardData.push(props.data[0])
    }



    return (
        <>
            {portalCardData.map((PortalItem) => {
                return <PortalCard data={PortalItem} history={props.history} authToken={props.authToken} />
            })
            }
        </>
    )

}

export default function PortalComponent() {

    const [userData, setUserData] = useState(null)
    const [useInfoAvail, setUserInfoAvail] = useState(false)
    const [authToken, setAuthToken] = useContext(AuthContext)
    const history = useHistory()

    useEffect(async () => {
        const newUserData = await FetchProjectInformation(authToken
        )
        setUserData(newUserData)
        setUserInfoAvail(true)
    }, [])

    return (
        <div className="sub-page-container">
            <Card className="main-card border-0">
                <Card.Header className="bg-dark text-white">
                    <h3 >Portal</h3>
                </Card.Header>
                <Card.Body className="main-card-body">
                    <RenderPortalCards data={PortalDataAll} userData={userData} history={history} authToken={authToken} />

                </Card.Body>
            </Card>

        </div >
    )

}
