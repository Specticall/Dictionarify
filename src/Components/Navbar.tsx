import { useLocation, useNavigate } from "react-router-dom";
import Button from "./Common/Button";
import Icons from "./Common/Icons";
import { CSSProperties, useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";

const activeStyles: CSSProperties = {
  color: "black",
  fontWeight: "500",
};

export default function Navbar() {
  const { loggedInUserData, logoutUser } = useAuth();
  const [showBackground, setShowBackground] = useState(window.scrollY !== 0);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const watchScroll = () => {
      setShowBackground(window.scrollY > 0);
    };
    window.addEventListener("scroll", watchScroll);

    return () => {
      window.removeEventListener("scroll", watchScroll);
    };
  }, []);
  const handleNavigate = (path: string) => () => {
    navigate(path);
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0  text-main z-10 transition-all duration-200"
      style={
        showBackground
          ? {
              background: "white",
              boxShadow: "-1px 24px 48px 0px rgba(181,181,219,0.1)",
            }
          : undefined
      }
    >
      <ul className="flex justify-between items-center gap-4 max-w-[75rem] mx-auto py-8 px-8">
        <div className="flex justify-center items-center gap-8 text-light">
          <li className="mr-6">
            <Icons icon="logo" />
          </li>
          <li
            className="cursor-pointer"
            onClick={handleNavigate("/app/home")}
            style={pathname === "/app/home" ? activeStyles : undefined}
          >
            Dictionary
          </li>
          <li
            className="cursor-pointer"
            onClick={handleNavigate("/app/bookmark")}
            style={pathname === "/app/bookmark" ? activeStyles : undefined}
          >
            Bookmarks
          </li>
        </div>
        {loggedInUserData ? (
          <Button
            onClick={() => {
              logoutUser();
              navigate("/app/home");
            }}
          >
            Logout
          </Button>
        ) : (
          <Button onClick={() => navigate("/register")}>Register</Button>
        )}
      </ul>
    </nav>
  );
}
