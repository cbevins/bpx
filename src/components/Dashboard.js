import React from 'react';
import Badge from 'react-bootstrap/Badge'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table';

export default function Dashboard(props) {
  const { dag, numUpdates } = props;
  return (
    <Container>
      <Table responsive="sm">
        <tbody>
          <tr>
            <td>
              <Badge variant="secondary">
                {numUpdates} Updates
              </Badge>
            </td>
            <td>
              <Badge variant="secondary">
                {dag.selectedLeafs.length} Outputs
              </Badge>
            </td>
            <td>
              <Badge variant="secondary">
                {dag.requiredInputLeafs.length} Inputs
              </Badge>
            </td>
            <td>
              <Badge variant="secondary">
                {dag.rangeLeafs().length} Ranged Inputs
              </Badge>
            </td>
            <td>
              <Badge variant="secondary">
                {dag.runs()} Result Sets
              </Badge>
            </td>
            <td>
              <Badge variant="secondary">
                {dag.batch.elapsed} msec
              </Badge>
            </td>
          </tr>
        </tbody>
      </Table>
      </Container>
  );
}
