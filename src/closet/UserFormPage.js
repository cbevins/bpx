import React from 'react';
import useValidatedForm from './useBpxForm';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import AppDag from './AppDag';

let BPX_COUNT=1;

function UserForm () {
  console.log('BPX_COUNT='+BPX_COUNT+' -----------------------------');
  BPX_COUNT += 1;
  let fields =[];
  for(let idx=0; idx<=3; idx++) {
    fields.push('field'+idx);
  };

  const initialState = fields.reduce((acc, field) => {
    acc[field] = '';
    return acc;
  }, {});

  const validations = fields.reduce((acc, field) => {
    acc.push({name: field, type: 'required', stateMap: field});
    return acc;
  }, []);
  validations.push({name: 'email', type: 'isEmail', stateMap: 'email'});

  const [formData, validation, validateForm, getData] = useValidatedForm(initialState, validations);

  const submit = (event) => {
    event.preventDefault();
    const valid = validateForm();
    if ( valid ) {
      const {firstName, lastName, email} = getData();
      const msg = `Hello, ${firstName} ${lastName} at ${email}`;
      alert(msg);
      console.log(getData());
    } else {
      alert('INVALID FORM');
    }
  }

  const hasError = (field) => validation.errors[field].length > 0;

  const rows = Object.keys(initialState).map((key) => {
    return (
      <Form.Group as={Row} key={key}>
        <Form.Label column sm={2}>{key}</Form.Label>
        <Col sm={1}>
          <Button>?</Button>
        </Col>
        <Col sm={6}>
          <Form.Control type="text"
            name={key}
            id={key}
            isInvalid={hasError(key)}
            { ...formData[key].input } />
          <Form.Control.Feedback type="invalid">
            { 'ERRORS: '+validation.errors[key].join(', ')}
          </Form.Control.Feedback>
        </Col>
        <Col sm={3}>
          <Button>Units</Button>
        </Col>
      </Form.Group>
    );
  });

  return (
    <Form className='validated-form' noValidate={true} onSubmit={submit}>
      {rows}
      <Button type="submit" disabled={!validation.valid}>
        Submit form
      </Button>
    </Form>
  )
}

function BpxForm (props) {
  const dag = AppDag.getDag();
  console.log('BPX_COUNT='+BPX_COUNT+' -----------------------------');
  BPX_COUNT += 1;

  const initialState = dag.requiredInputLeafs.reduce((acc, leaf) => {
    acc[leaf.fullName('-')] = leaf.value();
    return acc;
  }, {});

  const validations = dag.requiredInputLeafs.reduce((acc, leaf) => {
    let slug = leaf.fullName('-');
    acc.push({name: slug, type: 'required', stateMap: slug});
    return acc;
  }, []);

  const [formData, validation, validateForm, getData] = useValidatedForm(initialState, validations);

  if ( dag.requiredInputLeafs.length < 1 ) {
    return (<h3>You must first select some outputs</h3>)
  }

  const submit = (event) => {
    event.preventDefault();
    const valid = validateForm();
    if ( valid ) {
      //const data = getData();
      alert('VALID');
    } else {
      alert('INVALID FORM');
    }
  }

  const hasError = (field) => validation.errors[field].length > 0;

  const rows = Object.keys(initialState).map((key) => {
    return (
      <Form.Group as={Row} controlId={key}>
        <Form.Label column sm={2}>{key}</Form.Label>
        <Col sm={1}>
          <Button>?</Button>
        </Col>
        <Col sm={6}>
          <Form.Control type="text"
            name={key}
            id={key}
            isInvalid={hasError(key)}
            { ...formData[key].input } />
          <Form.Control.Feedback type="invalid">
            { 'ERRORS: '+validation.errors[key].join(', ')}
          </Form.Control.Feedback>
        </Col>
        <Col sm={3}>
          <Button>Units</Button>
        </Col>
      </Form.Group>
    );
  });

  return (
    <Form className='validated-form' noValidate={true} onSubmit={submit}>
      {rows}
      <Button type="submit" disabled={!validation.valid}>
        Submit form
      </Button>
    </Form>
  )
}

export default function UserFormPage() {
  return (<div><UserForm /> </div>)
}
