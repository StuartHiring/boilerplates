import React from "react";
import { RouteComponentProps } from "react-router-dom";
import LaunchesPast from "../../components/LaunchesPast";

interface AppProps extends RouteComponentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  route: any;
}

const App: React.FC<AppProps> = ({ location, match, route }) => {
  console.log(location);
  console.log(match);
  console.log(route);

  return <LaunchesPast />;
};

export default App;
