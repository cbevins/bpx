import React from 'react';
import {KeyedList, keyedListValueCompare} from './KeyedList';

export function InputList(props) {
  const items = [];
  props.dag.requiredInputLeafs.forEach((leaf) => {
    let name = leaf.fullName('/');
    items.push({key: name, value: name});
  });
  items.sort(keyedListValueCompare);
  const selected = props.dag.selectedLeafs.length;
  return (
    <div>
      <h3>The {selected} selected variables require {items.length} inputs:</h3>
      <KeyedList items={items} />
    </div>
  );
}

export default function InputPage(props) {
  return <InputList dag={props.dag} />
}
