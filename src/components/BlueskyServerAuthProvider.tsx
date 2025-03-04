import { BlueskyServerAuthContext } from "@/contexts";
import { ReactNode } from "react";

type Props = {
  children: JSX.Element | JSX.Element[] | ReactNode;
};

export default function BlueskyServerAuthProvider({ children }: Props) {
  return (
    <BlueskyServerAuthContext.Provider
      value={{
        authenticated: false,
      }}
    >
      {children}
    </BlueskyServerAuthContext.Provider>
  );
}
