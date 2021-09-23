import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { Table, Button, Dropdown, DropdownButton, Card } from 'react-bootstrap'
import "./data-query-component.css"
import { Route, Redirect } from 'react-router-dom'

import AuthContext from '../authentication-component/AuthContext';

// Function to render a table coming in from mongoDB
function renderTable(data) {
    console.log(data)
    if (data === null) {
        return (<h1>No Data found</h1>)
    }

    if (data.length === undefined) {
        return (<h1>No Data found</h1>)
    }



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
            <div className="sub-page-container">
                <Table striped bordered hover size="sm" variant="dark" responsive>
                    {/* Table header */}
                    <thead>
                        <tr key="row_1">
                            {column_names.map((column, column_key) => {
                                return (<th key={"row_1_column_" + column_key}>{column}</th>)
                            })}
                        </tr>
                    </thead>
                    {/* Table Body */}
                    <tbody>
                        {full_data_set.map((household, household_key) => {
                            return (<tr key={"row_" + household_key}>
                                {column_names.map((column, column_key) => {
                                    return (<td key={"row_" + household_key + "column_" + column_key + "_" + "household_" + household_key}>{household[column]}</td>)
                                })}
                            </tr>)
                        })}

                    </tbody>
                </Table>
            </div >)
    }
}

