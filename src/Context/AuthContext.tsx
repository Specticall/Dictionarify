import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { TUser } from "../Utils/types";
import { v4 as uuidv4 } from "uuid";

type TAuthContextValues = {
  registerUser: (email: string, password: string) => void;
  loginUser: (email: string, password: string) => void;
  logoutUser: () => void;
  loggedInUserData: TUser | undefined;
  updateLoggedInUser: (callback: (currentUserData: TUser) => TUser) => void;
};

const AuthContext = createContext<TAuthContextValues | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<TUser[]>([]);
  const [loggedInUserId, setLoggedInUserId] = useState<string | undefined>();

  useEffect(() => {
    setUserData(JSON.parse(localStorage.getItem("userData") || "[]") || []);
    setLoggedInUserId(localStorage.getItem("loggedInUserId") || undefined);
  }, []);

  const registerUser = (email: string, password: string) => {
    const newUser = {
      email,
      password,
      id: uuidv4(),
      bookmarks: [],
    };

    const emailAlreadyExist = userData?.some((data) => data.email === email);
    if (emailAlreadyExist) throw Error("Register: 'Email already exist'");

    localStorage.setItem(
      "userData",
      JSON.stringify([...(userData || []), newUser])
    );

    setUserData((users) => [...(users || []), newUser]);
  };

  const loginUser = (email: string, password: string) => {
    const user = userData?.find((user) => user.email === email);
    if (!user) throw new Error("Login Error : Email not found");

    const passwordMatch = user.password === password;
    if (!passwordMatch) throw new Error("Login Error: Password does not match");

    localStorage.setItem("loggedInUserId", user.id);
    setLoggedInUserId(user.id);
  };

  const loggedInUserData = useMemo(() => {
    return userData?.find((data) => data.id === loggedInUserId);
  }, [userData, loggedInUserId]);

  const logoutUser = () => {
    setLoggedInUserId(undefined);
    localStorage.removeItem("loggedInUserId");
  };

  const updateLoggedInUser = (callback: (currentUserData: TUser) => TUser) => {
    if (!loggedInUserId || !loggedInUserData)
      throw new Error(
        "Update user: user must be signed in before doing an UPDATE operation"
      );

    setUserData((current) => {
      const currentUserIndex =
        current?.findIndex((user) => {
          return user.id === loggedInUserId;
        }) ?? -1;

      if (currentUserIndex === -1) {
        console.log("updateLoggedInUserUser : index not found!");
        return current;
      }

      current[currentUserIndex] = callback(current[currentUserIndex]);

      localStorage.setItem("userData", JSON.stringify(current));
      return [...current];
    });
  };

  return (
    <AuthContext.Provider
      value={{
        registerUser,
        loginUser,
        logoutUser,
        loggedInUserData,
        updateLoggedInUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used inside of it's Provider's scope");
  return context;
}
