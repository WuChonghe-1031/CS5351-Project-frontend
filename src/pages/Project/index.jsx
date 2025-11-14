import React from "react";
import { useState } from "react";
import ProjectDashboard from "./ProjectDashboard";

const Project = () => {
  const [a, setA] = useState(null);
  return <div>Project Page
    <ProjectDashboard />
  </div>;
}

export default Project;