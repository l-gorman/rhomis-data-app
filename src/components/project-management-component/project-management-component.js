import React, { useState, useEffect, useContext } from 'react'
import { Form, Button, Card, Table } from 'react-bootstrap'
import axios from 'axios'
import AuthContext from '../authentication-component/AuthContext'
import './project-management-component.css'
import '../../App.css'


import { useHistory } from 'react-router'

import { AiOutlineArrowLeft } from 'react-icons/ai'

import QRCode from 'react-qr-code'
import { deflateSync } from 'zlib'

async function GetProjectInformation(props) {
    console.log("authToken: ", props.authToken)
    const result = await axios({
        method: 'get',
        url: process.env.REACT_APP_AUTHENTICATOR_URL + "api/meta-data",
        headers: {
            'Authorization': props.authToken
        }
    })

    console.log("response: ")
    console.log(result)
    if (result.status === 200) {
        console.log("Setting project information")

        props.setAdminData(result.data)
    }
    if (result.status === 400) {
        alert(result.data)
    }
}

async function ProcessData(props) {
    console.log("Process data form")


    const form = props.data.forms.filter((item) => item.name === props.formSelected)[0]
    console.log(form)


    const result = await axios({
        method: 'post',
        url: process.env.REACT_APP_API_URL + "api/process-data",
        headers: {
            'Authorization': props.authToken
        },
        data: {
            commandType: props.commandType,
            projectName: props.projectSelected,
            formName: props.formSelected,
            formVersion: form.formVersion,
            draft: props.draft,
        }
    })

    console.log(result)
    return (result)


}

function RenderProjectInformation(props) {
    console.log(props)
    if (props.data.projects === undefined) {
        return (
            <div>
                <Table striped bordered hover>
                    <thead key="table-header">
                        <tr key="table-row-1">

                            <th key="table-head-item-1">Project Name</th>
                            <th key="table-head-item-2">Description</th>
                            <th key="table-head-item-3">Created at</th>
                            <th key="table-head-item-4"></th>


                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={4}>No projects found</td>
                        </tr>

                    </tbody>

                </Table>
            </div>
        )
    }

    if (props.data.projects.length === 0) {
        return (
            <div>
                <Table striped bordered hover>
                    <thead key="table-header">
                        <tr key="table-row-1">

                            <th key="table-head-item-1">Project Name</th>
                            <th key="table-head-item-2">Description</th>
                            <th key="table-head-item-3">Created at</th>
                            <th key="table-head-item-4"></th>


                        </tr>
                    </thead>
                    <tbody>
                        <tr >
                            <td colSpan={4} style={{ "text-align": "center" }}>No projects found</td>
                        </tr>
                        <tr >
                            <td colSpan={4} style={{ "text-align": "center" }}><a href="https://rhomis-survey.stats4sdtest.online"><Button >Start Creating a Survey</Button></a></td>
                        </tr>

                    </tbody>

                </Table>
            </div>
        )
    }


    if (props.data.projects !== undefined) {
        return (
            <div>
                <Table striped bordered hover>
                    <thead key="table-header">
                        <tr key="table-row-1">
                            <th key="table-head-item-1">Project Name</th>
                            <th key="table-head-item-2">Description</th>
                            <th key="table-head-item-3">Created at</th>
                            <th key="table-head-item-4"></th>
                        </tr>
                    </thead>
                    <tbody key="table-body">
                        {props.data.projects.map((project, index) => {
                            let date = new Date(project.createdAt)
                            let dateString = date.toDateString()
                            return (
                                <tr key={"table-row-" + index}>

                                    <td key={"table-row-" + index + "-item-1"}>{project.name}</td>
                                    <td key={"table-row-" + index + "-item-2"}>{project.description}</td>
                                    <td key={"table-row-" + index + "-item-3"}>{dateString}</td>
                                    <td key={"table-row-" + index + "-item-4"}>
                                        <Button className="bg-dark text-white border-0" onClick={() => {
                                            props.setProjectSelected(project.name)
                                            const currentFilters = props.filters
                                            currentFilters.push("Project: " + project.name)
                                            props.setFilters(currentFilters)
                                            props.setTitle("Select a Form")
                                        }}>
                                            Select
                                        </Button></td>
                                </tr>
                            )

                        })}

                    </tbody>
                </Table>
            </div>


        )
    }

}

