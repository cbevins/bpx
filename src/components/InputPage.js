import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import AppDag from './AppDag';

import InputBool from './InputBool';
import InputOption from './InputOption';
import InputQuantity from './InputQuantity';
import InputText from './InputText';

import DagLeafBool from '../DagLeafBool';
import DagLeafOption from '../DagLeafOption';
import DagLeafQuantity from '../DagLeafQuantity';
import DagLeafText from '../DagLeafText';

function InputItem(props) {
  const { dag, leaf, id, label, desc, value, isValid } = props;
  if (leaf instanceof DagLeafBool) {
    return (<InputBool dag={dag} leaf={leaf} id={id} value={value} label={label} desc={desc} />);
  } else if (leaf instanceof DagLeafOption) {
    return (<InputOption dag={dag} leaf={leaf} id={id} value={value} label={label} desc={desc} />);
  } else if (leaf instanceof DagLeafQuantity) {
    return (<InputQuantity dag={dag} leaf={leaf} id={id} value={value} label={label} desc={desc} isValid={isValid} />);
  } else if (leaf instanceof DagLeafText) {
    return (<InputText dag={dag} leaf={leaf} id={id} value={value} label={label} desc={desc} />);
  }
}

function inputFormHandleOnSubmit (dag, e) {
  e.preventDefault();
  if (dag.selectedLeafs.length===0) {
    alert('There are currently no selected outputs');
    return;
  }
  const errors = dag.requiredInputLeafs.reduce((acc, leaf) => {
    acc += leaf.own.form.errors.length;
    return acc;
  }, 0);
  if (errors) {
    alert(`Please fix the ${errors} form errors`);
  } else {
    alert('InputForm is valid, running results');
    dag.updateBatch(false);
  }
}

export function InputForm(props) {
  const {dag} = props;
  const inputs = dag.requiredInputLeafs.map((leaf) =>
    <InputItem
      key={leaf.own.form.slug}
      id={leaf.own.form.slug}
      dag={dag}
      leaf={leaf}
      value={leaf.value()}
      label={leaf.label()}
      desc={leaf.desc()} />
  );
  return (
    <Form onSubmit={(e) => inputFormHandleOnSubmit(dag, e)}>
      {inputs}
      <Button type="submit">
        Submit
      </Button>
    </Form>);
}

export default function InputPage(props) {
  const { dag } = props;
  if (dag.selectedLeafs.length===0) {
    return (<h3>There are currently no outputs selected</h3>);
  }
  return (<div><InputForm dag={dag} /></div>);
}
