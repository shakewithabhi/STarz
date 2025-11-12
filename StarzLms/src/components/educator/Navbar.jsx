import React from "react";
import { assets, dummyEducatorData } from "../../assets/assets";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const NavBar = () => {
  const { user } = useUser();
  const educatorData = dummyEducatorData;

  return (
    <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3">
      <Link to="/">
        <img src={assets.logo} alt="" />
      </Link>
      <div className="flex items-center gap-5 text-gray-500 relative">
        <p> hi! {user ? user.fullName : "Developers"} </p>
        {user ? (
          <UserButton />
        ) : (
          <img src={assets.profile_img} className="max-w-8" alt="" />
        )}
      </div>
    </div>
  );
};

export default NavBar;
