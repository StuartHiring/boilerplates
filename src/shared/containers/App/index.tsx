import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import Navbar from "../Navbar";
import "../../../styles/main.scss";

interface AppProps extends RouteComponentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  route: any;
}

const App: React.FC<AppProps> = ({ location, match, route }) => {
  console.log(location);
  console.log(match);
  console.log(route);

  const isAuth = false;

  return (
    <>
      <Navbar isAuth={isAuth} />
      {renderRoutes(route.routes)}
    </>
  );
};

export default App;
