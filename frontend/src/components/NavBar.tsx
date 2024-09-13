import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import { Container, Nav, Navbar } from 'react-bootstrap';

const NavBar: React.FC = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <Navbar bg="light" expand="lg" className="mb-4">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    CM Stripe App
                </Navbar.Brand>
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="ms-auto">
                        {user && <Nav.Link onClick={logout}>Logout</Nav.Link>}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;