async function FinalizeForm(props) {

    console.log("Finalizing form")

    const result = await axios({
        method: 'post',
        url: process.env.REACT_APP_AUTHENTICATOR_URL + "api/forms/publish",
        headers: {
            'Authorization': props.authToken
        },
        params: {
            form_name: props.form,
            project_name: props.project
        }
    })

    console.log("Finalization response")
    console.log(result)

}

function FormTables(props) {

    console.log("Render project admin props")
    console.log(props)

    let formsExist = false

    if (props.data.forms !== undefined) {

        if (props.data.forms.length > 0) {
            let formsForProject = props.data.forms.filter((form) => form.project === props.projectSelected)
            formsExist = formsForProject.length > 0

            console.log("formsForProject")

            console.log(formsForProject)
        }
    }


    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Form Name</th>
                    <th>Status</th>

                    <th>Created At</th>
                    <th style={{ "width": "40px" }}></th>
                    <th style={{ "width": "40px" }}></th>
                </tr>
            </thead>
            <tbody>
                {formsExist ? props.data.forms.map((form) => {
                    let date = new Date(form.createdAt)
                    let dateString = date.toDateString()
                    if (form.project === props.projectSelected) {
                        return (
                            <tr>
                                <td>{form.name}</td>
                                <td>{form.draft ? "Draft" : "Finalized"}</td>
                                <td >{dateString}</td>
                                <td style={{ "width": "40px" }}>
                                    <Button disabled={!form.draft} className="bg-dark text-white border-0"
                                        onClick={async () => {

                                            const finalizedForm = await FinalizeForm({
                                                form: form.name,
                                                project: props.projectSelected,
                                                authToken: props.authToken
                                            })

                                            const metaData = await GetProjectInformation({
                                                setAdminData: props.setAdminData,
                                                authToken: props.authToken
                                            })

                                        }}>Finalize</Button></td>
                                <td style={{ "width": "40px" }}><Button className="bg-dark text-white border-0"
                                    onClick={() => {
                                        props.setFormSelected(form.name)
                                        const newFilters = props.filters
                                        newFilters.push("Form: " + form.name)
                                        props.setFilters(newFilters)
                                    }}>Select</Button></td>
                            </tr>
                        )
                    }

                }) : <><tr><td style={{ "text-align": "center" }} colSpan={5}>No forms created yet</td></tr>
                    <tr><td style={{ "text-align": "center" }} colSpan={5}><a href="https://rhomis-survey.stats4sdtest.online"><Button >Start Creating a Survey</Button></a></td></tr></>}
            </tbody>

        </Table >
    )
}

function UserTables() {

    const users = []

    return (
        <>
            <Table key="user-table">
                <thead key="user-table-head">
                    <tr key="user-table-head-row">
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>

                <tbody>
                    {users.length === 0 ?
                        <tr>
                            <td colSpan={2}>No other users found</td>
                        </tr> :
                        <tr>
                            <td colSpan={2}>Users found</td>
                        </tr>
                    }
                </tbody>

            </Table>
        </>
    )

}

function UserForm() {

    return (
        <>
            <Form>
                <Form.Group>
                    <Form.Label>User email</Form.Label>
                    <Form.Control />
                </Form.Group>
                <Form.Group>
                    <Form.Label>User Role</Form.Label>
                    <Form.Select aria-label="Default select example" defaultValue="Open this select menu">
                        <option disabled={true}>Open this select menu</option>
                        <option value="dataCollector">Data Collector: Can access training materials and configure enumerator devices</option>
                        <option value="dataAnalyst">Data Analyst: Can download processed data</option>
                    </Form.Select>
                </Form.Group>

                <Button className="bg-dark text-white border-0 float-right" style={{ "marginTop": "10px" }}>Add User</Button>

            </Form>
        </>
    )

}

