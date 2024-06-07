import { useState, useEffect, useContext, MouseEventHandler } from "react";
import { MetamaskContext } from "@/Provider";
import { useRouter } from "next/router";
import Footer from "@/components/Footer";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect, useChains, useSignMessage } from "wagmi";
import queen from "../../public/images/queen.png";
import Image from "next/image";
import { watchAccount } from "@wagmi/core";
import useWhitelistStatus from "../hook/useWhitelistStatus";
import Loader from "../components/Loader";
import Header from "../components/Header";

interface LoginProps {
  config: any;
}

const Login: React.FC<LoginProps> = ({ config }) => {
  const { metamask, pseudo } = useContext(MetamaskContext);
  const [userSession, setUserSession] = metamask;
  const [userData, setUserData] = pseudo;
  const router = useRouter();
  const [btn, setBtn] = useState(false);
  const [error, setError] = useState("");
  const chains = useChains();
  const { disconnect } = useDisconnect();
  const [status, setStatus] = useState("Resistance is Futile");
  const { isConnected, address, chain } = useAccount();
  const {
    isUmbrellaWhitelisted,
    isQuizWhitelisted,
    maxAddressesWhitelisted,
    remainingAddresses,
    loading,
    paused,
  } = useWhitelistStatus(config);
  const { signMessageAsync } = useSignMessage();
  const [loader, setLoader] = useState(false);

  const validateUserData = (data: string): boolean => {
    const regex = /^[a-zA-Z\d]{4,20}$/;
    return regex.test(data);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (paused) {
      setError("The WhiteList is paused");
      return;
    }
    if (
      isQuizWhitelisted ||
      isUmbrellaWhitelisted ||
      remainingAddresses === 0
    ) {
      disconnect();
      return;
    }
    if (!validateUserData(userData)) {
      setError("Nickname must be 4-20 alphanumeric characters.");
      return;
    }

    if (chain?.id === 137) {
      try {
        await handleSignMessage();
        setLoader(true);
        await router.push("/welcome");
        setLoader(false);
      } catch (error) {
        console.error("Error signing message: ", error);
        setError("Failed to sign message.");
        disconnect();
      }
    } else {
      alert("Switch to Polygon network");
      disconnect();
    }
  };

  const handleSignMessage = async () => {
    try {
      const message = `Welcome to the Star Trekker Quizz ! ${userData}. If you succeed, you will join the WhiteList for minting a Star Trekker NFT ! You can try as many times as there are spots available, but remember, you have to answer correctly to all 30 questions to win.
      Good Luck !`;
      await signMessageAsync({ message });
    } catch (error) {
      console.error("Erreur lors de la signature :", error);
      disconnect();
    }
  };

  const disengageButton = () => (
    <button
      className="btnSubmit"
      onClick={disconnect as MouseEventHandler<HTMLButtonElement>}
    >
      Disengage
    </button>
  );

  useEffect(() => {
    const AccountWatch = () => {
      watchAccount(config, {
        onChange: (account, prevAccount) => {
          if (
            account.address !== undefined &&
            prevAccount.address !== undefined
          ) {
            if (account.address !== prevAccount.address) {
              setUserSession(account.address);
              setUserData("");
            }
          }
        },
      });
    };
    AccountWatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, setUserSession, setUserData]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!isConnected) {
        setError("Wallet is not connected");
        setStatus("Resistance is Futile");
        setUserSession(null);
        setBtn(true);
        return;
      }
      if (isConnected && chains?.length) {
        if (chains[0]?.id !== 137) {
          setError("Wrong network");
          setStatus("Resistance is Futile");
          setUserSession(null);
          setBtn(false);
        } else if (chains[0]?.id === 137) {
          setError("");
          setStatus("Assimilated");
          setBtn(false);
          setUserSession(address);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, chains, address, setUserSession]);

  return (
    <div className="signUpLoginBox">
      <Header />
      <div className="slContainer">
        <div className="formBoxLeftLogin"></div>
        <div className="formBoxRight">
          {!paused ? (
            <>
              <div className="formContent">
                {error !== "" && (
                  <span className="animate__animated animate__zoomInLeft">
                    {error}
                  </span>
                )}

                {!loader ? (
                  <h2>Status: {status} </h2>
                ) : (
                  <>
                    <Loader loadingMsg={undefined} styling={undefined} />
                  </>
                )}
                <hr />

                {!loading ? (
                  userSession && (
                    <div>
                      <h2>Account: {userSession}</h2>
                      {remainingAddresses !== undefined &&
                        remainingAddresses > 0 && (
                          <h2 style={{ fontSize: "1.5rem" }}>
                            {remainingAddresses} spot
                            {remainingAddresses > 1 ? "s" : ""} left on{" "}
                            {maxAddressesWhitelisted}
                          </h2>
                        )}

                      {isQuizWhitelisted ? (
                        <div className="rules">
                          <div>
                            <p>
                              Congratulations for succeeding in this Quiz ! You
                              are now part of the WhiteList !
                            </p>
                            <hr />
                            {disengageButton()}
                          </div>
                          <Image
                            src={queen}
                            width={200}
                            height={200}
                            className="picture"
                            alt="queen"
                          />
                        </div>
                      ) : isUmbrellaWhitelisted ? (
                        <div className="rules">
                          <div>
                            <p>
                              You are already part of the WhiteList, Thanks for
                              participation in UmbrellaCorp Academy !
                            </p>
                            <hr />
                            {disengageButton()}
                          </div>
                          <Image
                            src={queen}
                            width={200}
                            height={200}
                            className="picture"
                            alt="queen"
                          />
                        </div>
                      ) : remainingAddresses && remainingAddresses > 0 ? (
                        <form
                          className="inputBox"
                          onSubmit={
                            handleSubmit as MouseEventHandler<HTMLFormElement>
                          }
                        >
                          <input
                            type="text"
                            placeholder="Nickname 4 - 20 alphanumeric characters"
                            pattern="[a-zA-Z\d]{4,20}"
                            onChange={(e) => setUserData(e.target.value)}
                            value={userData}
                            autoFocus
                            required
                          />
                          <div className="rules">
                            <p>
                              Welcome to the Star Trekker Quizz ! <br />
                              <br />
                              There are 3 levels, each level has 10 questions.{" "}
                              <br />
                              ALL the 30 answers MUST be correct to win a chance
                              to join the WhiteList ! <br />
                              <br />
                              Warning ! Changing account, network, refreshing,
                              back to login page or Logout during the quizz will
                              reset your progression ! <br />
                              <br />
                              GOOD LUCK !
                            </p>
                            <Image
                              src={queen}
                              width={200}
                              height={200}
                              className="picture"
                              alt="queen"
                            />
                          </div>
                          <hr />
                          <button
                            className="btnSubmit"
                            type="submit"
                            disabled={
                              isQuizWhitelisted ||
                              isUmbrellaWhitelisted ||
                              remainingAddresses === 0
                            }
                          >
                            Start the Quizz !
                          </button>
                          {disengageButton()}
                        </form>
                      ) : typeof remainingAddresses === "number" &&
                        remainingAddresses === 0 ? (
                        <div className="rules">
                          <div>
                            <p>
                              The WhiteList is full,{" "}
                              {isQuizWhitelisted || isUmbrellaWhitelisted
                                ? " but you are already part of the WhiteList !"
                                : " you can't participate anymore."}
                            </p>{" "}
                            <hr />
                            {disengageButton()}
                          </div>
                          <Image
                            src={queen}
                            width={200}
                            height={200}
                            className="picture"
                            alt="queen"
                          />
                        </div>
                      ) : undefined}
                    </div>
                  )
                ) : loading ? (
                  <Loader loadingMsg={undefined} styling={undefined} />
                ) : undefined}

                {btn && (
                  <ConnectButton.Custom>
                    {({ openConnectModal }) => (
                      <button
                        className="btnSubmit"
                        onClick={openConnectModal}
                        disabled={paused}
                      >
                        Connect Wallet
                      </button>
                    )}
                  </ConnectButton.Custom>
                )}
              </div>
            </>
          ) : (
            <div className="formContent">
              <h2>Status: {status} </h2>
              <div className="rules">
                <p>Don't be so pressed to be assimilated ! Wait patiently...</p>{" "}
                <Image
                  src={queen}
                  width={200}
                  height={200}
                  className="picture"
                  alt="queen"
                />
              </div>
            </div>
          )}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Login;
