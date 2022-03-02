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

import React, { useState, useEffect, useContext } from 'react'
import { Form, Button, Card, Table } from 'react-bootstrap'
import axios from 'axios'
import AuthContext from '../authentication-component/AuthContext'
import '../project-management-component/project-management-component.css'
import '../../App.css'


import { useHistory } from 'react-router'
import { useParams } from 'react-router-dom'

import { FetchUserInformation, GetFormInformation, GetInformationForFormComponent} from '../fetching-context-info/fetching-context-info'


import { AiOutlineArrowLeft } from 'react-icons/ai'

import QRCode from 'react-qr-code'
import { deflateSync } from 'zlib'
import UserContext from '../user-info-component/UserContext'

// Rendering a table based on JSON data from a query
// This could include individual household entries
// or could include things like units
function renderTable(data) {
    // console.log(data)


    if (data !== null) {
        var full_data_set = data.slice(0, 9)
        var column_names = []

        // Looping through households
        for (let household_index = 0; household_index < full_data_set.length; household_index++) {
            // All of the column names for this individual household
            var household_column_names = Object.keys(full_data_set[household_index])
            //Looping through individual column names for the individual household
            for (let column_index = 0; column_index < household_column_names.length; column_index++) {
                // The new column name for that household
                var new_column = household_column_names[column_index]

                if (!column_names.some(column => column === new_column)) {

                    if (household_index === 0) {
                        column_names.splice(column_index, 0, new_column)
                    }

                    if (household_index > 0) {

                        // Check if the previous column was in the column index
                        if (!household_column_names[column_index - 1] !== undefined) {
                            var index_of_previous_column_name = column_names.indexOf(household_column_names[column_index - 1])
                            column_names.splice(index_of_previous_column_name + 1, 0, new_column)

                        } else {
                            column_names.splice(column_index + 1, 0, new_column)
                        }
                    }
                }

            }
        }
        return (
            <>
                <Table striped hover size="sm" responsive>
                    {/* Table header */}
                    <thead>
                        <tr key="row_1">
                            {column_names.map((column, column_key) => {
                                return (<th className="col-md-1" key={"row_1_column_" + column_key}>{column}</th>)
                            })}
                        </tr>
                    </thead>
                    {/* Table Body */}
                    <tbody>
                        {full_data_set.map((household, household_key) => {
                            return (<tr key={"row_" + household_key}>
                                {column_names.map((column, column_key) => {
                                    return (<td height="10px" key={"row_" + household_key + "column_" + column_key + "_" + "household_" + household_key}>{household[column] ? household[column] : "NA"}</td>)
                                })}
                            </tr>)
                        })}

                    </tbody>
                </Table>
            </ >)
    }
}

function generateCSV(data) {
    //Return nothing if the data is null
    if (data === null) {
        return;
    }

    if (data.length === undefined) {
        return;
    }

    // Creating an empty list to include all of the lines of the csv
    var csv_lines = []

    // This is the full RHoMIS Data set
    var full_data_set = data

    // Identifying the column headers
    // Some households have more columns than other. This merges column
    // names in order based on the rows of each household
    var column_names = []

    // Looping through households
    for (let household_index = 0; household_index < full_data_set.length; household_index++) {
        // All of the column names for this individual household
        var household_column_names = Object.keys(full_data_set[household_index])
        //Looping through individual column names for the individual household
        for (let column_index = 0; column_index < household_column_names.length; column_index++) {
            // The new column name for that household
            var new_column = household_column_names[column_index]
            // Checking whether the new column has previously been encountered 
            if (!column_names.some(column => column === new_column)) {
                // If this is the first househould, adds the new element at the column index
                // not deleting any items
                if (household_index === 0) {
                    column_names.splice(column_index, 0, new_column)
                }
                // Checks if this is a household after the first household
                if (household_index > 0) {
                    // Check if the previous column was in the column index
                    if (!household_column_names[column_index - 1] !== undefined) {
                        // Looks at the column before, if it was encountered previously
                        // we make sure this new column is added in the correct place
                        var index_of_previous_column_name = column_names.indexOf(household_column_names[column_index - 1])

                        column_names.splice(index_of_previous_column_name + 1, 0, new_column)

                    } else {
                        // If the previous column did not exist previously, we make sure to add the new column
                        // at the end.
                        column_names.splice(column_index + 1, 0, new_column)
                    }
                }
            }


        }
    }
    // add all of the column names, seperated by a column and a space
    csv_lines.push(column_names.join(", "))

    // Now push each individual household to the csv
    var household_data = full_data_set.map((household) => {
        var household_array = column_names.map((column) => {
            if (household[column] !== null) {
                return household[column]
            } else {
                return ''
            }

        })
        // Join the column values by comma
        var household_row = household_array.join(", ")
        return (household_row)

    })
    csv_lines = csv_lines.concat(household_data)

    // Join each line and seperate by \n
    var csv_string = csv_lines.join('\n')
    return (csv_string)
}

