import React from 'react';
import {KeyedList} from './SimpleList';

function keyedListValueCompare(a, b) {
  if (a.value < b.value) return -1;
  if (a.value > b.value) return 1;
  return 0;
}

export default function SelectTab(props) {
  const items = [];
  props.dag.leafs.forEach((leaf) => {
    let name = leaf.fullName('/');
    items.push({key: name, value: name});
  });
  items.sort(keyedListValueCompare);
  return (
    <div>
      <h3>{items.length} BehavePlus Explorer Variables</h3>
      <KeyedList items={items} />
    </div>
  );
}
