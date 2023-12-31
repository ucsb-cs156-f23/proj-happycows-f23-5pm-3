import React, { useState} from "react";
import greetingsList from "../../../assets/PlayGreetings.json"

import "../../pages/HomePage.css"


export default function CommonsPlay({ currentUser }) {
  // Stryker disable  all 
  const firstName = currentUser?.root ? currentUser?.root?.user?.givenName : "";

  const [welcomeText, _]= useState(greetingsList[Math.floor(Math.random() * greetingsList.length)]);
  // Stryker restore all

  return (
    <div data-testid="CommonsPlay">
      <h1 data-testid="CommonsPlay-title" style={{backgroundSize: "300%",backgroundPosition:"-100%", fontSize:"32px", backgroundClip: "text", color: "transparent"}} className="gradient-animation">
      {welcomeText} {firstName}! 
    </h1>
    </div>
  );
};