async function FetchData(props) {
    // Basic post request, fetching information by: 
    //dataType: type of data we are looking for (e.g. indicator data),
    console.log("Fetching unit data")
    console.log(props)

    const response = await axios({
        method: "post",
        url: process.env.REACT_APP_API_URL + "api/data",
        data: {
            dataType: props.dataType,
            projectID: props.projectID,
            formID: props.formID,
            unit: props.unit,
            data: props.data
        },
        headers: {
            'Authorization': props.authToken
        }
    })

    // If the response is null return null
    // Otherwise return the dataset.
    var data = response.data
    if (data === null) {
        return null
    } else {
        return (data)
    }
}
// Generating a link to download the csv data
function generateDataDownloadLink(dataToDownload, dataDownloadLink) {
    // Generating the csv string from the data we
    // hope to download (comes in JSON format)
    const dataCSV = generateCSV(dataToDownload)
    // Create a file-like immutable objesct
    const data = new Blob([dataCSV], { type: 'text/plain' })

    // Clears the previous URL used to download the data
    if (dataDownloadLink !== '') {
        window.URL.revokeObjectURL(dataDownloadLink)
    }
    // update the download link state
    return (window.URL.createObjectURL(data))
}

async function ProcessData(props) {
    const form = props.data.forms.filter((item) => item.name === props.formSelected && item.project === props.projectSelected)[0]
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
    return (result)
}

async function AddFormUser(props) {
    let url = ""
    if (props.userType === "dataCollector") {
        url = process.env.REACT_APP_AUTHENTICATOR_URL + "api/user/data-collector"
    }

    if (props.userType === "analyst") {
        url = process.env.REACT_APP_AUTHENTICATOR_URL + "api/user/analyst"
    }

    try {
        const result = await axios({
            method: 'post',
            url: url,
            headers: {
                'Authorization': props.authToken
            },
            data: {
                formName: props.formName,
                email: props.email
            }
        })
        console.log(result)
        return (result)

    } catch (err) {
        return (err)

    }

}

function UserForm(props) {

    const [userType, setUserType] = useState('')
    const [email, setEmail] = useState('')

    return (
        <>
            <Form>
                <Form.Group>
                    <Form.Label>User email</Form.Label>
                    <Form.Control onChange={(event) => {
                        setEmail(event.target.value)
                        console.log(event.target.value)
                    }}></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>User Role</Form.Label>
                    <Form.Select aria-label="Default select example" defaultValue="Open this select menu"
                        onChange={(event) => {
                            setUserType(event.target.value)

                            console.log(event.target.value)
                        }}>
                        <option disabled={true}>Open this select menu</option>
                        <option value="dataCollector">Data Collector: Can access training materials and configure enumerator devices</option>
                        <option value="analyst">Data Analyst: Can download processed data</option>
                    </Form.Select>
                </Form.Group>

                <Button className="bg-dark text-white border-0 float-right" style={{ "marginTop": "10px" }}
                    onClick={async () => {
                        console.log(email)
                        const result = await AddFormUser({
                            authToken: props.authToken,
                            email: email,
                            formName: props.formSelected,
                            userType: userType
                        })
                        console.log(result)
                    }}>Add User</Button>

            </Form >
        </>
    )

}




