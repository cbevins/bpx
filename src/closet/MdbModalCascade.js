import React, { useState } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalHeader, MDBModalBody, MDBNav, MDBNavItem, MDBNavLink, MDBInput, MDBModalFooter,
MDBIcon, MDBTabContent, MDBTabPane, MDBRow } from 'mdbreact';

export default function MdbModalCascade (props) {
  const [modal1, setModal1] = useState(false);
  const [modal3, setModal3] = useState(false);
  const [activeItem, setActiveItem] = useState('1');

  return (
    <MDBContainer>
       <MDBBtn rounded onClick={() => setModal1(!modal1)}>
         MDBReact Modal Login/Register Cascade Form (Bombs)
       </MDBBtn>
       <MDBModal className="form-cascading" isOpen={modal1}
            toggle={() => setModal1(!modal1)}>
        <MDBModalHeader className="text-center" titleClass="w-100 font-weight-bold"
            toggle={() => setModal1(!modal1)}>
           Write to us
        </MDBModalHeader>
        <MDBNav tabs
            className="md-tabs nav-justified tabs-2 light-blue darken-3"
            style={{ margin: "-1.5rem 1rem 0 1rem" }}>
          <MDBNavItem>
            <MDBNavLink className={activeItem===1 ? "active" : "" }
                to="#One" onClick={() => setActiveItem('1')}>
              <MDBIcon icon="user" className="mr-1" />
                Enter Values
            </MDBNavLink>
          </MDBNavItem>
          <MDBNavItem>
            <MDBNavLink className={activeItem===2 ? "active" : "" }
                to="#Two" onClick={() => setActiveItem('2')}>
              <MDBIcon icon="user-plus" className="mr-1" />
                Enter Loop
            </MDBNavLink>
          </MDBNavItem>
        </MDBNav>
      </MDBModal>
    </MDBContainer>
  );
}