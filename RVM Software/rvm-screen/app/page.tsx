"use client";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QrPage from "./QrPage";
import ScanPage from "./ScanItemPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QrPage />} />
        <Route path="/scan" element={<ScanPage />} />
      </Routes>
    </Router>
  );
};

export default App;
