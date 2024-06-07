import { useState, useRef, useEffect } from "react";
import { SiGithub } from "react-icons/si";

const Footer = () => {
  const [disclaimer, setDisclaimer] = useState(false);
  const disclaimerRef = useRef();

  useEffect(() => {
    if (typeof window !== "undefined") {
      function handleClickOutside(event) {
        if (disclaimerRef.current) {
          setDisclaimer(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disclaimerRef]);

  return (
    <footer>
      <div className="footer-container">
        <div className="footer" id="footer">
          &copy; Copyright - App made with{" "}
          <span aria-label="heart emoji"> ❤️ </span> by Crypt0zauruS -{" "}
          {new Date().getFullYear()}
          <br />
          <p>
            <br />
            Follow me on{" "}
            <a
              className="github"
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/Crypt0zauruS"
            >
              <SiGithub />
            </a>{" "}
            -{" "}
            <button
              className="disclaimerBtn"
              onClick={() => setDisclaimer(true)}
            >
              Disclaimer
            </button>
          </p>
        </div>
        <p>Icons provided by iconFinder.com</p>
      </div>
      {disclaimer && (
        <div ref={disclaimerRef} className="disclaimer">
          <p>
            "Star Trek&trade; and all related marks, movies, TV shows, logos and
            characters are solely owned by CBS Studios Inc. This fan website and
            the associated fan Quiz and NFT Collection is not endorsed by,
            sponsored by, nor affiliated with CBS, Paramount Pictures, or any
            other Star Trek&trade; franchise, deal with a non-commercial Free
            Mint NFT Collection. No commercial exhibition or distribution is
            permitted. No alleged independent rights will be asserted against
            CBS or Paramount Pictures."
          </p>
        </div>
      )}
    </footer>
  );
};

export default Footer;
