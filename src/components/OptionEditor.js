import React, {useState} from 'react';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import AppDag from './AppDag';

export default function OptionEditor({leaf, setShowEditor}) {
  const visitedField = {isValid: true, isInvalid: false, visited: true, values: [], errors: [] };
  const pristineForm = {
    option: {...visitedField},
  };

  const [form, setForm] = useState({...pristineForm});

  function saveOptions(e) {
    const newForm = {...form};
    newForm.option = {...visitedField};
    const descs = [...e.target.options]
      .filter(option => option.selected)
      .map(option => option.value);
    descs.forEach((desc) => {
      const parts = desc.split(':');
      newForm.option.values.push(parts[0]);
    });
    setForm(newForm);
    return (newForm.option.errors.length===0)
  }

  return (
    <Card.Body>
      <Card.Title></Card.Title>

      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text>Select</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control as='select' multiple defaultValue={leaf.item(leaf.value())}
            onChange={(e) => saveOptions(e)}>
          {
            leaf.itemKeys().map((item) => {
              let desc = leaf.item(item);
              return (
                <option>{desc}</option>
              );
            })
          }
        </Form.Control>
      </InputGroup>

      <Button variant='primary'
          onClick={() => {
              AppDag.setBatchInputs(leaf, form.option.values);
              setShowEditor(false);
          }}>
        Apply Values
      </Button>
      <Button variant='secondary' onClick={() => {setShowEditor(false);}}>
        Cancel
      </Button>
    </Card.Body>
  );
}
