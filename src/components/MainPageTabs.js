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
import TreeBrowserPage from './TreeBrowserPage';

export default function MainPageTabs(props) {
  const { dag } = props;
  return (
    <Container fluid="true">
      <Row>
        <Col>
          <Tabs defaultActiveKey="select" id="uncontrolled-tab-example">
            <Tab eventKey="select" title="Select">
              <SelectPage dag={dag} />
            </Tab>
            <Tab eventKey="configure" title="Configure">
              <ConfigPage dag={dag} />
            </Tab>
            <Tab eventKey="input" title="Input">
              <InputPage dag={dag} />
            </Tab>
            <Tab eventKey="results" title="Results">
              <ResultsPage dag={dag} />
            </Tab>
            <Tab eventKey="tree" title="Tree Browser">
              <TreeBrowserPage dag={dag} />
            </Tab>
        </Tabs>
        </Col>
      </Row>
    </Container>
  );
}
