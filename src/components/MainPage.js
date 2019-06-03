import React from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormCheck from 'react-bootstrap/FormCheck';
import FormControl from 'react-bootstrap/FormControl';

function SelectForm() {
  const blocks = {
    primary: {
      label: 'Primary Fuel',
    },
    secondary: {
      label: 'Secondary Fuel',
    },
  };


  return (
    <Form>
    {
      Object.keys(blocks).map(block => (
          <div key={`custom-checkbox-${block}`} className="mb-3">
            <Form.Check
              custom
              type="checkbox"
              id={`custom-checkbox-${block}`}
              label={`${blocks[block].label}`}
            />
          </div>
        ))
    }
    </Form>
  );
}

function ConfigTab() {
  return (
    <div>
      <h1>Configure Available Options</h1>
    </div>
  );
}

function InputTab() {
  return (
    <h1>Enter Required Inputs</h1>
  );
}

function ResultsTab() {
  return (
    <h1>View Results</h1>
  );
}

function SelectTab() {
  return (
    <div>
      <h1>Select Desired Outputs</h1>
      <SelectForm />
    </div>
  );
}

function VizTab() {
  return (
    <h1>Graph and Pivot Results</h1>
  );
}

function MainPageTabs() {
  return (
    <Tabs defaultActiveKey="select" id="uncontrolled-tab-example">
      <Tab eventKey="select" title="Select">
        <SelectTab />
      </Tab>
      <Tab eventKey="configure" title="Configure">
          <ConfigTab />
      </Tab>
      <Tab eventKey="input" title="Input">
        <InputTab />
      </Tab>
      <Tab eventKey="results" title="Results">
        <ResultsTab />
      </Tab>
      <Tab eventKey="viz" title="Visualization" disabled>
        <VizTab />
      </Tab>
    </Tabs>
  );
}

export default function MainPage() {
  return (
    <Container fluid="true">
      <Row>
        <Col>
        <MainPageTabs />
        </Col>
      </Row>
    </Container>
  );
}
