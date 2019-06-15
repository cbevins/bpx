import React from 'react';
import Card from 'react-bootstrap/Card';
import { Line } from '@nivo/line';

const commonProperties = {
  width: 900,
  height: 400,
  margin: { top: 20, right: 20, bottom: 60, left: 80 },
  animate: true,
  enableSlices: 'x',
};

const curveOptions = ['linear', 'monotoneX', 'step', 'stepBefore', 'stepAfter'];

const CustomSymbol = ({ size, color, borderWidth, borderColor }) => (
  <g>
    <circle fill="#fff" r={size / 2} strokeWidth={borderWidth} stroke={borderColor} />
    <circle r={size / 5} strokeWidth={borderWidth} stroke={borderColor} fill={color} fillOpacity={0.35} />
  </g>
);

function GraphContainer(props) {
  const { dag, xleaf, yleaf } = props;
  return (
    <Card>
      <Card.Header>
        {yleaf.prettyName()} vs {xleaf.prettyName()}
      </Card.Header>
      <Card.Body>
        <GraphDependent dag={dag} xleaf={xleaf} yleaf={yleaf} />
      </Card.Body>
    </Card>
  );
}

function GraphDependent(props) {
  const { dag, xleaf, yleaf } = props;
  let pts = [];
  for(let idx=0; idx<dag.batch.results; idx+=1) {
    pts.push( { x: xleaf.fetch(idx), y: yleaf.fetch(idx) } );
  }
  const data = [{
    id: yleaf.prettyName(),
    data: pts,
  }];
  return (
    <Line
      {...commonProperties}
      curve="monotoneX"
      data={data}
      xScale={{
        type: 'linear',
        min: 0,
        max: 'auto',
      }}
      axisLeft={{
        legend: yleaf.label(),
        legendOffset: -36,
        legendPosition: 'middle',
      }}
      axisBottom={{
        legend: xleaf.label(),
        legendOffset: 36,
        legendPosition: 'middle',
      }}
      yFormat={value =>
        `${Number(value).toFixed(4)}`
      }
      enablepointvalue="true"
      // pointSymbol={CustomSymbol}
      // pointSize={16}
    />
  );
}

function GraphIndependents(props) {
  const { dag, xleaf } = props;
  const graphs = dag.selectedLeafs.map((yleaf) =>
    <GraphContainer dag={dag} xleaf={xleaf} yleaf={yleaf} />
  )
  return (<div>{graphs}</div>)
}

export default function GraphPage(props) {
  const { dag } = props;
  if (dag.runs()===0) {
    return (<h3>There are currently no run results</h3>);
  }
  const rangeLeafs = dag.rangeLeafs();
  if (rangeLeafs.length<1) {
    return (<h3>There are currently no input variables with multiple values</h3>);
  }
  const graphs = rangeLeafs.map((rangeLeaf) =>
    <GraphIndependents dag={dag} xleaf={rangeLeaf} />
  );
  return (<div>{graphs}</div>);
}
