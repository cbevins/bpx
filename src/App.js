import React from 'react';
import MainPageNav from './components/MainPageNav';
import MainPageTabs from './components/MainPageTabs';

import './App.css';
import './components/json-inspector.css';

export default function App() {
  return (
    <div>
      <MainPageNav />
      <MainPageTabs />
    </div>
  );
}
