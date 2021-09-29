import React, { useState, useEffect, useContext } from 'react'

import { Form, Button, Card } from 'react-bootstrap'

import axios from 'axios'


import AuthContext from '../authentication-component/AuthContext'



import './project-management-component.css'
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
                <Card.Header className="bg-dark text-white"><h2>Project Management</h2>
                </Card.Header>
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

                    <Button className="end-button" onClick={async () => {
                        const projectResponse = await DeleteProject(authToken, projectName, formName, selectedFile)
                        console.log(projectResponse)

                    }

                    }>Delete Project</Button>
                </div>

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

        </div >
    )
}
