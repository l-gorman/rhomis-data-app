// Copyright (C) 2022 Léo Gorman
// 
// This file is part of rhomis-data-app.
// 
// rhomis-data-app is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// rhomis-data-app is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with rhomis-data-app.  If not, see <http://www.gnu.org/licenses/>.

import { useParams } from "react-router-dom"
import { FetchUserInformation, GetInformationForFormComponent } from '../fetching-context-info/fetching-context-info'
import { Spinner } from "react-bootstrap"


import React, { useState, useEffect, useContext } from 'react'
import { Form, Button, Card, Table, CardGroup, DropdownButton, Dropdown } from 'react-bootstrap'
import axios from 'axios'
import AuthContext from '../authentication-component/AuthContext'
import UserContext from "../user-info-component/UserContext"
import '../project-management-component/project-management-component.css'
import '../../App.css'


import { useHistory } from 'react-router'

import { AiOutlineArrowLeft } from 'react-icons/ai'

import QRCode from 'react-qr-code'
import { deflateSync } from 'zlib'

// Generating a link to download the csv data


// async function FinalizeForm(props) {

//     console.log("Finalizing form")

//     const result = await axios({
//         method: 'post',
//         url: process.env.REACT_APP_AUTHENTICATOR_URL + "api/forms/publish",
//         headers: {
//             'Authorization': props.authToken
//         },
//         params: {
//             form_name: props.form,
//             project_name: props.project
//         }
//     })

//     FetchUserInformation({
//         authToken: props.authToken,
//         setUserInfo: props.setAdminData
//     })

//     // console.log("Finalization response")
//     // console.log(result)

// }

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('/');
}


function NoInfoFound() {
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Form Name</th>
                    <th>Status</th>

                    <th>Created At</th>

                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colSpan={3}>Forms Not Found</td>
                </tr>
            </tbody>

        </Table >
    )


}

function FormTables(props) {

    const history = useHistory()


    let allowToFinalize = false
    if (!props.data) {
        return (<NoInfoFound />)
    }
    if (!props.data.user) {
        return (<NoInfoFound />)
    }
    if (!props.data.user.roles) {
        return (<NoInfoFound />)
    }
    if (props.data.user.roles.projectManager !== undefined) {
        if (props.data.user.roles.projectManager.includes(props.projectSelected))
            allowToFinalize = true
    }

    let formsExist = false

    if (props.data.forms !== undefined) {

        if (props.data.forms.length > 0) {
            let formsForProject = props.data.forms.filter((form) => form.project === props.projectSelected)
            formsExist = formsForProject.length > 0


        }
    }


    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Form Name</th>
                    <th>Status</th>

                    <th>Created At</th>
                    <th>Submissions</th>
                    <th ></th>


                </tr>
            </thead>
            <tbody>
                {formsExist ? props.data.forms.map((form) => {
                    // let date = new Date(form.createdAt)
                    let dateString = formatDate(form.createdAt)
                    if (form.project === props.projectSelected) {

                        let disableButton = true

                        let accessData = false

                        if (allowToFinalize === false) {
                            disableButton = false
                        }

                        if (form.draft) {
                            disableButton = false
                        }

                        if (form.submissions > 0) {

                            accessData = true

                        }



                        return (
                            <tr>
                                <td style={{ "vertical-align": "middle" }}>{form.name}</td>
                                <td style={{ "vertical-align": "middle" }}>{form.draft ? "Draft" : "Finalized"}</td>
                                <td style={{ "vertical-align": "middle" }}>{dateString}</td>
                                <td style={{ "vertical-align": "middle" }}>{props.submissionsLoading ? <Spinner as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true" /> : form.submissions}</td>

                                <td style={{ "text-align": "center" }}>
                                    <DropdownButton title="Options" variant="dark" menuVariant="dark border-0" drop="end">
                                        <Dropdown.Item className="dark text-white border-0"
                                            onClick={() => {
                                                history.push("/projects/" + props.projectSelected + "/forms/" + form.name + "/collect")
                                            }}>Collect Data</Dropdown.Item>
                                        <Dropdown.Item className="dark text-white border-0"
                                            onClick={() => {
                                            }}>Edit Form</Dropdown.Item>

                                        <Dropdown.Item className="dark text-white border-0"
                                            onClick={() => {


                                                history.push("/projects/" + props.projectSelected + "/forms/" + form.name + "/users")

                                            }}>Manage Users</Dropdown.Item>
                                        {accessData ?
                                            <Dropdown.Item className="dark text-white border-0"
                                                onClick={() => {

                                                    history.push("/projects/" + props.projectSelected + "/forms/" + form.name + "/data")

                                                }}
                                            >Access Data</Dropdown.Item> : <></>}
                                    </DropdownButton>
                                </td>
                            </tr>
                        )
                    }

                }) : <><tr><td style={{ "text-align": "center" }} colSpan={5}>No forms created yet</td></tr></>}
                {/* <tr><td style={{ "text-align": "center" }} colSpan={5}><a href="https://rhomis-survey.stats4sdtest.online"><Button >Start Creating a Survey</Button></a></td></tr></>} */}
            </tbody>

        </Table >
    )
}





