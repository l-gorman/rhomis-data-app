import React from 'react'
import { Card } from 'react-bootstrap'
import './collect-data-component.css'

export default function CollectDataComponent() {
    return (
        <div className="sub-page-container">
            <Card className="main-card border-0">
                <Card.Header className="bg-dark text-white">
                    <h3 >Collect Data</h3>
                </Card.Header>
                <Card.Body></Card.Body>
            </Card>
        </div>
    )
}
