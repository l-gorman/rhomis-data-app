import React from 'react'
import { Card } from 'react-bootstrap'
import './public-data-component.css'

export default function PublicDataComponent() {
    return (
        <div className="sub-page-container">
            <Card className="main-card border-0">
                <Card.Header className="bg-dark text-white">
                    <h3 >Public Data</h3>
                </Card.Header>
                <Card.Body></Card.Body>
            </Card>
        </div>
    )
}