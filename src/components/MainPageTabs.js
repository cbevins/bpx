import React from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import ConfigPage from './ConfigPage';
import InputPage from './InputPage';
import ResultsPage from './ResultsPage';
import SelectPage from './SelectPage';

import Dag from  '../Dag';

export default function MainPageTabs(props) {
  const dag = new Dag('Bpx');

  return (
    <Container fluid="true">
      <Row>
        <Col>
          <Tabs defaultActiveKey="select" id="uncontrolled-tab-example">
            <Tab eventKey="select" title="Select">
              <SelectPage dag={dag}/>
            </Tab>
            <Tab eventKey="configure" title="Configure">
                <ConfigPage />
            </Tab>
            <Tab eventKey="input" title="Input">
              <InputPage />
            </Tab>
            <Tab eventKey="results" title="Results">
              <ResultsPage />
            </Tab>
        </Tabs>
        </Col>
      </Row>
    </Container>
  );
}
