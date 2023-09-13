import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import SiteHeader from "./SiteHeader";
import LinksSection from "./LinksSection";

function About() {
  const navigate = useNavigate();
  return (
    <div className="App flex flex-col items-center text-cyber-text bg-cyber-gradient min-h-screen min-w-screen">
      <SiteHeader />
      <main className="container mx-auto text-center">
        <LinksSection />
        <p>About Us</p>
      </main>
    </div>
  );
}

export default About;
