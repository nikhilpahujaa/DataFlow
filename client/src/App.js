import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Analyze from './pages/Analyze';
import Migrate from './pages/Migrate';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="px-[15%] py-8 pb-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analyze" element={<Analyze />} />
            <Route path="/migrate" element={<Migrate />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;