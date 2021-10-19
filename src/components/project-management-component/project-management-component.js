import React, { useState, useEffect, useContext } from 'react'
import { Form, Button, Card, Table } from 'react-bootstrap'
import axios from 'axios'
import AuthContext from '../authentication-component/AuthContext'
import './project-management-component.css'
import { actions } from 'react-table'
import { response } from 'msw'

import { MdOutlineRefresh } from 'react-icons/md'


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
    }
    if (result.status === 400) {
        alert(result.data)
    }
}


function RenderProjectInformation(props) {

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
                            <th ></th>
                        </tr >
                    </thead>
                    <tbody>
                        {props.projectInformation.forms.map((form) => {
                            return <tr>
                                <td >{form.project}</td>
                                <td>{form.name}</td>
                                <td><Button className="float-right">Select</Button></td>
                            </tr>

                        })}

                    </tbody>
                </Table > : <h2>No forms loaded yet</h2>}
            </>)
    }
    if (!props.projectInformationAvailable) return (<>No Projects</>)

    return
}
function RenderProjectCards(props) {
    console.log("Render cards props")
    console.log(props)

    return props.data.map((project) => {
        return (<RenderProjectCard data={project} />)
    })

}
function RenderProjectCard(props) {
    // console.log(props)
    return (
        <>
            < Card className="sub-card project-card border-0">
                <h4 className="portal-card-header">{props.data.name}</h4>
                <p className="sub-card-text text-white">{props.data.description}</p>

            </Card >
        </>
    )
}


export default function ProjectManagementComponent(props) {

    const [projectInformation, setProjectInformation] = useState([])

    const [authToken, setAuthToken] = useContext(AuthContext)

    // const [filters, setFilters] = useState([])


    // const [projectName, setProjectName] = useState(null)

    const [projectSelected, setProjectSelected] = useState(null)
    const [formSelected, setFormSelected] = useState(null)



    const projects = [{
        name: "xyz",
        description: "short description to remember details about the project"
    },
    {
        name: "abc",
        description: "short description to remember details about the project"
    }]

    useEffect(async () => {
        const projectResponse = await GetProjectInformation({
            setProjectInformation: setProjectInformation,
            authToken: authToken
        })
        // console.log(projectResponse)

    }, [])


    useEffect(() => {
        console.log("Project Information")

        console.log(projectInformation.projects)

    }, [projectInformation])

    return (
        <div id="project-management-container" className="sub-page-container">

            <Card className="main-card border-0">
                <Card.Header className=" bg-dark text-white">
                    <div className="main-card-header-container">
                        <h3>Get Project MetaData</h3>

                        <div style={{ "display": "flex", "flex-direction": "row", "margin-left": "auto" }} >
                            <div className="main-card-header-item">filter 1</div>
                            <div className="main-card-header-item">filter 2</div>
                            <div className="main-card-header-item">filter 3</div>
                            <Button className="bg-dark border-0" onClick={async () => {
                                const projectResponse = await GetProjectInformation({
                                    setProjectInformation: setProjectInformation,
                                    authToken: authToken
                                })
                                console.log(projectResponse)

                            }
                            }><MdOutlineRefresh size={25} /></Button>
                        </div>
                    </div>


                </Card.Header>

                <Card.Body className="main-card-body">

                    {projectSelected ? <h1>No projects found</h1> : <RenderProjectCards data={projects} />}

                </Card.Body>



            </Card >

        </div >
    )
}
