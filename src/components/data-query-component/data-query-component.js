import React, { useState } from 'react'
import axios from 'axios'
import { Table, Button, Dropdown, DropdownButton, Card } from 'react-bootstrap'
import "./data-query-component.css"

// Function to render a table coming in from mongoDB
function renderTable(data) {
    if (data === null) {
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
                                return (<th key={"column_" + column_key}>{column}</th>)
                            })}
                        </tr>
                    </thead>
                    {/* Table Body */}
                    <tbody>
                        {full_data_set.map((household, household_key) => {
                            return (<tr key={"row_" + household_key}>
                                {column_names.map((column, column_key) => {
                                    return (<td key={"column_" + column_key + "_" + "household_" + household_key}>{household[column]}</td>)
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
    //console.log(data)
    if (data === null) {
        return;
    }


    var csv_lines = []
    // Checking if the data is in order

    // This is the full RHoMIS Data set
    var full_data_set = data
    //console.log(full_data_set)
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

    //var column_names = Object.keys(full_data_set[0])
    csv_lines.push(column_names.join(", "))

    var household_data = full_data_set.map((household) => {
        var household_array = column_names.map((column) => {
            if (household[column] !== null) {
                return household[column]
            } else {
                return ''
            }

        })

        var household_row = household_array.join(", ")
        return (household_row)

    })
    csv_lines = csv_lines.concat(household_data)

    var csv_string = csv_lines.join('\n')
    return (csv_string)
    //setCSV(csv_string)
    //console.log(csv_string)

}


// Getting project meta-data
async function fetchProjectInformation() {

    const response = await axios.get("http://localhost:3000/api/meta-data")
    return (response.data)

}

// Getting all data as normal
async function fetchData(dataType, projectID, formID) {

    console.log(projectID)
    console.log(formID)
    console.log(dataType)


    const response = await axios({
        method: "post",
        url: "http://localhost:3000/api/data",
        data: {
            dataType: dataType,
            projectID: projectID,
            formID: formID
        }
    })
    console.log(response)

    var data = response.data
    if (data === null) {
        return null
    } else {
        return (data)
    }

}

// Generating a link to download the csv data
function generateDataDownloadLink(dataToDownload, dataDownloadLink) {
    const dataCSV = generateCSV(dataToDownload)
    const data = new Blob([dataCSV], { type: 'text/plain' })

    if (dataDownloadLink !== '') {
        window.URL.revokeObjectURL(dataDownloadLink)
    }
    // update the download link state
    return (window.URL.createObjectURL(data))
}

function dataDownloadButton(dataDownloadLink, csvsAvailable, dataType, projectID, formID) {
    if (csvsAvailable) {
        return (<div className="end-button-container">
            <a
                // Name of the file to download
                download={projectID + '_' + formID + '_' + dataType + '_' + '.csv'}
                // link to the download URL
                href={dataDownloadLink}
            >
                <Button className="end-button">Download Data as CSV</ Button></a>
        </div>

        )
    }
}

function dropDownTitle(titleType, value) {
    if (value === null) {
        return (titleType)
    }
    return (value)

}

function filterButtons(projectInformationAvailable, projectInformation, projectID, setProjectID, formID, setFormID, dataType, setDataType) {
    if (projectInformationAvailable) {

        const projectIDs = projectInformation.map(project => project.projectID)
            .filter((value, index, self) => self.indexOf(value) === index)

        // Making sure only the forms belonging to this project are shown.
        const formIDs = []
        if (projectID !== null) {
            projectInformation.forEach((project) => {
                if (project.projectID === projectID) {
                    formIDs.push(project.formID)
                }
            })
        }





        return (
            <>
                <Card.Body>
                    <p>Please use the filters below to select the data you would like to access. Then click "fetch" data to access a preview of the dataset and make it available for download</p>
                    <div>
                        <div className="button-row">

                            <DropdownButton className="filter-button" onSelect={(e) => setProjectID(e)} title={dropDownTitle("Project ID", projectID)}>
                                {projectIDs.map((projectID) => {
                                    return (<Dropdown.Item eventKey={projectID}>{projectID}</Dropdown.Item>)
                                })}

                            </DropdownButton>

                            <DropdownButton className="filter-button" onSelect={(e) => setFormID(e)} title={dropDownTitle("Form ID", formID)}>
                                {formIDs.map((formID) => {
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

function projectInformationButton(projectInformation, setProjectInformation, projectInformationAvailable, setProjectInformationAvailable) {

    if (!projectInformationAvailable) {
        return (
            <div >
                <Card.Body>

                    <p>Click the button below to begin querying the data. This will load information on the projects and forms used for various RHoMIS projects.</p>
                </Card.Body>

                <div className="end-button-container">

                    <Button className="end-button" onClick={async () => {
                        const newProjectInfo = await fetchProjectInformation()
                        setProjectInformation(newProjectInfo)
                        setProjectInformationAvailable(true)
                    }}>Get Project Information</Button>
                </div>

            </div>
        )
    }
}

function fetchDataButton(projectInformationAvailable, dataType, projectID, formID, dataDownloadLink, setDataDownloadLink, setData, setcsvAvailable) {
    if (projectInformationAvailable) {
        return (
            <div className="end-button-container">
                < Button className="end-button" onClick={async () => {
                    const newData = await fetchData(dataType, projectID, formID)
                    setDataDownloadLink(generateDataDownloadLink(newData, dataDownloadLink))
                    setData(newData)
                    setcsvAvailable(true)
                }
                }>Fetch Data</Button >
            </div>
        )
    }
}



// Full data viewer component
export default function DataQueryComponent() {

    // The data we are hoping to view and download
    const [data, setData] = useState(null)
    // The link generated to download the data
    const [dataDownloadLink, setDataDownloadLink] = useState('')
    // A boolean indicating whether or not the csv is ready to download
    const [csvsAvailable, setcsvAvailable] = useState(false)

    const [projectInformationAvailable, setProjectInformationAvailable] = useState(false)

    // Information on what projects exist
    const [projectInformation, setProjectInformation] = useState([])

    // Data type we are looking for
    const [dataType, setDataType] = useState(null)
    const [projectID, setProjectID] = useState(null)
    const [formID, setFormID] = useState(null)

    // Return Body of the main function
    return (
        <div className="sub-page-container">
            <h1>RHoMIS 2.0 Data Querying</h1>
            <Card >
                <Card.Header className="bg-dark text-white">Data Filters</Card.Header>

                {filterButtons(projectInformationAvailable, projectInformation, projectID, setProjectID, formID, setFormID, dataType, setDataType)}

                {projectInformationButton(projectInformation, setProjectInformation, projectInformationAvailable, setProjectInformationAvailable)}

                {fetchDataButton(projectInformationAvailable, dataType, projectID, formID, dataDownloadLink, setDataDownloadLink, setData, setcsvAvailable)}
            </Card>

            {renderTable(data)}
            {dataDownloadButton(dataDownloadLink, csvsAvailable, dataType, projectID, formID)}
        </div >
    )
}
