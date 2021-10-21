import React, { useState, useEffect, useContext } from 'react'
import { Form, Button, Card, Table } from 'react-bootstrap'
import axios from 'axios'
import AuthContext from '../authentication-component/AuthContext'
import './project-management-component.css'
import { actions } from 'react-table'
import { response } from 'msw'

import { MdOutlineRefresh } from 'react-icons/md'
import { AiOutlineArrowLeft } from 'react-icons/ai'


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

    if (props.data.projects === undefined) {
        return (
            <div>
                <Table striped bordered hover>
                    <thead key="table-header">
                        <tr key="table-row-1">

                            <th key="table-head-item-2">Project Name</th>
                            <th key="table-head-item-3">Description</th>
                            <th key="table-head-item-3">Created at</th>

                            <th key="table-head-item-1"></th>

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
                                            props.setTitle("Project Administration")
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

function SelectProject(props) {

}

function FormTables() {
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>x</th>
                    <th>y</th>
                    <th>z</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                </tr>
                <tr>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                </tr>
            </tbody>

        </Table>
    )
}

function RenderProjectAdmin() {

    return (<>
        <Card className="project-management-card">
            <Card.Header as="h5">Select a Form</Card.Header>
            <Card.Body>
                {/* <Card.Title>Special title treatment</Card.Title> */}
                <FormTables />
                <Button variant="primary">Go somewhere</Button>
            </Card.Body>
        </Card>

        <Card className="project-management-card">
            <Card.Header as="h5">Manage Users</Card.Header>
            <Card.Body>
                {/* <Card.Title>Special title treatment</Card.Title> */}
                <Card.Text>

                </Card.Text>
                <Button variant="primary">Go somewhere</Button>
            </Card.Body>
        </Card>
    </>

    )

}


function BackButton(props) {

    if (props.filters.length === 1) {
        props.setProjectSelected(false)
        props.setFilters([])
        props.setTitle("Select a Project")

    }

}


export default function ProjectManagementComponent(props) {


    const [authToken, setAuthToken] = useContext(AuthContext)

    const [projectInformation, setProjectInformation] = useState([])
    const [filters, setFilters] = useState([])

    const [title, setTitle] = useState("Select a Project")

    // const [projectName, setProjectName] = useState(null)

    const [projectSelected, setProjectSelected] = useState(false)
    const [formSelected, setFormSelected] = useState(false)

    useEffect(async () => {
        const projectResponse = await GetProjectInformation({
            setProjectInformation: setProjectInformation,
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
                                <Button className="bg-dark border-0" onClick={async () => {
                                    const projectResponse = await GetProjectInformation({
                                        setProjectInformation: setProjectInformation,
                                        authToken: authToken
                                    })
                                    console.log(projectResponse)

                                }
                                }><MdOutlineRefresh size={25} /></Button>}
                        </div>
                    </div>


                </Card.Header>

                <Card.Body className="main-card-body">

                    {(filters.length === 1 & projectSelected !== false) ? <RenderProjectAdmin /> : <RenderProjectInformation data={projectInformation} setProjectSelected={setProjectSelected} filters={filters} setFilters={setFilters} setTitle={setTitle} />}

                </Card.Body>



            </Card >

        </div >
    )
}
