import React from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import ConfigPage from './ConfigPage';
import InputPage from './InputPage';
import InputPage2 from './InputPage2';
import ResultsPage from './ResultsPage';
import SelectPage from './SelectPage';
import TreeBrowserPage from './TreeBrowserPage';
import GraphPage from './GraphPage';
import TablePage from './TablePage';
//import UserFormPage from './UserFormPage';
import DynamicForm from './DynamicForm';

export default function MainPageTabs({dag}) {
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
            <Tab eventKey="input2" title="Input2">
              <InputPage2 dag={dag} />
            </Tab>
            <Tab eventKey="results" title="Record View">
              <ResultsPage dag={dag} />
            </Tab>
            <Tab eventKey="table" title="Results Table">
              <TablePage dag={dag} />
            </Tab>
            <Tab eventKey="graph" title="Graphs">
              <GraphPage dag={dag} />
            </Tab>
            <Tab eventKey="dynamic" title="Dynamic Form">
              <DynamicForm dag={dag} />
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
