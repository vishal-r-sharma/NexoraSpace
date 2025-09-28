import React from "react";
import AppRoutes from "./Routes/Routes";
import { EmployeeProvider } from "./components/clientSystem/EmployeeContext";
import { ProjectProvider } from "./components/clientSystem/ProjectContext";

const App = () => {
  return (
    <EmployeeProvider>
      <ProjectProvider>
        <AppRoutes />
      </ProjectProvider>
    </EmployeeProvider>
  );
};

export default App;