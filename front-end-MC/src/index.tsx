import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './views/App';
import PatientRegister from './views/PatientRegister';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/patientRegisters" element={<PatientRegister />} />
        <Route path="/patientRegisters/:editId" element={<PatientRegister />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);