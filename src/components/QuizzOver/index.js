import { forwardRef, memo, useEffect, useState } from "react";
import { GiTrophyCup } from "react-icons/gi";
import { SiStartrek } from "react-icons/si";
import Loader from "../Loader";
import intrepid from "../../../public/images/intrepid.png";
import galaxy from "../../../public/images/galaxy.png";
import sovereign from "../../../public/images/sovereign.png";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import { useWriteContract, useAccount, useChains } from "wagmi";
import { useEthersSigner } from "../ethersProvider";
import useWhitelistStatus from "../../hook/useWhitelistStatus";

const QuizzOver = forwardRef((props, ref) => {
  const {
    levelNames,
    score,
    quizzLevel,
    percent,
    maxQuestions,
    loadLevelQuestions,
    config,
  } = props;

  const [asked, setAsked] = useState([]);
  const { quizContract, isUmbrellaWhitelisted, isQuizWhitelisted, paused } =
    useWhitelistStatus(config);
  const images = [intrepid, galaxy, sovereign];
  const rank = levelNames[quizzLevel - 1];
  const { address } = useAccount();
  const chains = useChains();
  const { error, isError, isSuccess, receipt } = useWriteContract();
  const signer = useEthersSigner();
  const [loading, setLoading] = useState(false);
  // const averageGrade = maxQuestions / 2;
  const averageGrade = maxQuestions;

  async function fetchNonceAndSignature() {
    try {
      const response = await fetch("/api/getNonceAndSignature", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userAddress: address }),
      });

      if (response.ok) {
        const data = await response.json();

        return {
          nonce: data.nonce,
          signature: data.signature,
          randomValue: data.randomValue,
        };
      } else {
        toast.error(` Failed to fetch nonce and signature`, {
          theme: "dark",
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
        });
        return null;
      }
    } catch (error) {
      console.error("Error fetching nonce and signature: ", error);
      toast.error(` Failed to fetch nonce and signature`, {
        theme: "dark",
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      });
      return null;
    }
  }

  const claimWhitelist = async () => {
    if (paused) {
      console.error("Contract is paused");
      return;
    }
    if (!address) {
      console.error("No address");
      return;
    }
    if (chains[0]?.id !== 137) {
      console.error("Chain is not Polygon");
      return;
    }
    if (!signer) {
      console.error("No signer");
      return;
    }
    try {
      setLoading(true);
      const data = await fetchNonceAndSignature();
      if (!data) {
        throw new Error("Failed to fetch nonce or signature");
      }
      const { nonce, signature, randomValue } = data;

      if (!quizContract) {
        console.error("No contract");
        toast.error("Contract not found", {
          theme: "dark",
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
        });
        return;
      }
      const tx = await quizContract.addAddressToWhitelist(
        nonce,
        signature,
        randomValue
      );
      console.log("Transaction sent:", tx.hash);

      const receipt = await tx.wait();
      console.log("Transaction mined:", receipt);

      quizContract.on("AddressAddedToWhitelist", (user, event) => {
        console.log("User added to whitelist:", user, event);
      });

      toast.success("You are successfully whitelisted !", {
        theme: "dark",
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error claiming whitelist: ", error);

      const message = error.message.includes("already whitelisted")
        ? "You are already whitelisted !"
        : "Error claiming whitelist";
      toast.error(message, {
        theme: "dark",
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") setAsked(ref.current);
    // eslint-disable-next-line
  }, [ref]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (score < averageGrade) {
        setTimeout(() => {
          loadLevelQuestions(0);
        }, 4000);
      }
    }
    // eslint-disable-next-line
  }, [score, averageGrade, loadLevelQuestions]);

  useEffect(() => {
    if (isSuccess) {
      console.log("Transaction réussie:", receipt);
      toast.success(` Transaction successful`, {
        theme: "dark",
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      });
    } else if (isError) {
      console.error("Erreur dans la transaction:", error);
      toast.error(` Transaction failed`, {
        theme: "dark",
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      });
    }
    // eslint-disable-next-line
  }, [isSuccess, isError, receipt, error]);

  const decision =
    score === averageGrade ? (
      <>
        <div className="stepsBtnContainer">
          {quizzLevel < levelNames.length ? (
            <>
              <p className="successMsg">
                <SiStartrek size="50px" /> Congratulations ! you are promoted to
                the {rank} rank !
              </p>
              <button
                className="btnResult success"
                onClick={() => loadLevelQuestions(quizzLevel)}
              >
                Next level
              </button>
            </>
          ) : (
            <>
              <p className="successMsg">
                <GiTrophyCup size="50px" /> Congratulations Admiral ! You're an
                expert !{" "}
                {isUmbrellaWhitelisted
                  ? "But you're already been whitelisted on UmbrellaCorp Academy !"
                  : isQuizWhitelisted
                  ? "But you're already been whitelisted here !"
                  : "Click on the button to get whitelisted for the Star Trekker NFT Collection Free Mint !"}
              </p>
              <button
                onClick={() => {
                  claimWhitelist();
                }}
                className="btnResult gameOver"
                disabled={
                  loading ||
                  isUmbrellaWhitelisted ||
                  isQuizWhitelisted ||
                  paused
                }
              >
                Get Whitelisted !
              </button>
            </>
          )}
        </div>
        <div className="percentage">
          <div className="progressPercent">Your score: {percent} %</div>
          <div className="progressPercent">
            Your mark: {score}/{maxQuestions}
          </div>
        </div>
      </>
    ) : (
      <>
        <div className="stepsBtnContainer">
          <p className="failureMsg">You failed !</p>
        </div>
        <div className="percentage">
          <div className="progressPercent">Your score: {percent} %</div>
          <div className="progressPercent">
            Your mark: {score}/{maxQuestions}
          </div>
        </div>
      </>
    );

  // eslint-disable-next-line
  {
    /* Keeping code for future releases, but out of question to display answers for a whitelist quizz !!!
    score === averageGrade ? (    
    asked.map((elem) => {
          return (
            <tr key={elem.id}>
              <td>{elem.question}</td>
              <td>{elem.answer}</td>
          </tr> 
          
          );
        }))
      */
  }

  const QuestionsAndAnswers =
    score === averageGrade ? (
      images?.[quizzLevel - 1] && (
        <Image
          width={1000}
          height={200}
          className="starship animate__animated animate__lightSpeedInLeft picture"
          src={images[quizzLevel - 1]}
          alt="starship"
        />
      )
    ) : (
      <table className="answers">
        <thead>
          <tr>
            <td colSpan="3">
              <Loader
                loadingMsg={
                  "All the answers must be correct ! Wait to try again !"
                }
                styling={{
                  fontSize: "1.3em",
                  textAlign: "center",
                  color: "red",
                }}
              />
            </td>
          </tr>
        </thead>
      </table>
    );

  return (
    <>
      <ToastContainer />
      {decision}
      {loading && <Loader loadingMsg={"Transaction in progress..."} />}
      <hr />

      <div className="answerContainer">
        {/* Keeping code for future releases, but out of question to display answers for a whitelist quizz !!!
          <table className="answers">
          <thead>
            <tr>
              <th>Questions</th>
              <th>Answers</th>
            </tr>
          </thead>
          <tbody>{QuestionsAndAnswers}</tbody>
          </table>
          */}
        {QuestionsAndAnswers}
      </div>
    </>
  );
});

// eviter que le composant se charge plusieurs fois
export default memo(QuizzOver);
