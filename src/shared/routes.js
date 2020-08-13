import App from "./containers/App";
import Home from "./components/Home";
import LoginRegister from "./components/LoginRegister";
import LaunchesPast from "./components/LaunchesPast";

export default [
  {
    path: "/",
    component: App,
    routes: [
      {
        path: "/",
        exact: true,
        component: Home,
      },
      {
        path: "/launches_past",
        component: LaunchesPast,
      },
      {
        path: "/login_register",
        component: LoginRegister,
      },
    ],
  },
];
