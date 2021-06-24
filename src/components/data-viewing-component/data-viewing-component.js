import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Table, Button } from 'react-bootstrap'
import "./data-viewing-component.css"

// Function to render a table coming in from mongoDB
function renderTable(data) {
    if (data === null) {
        return (<h1>No Data found</h1>)
    }

    if (data !== null) {

        var full_data_set = data
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
            <div>
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
            </div>)
    }
}

function generateCSV(data) {
    console.log(data)
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


async function getData(url, projectID) {
    const response = await axios.get(url)
    var data = await response.data
    if (data === null) {
        return null
    }

    var projData = data.find(project => project.projectID === projectID)
    if (projData !== null & projData !== undefined) {
        //setProcessedData(projData.data)
        return projData.data
    } else {
        return null
    }

}




// Full data viewer component
export default function DataViewer() {
    const [processedData, setProcessedData] = useState(null)
    const [indicatorData, setIndicatorData] = useState(null)


    const [downloadLink, setDownloadLink] = useState('')
    const [processedDataCSV, setProcessedDataCSV] = useState('')
    const [indicatorCSV, setIndicatorCSV] = useState('')




    // Running only when the page loads
    useEffect(() => {

        // Create an async function to initalize variables
        const fetchData = async (url, projectID) => {
            const data = await getData(url, projectID);
            setProcessedData(data);
        }
        fetchData("http://localhost:3000/api/processed-data/", "test_project")

    }, [])

    useEffect(() => {
        setProcessedDataCSV(generateCSV(processedData))
        generateDownloadLink(processedData)
    }, [processedData])

    // Generate a 
    function generateDownloadLink(datastring) {

        //console.log("Trying to download")
        const list = ["apple", "banana", "pear"]
        const data = new Blob([processedDataCSV], { type: 'text/plain' })


        // this part avoids memory leaks
        if (downloadLink !== '') {
            window.URL.revokeObjectURL(downloadLink)
        }

        // update the download link state
        setDownloadLink(window.URL.createObjectURL(data))
    }


    // Return Body of the main function
    return (
        <>
            <h1>Processed Dataset</h1>
            <div className="table-container">
                {renderTable(processedData)}
            </div>
            <div className="button-container">
                <a
                    // Name of the file to download
                    download='data.csv'
                    // link to the download URL
                    href={downloadLink}
                >
                    <Button className="download-button">Download Data</ Button></a>
            </div>

        </>
    )
}
