import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

export default function MainPageNav(props) {
  return (
<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
  <Navbar.Brand href="#home">
    <img
        src="./favicon.ico"
        width="30"
        height="30"
        className="d-inline-block align-top"
        alt="SEM"
    />
    SEM
  </Navbar.Brand>
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">
    <Nav className="mr-auto">
      <Nav.Link href="#home">Home</Nav.Link>
      <Nav.Link href="#bpx">BehavePlus Explorer</Nav.Link>
      <NavDropdown title="StandAlone Models" id="collasible-nav-dropdown">
        <NavDropdown.Item href="#size">Scorch Height</NavDropdown.Item>
        <NavDropdown.Item href="#size">Fire Ellipse Size</NavDropdown.Item>
        <NavDropdown.Item href="#spot">Spotting Distance</NavDropdown.Item>
        <NavDropdown.Item href="#crown">Crown Fire</NavDropdown.Item>
      </NavDropdown>
    </Nav>
  </Navbar.Collapse>
</Navbar>
  );
}
