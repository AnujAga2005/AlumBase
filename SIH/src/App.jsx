import React from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./sections/Navbar";
import { Home } from "./pages/Home";
import Donations from "./pages/Donations";
import AlumniDirectory from "./pages/AlumniDirectory";


const App = () => {
  return (
    <main>
      <Navbar />

    <Routes>

  {/* top-level pages */}

  <Route path="/" element={
       <Home />}/>

  <Route path="/donations" element={<Donations />} />
  <Route path="/alumni" element={<AlumniDirectory />} />

  {/* sub-category pages */}
  
    </Routes>
    </main>
   
  );
};

export default App;
