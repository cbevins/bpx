import React, { useState } from 'react';
import MainPageNav from './components/MainPageNav';
import MainPageTabs from './components/MainPageTabs';

import './App.css';
import './components/json-inspector.css';
import 'react-table/react-table.css';
//import './components/UserForm.css';

import AppDag from './components/AppDag';
import Dashboard from './components/Dashboard';

export function MainPage(props) {
  const { dag, numUpdates } = props;
  return (
    <div>
      <MainPageNav />
      <Dashboard dag={dag} numUpdates={numUpdates} />
      <MainPageTabs dag={dag} />
    </div>
  );
}

// Simply intitializes data, so must never be called a second time!
export default function App() {
  AppDag.init('Bpx');
  return <AppData />
}

export function AppData(props) {
  // Modify the DAG to accomodate leaf input processing
  const initialDag = AppDag.getDag();
  initialDag.leafs.forEach((leaf) => {
    leaf.own.form = {
      slug: leaf.fullName('-'),
      display: leaf.value(),
      errors: [],
      isValid: true,
      isInvalid: false,
    };
  });

  const [dag, setDag] = useState(initialDag);
  const [numUpdates, setNumUpdates] = useState(0);

  // Handlers should call dagUpdate() instead of setDag()
  // so we can do debugging, logging, etc.
  function dagUpdate() {
    //console.log('DAG UPDATE='+numUpdates+' -------------------------------');
    setDag(AppDag.getDag());
    setNumUpdates(numUpdates+1);
    //alert('dagUpdate() #'+numUpdates);
  }
  AppDag.setStateUpdater(dagUpdate);

  return (
    <div>
      <MainPage dag={dag} numUpdates={numUpdates} />
    </div>
  );
}
