import React from 'react';
import {KeyedList, keyedListValueCompare} from './KeyedList';

export function ConfigList(props) {
  const items = [];
  props.dag.requiredConfigLeafs.forEach((leaf) => {
    let name = leaf.fullName('/');
    items.push({key: name, value: name});
  });
  items.sort(keyedListValueCompare);
  const selected = props.dag.selectedLeafs.length;
  return (
    <div>
      <h3>The {selected} selected variables have {items.length} active configurations:</h3>
      <KeyedList items={items} />
    </div>
  );
}

export default function ConfigPage(props) {
  return <ConfigList dag={props.dag} />
}