// Function for converting simple json layout into CSV format
function generateCSV(data) {
    //Return nothing if the data is null
    if (data === null) {
        return;
    }

    // console.log("length " + data.length)
    if (data.length === undefined) {
        return;
    }

    // Creating an empty list to include all of the lines of the csv
    var csv_lines = []
    // Checking if the data is in order

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

// Getting project meta-data
async function fetchProjectInformation(authToken) {
    // Basic get request for metadata
    const response = await axios({
        method: "get",
        url: process.env.REACT_APP_AUTHENTICATOR_URL + "api/meta-data",
        headers: {
            'Authorization': authToken
        }
    })
    //const response = await axios.get(process.env.REACT_APP_API_URL + "api/meta-data")
    console.log(response.data)
    //return (undefined)
    return (response.data)
}

// Getting all data as normal
async function fetchData(dataType, projectName, formID, authToken) {
    // Basic post request, fetching information by: 
    //dataType: type of data we are looking for (e.g. indicator data),

    const response = await axios({
        method: "post",
        url: process.env.REACT_APP_API_URL + "api/data",
        data: {
            dataType: dataType,
            projectID: projectName,
            formID: formID
        },
        headers: {
            'Authorization': authToken
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
    // Creat e a file-like immutable objesct
    const data = new Blob([dataCSV], { type: 'text/plain' })

    // Clears the previous URL used to download the data
    if (dataDownloadLink !== '') {
        window.URL.revokeObjectURL(dataDownloadLink)
    }
    // update the download link state
    return (window.URL.createObjectURL(data))
}

// A simple button to download the data
function dataDownloadButton(dataDownloadLink, csvsAvailable, dataType, projectName, formID) {
    if (csvsAvailable) {
        return (<div className="end-button-container">
            <a
                // Name of the file to download
                download={projectName + '_' + formID + '_' + dataType + '_' + '.csv'}
                // link to the download URL
                href={dataDownloadLink}
            >
                <Button className="end-button">Download Data as CSV</ Button></a>
        </div>

        )
    }
}

// Function for ensuring the title of the drop-down updates
// properly when a new value is selected
function dropDownTitle(titleType, value) {
    if (value === null) {
        return (titleType)
    }
    return (value)

}

// Buttons to filter projects based on meta-data 
function filterButtons(projectInformationAvailable, projectInformation, projectName, setProjectName, formID, setFormID, dataType, setDataType) {
    if (projectInformationAvailable) {

        console.log(projectInformation)
        const projectNames = projectInformation.projects.map(project => project.name)

        // Making sure only the forms belonging to this project are shown.
        const formIDs = []

        if (projectName !== null) {
            const project = projectInformation.projects.filter(project => project.name === projectName)
            console.log(project)
            const projectID = project[0].centralID
            if (projectID !== null) {
                formIDs.push(project[0].forms)


                // projectInformation.forms.forEach((form) => {
                //     if (form.project === projectID) {
                //         formIDs.push(form.name)
                //     }
                // })
            }
        }


        return (
            <>
                <Card.Body>
                    <p>Please use the filters below to select the data you would like to access. If the data has not been processed, or you are unsure whether it has been processed, click the "Process Data" button. Then click "fetch" data to access a preview of the dataset and make it available for download</p>
                    <div>
                        <div className="button-row">

                            <DropdownButton className="filter-button" onSelect={(e) => setProjectName(e)} title={dropDownTitle("Project Name", projectName)}>
                                {projectNames.map((projectName) => {
                                    return (<Dropdown.Item eventKey={projectName}>{projectName}</Dropdown.Item>)
                                })}

                            </DropdownButton>

                            <DropdownButton className="filter-button" onSelect={(e) => setFormID(e)} title={dropDownTitle("Form ID", formID)}>


                                {
                                    formIDs.map((formID) => {

                                        return (<Dropdown.Item eventKey={formID}>{formID}</Dropdown.Item>)

                                    })}
                            </DropdownButton>

                            <DropdownButton className="filter-button" onSelect={(e) => setDataType(e)} title={dropDownTitle("Select Data to View", dataType)}>
                                <Dropdown.Item eventKey="processedData">Whole Survey</Dropdown.Item>
                                <Dropdown.Item eventKey="indicatorData">Indicator Data</Dropdown.Item>
                                <Dropdown.Item eventKey="metaData">Meta Data</Dropdown.Item>
                                <Dropdown.Item eventKey="cropData">Crop Data</Dropdown.Item>
                                <Dropdown.Item eventKey="livestockData">Livestock Data</Dropdown.Item>
                            </DropdownButton>
                        </div>
                    </div>
                </Card.Body>

            </>
        )
    }

}

function projectInformationButton(projectInformation, setProjectInformation, projectInformationAvailable, setProjectInformationAvailable, authToken) {

    if (!projectInformationAvailable) {
        return (
            <div >
                <Card.Body>

                    <p>Click the button below to begin querying the data. This will load information on the projects and forms used for various RHoMIS projects.</p>
                </Card.Body>

                <div className="end-button-container">

                    <Button className="end-button" onClick={async () => {
                        const newProjectInfo = await fetchProjectInformation(authToken)
                        console.log("newProjectInfo")

                        console.log(newProjectInfo)
                        if (newProjectInfo !== undefined) {
                            setProjectInformation(newProjectInfo)
                            setProjectInformationAvailable(true)
                        }
                    }}>Get Project Information</Button>
                </div>

            </div>
        )
    }
}

function fetchDataButton(projectInformationAvailable, dataType, projectName, formID, dataDownloadLink, setDataDownloadLink, setData, setcsvAvailable, authToken) {
    if (projectInformationAvailable) {
        return (
            <div className="end-button-container">
                < Button className="end-button" onClick={async () => {
                    const newData = await fetchData(dataType, projectName, formID, authToken)
                    setDataDownloadLink(generateDataDownloadLink(newData, dataDownloadLink))
                    setData(newData)
                    setcsvAvailable(true)
                }
                }>Fetch Data</Button >
            </div>
        )
    }
}

async function processData(projectName, formID, authToken) {
    const response = await axios({
        method: "post",
        url: process.env.REACT_APP_API_URL + "api/process-data",
        data: {
            projectName: projectName,
            formName: formID
        },
        headers: {
            'Authorization': authToken
        }
    })

    return (response)

}

async function generateData(projectName, formID, authToken) {
    const response = await axios({
        method: "post",
        url: process.env.REACT_APP_API_URL + "api/generate-data",
        data: {
            projectName: projectName,
            formName: formID,
            numberOfResponses: 10

        },
        headers: {
            'Authorization': authToken
        }
    })

    return (response)

}

function processDataButton(projectInformationAvailable, projectName, formID, authToken) {
    if (projectInformationAvailable) {
        return (
            <div className="end-button-container">
                < Button className="end-button" onClick={async () => {

                    const dataProcessedResponse = await processData(projectName, formID, authToken)
                    console.log(dataProcessedResponse)
                }
                }>Process Data</Button >
            </div>
        )
    }
}

function generateDataButton(projectInformationAvailable, projectName, formID, authToken) {
    if (projectInformationAvailable) {
        return (
            <div className="end-button-container">
                < Button className="end-button" onClick={async () => {

                    const dataGeneratedResponse = await generateData(projectName, formID, authToken)
                    console.log(dataGeneratedResponse)
                }
                }>Generate Data</Button >
            </div>
        )
    }
}

// Full data viewer component
function DataQueryComponent(props) {



    const [authToken, setAuthToken] = useContext(AuthContext)




    // The data we are hoping to view and download
    const [data, setData] = useState(null)
    // The link generated to download the data
    const [dataDownloadLink, setDataDownloadLink] = useState('')
    // A boolean indicating whether or not the csv is ready to download
    const [csvsAvailable, setcsvAvailable] = useState(false)

    // Boolean indicating whether or not project information has been downloaded yet
    const [projectInformationAvailable, setProjectInformationAvailable] = useState(false)

    // Information on what projects exist and what forms exist
    const [projectInformation, setProjectInformation] = useState([])

    // Data type we are looking for
    const [dataType, setDataType] = useState(null)
    const [projectName, setProjectName] = useState(null)

    const [formID, setFormID] = useState(null)

    //authToken
    // Return Body of the main function

    // useEffect(() => {
    //     async function fetchInitialData() {
    //         const newProjectInfo = await fetchProjectInformation(authToken)
    //         setProjectInformation(newProjectInfo)
    //         setProjectInformationAvailable(true)
    //     }
    //     fetchInitialData()

    // }, [])



    return (
        <div id="data-query-container" className="sub-page-container">

            <h1 id="data-query-title">RHoMIS 2.0 Data Querying</h1>
            <Card >
                <Card.Header className="bg-dark text-white">Data Filters</Card.Header>

                {filterButtons(projectInformationAvailable, projectInformation, projectName, setProjectName, formID, setFormID, dataType, setDataType)}
                {projectInformationButton(projectInformation, setProjectInformation, projectInformationAvailable, setProjectInformationAvailable, authToken)}
                {generateDataButton(projectInformationAvailable, projectName, formID, authToken)}
                {processDataButton(projectInformationAvailable, projectName, formID, authToken)}
                {fetchDataButton(projectInformationAvailable, dataType, projectName, formID, dataDownloadLink, setDataDownloadLink, setData, setcsvAvailable, authToken)}

                {/* {filterButtons(projectInformationAvailable, projectInformation, projectName, setProjectName, formID, setFormID, dataType, setDataType)}
                {projectInformationButton(projectInformation, setProjectInformation, projectInformationAvailable, setProjectInformationAvailable, props.authToken)}
                {generateDataButton(projectInformationAvailable, projectName, formID, props.authToken)}
                {processDataButton(projectInformationAvailable, projectName, formID, props.authToken)}
                {fetchDataButton(projectInformationAvailable, dataType, projectName, formID, dataDownloadLink, setDataDownloadLink, setData, setcsvAvailable, props.authToken)} */}
            </Card>

            {renderTable(data)}
            {dataDownloadButton(dataDownloadLink, csvsAvailable, dataType, projectName, formID)}
        </div >
    )
}


// Export all of the functions as want to ensure
// that they work for testing purposes
export {
    DataQueryComponent,
    renderTable,
    generateCSV,
    fetchProjectInformation,
    fetchData,
    generateDataDownloadLink,
    dataDownloadButton,
    dropDownTitle,
    filterButtons,
    projectInformationButton,
    fetchDataButton
}

