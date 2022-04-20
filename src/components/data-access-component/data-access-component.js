import React, { useState, useContext, useEffect } from 'react'
import { Card, Button, Nav, Accordion, Table } from 'react-bootstrap'
import { AiOutlineArrowLeft } from 'react-icons/ai'
import { useParams, useHistory } from 'react-router-dom'

import AuthContext from '../authentication-component/AuthContext'
import UserContext from '../user-info-component/UserContext'

import { FetchUserInformation } from '../fetching-context-info/fetching-context-info'

import { GetInformationForFormComponent } from '../fetching-context-info/fetching-context-info'

function RenderUnitsForm(props) {

    return (
        <Card style={{ "margin-top": "30px" }}>
            <Card.Header>
                Units
            </Card.Header>
            <Card.Body>

            </Card.Body>
        </Card>


    )

}

function RenderPriceAndCalorieConversions(props) {
    return (
        <Card style={{ "margin-top": "30px" }}>
            <Card.Header>
                Prices and Calories
            </Card.Header>
            <Card.Body>

            </Card.Body>
        </Card >


    )
}

function RenderFinalOutputs(props) {
    return (
        <Card style={{ "margin-top": "30px" }}>
            <Card.Header>
                Final Outputs
            </Card.Header>
            <Card.Body>

            </Card.Body>
        </Card>
    )

}


function RenderDataCard(props) {

    return (
        <>
            <RenderUnitsForm />
            <RenderPriceAndCalorieConversions />

            <RenderFinalOutputs />
        </>

    )


}







function CheckDataStatus() {

}

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

export default function DataAccessComponent() {

    const projectSelected = useParams().projectName
    const formSelected = useParams().formName

    const [authToken, setAuthToken] = useContext(AuthContext)
    const [adminData, setAdminData] = useContext(UserContext)

    const history = useHistory()


    const [formData, setFormData] = useState()





    useEffect(() => {
        async function GetUserInfo() {

            await GetInformationForFormComponent({
                setAuthToken: setAuthToken,
                authToken: authToken,
                setUserInfo: setAdminData,
                projectName: projectSelected,
                formName: formSelected,
                setFormData: setFormData
            })
            // const response = await FetchUserInformation({
            //     authToken: authToken,
            //     setUserInfo: setAdminData
            // })


        }

        GetUserInfo()
    }, [])


    useEffect(() => {
        console.log("Form Data")
        console.log(formData)

    }, [formData])
    return (
        <div id="project-management-container" className="sub-page-container">

            <Card className="main-card border-0">
                <Card.Header className=" bg-dark text-white">
                    <div className="main-card-header-container">
                        <h3>Data</h3>

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
                <Card.Body>

                    <RenderDataCard
                        authToken={authToken}
                        formData={formData}
                        projectSelected={projectSelected}
                        formSelected={formSelected}

                    />

                </Card.Body>
            </Card>
        </div >
    )
}
