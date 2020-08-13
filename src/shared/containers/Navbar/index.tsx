import React from "react";
import { NavLink } from "react-router-dom";

interface NavbarProps {
  isAuth: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isAuth }) => {
  const NAVBAR_ITEMS = [
    {
      name: "HOME",
      to: "/",
    },
    {
      name: "LAUNCHES PAST",
      to: "/launches_past",
    },
    {
      name: isAuth ? "LOGOUT" : "LOGIN",
      to: "/login_register",
    },
  ];

  const renderNavbarItems = NAVBAR_ITEMS.map((item) => {
    return (
      <li key={item.name}>
        <NavLink to={item.to}>{item.name}</NavLink>
      </li>
    );
  });

  return (
    <div>
      <ul>{renderNavbarItems}</ul>
    </div>
  );
};

export default Navbar;
