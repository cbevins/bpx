import React from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import ConditionsPage from './ConditionsPage';
import ConfigPage from './ConfigPage';
import GraphPage from './GraphPage';
import ResultsReportPage from './ResultsReportPage';
import ResultsTablePage from './ResultsTablePage';
import ResultsTablePage2 from './ResultsTablePage2';
import SelectPage from './SelectPage';
import TreeBrowserPage from './TreeBrowserPage';

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
            <Tab eventKey="conditions" title="Conditions">
              <ConditionsPage dag={dag} />
            </Tab>
            <Tab eventKey="results" title="Results Report">
              <ResultsReportPage dag={dag} />
            </Tab>
            <Tab eventKey="table" title="Results Table">
              <ResultsTablePage2 dag={dag} />
            </Tab>
            <Tab eventKey="graph" title="Graphs">
              <GraphPage dag={dag} />
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
