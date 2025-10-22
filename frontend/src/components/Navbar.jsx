import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { MessageCircle, Cog, CircleUserRound, LogOut } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  return (
    <div className="navbar bg-base-200 ">
      <div className="ps-4">
        <Link to={"/"}>
          <img
            src="/flux-logo.png"
            alt="App Logo"
            className=" w-30 h-10 object-contain"
          />
        </Link>
      </div>
      <div className="flex grow justify-end px-2">
        <div className="flex items-stretch">
          {!authUser && (
            <>
              <Link
                to="/aboutus"
                className="flex items-center gap-3 px-4 py-2 rounded-lg text-base-content transition-none hover:bg-transparent focus:bg-transparent active:bg-transparent border-none shadow-none"
              >
                About Us
              </Link>
            </>
          )}

          {authUser && (
            <div className="avatar">
              <div className="ring-primary ring-offset-base-100 w-10 rounded-full border-3 border-green-500">
                <img src={authUser.message.profilePic} className="" />
              </div>
            </div>
          )}

          <div className="dropdown dropdown-end">
            <button
              tabIndex={0}
              className="btn btn-ghost rounded-field bg-transparent border-none hover:bg-transparent focus:bg-transparent active:bg-transparent shadow-none  "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-5 w-5 stroke-current"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>{" "}
              </svg>
            </button>

            <ul
              tabIndex="-1"
              className="menu dropdown-content bg-base-200 rounded-box z-1 mt-4 w-52 p-2 shadow-sm"
            >
              <li>
                <Link
                  to="/settings"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-base-300 transition-colors"
                >
                  <Cog size={18} />
                  <span className="font-medium">Settings</span>
                </Link>
              </li>
              {authUser && (
                <>
                  <li>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-base-300 transition-colors"
                    >
                      <CircleUserRound size={18} />
                      <span className="font-medium">Profile</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/login"}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-base-300 transition-colors"
                      onClick={logout}
                    >
                      <LogOut size={18} />
                      <span className="font-medium">Log out</span>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