function SetInitialFormState(props) {

    console.log("Initial form state props")
    console.log(props)

    function CheckFormCode(props) {
        if (!props.data) {
            return false
        }
        if (!props.data.forms) {
            return false
        }
        let form = props.data.forms.filter((item) => item.name === props.formSelected & item.project === props.projectSelected)
        if (form.length === 1) {
            return true
        }
        return (false)
    }

    function CheckUnitsForm(props) {

        if (!props.formData) {
            return false
        }
        if (!props.formData.units) {
            return false
        }
        if (props.formData.units.length > 0) {
            console.log("Number of forms")
            console.log(props.formData.units.length)
            return (true)
        }

        return false
    }



    function CheckDataForm(props) {

        // Checking if their is data for this form
        // If so the render the data form
        if (props.formData) {
            if (props.formData.dataSets.length > 0) {
                return (true)
            }
        }
        return (false)
    }

    function CheckProjectManager(props) {
        console.log("Project manager props")
        console.log(props)

        if (!props.data) {
            return false
        }
        if (!props.data.user) {
            return false
        }

        if (!props.data.user.roles) {
            return false
        }

        if (!props.data.user.roles.projectManager) {
            return false
        }

        if (props.data.user.roles.projectManager.includes(props.projectSelected)) {
            return true
        }


        return false

    }

    function CheckDataAnalyst(props) {

        if (!props.data) {
            return false
        }
        if (!props.data.user) {
            return false
        }

        if (!props.data.user.roles) {
            return false
        }

        if (!props.data.user.roles.dataCollector) {
            return false
        }

        if (props.data.user.roles.dataCollector.includes(props.formSelected)) {
            return true
        }
        return false
    }

    function CheckODKConf(props) {
        console.log("odk conf args")
        console.log(props)
        if (!props.data) {
            return false
        }

        if (!props.data.forms) {
            return false
        }
        let form = props.data.forms.filter((item) => item.name === props.formSelected && item.project === props.projectSelected)
        if (form.length !== 1) {
            return false
        }

        if (form[0].draft === true) {
            return form[0].draftCollectionDetails

        }
        if (form[0].draft === false) {
            return form[0].collectionDetails
        }


        return false
    }

    function CheckEncodedSettings(props) {

        if (!props.data) {
            return false
        }

        if (!props.data.forms) {
            return false
        }
        let form = props.data.forms.filter((item) => item.name === props.formSelected && item.project === props.projectSelected)

        if (form.length !== 1) {
            return false
        }

        if (form[0].draft === true) {
            let odkConf = form[0].draftCollectionDetails
            return deflateSync(JSON.stringify(odkConf)).toString('base64')

        }
        if (form[0].draft === false) {
            let odkConf = form[0].collectionDetails
            return deflateSync(JSON.stringify(odkConf)).toString('base64')
        }


        return false

    }

    function CheckDraft(props) {

        if (!props.data) {
            return false
        }

        if (!props.data.forms) {
            return false
        }
        let form = props.data.forms.filter((item) => item.name === props.formSelected && item.project === props.projectSelected)

        if (form.length !== 1) {
            return false
        }

        if (form[0].draft === true) {
            return true

        }
        if (form[0].draft === false) {
            return false
        }
        return false

    }

    // Check if a code for the form should be rendered

    const renderODKFormCode = CheckFormCode({
        data: props.data,
        formSelected: props.formSelected,
        projectSelected: props.projectSelected
    })
    const renderUnitsForm = CheckUnitsForm({
        formData: props.formData
    })

    const renderDataForm = CheckDataForm({ formData: props.formData })

    const projectManagerOfForm = CheckProjectManager({
        data: props.data,
        projectSelected: props.projectSelected
    })
    const dataAnalystOfForm = CheckDataAnalyst({
        data: props.data,
        formSelected: props.formSelected
    })

    const odkConf = CheckODKConf({
        data: props.data,
        projectSelected: props.projectSelected,
        formSelected: props.formSelected
    })

    const encoded_settings = CheckEncodedSettings({
        data: props.data,
        projectSelected: props.projectSelected,
        formSelected: props.formSelected
    })

    const draft = CheckDraft({
        data: props.data,
        projectSelected: props.projectSelected,
        formSelected: props.formSelected
    })

    const stateToReturn = {
        renderODKFormCode: renderODKFormCode,
        renderUnitsForm: renderUnitsForm,
        renderDataForm: renderDataForm,
        projectManagerOfForm: projectManagerOfForm,
        dataAnalystOfForm: dataAnalystOfForm,
        odkConf: odkConf,
        encoded_settings: encoded_settings,
        draft: draft
    }
    return stateToReturn
}


