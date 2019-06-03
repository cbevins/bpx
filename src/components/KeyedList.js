import React from 'react';

export function SimpleList(props) {
  const items = props.items;
  const listItems = items.map((item, idx) =>
    <li key={idx}>
      {item}
    </li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

export function keyedListValueCompare(a, b) {
  if (a.value < b.value) return -1;
  if (a.value > b.value) return 1;
  return 0;
}

function KeyedItem(props) {
  return <li>{props.value}</li>;
}

export function KeyedList(props) {
  const items = props.items;
  const listItems = items.map((item) =>
    <KeyedItem key={item.key} value={item.value} />
  );
  return (
    <ul>{listItems}</ul>
  );
}
