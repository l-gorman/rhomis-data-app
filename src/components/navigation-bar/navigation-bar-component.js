import React, { useContext } from 'react'
import { Navbar, Nav, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import AuthContext from '../authentication-component/AuthContext';
import { AiFillHome } from 'react-icons/ai'
/* 
Setting up a standard react navbar to navigation component. Please
note that if you want to maintain state or context between routes,
you must use the 'react-router-dom' "link". I have integrated
this with the Nav.Link component 
*/


export default function MainNavbar(props) {
    // props.Logout()
    const [authToken, setAuthToken] = useContext(AuthContext)

    return (
        <>
            <Navbar fixed="top" bg="dark" variant="dark" expand="xl">

                <Navbar.Brand as={Link} to="/"> RHoMIS</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {/* <Nav.Link as={Link} to="/"><AiFillHome size={10} /></Nav.Link> */}
                        <Nav.Link as={Link} to="/">Portal</Nav.Link>
                        <Nav.Link as={Link} to="/project-management">Project Management</Nav.Link>
                        <Nav.Link as={Link} to="/data-collection">Collect Data</Nav.Link>
                        <Nav.Link as={Link} to="/global-data">Global Data</Nav.Link>
                        <Nav.Link as={Link} to="/data-querying">Data Query</Nav.Link>
                    </Nav>
                    <Nav className="ml-auto">
                        {/* <Nav.Link as={Link} className="justify-content-end" to="/account">Account  </Nav.Link> */}
                        <Nav.Link as={Link} to="/login" onClick={() => setAuthToken(null)} className="justify-content-end" >Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar >

        </>

    )
}

