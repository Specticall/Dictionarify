import { ReactNode, createContext, useContext, useRef } from "react";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";

type TLoaderContextValues = {
  startLoading: () => void;
  completeLoading: () => void;
};

const LoaderContext = createContext<TLoaderContextValues | null>(null);

export function LoaderProvider({ children }: { children: ReactNode }) {
  const ref = useRef<null | LoadingBarRef>(null);
  const startLoading = () => {
    if (!ref.current) return;
    ref.current.continuousStart();
  };

  const completeLoading = () => {
    if (!ref.current) return;
    ref.current.complete();
  };
  return (
    <LoaderContext.Provider value={{ startLoading, completeLoading }}>
      <LoadingBar ref={ref} color="#0038FF" />
      {children}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  const context = useContext(LoaderContext);
  if (!context)
    throw new Error("useLoader must be used inside of it's Provider's scope");
  return context;
}