function RenderProjectAdmin(props) {
    let renderUserForm = false

    const [newUser, setNewUser] = useState('')

    if (!props.data) {
        return (<NoInfoFound />)
    }
    if (!props.data.user) {
        return (<NoInfoFound />)
    }
    if (!props.data.user.roles) {
        return (<NoInfoFound />)
    }

    if (props.data.user.roles.projectManager !== undefined) {
        if (props.data.user.roles.projectManager.includes(props.projectSelected))
            renderUserForm = true
    }

    return (<>
        <Card className="project-management-card">
            <Card.Header as="h5">Select a Form</Card.Header>
            <Card.Body>
                {/* <Card.Title>Special title treatment</Card.Title> */}
                <FormTables submissionsLoading={props.submissionsLoading} projectSelected={props.projectSelected} authToken={props.authToken} setAdminData={props.setAdminData} data={props.data} filters={props.filters} setFilters={props.setFilters} setFormSelected={props.setFormSelected} />
            </Card.Body>
        </Card>






    </>

    )

}




function FormManagementComponent() {
    // const { projectName } = useParams()

    const history = useHistory()
    const projectSelected = useParams().projectName
    const [authToken, setAuthToken] = useContext(AuthContext)
    const [adminData, setAdminData] = useContext(UserContext)

    const [submissionsLoading, setSubmissionLoading] = useState(true)

    const [formData, setFormData] = useState()

    console.log("admin data")
    console.log(adminData)

    const [formSelected, setFormSelected] = useState(null)
    const [filters, setFilters] = useState(null)
    const data = null

    useEffect(() => {




        async function GetUserInfo() {

            await FetchUserInformation({
                authToken: authToken,
                setUserInfo: setAdminData,
                getSubmissionCount: true
            })

            setSubmissionLoading(false)

        }

        GetUserInfo()

    }, [])

    // useEffect(() => {
    //     console.log("Form Data")
    //     console.log(formData)

    // }, [formData])




    return (

        <div id="project-management-container" className="sub-page-container">

            <Card className="main-card border-0">
                <Card.Header className=" bg-dark text-white">
                    <div className="main-card-header-container">
                        <h3>Form Overview</h3>
                        <div style={{ "display": "flex", "flex-direction": "row", "margin-left": "auto" }} >
                            <div className="main-card-header-item">{projectSelected}</div>
                            <Button className="bg-dark border-0" onClick={() => {
                                history.push("/projects")
                            }}>
                                <AiOutlineArrowLeft size={25} />
                            </Button>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body className="main-card-body">
                    <RenderProjectAdmin
                        authToken={authToken}
                        projectSelected={projectSelected}
                        formSelected={formSelected}
                        setAdminData={setAdminData}
                        data={adminData}
                        setFormSelected={setFormSelected}
                        filters={filters}
                        setFilters={setFilters}
                        submissionsLoading={submissionsLoading} />
                </Card.Body>
            </Card>
        </div >
    )


}




export default FormManagementComponent