function RenderProjectAdmin(props) {
    let renderUserForm = false

    if (props.data.user.roles.projectManager !== undefined) {
        renderUserForm = props.data.user.roles.projectManager.length > 0
    }


    return (<>
        <Card className="project-management-card">
            <Card.Header as="h5">Select a Form</Card.Header>
            <Card.Body>
                {/* <Card.Title>Special title treatment</Card.Title> */}
                <FormTables projectSelected={props.projectSelected} authToken={props.authToken} setAdminData={props.setAdminData} data={props.data} filters={props.filters} setFilters={props.setFilters} setFormSelected={props.setFormSelected} />
            </Card.Body>
        </Card>

        {renderUserForm ? <Card className="project-management-card">
            <Card.Header as="h5">Add Project Manager</Card.Header>
            <Card.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>User email</Form.Label>
                        <Form.Control />
                    </Form.Group>
                    <Button className="bg-dark text-white border-0 float-right" style={{ "marginTop": "10px" }}>Add Project Manager</Button>
                </Form>
            </Card.Body>
        </Card> : <></>}




    </>

    )

}

function BackButton(props) {

    if (props.filters.length === 1) {
        props.setProjectSelected(false)
        props.setFilters([])
        props.setTitle("Select a Project")
    }

    if (props.filters.length === 2) {
        props.setFormSelected(false)
        const newFilters = props.filters[0]
        props.setFilters([newFilters])
        props.setTitle("Select a Form")

    }

}

function RenderFormAdmin(props) {

    const [renderInstallCode, setRenderInstallCode] = useState(false)
    const [renderODKFormCode, setRenderODKFormCode] = useState(true)
    console.log("Form Props")

    console.log(props)

    let renderUserForm = false

    if (props.data.user.roles.projectManager !== undefined) {
        renderUserForm = props.data.user.roles.projectManager.length > 0
    }

    let odkConf = {}
    let draft = null

    if (props.data.forms !== undefined) {
        let form = props.data.forms.filter((item) => item.name === props.formSelected)

        if (form.length === 1) {
            if (form[0].draft === true) {
                odkConf = form[0].draftCollectionDetails
                draft = true
            }
            if (form[0].draft === false) {
                odkConf = form[0].collectionDetails
                draft = false
            }
        }
        console.log(form)

    }

    console.log(odkConf)
    const encoded_settings = deflateSync(JSON.stringify(odkConf)).toString('base64');

    return (
        <>
            <Card className="project-management-card">
                <Card.Header>Collect Data</Card.Header>
                <Card.Body>
                    <p>
                        To start collecting data and submitting completed surveys you will need
                        to make sure you have installed the ODK Collect App on your android device.
                        To install ODK collect, scan <a href="#" onClick={(e) => {
                            e.preventDefault()
                            setRenderInstallCode(!renderInstallCode)
                        }} className="qr-code-link">this QR code</a> or
                        search for ODK collect on the Google Play Store.
                    </p>
                    {renderInstallCode ?
                        <>
                            <div className="qr-code-container">

                                <QRCode value={"https://play.google.com/store/apps/details?id=org.odk.collect.android&hl=en_GB&gl=US"} />

                            </div>
                            <div className="qr-code-container">
                                <Button onClick={() => {
                                    setRenderInstallCode(false)
                                }}>Hide Code</Button>
                            </div>
                        </>
                        : <></>}

                    <p>
                        Once you have installed ODK collect, you will need to configure the app to
                        access RHoMIS forms. Open the app. If this is your first time using ODK
                        there will be an option to "Configure with QR code". Use <a href="#" onClick={(e) => {
                            e.preventDefault()
                            setRenderODKFormCode(!renderODKFormCode)

                        }} className="qr-code-link">this QR code</a>. If you have used the App
                        before, you will need to add this form.
                    </p>
                    {renderODKFormCode ?
                        <>
                            <div className="qr-code-container">

                                <QRCode value={encoded_settings} />

                            </div>
                            <div className="qr-code-container">
                                <Button onClick={() => {
                                    setRenderODKFormCode(false)
                                }}>Hide Code</Button>
                            </div>
                        </>
                        : <></>}
                    {draft ? <h4>***Your form is currently saved as a draft. Any submissions you make
                        will be removed once the form is finalised*** </h4> : <></>}

                </Card.Body>
            </Card>

            <Card className="project-management-card">
                <Card.Header>Process Data</Card.Header>
                <Card.Body>
                    {draft ? <Button style={{ "margin": "10px" }}
                        onClick={async () => {
                            await ProcessData({
                                commandType: "generate",
                                draft: draft,
                                authToken: props.authToken,
                                data: props.data,
                                formSelected: props.formSelected,
                                projectSelected: props.projectSelected
                            })
                            console.log("gen data")
                        }}

                    >Generate Data</Button> : <></>}


                    <Button style={{ "margin": "10px" }}
                        onClick={async () => {
                            await ProcessData({
                                commandType: "units",
                                draft: draft,
                                authToken: props.authToken,
                                data: props.data,
                                formSelected: props.formSelected,
                                projectSelected: props.projectSelected
                            })
                            console.log("gen data")
                        }}
                    >
                        Extract Units
                    </Button>
                    <Button style={{ "margin": "10px" }}
                        onClick={async () => {
                            await ProcessData({
                                commandType: "process",
                                draft: draft,
                                authToken: props.authToken,
                                data: props.data,
                                formSelected: props.formSelected,
                                projectSelected: props.projectSelected
                            })
                            console.log("gen data")
                        }}
                    >
                        Process Data
                    </Button>

                </Card.Body>
            </Card>

            <Card className="project-management-card">
                <Card.Header>Modify Units</Card.Header>
                <Card.Body>Test Body</Card.Body>
            </Card>

            {
                renderUserForm ? <Card className="project-management-card">
                    <Card.Header as="h5">Manage Users</Card.Header>
                    <Card.Body>
                        <UserTables />
                        <UserForm />
                    </Card.Body>
                </Card> :
                    <></>
            }
        </>
    )
}

