import React, { useContext, useState } from 'react'
import { Container, Navbar, Nav, Offcanvas, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import AuthContext from '../authentication-component/AuthContext';
import { MdOutlineMenu } from 'react-icons/md'

import './navigation-bar-component.css'
/* 
Setting up a standard react navbar to navigation component. Please
note that if you want to maintain state or context between routes,
you must use the 'react-router-dom' "link". I have integrated
this with the Nav.Link component 
*/




export default function MainNavbar(props) {
    // props.Logout()
    const [authToken, setAuthToken] = useContext(AuthContext)
    const [show, setShow] = useState(false)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Navbar fixed="top" bg="dark" variant="dark" expand="false">
                {/* <Container fluid> */}

                <Button bg="dark" variant="dark" onClick={handleShow}><MdOutlineMenu size={25} color="white" /></Button>
                <h2 style={{ "color": "white" }}>RHoMIS 2.0</h2>
                <Nav.Link className="side-bar-link" as={Link} to="/login" onClick={() => setAuthToken(null)} >Logout</Nav.Link>



                <Offcanvas
                    backdrop="true"
                    style={{ "background-color": "#212529" }}
                    id="offcanvasNavbar"
                    aria-labelledby="offcanvasNavbarLabel"
                    placement="start"
                    show={show}
                    onHide={handleClose}

                >
                    <Offcanvas.Header closeVariant="white" closeButton style={{ "color": "white" }}>
                        <Offcanvas.Title id="offcanvasNavbarLabel">RHoMIS 2.0</Offcanvas.Title>
                    </Offcanvas.Header>
                    <div className="side-bar-container">

                        <div className="side-bar-item">
                            <Nav.Link className="side-bar-link" as={Link} onClick={() => { handleClose() }} to="/">Portal</Nav.Link>
                        </div>
                        <div className="side-bar-item">
                            <Nav.Link className="side-bar-link" as={Link} onClick={() => { handleClose() }} to="/project-management">My Projects</Nav.Link>
                        </div>
                        <div className="side-bar-item">
                            <Nav.Link className="side-bar-link" as={Link} onClick={() => { handleClose() }} to="/project-management">Design a Survey</Nav.Link>
                        </div>
                        <div className="side-bar-item">
                            <Nav.Link className="side-bar-link" as={Link} onClick={() => { handleClose() }} to="/data-collection">Collect Data</Nav.Link>
                        </div>
                        <div className="side-bar-item">
                            <Nav.Link className="side-bar-link" as={Link} onClick={() => { handleClose() }} to="/global-data">Global Data</Nav.Link>
                        </div>
                        <div className="side-bar-item">
                            <Nav.Link className="side-bar-link" as={Link} onClick={() => { handleClose() }} to="/data-querying">Data Query</Nav.Link>
                        </div>
                        <div className="side-bar-item">
                            <Nav.Link className="side-bar-link" as={Link} onClick={() => { handleClose() }} to="/form-creation">Form Creation</Nav.Link>
                        </div>
                        <div className="side-bar-item">
                            <Nav.Link className="side-bar-link" as={Link} to="/login" onClick={() => setAuthToken(null)} >Logout</Nav.Link>
                        </div>
                    </div>

                </Offcanvas>
                {/* </Navbar.Collapse> */}
                {/* </Container> */}
            </Navbar >

        </>

    )
}

