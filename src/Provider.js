import { useState, createContext } from "react";

export const MetamaskContext = createContext();

export const MetamaskProvider = (props) => {
  const [metamaskAccount, setMetamaskAccount] = useState(null);
  const [pseudo, setPseudo] = useState("");
  return (
    <MetamaskContext.Provider
      value={{
        metamask: [metamaskAccount, setMetamaskAccount],
        pseudo: [pseudo, setPseudo],
      }}
    >
      {props.children}
    </MetamaskContext.Provider>
  );
};
