import React, { useState } from 'react';
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
  return (
    <Container fluid="true">
      <Row>
        <Col>
          <Tabs defaultActiveKey="select" id="uncontrolled-tab-example">
            <Tab eventKey="select" title="Select">
              <SelectPage />
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
            <Tab eventKey="tree" title="Tree Browser">
              <TreeBrowserPage />
            </Tab>
        </Tabs>
        </Col>
      </Row>
    </Container>
  );
}