export default function ProjectManagementComponent(props) {

    const history = useHistory()

    const [authToken, setAuthToken] = useContext(AuthContext)

    const [adminData, setAdminData] = useState([])


    const [filters, setFilters] = useState([])

    const [title, setTitle] = useState("Select a Project")

    // const [projectName, setProjectName] = useState(null)

    const [projectSelected, setProjectSelected] = useState(false)
    const [formSelected, setFormSelected] = useState(false)

    useEffect(async () => {
        const metaData = await GetProjectInformation({
            setAdminData: setAdminData,
            authToken: authToken
        })
    }, [])

    return (
        <div id="project-management-container" className="sub-page-container">

            <Card className="main-card border-0">
                <Card.Header className=" bg-dark text-white">
                    <div className="main-card-header-container">
                        <h3>{title}</h3>
                        <div style={{ "display": "flex", "flex-direction": "row", "margin-left": "auto" }} >
                            {/* Render the filters in the top of the card */}
                            {filters ? filters.map((filter) => {
                                return <div className="main-card-header-item">{filter}</div>
                            }) : ''}
                            {/* Render the refresh button if no  */}
                            {filters.length > 0 ?
                                <Button className="bg-dark border-0" onClick={() => {
                                    BackButton({
                                        setProjectSelected: setProjectSelected,
                                        setFilters: setFilters,
                                        filters: filters,
                                        setFormSelected: setFormSelected,
                                        setTitle: setTitle,

                                    })
                                }}>
                                    <AiOutlineArrowLeft size={25} />
                                </Button> :
                                <Button className="bg-dark border-0" onClick={() => {
                                    history.push("/")

                                }
                                }><AiOutlineArrowLeft size={25} /></Button>}
                        </div>
                    </div>


                </Card.Header>

                <Card.Body className="main-card-body">
                    {(filters.length === 0 & projectSelected === false) ? <RenderProjectInformation data={adminData} setProjectSelected={setProjectSelected} filters={filters} setFilters={setFilters} setTitle={setTitle} /> : <></>}

                    {(filters.length === 1 & projectSelected !== false) ?
                        <RenderProjectAdmin
                            authToken={authToken}
                            projectSelected={projectSelected}
                            formSelected={formSelected}
                            setAdminData={setAdminData}
                            data={adminData}
                            setFormSelected={setFormSelected}
                            filters={filters}
                            setFilters={setFilters} /> : <></>}
                    {(filters.length === 2 & projectSelected !== false & formSelected !== false) ?
                        <RenderFormAdmin
                            authToken={authToken}
                            setAdminData={setAdminData}
                            data={adminData}
                            formSelected={formSelected}
                            projectSelected={projectSelected} /> : <></>}
                </Card.Body>
            </Card >
        </div >
    )
}
