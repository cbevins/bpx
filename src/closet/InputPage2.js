import React, { useState } from "react";
import { useForm } from "./form/use-form";
import { validators, validateInputEvents, evaluateConditions} from "./form/validators";

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const { required, email } = validators;
const { onBlur, onSubmit, onChange } = validateInputEvents;

function InputForm2(props) {
  const { dag } = props;

  const {
    getFormProps,
    uiState,
    api,
    formValidity,
    inputs,
    inputUiState
  } = useForm({
    id: "BPX",
    initialState: {}
  });

  dag.requiredInputLeafs.forEach((leaf) => {
    api.addInput({
      id: leaf.fullName('-'),
      value: leaf.value(),
      validators: [
        {
          ...required,
          when: [
            // {
            //   eventType: onChange,
            //   evaluateCondition: evaluateConditions.rewardEarlyValidateLate
            // },
            onBlur,
            onSubmit
          ]
        }
      ]
    });
  });

  const handleOnSubmit = async ({ evt, inputValues }) => {
    await sleep(2000);
    console.log("inputPage2 onSubmit, inputValues", inputValues);
  };

  const handleHelpButtonClick = () => {
  };

  const getErrors = field => {
    return ( formValidity.hasOwnProperty(field)
      && formValidity[field].hasOwnProperty('errors') )
      ? formValidity[field].errors.join(', ') : '';
  }

  const isInvalid = field => {
    return ( formValidity.hasOwnProperty(field)
          && formValidity[field].hasOwnProperty('valid') )
      ? ! formValidity[field].valid
      : false;    // not yet determinbed to be invalid
  }

  // Valid only if NOT pristine AND tested AND valid
  const isValid = field => {
    return ( formValidity.hasOwnProperty(field)
          && formValidity[field].hasOwnProperty('valid') )
      ? formValidity[field].valid
      : false;    // not yet determinbed to be valid
  }

  return (
    <div>
      <h2>{`Dynamic form sample now has ${Object.entries(inputs).length} inputs`}</h2>
      <h3>Overall form diagnostics</h3>
      <ul>
        <li>uiState: {JSON.stringify(uiState)}</li>
        <li>formValidity: {JSON.stringify(formValidity)}</li>
      </ul>
      {uiState.isSubmitting && (
        <div className="submitting-indicator">Submitting</div>
      )}
      <h3>Form</h3>
      <Form {...getFormProps({ onSubmit: handleOnSubmit })}>
        {Object.entries(inputs).map(([key, value]) => (
          <Form.Group as={Row} key={value.id}>
            <Form.Label column sm={2}>{value.id}</Form.Label>
            <Col sm={1}>
              <Button onClick={() => handleHelpButtonClick(value.id)}>?</Button>
            </Col>
            <Col sm={6}>
              <Form.Control type="text"
                {...value.getInputProps()}
                disabled={uiState.isSubmitting || uiState.isValidating}
                isValid={isValid(value.id)}
                isInvalid={isInvalid(value.id)}
              />
              <Form.Control.Feedback type="invalid">
                {getErrors(value.id)}
              </Form.Control.Feedback>
            </Col>
            <Col sm={6}>
              <Form.Text className="text-muted">
                {JSON.stringify(inputUiState[value.id])} --{" "}
                {JSON.stringify(formValidity[value.id])}
              </Form.Text>
            </Col>
          </Form.Group>
        ))}

        <div className="input-footer">
          <Button type="submit" disabled={uiState.isSubmitting || uiState.isValidating}>
            Save
          </Button>
          {uiState.isSubmitting || (uiState.isValidating && <p>Submitting...</p>)}
        </div>
      </Form>
    </div>
  );
}

export default function InputPage2({dag}) {
  return (
    <InputForm2 dag={dag} />
  );
}