function RenderFormAdmin(props) {

    // const [formAdminState, setFormAdminState] = useState()

    const [renderInstallCode, setRenderInstallCode] = useState(false)
    const [renderODKFormCode, setRenderODKFormCode] = useState(true)

    const [unitsSelect, setUnitsSelect] = useState(null)
    const [rhomisDataSelect, setRHoMISSelect] = useState(null)

    const [unitsData, setUnitsData] = useState(null)
    const [rhomisData, setRHoMISData] = useState(null)

    const [unitsDownloadLink, setUnitsDownloadLink] = useState('')
    const [dataDownloadLink, setDataDownloadLink] = useState('')



    // Checking what data is available when component loads



    // Return nothing if there is no administrative data
    if (!props.data) {
        return (<></>)
    }


    console.log("form props")

    console.log(props)

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
                                <Button className="bg-dark border-0" onClick={() => {
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

                                <QRCode value={props.formState.encoded_settings} />

                            </div>
                            <div className="qr-code-container">
                                <Button className="bg-dark border-0" onClick={() => {
                                    setRenderODKFormCode(false)
                                }}>Hide Code</Button>
                            </div>
                        </>
                        : <></>}
                    {props.formState.draft ? <h4>***Your form is currently saved as a draft. Any submissions you make
                        will be removed once the form is finalised*** </h4> : <></>}

                    {props.formState.draft ?
                        <>
                            As this is a draft form. You might like to quickly see what the data you collect might look like. Click the button below to generate some mock data. Please note,
                            that values are randomly generated.
                            < br />
                            <Button className="bg-dark border-0" style={{ "margin": "10px" }}
                                onClick={async () => {
                                    await ProcessData({
                                        commandType: "generate",
                                        draft: props.formState.draft,
                                        authToken: props.authToken,
                                        data: props.data,
                                        formSelected: props.formSelected,
                                        projectSelected: props.projectSelected
                                    })
                                    console.log("gen data")
                                }}

                            >Generate Data</Button> </> : <></>}

                </Card.Body>
            </Card>



            {props.formState.dataAnalystOfForm | props.formState.projectManagerOfForm ?
                < Card className="project-management-card">
                    <Card.Header>Processing Data</Card.Header>
                    <Card.Body>

                        During data-collection, enumerators have the opportunity
                        to input new units. We need to know the numeric conversions
                        for these units in order calculate key indicators (e.g. crop yield). <br />


                        <Button className="bg-dark border-0" style={{ "margin": "10px" }}
                            onClick={async () => {
                                await ProcessData({
                                    commandType: "units",
                                    draft: props.formState.draft,
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

                        <br />
                        Once you have converted your units, the data-set can be processed
                        to calculate key information <br />
                        <Button className="bg-dark border-0" style={{ "margin": "10px" }}
                            onClick={async () => {
                                await ProcessData({
                                    commandType: "process",
                                    draft: props.formState.draft,
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
                </Card> : <></>
            }

            {props.formState.renderUnitsForm ? <Card className="project-management-card">
                <Card.Header>Download Units</Card.Header>
                <Card.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Select the Type of Unit</Form.Label>

                            <Form.Select defaultValue="Select"
                                onChange={async (event) => {
                                    setUnitsSelect(event.target.value)
                                    const newUnitsData = await FetchData({
                                        authToken: props.authToken,
                                        dataType: event.target.value,
                                        projectID: props.projectSelected,
                                        formID: props.formSelected,
                                        unit: true,
                                        data: false
                                    })
                                    const units_download_link = generateDataDownloadLink(newUnitsData, unitsDownloadLink)
                                    setUnitsDownloadLink(units_download_link)

                                    setUnitsData(newUnitsData)



                                    console.log("units data")
                                    console.log(newUnitsData)



                                }}>
                                <option key="default-select" disabled={true}>Select</option>
                                {props.formData.units.map((unitType) => {
                                    return <option key={"unit-option-" + unitType}>{unitType}</option>
                                })}
                            </Form.Select>
                        </Form.Group>

                    </Form>
                    {unitsData ? <>
                        <br />
                        {renderTable(unitsData)}
                        <a
                            // Name of the file to download
                            download={props.projectSelected + '_' + props.formSelected + '_' + unitsSelect + '.csv'}
                            // link to the download URL
                            href={unitsDownloadLink}
                        >

                            <Button className="bg-dark border-0">Download Data</Button></a>
                    </>
                        : <></>}




                    {/* {JSON.stringify(formData.units)} */}
                </Card.Body>
            </Card > : <></>
            }

            {
                props.formState.renderDataForm ? <Card className="project-management-card">
                    <Card.Header>Download Data</Card.Header>
                    <Card.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Select the type of data</Form.Label>
                                <Form.Select defaultValue="Select"
                                    onChange={async (event) => {
                                        setRHoMISSelect(event.target.value)
                                        const newRHoMISData = await FetchData({
                                            authToken: props.authToken,
                                            dataType: event.target.value,
                                            projectID: props.projectSelected,
                                            formID: props.formSelected,
                                            unit: false,
                                            data: true
                                        })
                                        const rhomis_download_link = generateDataDownloadLink(newRHoMISData, dataDownloadLink)
                                        setDataDownloadLink(rhomis_download_link)
                                        setRHoMISData(newRHoMISData)
                                        console.log("rhomis data")
                                        console.log(newRHoMISData)
                                    }}>
                                    <option key="default-select" disabled={true}>Select</option>
                                    {props.formData.dataSets.map((dataSet) => {
                                        return <option key={"data-option-" + dataSet}>{dataSet}</option>
                                    })}
                                </Form.Select>
                            </Form.Group>

                        </Form>

                        {rhomisData ? <>
                            <br />
                            {renderTable(rhomisData)}
                            <a
                                // Name of the file to download
                                download={props.projectSelected + '_' + props.formSelected + '_' + rhomisDataSelect + '.csv'}
                                // link to the download URL
                                href={dataDownloadLink}
                            >
                                <Button className="bg-dark border-0">Download Data</Button></a>
                        </>
                            : <></>}
                    </Card.Body>
                </Card> :
                    <></>
            }
            {
                props.formState.projectManagerOfForm ? <Card className="project-management-card">
                    <Card.Header as="h5">Manage Users</Card.Header>
                    <Card.Body>
                        {/* <UserTables /> */}
                        <UserForm authToken={props.authToken}
                            formSelected={props.formSelected}
                            projectSelected={props.projectSelected} />
                    </Card.Body>
                </Card> :
                    <></>
            }
        </>
    )
}

export default function FormAdminComponent() {

    const history = useHistory()
    const projectSelected = useParams().projectName
    const formSelected = useParams().formName


    const [authToken, setAuthToken] = useContext(AuthContext)
    const [adminData, setAdminData] = useContext(UserContext)

    const [formData, setFormData] = useState()

    const [initialState, setInitialState] = useState({
        renderODKFormCode: false,
        renderUnitsForm: false,
        renderDataForm: false,
        projectManagerOfForm: false,
        dataAnalystOfForm: false,
        odkConf: false,
        encoded_settings: false,
        draft: false
    })


    useEffect(() => {




        async function GetUserInfo() {
            await GetInformationForFormComponent({
                setAuthToken:setAuthToken,
                authToken: authToken,
                setUserInfo: setAdminData

            })
            // const response = await FetchUserInformation({
            //     authToken: authToken,
            //     setUserInfo: setAdminData
            // })


        }

        GetUserInfo()
    }, [])


    useEffect(() => {
        console.log("form data changed")
        const new_form_state = SetInitialFormState({
            data: adminData,
            formData: formData,
            formSelected: formSelected,
            projectSelected: projectSelected
        })
        console.log("New form admin state")
        console.log(new_form_state)

        setInitialState(new_form_state)


    }, [formData, adminData, formSelected, projectSelected])

    return (
        <div id="project-management-container" className="sub-page-container">

            <Card className="main-card border-0">
                <Card.Header className=" bg-dark text-white">
                    <div className="main-card-header-container">
                        <h3>Form Overview</h3>
                        <div style={{ "display": "flex", "flex-direction": "row", "margin-left": "auto" }} >
                            <div className="main-card-header-item">{projectSelected}</div>
                            <div className="main-card-header-item">{formSelected}</div>

                            <Button className="bg-dark border-0" onClick={() => {
                                history.push("/projects/" + projectSelected)

                            }}>
                                <AiOutlineArrowLeft size={25} />
                            </Button>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body className="main-card-body">
                    <RenderFormAdmin
                        authToken={authToken}
                        setAdminData={setAdminData}
                        data={adminData}
                        formSelected={formSelected}
                        projectSelected={projectSelected}
                        formData={formData}
                        setFormData={setFormData}
                        formState={initialState}
                        setFormState={setInitialState} />
                </Card.Body>
            </Card>
        </div >
    )
}