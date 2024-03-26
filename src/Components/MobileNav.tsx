import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import Button from "./Common/Button";
import { CSSProperties, useState } from "react";

const activeStyles: CSSProperties = {
  color: "black",
  fontWeight: "500",
};

export default function MobileNav() {
  const { loggedInUserData, logoutUser } = useAuth();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleNavigate = (path: string) => () => {
    navigate(path);
  };

  const toggle = () => {
    setOpen((cur) => !cur);
  };

  return (
    <>
      <i
        onClick={toggle}
        className="text-[1.75rem] bx bx-menu hover:text-accent cursor-pointer"
      ></i>

      <div
        className="bg-black/40 fixed inset-0 flex justify-end transition-all duration-500"
        style={!open ? { visibility: "hidden", opacity: 0 } : undefined}
        onClick={() => setOpen(false)}
      >
        <ul
          className="bg-white  h-full w-full max-w-[15rem] py-12 px-8 flex flex-col items-start transition-all duration-500 justify-start gap-4"
          style={{ transform: `translateX(${open ? "0" : "100"}%)` }}
        >
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
          {loggedInUserData ? (
            <Button
              className="w-full"
              onClick={() => {
                logoutUser();
                navigate("/app/home");
              }}
            >
              Logout
            </Button>
          ) : (
            <Button className="w-full" onClick={() => navigate("/register")}>
              Register
            </Button>
          )}
        </ul>
      </div>
    </>
  );
}
