import { useContext, useEffect } from "react";
import { MetamaskContext } from "../Provider";
import { useRouter } from "next/router";
import { useAccount, useChains, useDisconnect } from "wagmi";
import Logout from "../components/Logout";
import Quizz from "../components/Quizz";
import { watchAccount } from "@wagmi/core";
import useWhitelistStatus from "../hook/useWhitelistStatus";

interface LoginProps {
  config: any;
}

const Welcome: React.FC<LoginProps> = ({ config }) => {
  const { metamask, pseudo } = useContext(MetamaskContext);
  const [userSession, setUserSession] = metamask;
  const { disconnect } = useDisconnect();
  const { isConnected, address, chain } = useAccount();
  const chains = useChains();
  const router = useRouter();
  const [userData, setUserData] = pseudo;
  const { paused } = useWhitelistStatus(config);

  const AccountWatch = () => {
    watchAccount(config, {
      onChange: (account, prevAccount) => {
        if (
          account.address !== undefined &&
          prevAccount.address !== undefined
        ) {
          account.address !== prevAccount.address && disconnect();
        }
      },
    });
  };

  useEffect(() => {
    if (window !== undefined) {
      chain?.id !== 137 && disconnect();
    }
    // eslint-disable-next-line
  }, [chain]);

  useEffect(() => {
    AccountWatch();
    // eslint-disable-next-line
  }, [AccountWatch]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      reset();
    }
    // eslint-disable-next-line
  }, [isConnected, chains, address, userData, userSession]);

  const reset = () => {
    if (
      !isConnected ||
      !chains.length ||
      chains[0]?.id !== 137 ||
      address !== userSession ||
      !address ||
      !userSession ||
      !userData
    ) {
      setUserSession(null);
      setUserData("");
      disconnect();
      router.push("/");
    }
  };

  useEffect(
    () => {
      if (paused) {
        disconnect();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [paused]
  );

  return (
    <div className="quiz-bg">
      <div className="container">
        <Logout />
        <Quizz config={config} />
      </div>
    </div>
  );
};

export default Welcome;
