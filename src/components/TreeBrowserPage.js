import React from 'react';
import DagLeaf from '../DagLeaf';
import AppDag from './AppDag';
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
  const tree = AppDag.getTree();
  const dup = JSON.parse(JSON.stringify(tree));
  constructDupTree(tree, dup);
  return <Inspector data={dup} />
}
