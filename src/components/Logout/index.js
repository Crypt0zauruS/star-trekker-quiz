import { useState, useEffect, useContext } from "react";
import ReactTooltip from "react-tooltip-rc";
import { MetamaskContext } from "../../Provider";
import { useRouter } from "next/router";
import { useDisconnect } from "wagmi";

const Logout = () => {
  const { pseudo } = useContext(MetamaskContext);
  const { disconnect } = useDisconnect();
  const [checked, setChecked] = useState(false);
  const [userData] = pseudo;
  const router = useRouter();

  useEffect(() => {
    if (checked) {
      disconnect();
      router.push("/");
      //router.reload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  const handleChange = (e) => {
    setChecked(e.target.checked);
  };

  return (
    <div className="logoutContainer">
      <p className="logoutText">Logout & RESET</p>

      <label className="switch">
        <input onChange={handleChange} type="checkbox" checked={checked} />
        <span
          className="slider round"
          data-tip={`Reset ${userData}'s quizz`}
        ></span>
      </label>
      <ReactTooltip place="left" effect="solid" />
    </div>
  );
};

export default Logout;
