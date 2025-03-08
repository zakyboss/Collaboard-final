// File: src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Front-end/Pages/Home";
import LoginForm from "./Front-end/Pages/Login";
import Signup from "./Front-end/Pages/Signup";
import About from "./Front-end/Pages/About";
import Contacts from "./Front-end/Pages/Contacts";
import CreateProjects from "./Front-end/Pages/CreateProjects";
import YourProjects from "./Front-end/Pages/YourProjects";
import PageNotFound from "./Front-end/Pages/PageNotFound";
import EditProfile from "./Front-end/Pages/EditProfile"; // if you have an EditProfile

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" index element={<Home />} />

        {/* Auth Pages */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<Signup />} />

        {/* Other Pages */}
        <Route path="/about" element={<About />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/projectCreation" element={<CreateProjects />} />
        <Route path="/your-projects" element={<YourProjects />} />
        <Route path="/edit-profile" element={<EditProfile />} />

        {/* 404 / Catch-All */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
