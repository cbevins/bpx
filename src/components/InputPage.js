import React from 'react';
import Form from 'react-bootstrap/Form';

import InputBool from './InputBool';
import InputOption from './InputOption';
import InputQuantity from './InputQuantity';
import InputText from './InputText';

import DagLeafBool from '../DagLeafBool';
import DagLeafOption from '../DagLeafOption';
import DagLeafQuantity from '../DagLeafQuantity';
import DagLeafText from '../DagLeafText';

function InputItem(props) {
  const { dag, leaf, id, label, desc, value } = props;
  if (leaf instanceof DagLeafBool) {
    return (<InputBool dag={dag} leaf={leaf} id={id} value={value} label={label} desc={desc} />);
  } else if (leaf instanceof DagLeafOption) {
    return (<InputOption dag={dag} leaf={leaf} id={id} value={value} label={label} desc={desc} />);
  } else if (leaf instanceof DagLeafQuantity) {
    return (<InputQuantity dag={dag} leaf={leaf} id={id} value={value} label={label} desc={desc} />);
  } else if (leaf instanceof DagLeafText) {
    return (<InputText dag={dag} leaf={leaf} id={id} value={value} label={label} desc={desc} />);
  }
}

export function InputForm(props) {
  const {dag} = props;
  const inputs = dag.requiredInputLeafs.map((leaf) =>
    <InputItem
      key={'inputForm-'+leaf.fullName()}
      id={'formControl-'+leaf.fullName()}
      dag={dag}
      leaf={leaf}
      value={leaf.value()}
      label={leaf.label()}
      desc={leaf.desc()} />
  );
  return (<Form>{inputs}</Form>);
}

export default function InputPage(props) {
  const { dag } = props;
  return (<div><InputForm dag={dag} /></div>);
}
