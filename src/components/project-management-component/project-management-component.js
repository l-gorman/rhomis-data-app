import React, { useState, useEffect, useContext } from 'react'
import { Form, Button, Card, Table } from 'react-bootstrap'
import axios from 'axios'
import AuthContext from '../authentication-component/AuthContext'
import './project-management-component.css'
import { actions } from 'react-table'
import { response } from 'msw'


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

        props.setProjectInformation(result.data)
        props.setProjectInformationAvailable(true)
    }
    if (result.status === 400) {
        alert(result.data)
    }
}


function RenderProjectInformation(props) {
    // Need:
    //props.projects (array of objects)
    //props.forms

    // console.log("project info avail:" + props.projectInformationAvailable)
    // console.log("project info:")
    // console.log(props.projectInformation)
    // console.log(props.projectInformation.forms.length === 0)
    if (props.projectInformationAvailable) {

        return (
            <>
                All Projects:
                <ul>
                    {props.projectInformation.projects.map((project) => {
                        return <li>{project.name}</li>
                    })}
                </ul>


                {props.projectInformation.forms.length > 0 ? <Table striped bordered hover variant="dark">
                    <thead>
                        < tr >
                            <th>Project</th>
                            <th>Form</th>
                        </tr >
                    </thead>
                    <tbody>
                        {props.projectInformation.forms.map((form) => {
                            return <tr>
                                <td>{form.project}</td>
                                <td>{form.name}</td></tr>
                        })}

                    </tbody>
                </Table > : <h2>No forms loaded yet</h2>}
            </>)
    }
    if (!props.projectInformationAvailable) return (<>No Projects</>)

    return
}

async function CreateProject(authToken, projectName, formName, formFile) {
    console.log(projectName)
    console.log(authToken)

    // Create project
    const projectCreationResponse = await axios({
        method: "post",
        url: process.env.REACT_APP_AUTHENTICATOR_URL + "api/projects/create",
        data: {
            name: projectName
        },
        headers: {
            'Authorization': authToken
        }
    })

    return (projectCreationResponse)
}

async function DeleteProject(authToken, projectName, formName, formFile) {
    console.log(projectName)
    console.log(authToken)

    // Create project
    const projectCreationResponse = await axios({
        method: "delete",
        url: process.env.REACT_APP_AUTHENTICATOR_URL + "api/projects/delete",
        data: {
            name: projectName
        },
        headers: {
            'Authorization': authToken
        }
    })

    return (projectCreationResponse)
}


async function CreateForm(authToken, projectName, formName, formFile) {
    console.log(projectName)
    console.log(process.env.REACT_APP_AUTHENTICATOR_URL + 'api/forms/new?form_name=' + formName + '&project_name=' + projectName + '&publish=true')


    // Create form
    const formCreationResponse = await axios({
        method: "post",
        url: process.env.REACT_APP_AUTHENTICATOR_URL + 'api/forms/new?form_name=' + formName + '&project_name=' + projectName + '&publish=true',
        data: formFile,
        headers: {
            'Authorization': authToken,
            'Content-Type': "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }
    })
    return (formCreationResponse)




}


export default function ProjectManagementComponent(props) {

    const [projectInformation, setProjectInformation] = useState(null)
    const [projectInformationAvailable, setProjectInformationAvailable] = useState(false)

    const [authToken, setAuthToken] = useContext(AuthContext)


    const [projectName, setProjectName] = useState(null)
    const [formName, setFormName] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null);


    useEffect(() => {
        console.log(projectName)

    }, [projectName])

    return (
        <div id="project-management-container" className="sub-page-container">

            <Card >
                <Card.Header className="bg-dark text-white">Get Project MetaData</Card.Header>
                <Card.Body>

                    <RenderProjectInformation projectInformation={projectInformation} projectInformationAvailable={projectInformationAvailable} />

                </Card.Body>


                <div className="end-button-container">
                    <Button className="end-button" onClick={async () => {
                        const projectResponse = await GetProjectInformation({
                            setProjectInformationAvailable: setProjectInformationAvailable,
                            setProjectInformation: setProjectInformation,
                            authToken: authToken
                        })
                        console.log(projectResponse)

                    }

                    }>Get Project Information</Button>

                </div>
            </Card>



            <Card >
                <Card.Header className="bg-dark text-white">Add a project</Card.Header>
                <Card.Body>

                    Please use this form to create a new project and form to start collecting data

                    <Form>
                        <Form.Group className="mb-3" controlId="newProjectEntry">
                            <Form.Label>Project Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter a project name" onChange={(e) => setProjectName(e.target.value)} />
                            <Form.Text className="text-muted">
                                This is a project which will be able to hold multiple forms
                            </Form.Text>
                        </Form.Group>
                    </Form>
                </Card.Body>

                <div className="end-button-container">
                    <Button className="end-button" onClick={async () => {
                        const projectResponse = await CreateProject(authToken, projectName, formName, selectedFile)
                        console.log(projectResponse)

                    }

                    }>Create Project</Button>

                </div>


                <Card>
                    <Card.Header className="bg-dark text-white">Create a New form</Card.Header>

                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="newProjectEntry">
                                <Form.Label>Project Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter a project name" onChange={(e) => setProjectName(e.target.value)} />
                                <Form.Text className="text-muted">
                                    This is a project which will be able to hold multiple forms
                                </Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="newFormEntry">
                                <Form.Label>Form name</Form.Label>
                                <Form.Control type="text" placeholder="Enter the name of your form" onChange={(e) => setFormName(e.target.value)} />
                                <Form.Text className="text-muted">
                                    This must match the "form_title" field in your xlsx form settings
                                </Form.Text>
                            </Form.Group>

                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label>Select your xlsx file</Form.Label>
                                <Form.Control type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
                            </Form.Group>


                        </Form>
                    </Card.Body>

                    <div className="end-button-container">
                        <Button className="end-button" onClick={async () => {
                            const formResponse = await CreateForm(authToken, projectName, formName, selectedFile)
                            console.log(formResponse)

                        }

                        }>Submit Form</Button>
                    </div>


                </Card>

            </Card>

            <Card>
                <Card.Header className="bg-dark text-white">Delete a Project
                </Card.Header>

                <Card.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="newProjectEntry">
                            <Form.Label>Project Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter a project name" onChange={(e) => setProjectName(e.target.value)} />
                            <Form.Text className="text-muted">
                                This is a project which will be able to hold multiple forms
                            </Form.Text>
                        </Form.Group>
                    </Form>


                </Card.Body>

                <div className="end-button-container">
                    <Button className="end-button" variant="danger" onClick={async () => {
                        const projectResponse = await DeleteProject(authToken, projectName, formName, selectedFile)
                        console.log(projectResponse)

                    }

                    }>Delete Project</Button>
                </div>



            </Card>

        </div >
    )
}
