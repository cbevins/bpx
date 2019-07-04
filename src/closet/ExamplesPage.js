import React from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import Counter from '../closet/Counter';
import MdbModalForm from '../closet//MdbModalForm';
import MdbModalCascade from '../closet/MdbModalCascade';
import RbModalForm from '../closet/RbModalForm';

export default function ExamplesPage (props) {
  const { dag } = props;
  return (
    <Container>
      <Row>
        <RbModalForm dag={dag}/>
      </Row>
      <Row>
        <Counter/>
      </Row>
      <Row>
        <MdbModalForm/>
      </Row>
      <Row>
        <MdbModalCascade/>
      </Row>
    </Container>
  );
}