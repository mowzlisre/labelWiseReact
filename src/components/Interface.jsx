import React, { useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'; // Use BrowserRouter here
import AbstractInput from './AbstractInput';
import Login from './Login';
import Response from './Response'; // Make sure you import the Response component

function Interface() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const collapseSideBar = () => {
    setIsCollapsed(true);
};

  return (
    <Router>
        <Routes>
          <Route path="/login" element={<Login />} /> 
          <Route path="/new" element={<AbstractInput {...{isCollapsed, setIsCollapsed}} />} />
          <Route path="/response" element={<Response {...{isCollapsed, setIsCollapsed}} />} /> 
          <Route path="/response/:id" element={<Response {...{isCollapsed, setIsCollapsed}} />} /> 
          <Route path="/login" element={<Login />} /> 
        </Routes>
    </Router>
  );
}

export default Interface;
