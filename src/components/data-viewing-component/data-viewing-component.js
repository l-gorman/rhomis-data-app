import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Table } from 'react-bootstrap'
import "./data-viewing-component.css"

// Function to render a table coming in from mongoDB
function renderTable(data) {

    if (data !== null) {
        if (data.data !== null) {

            const column_names = Object.keys(data.data[0].data[0])
            return (
                <div>
                    <Table>
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
                            {data.data[0].data.map((household, household_key) => {
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





}




// Full data viewer component
export default function DataViewer() {
    const [processedData, setProcessedData] = useState(null)
    const [downloadLink, setDownloadLink] = useState('')
    const [csvData, setCSV] = useState('')

    const getData = () => {
        axios.get("http://localhost:3000/api/processed-data/")
            .then((response) => {
                setProcessedData(response.data)
            })
            .catch(function (error) {
            });


    }

    // Running only when the page loads
    useEffect(() => {
        getData()
    }, [])

    useEffect(() => {
        generateCSV({ data: processedData })
        generateDownloadLink(processedData)
    }, [processedData])

    // Generate a 
    function generateDownloadLink(datastring) {

        //console.log("Trying to download")
        const list = ["apple", "banana", "pear"]
        const data = new Blob([csvData], { type: 'text/plain' })


        // this part avoids memory leaks
        if (downloadLink !== '') {
            window.URL.revokeObjectURL(downloadLink)
        }

        // update the download link state
        setDownloadLink(window.URL.createObjectURL(data))
    }

    function generateCSV(data) {

        var csv_lines = []
        //console.log(data)
        if (data !== null) {
            if (data.data !== null) {
                if (data.data[0].data !== null) {
                    var full_data_set = data.data[0].data
                    console.log(full_data_set)
                    // Getting the column names from the first household
                    var column_names = Object.keys(full_data_set[0])
                    csv_lines.push(column_names.join(", "))

                    var household_data = full_data_set.map((household) => {
                        var household_array = column_names.map((column) => {
                            return household[column]

                        })

                        var household_row = household_array.join(", ")
                        return (household_row)

                    })
                    csv_lines = csv_lines.concat(household_data)

                    var csv_string = csv_lines.join("\n")
                    setCSV(csv_string)





                }
            }
            //console.log(data.data[0].data)
            // if (data.data[0].data == null) {
            //     const column_names = Object.keys(data.data[0].data[0])
            //     csv_string = csv_string + column_names.join(", ") + "\n"
            //     console.log(csv_string)
            //     setCSV(csv_string)

            // }
        }


    }

    // Return Body of the main function
    return (
        <div >

            <div><button onClick={() => getData()}>Import Data</button></div>
            <div className="table-container">
                {renderTable({ data: processedData })}
            </div>
            <div>
                <a
                    // Name of the file to download
                    download='data.csv'
                    // link to the download URL
                    href={downloadLink}
                >
                    <button>Download Data</button></a>
            </div>
        </div>
    )
}
