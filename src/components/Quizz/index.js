import { useState, useEffect, useContext, useRef, use } from "react";
import { MetamaskContext } from "../../Provider";
import { ToastContainer, toast } from "react-toastify";
import { QuizzStarTrek } from "../QuizzStarTrek"; // Importez le fichier chiffré
import Levels from "../Levels";
import ProgressBar from "../ProgressBar";
import QuizzOver from "../QuizzOver";
import { GiCyborgFace } from "react-icons/gi";
import { SiStartrek } from "react-icons/si";
import Header from "../Header";

const Quizz = ({ config }) => {
  const initialState = {
    user: null,
    levelNames: ["ensign", "captain", "admiral"],
    quizzLevel: 0,
    maxQuestions: 10,
    storedQuestions: [],
    question: null,
    options: [],
    idQuestion: 0,
    btnDisabled: true,
    userAnswer: null,
    score: 0,
    showWelcomeMsg: false,
    quizzEnd: false,
    percent: 0,
  };

  const [state, setState] = useState(initialState);
  const storedDataRef = useRef();
  const { pseudo } = useContext(MetamaskContext);
  const [user] = pseudo;

  useEffect(() => {
    if (typeof window !== "undefined") {
      loadQuestions(state.levelNames[state.quizzLevel]);
      setState((prevState) => ({ ...prevState, user }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const decryptData = async (
    encryptedQuestion,
    encryptedOptions,
    encryptedAnswer
  ) => {
    try {
      const response = await fetch("/api/decrypt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          encryptedQuestion,
          encryptedOptions,
          encryptedAnswer,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to decrypt the data");
      }

      const data = await response.json();

      return {
        decryptedQuestion: data.decryptedQuestion,
        decryptedOptions: data.decryptedOptions,
        decryptedAnswer: data.decryptedAnswer,
      };
    } catch (error) {
      console.error("Error decrypting data:", error);
      return null;
    }
  };

  const loadQuestions = async (level) => {
    const fetchedArrayQuizz = QuizzStarTrek[0].quizz[level];
    if (fetchedArrayQuizz?.length >= state.maxQuestions) {
      storedDataRef.current = fetchedArrayQuizz;
      const newArray = await Promise.all(
        fetchedArrayQuizz.map(
          async ({ question, options, answer, ...keepRest }) => {
            const decryptedData = await decryptData(question, options, answer);
            return {
              ...keepRest,
              question: decryptedData.decryptedQuestion,
              options: decryptedData.decryptedOptions,
              answer: decryptedData.decryptedAnswer,
            };
          }
        )
      );
      setState((prevState) => ({ ...prevState, storedQuestions: newArray }));
    } else {
      console.log("Not enough questions");
    }
  };

  useEffect(() => {
    if (state.storedQuestions.length) {
      setState((prevState) => ({
        ...prevState,
        question: state.storedQuestions[state.idQuestion].question,
        options: state.storedQuestions[state.idQuestion].options,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.storedQuestions]);

  useEffect(() => {
    if (state.idQuestion < state.storedQuestions.length) {
      setState((prevState) => ({
        ...prevState,
        question: state.storedQuestions[state.idQuestion].question,
        options: state.storedQuestions[state.idQuestion].options,
        userAnswer: null,
        btnDisabled: true,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.idQuestion]);

  useEffect(() => {
    if (state.quizzEnd) {
      const gradePercent = getPercent(state.maxQuestions, state.score);
      gameOver(gradePercent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.quizzEnd]);

  useEffect(() => {
    if (state.user && !state.showWelcomeMsg) {
      showToastMsg(state.user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.user, state.showWelcomeMsg]);

  const showToastMsg = (pseudo) => {
    if (!state.showWelcomeMsg) {
      setState((prevState) => ({ ...prevState, showWelcomeMsg: true }));
      toast.warn(`Welcome ${pseudo} ! Good luck 🦾`, {
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
  };

  const submitAnswer = (answer) => {
    setState((prevState) => ({
      ...prevState,
      userAnswer: answer,
      btnDisabled: false,
    }));
  };

  const getPercent = (maxQuest, ourScore) => (ourScore / maxQuest) * 100;

  const gameOver = (percent) => {
    if (percent >= 50) {
      setState((prevState) => ({
        ...prevState,
        quizzLevel: prevState.quizzLevel + 1,
        percent,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        percent,
      }));
    }
  };

  const nextQuestion = () => {
    const goodAnswer = state.storedQuestions[state.idQuestion].answer;

    if (String(state.userAnswer) === String(goodAnswer)) {
      setState((prevState) => ({ ...prevState, score: prevState.score + 1 }));
    }

    if (state.idQuestion === state.maxQuestions - 1) {
      setState((prevState) => ({ ...prevState, quizzEnd: true }));
    } else {
      setState((prevState) => ({
        ...prevState,
        idQuestion: prevState.idQuestion + 1,
        userAnswer: null,
        btnDisabled: true,
      }));
      toast.info("Next Question ! 🚀🚀", {
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
  };

  const loadLevelQuestions = (param) => {
    setState({
      ...initialState,
      quizzLevel: param,
      user: state.user,
    });
    loadQuestions(state.levelNames[param]);
  };

  const displayOptions = state.options.map((option, index) => (
    <p
      key={index}
      onClick={() => submitAnswer(option)}
      className={`answerOptions ${
        state.userAnswer === option ? "selected" : null
      }`}
    >
      <GiCyborgFace /> {option}
    </p>
  ));

  return state.quizzEnd ? (
    <>
      <Header />
      <QuizzOver
        ref={storedDataRef}
        levelNames={state.levelNames}
        score={state.score}
        maxQuestions={state.maxQuestions}
        quizzLevel={state.quizzLevel}
        percent={state.percent}
        loadLevelQuestions={loadLevelQuestions}
        config={config}
      />
    </>
  ) : (
    <>
      <ToastContainer />
      <div style={{ width: "80%", margin: "0 auto" }}>
        <Header />
        <h1
          style={{
            color: "#34343f",
            backgroundImage: "linear-gradient(45deg, #f3f3f3, #34343f)",
            fontSize: "2.2em",
            display: "inlineBlock",
            marginBottom: "10px",
            borderRadius: "5px",
            padding: "10px",
          }}
        >
          {state.user ? `${state.user}'s starship` : "Loading..."}
        </h1>

        <Levels levelNames={state.levelNames} quizzLevel={state.quizzLevel} />
        <ProgressBar
          idQuestion={state.idQuestion}
          maxQuestions={state.maxQuestions}
        />
        <h2 style={{ color: "aqua" }}>
          <SiStartrek /> {state.question}
        </h2>
        {displayOptions}
        <button
          disabled={state.btnDisabled}
          className="btnSubmit"
          onClick={nextQuestion}
        >
          {state.idQuestion < state.maxQuestions - 1 ? "Next" : "Finished"}
        </button>
      </div>
    </>
  );
};

export default Quizz;
