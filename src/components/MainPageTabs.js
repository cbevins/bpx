import React from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Nav from 'react-bootstrap/Nav';

import ConditionsPage from './ConditionsPage';
import ConfigPage from './ConfigPage';
import GraphPage from './GraphPage';
import ResultsPage from './ResultsPage';
import SelectPage from './SelectPage';
import TreeBrowserPage from './TreeBrowserPage';

export function MainPageTabsTop({dag}) {
  return (
    <Container fluid="true">
      <Row>
        <Col>
          <Tabs defaultActiveKey="select" id="uncontrolled-tab-example">
            <Tab eventKey="select" title="Select Outputs">
              <SelectPage dag={dag} />
            </Tab>
            <Tab eventKey="configure" title="Configure Inputs">
              <ConfigPage dag={dag} />
            </Tab>
            <Tab eventKey="conditions" title="Enter Inputs">
              <ConditionsPage dag={dag} />
            </Tab>
            <Tab eventKey="results" title="View Results">
              <ResultsPage dag={dag} />
            </Tab>
            <Tab eventKey="graph" title="View Graphs &amp; Tables">
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

export function MainPageTabsLeft({dag}) {
  return (
    <Card>
      <Card.Body>
        <Tab.Container fluid='true' id="left-tabs-example" defaultActiveKey="select">
          <Row>
            <Col sm={2}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="select">1 Select Outputs</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="config">2 Configure</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="input">3 Enter Inputs</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="results">4 View Results</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="analysis">5 Tables &amp; Graphs</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="treeBrowser">Tree Browser</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={10}>
              <Tab.Content>
                <Tab.Pane eventKey="select">
                  <SelectPage dag={dag} />
                </Tab.Pane>
                <Tab.Pane eventKey="config">
                  <ConfigPage dag={dag} />
                </Tab.Pane>
                <Tab.Pane eventKey="input">
                  <ConditionsPage dag={dag} />
                </Tab.Pane>
                <Tab.Pane eventKey="results">
                  <ResultsPage dag={dag} />
                </Tab.Pane>
                <Tab.Pane eventKey="analysis">
                  <GraphPage dag={dag} />
                </Tab.Pane>
                <Tab.Pane eventKey="treeBrowser">
                  <TreeBrowserPage dag={dag} />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Card.Body>
    </Card>
  );
}

export default function MainPageTabs({dag}) {
  return (
    <div><MainPageTabsLeft dag={dag}/></div>
  )
}
