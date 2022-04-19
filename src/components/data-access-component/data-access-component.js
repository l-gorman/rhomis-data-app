import React from 'react'
import { Card, Button } from 'react-bootstrap'
import { AiOutlineArrowLeft } from 'react-icons/ai'
import { useParams, useHistory } from 'react-router-dom'

export default function DataAccessComponent() {

    const projectSelected = useParams().projectName
    const formSelected = useParams().formName

    const history = useHistory()

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
                <Card.Body className="main-card-body">

                </Card.Body>
            </Card>
        </div >
    )
}
