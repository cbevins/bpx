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
