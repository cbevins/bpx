import React, { useState } from 'react';
import MainPageNav from './components/MainPageNav';
import MainPageTabs from './components/MainPageTabs';

import './App.css';
import './components/json-inspector.css';
import 'react-table/react-table.css';

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
  const initialDag = AppDag.getDag();
  initialDag.units.applyConfig('imperial');
  const [dag, setDag] = useState(initialDag);
  const [numUpdates, setNumUpdates] = useState(0);

  // Handlers should call dagUpdate() instead of setDag()
  // so we can do debugging, logging, etc.
  function dagUpdate() {
    setDag(AppDag.getDag());
    setNumUpdates(numUpdates+1);
  }
  AppDag.setStateUpdater(dagUpdate);

  return (
    <div>
      <MainPage dag={dag} numUpdates={numUpdates} />
    </div>
  );
}
