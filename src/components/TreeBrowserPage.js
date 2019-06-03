import React from 'react';
import DagLeaf from '../DagLeaf';
const Inspector = require('react-json-inspector');

function constructDupTree(tree, dup) {
  Object.keys(tree).forEach((item) => {
    if (tree[item] instanceof DagLeaf) {
      dup[item]._own = tree[item].own;
    } else {
      constructDupTree(tree[item], dup[item]);
      dup[item]._own = tree[item].own;
    }
  });
}

export default function TreeBrowserPage(props) {
  // We need a clone of the DAG tree that has
  // an iterable version of the 'own' property
  const dup = JSON.parse(JSON.stringify(props.dag.tree));
  constructDupTree(props.dag.tree, dup);
  return <Inspector data={dup} />
}
