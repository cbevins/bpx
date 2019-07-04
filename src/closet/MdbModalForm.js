import React, { useState } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBInput, MDBModalFooter, MDBIcon }
 from 'mdbreact';

export default function MdbModalForm(props) {
  const [modal, setModal] = useState(false);

  return (
     <MDBContainer>
        <MDBBtn rounded onClick={() => setModal(!modal)}>
          MDBReact Modal Contact Form
        </MDBBtn>
        <MDBModal isOpen={modal} toggle={() => setModal(!modal)}>
          <MDBModalHeader className="text-center" titleClass="w-100 font-weight-bold"
            toggle={() => setModal(!modal)}>
            Write to us
          </MDBModalHeader>
          <MDBModalBody>
            <form className="mx-3 grey-text">
              <MDBInput label="Your name" icon="user" group type="text" validate />
              <MDBInput label="Your email" icon="envelope" group type="email" validate error="wrong" success="right" />
              <MDBInput label="Your Subject" icon="tag" group type="text" />
              <MDBInput type="textarea" rows="2" label="Your message" icon="pencil-alt" />
            </form>
          </MDBModalBody>
          <MDBModalFooter className="justify-content-center">
            <MDBBtn color="unique" onClick={() => setModal(!modal)}>Send
              <MDBIcon far icon="paper-plane" className="ml-2" />
            </MDBBtn>
          </MDBModalFooter>
        </MDBModal>
      </MDBContainer>
    );
}