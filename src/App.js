import React, { useState } from 'react';
import MainPageNav from './components/MainPageNav';
import MainPageTabs from './components/MainPageTabs';

import './App.css';
import './components/json-inspector.css';

import AppDag from './components/AppDag';

export function MainPage(props) {
  const { dag } = props;
  return (
    <div>
      <MainPageNav />
      <MainPageTabs dag={dag} />
    </div>
  );
}

export default function App() {
  AppDag.init('Bpx');
  const [dag, setDag] = useState(AppDag.getDag());

  // Handlers should call dagUpdate() instead of setDag()
  // so we can do debugging, logging, etc.
  function dagUpdate() {
    //alert('dagUpdate()');
    setDag(dag);
  }
  AppDag.setStateUpdater(dagUpdate);

  return (
    <div>
      <MainPage dag={dag} />
    </div>
  );
}
