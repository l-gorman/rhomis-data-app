import { React } from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'

/* 
Setting up a standard react navbar to navigation component. Please
note that if you want to maintain state or context between routes,
you must use the 'react-router-dom' "link". I have integrated
this with the Nav.Link component 
*/
export default function MainNavbar() {
    return (
        <>
            <Navbar bg="dark" variant="dark" expand="xl">
                <Navbar.Brand href="/">RHoMIS</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">

                        <Nav.Link as={Link} to="/">Project Management</Nav.Link>
                        <Nav.Link as={Link} to="/data-querying">Data Query</Nav.Link>
                    </Nav>
                    <Nav className="ml-auto">
                        <Nav.Link as={Link} className="justify-content-end" to="/login">Account  </Nav.Link>
                        <Nav.Link as={Link} className="justify-content-end" to="/login">Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar >

        </>

    )
}

