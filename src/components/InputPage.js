import React from 'react';
import AppDag from './AppDag';
import {KeyedList, keyedListValueCompare} from './KeyedList';

export function InputList(props) {
  const dag = AppDag.getDag();
  const items = [];
  dag.requiredInputLeafs.forEach((leaf) => {
    let name = leaf.fullName('/');
    items.push({key: name, value: name});
  });
  items.sort(keyedListValueCompare);

  const selected = dag.selectedLeafs.length;
  return (
    <div>
      <h3>The {selected} selected variables require {items.length} inputs:</h3>
      <KeyedList items={items} />
    </div>
  );
}

export default function InputPage(props) {
  return <InputList />
}
