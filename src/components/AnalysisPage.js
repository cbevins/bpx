import React, { useState } from 'react';

import Container from 'react-bootstrap/Container';

export default function AnalysisPage({dag}) {
  const ranges = dag.requiredInputLeafs.filter((leaf) => leaf.own.inputs.length>1)

  if (dag.selectedLeafs.length===0) {
    return <h4>There are currently no selected outputs</h4>
  } else if (ranges<1) {
    return (
      <h4>
        There must be at least 1 variable with multiple values
        to generate a table or graph
      </h4>
    );
  } else if (ranges<2) {
    return (
      <h4>
        There must not be more than 2 variables with multiple values
        to generate a table or graph
      </h4>
    );
  } else {
    return (
      <Container>
        <ul>I wish to view:
          <li>a table</li>
          <li>a graph</li>
          <li>both a table and a graph</li>
        </ul>
        <ul>for each of the following outputs (y-axis variables):
          {dag.selectedLeafs.map((leaf) => <li>{leaf.name()}</li>)}
        </ul>
        <ul>over one of the following multiple inputs (x-axis variables):
          {ranges.map((leaf) => <li>{leaf.name()}</li>)}
        </ul>
      </Container>
    )
  }
}