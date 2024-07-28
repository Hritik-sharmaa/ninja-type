import React, { useEffect, useRef, useState } from "react";
import { texts } from "./utils/text";
import { IoMdTime } from "react-icons/io";
import { LuSkull } from "react-icons/lu";
import { FaRegStar } from "react-icons/fa";
import { TbLetterCase } from "react-icons/tb";
import { AiOutlineReload } from "react-icons/ai";
import Focus from "./components/Focus";
import EndGame from "./components/EndGame";

function App() {
  const [currentTexts, setCurrentTexts] = useState<string>(texts[0]);
  const [capsLock, setCapsLock] = useState<boolean>(false);
  const [mistakes, setMistakes] = useState<number>(0);
  const [timer, setTimer] = useState<number>(30);
  const [input, setInput] = useState<string>("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [pointsEarned, setPointsEarned] = useState<number>(100);
  const [theme, setTheme] = useState<string>("");
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [fontFamily, setFontFamily] = useState<string>("");

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setCurrentTexts(texts[Math.floor(Math.random() * texts.length)]);

    const handleCapsLock = (event: KeyboardEvent) => {
      if (event.getModifierState("CapsLock")) {
        setCapsLock(true);
      } else {
        setCapsLock(false);
      }
      focusInput();
    };

    const focusInput = () => {
      if (
        !document.activeElement ||
        document.activeElement.tagName !== "SELECT"
      ) {
        setIsFocus(true);
        inputRef.current?.focus();
      }
    };

    const handleClick = () => focusInput();

    window.addEventListener("keydown", handleCapsLock);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("keydown", handleCapsLock);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (startTime && !isCompleted && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer <= 0) {
      setIsCompleted(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCompleted, timer, startTime]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!startTime) setStartTime(Date.now());
    if (isCompleted || timer <= 0) return;

    let newValue = event.target.value;
    let currentMistakes = mistakes;

    if (newValue.length >= currentTexts.length) {
      newValue = newValue.slice(0, currentTexts.length);
      setIsCompleted(true);
      setEndTime(Date.now());
    }

    if (!isCompleted && newValue.length >= input.length) {
      const typedChar = newValue[newValue.length - 1];
      const correctChar = currentTexts[newValue.length - 1];
      if (typedChar !== correctChar) {
        currentMistakes++;
        setMistakes(currentMistakes);
        calculatePoints(currentMistakes);
      }
    }
    setInput(newValue);
  };

  const userText = () => {
    const elements: JSX.Element[] = [];
    let inputIndex: number = 0;

    const userWords = currentTexts.split(" ");
    userWords.forEach((word, wordIndex) => {
      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        const inputChar = input[inputIndex];
        const className =
          inputIndex < input.length
            ? inputChar === char
              ? "correctChar"
              : "incorrectChar"
            : "untypedChar";

        elements.push(
          <span key={`${wordIndex}-${i}`} className={className}>
            {char}
          </span>
        );
        inputIndex++;
      }

      if (wordIndex < userWords.length - 1) {
        elements.push(
          <span key={`space-${wordIndex}`} className="spaceChar">
            {" "}
          </span>
        );
        inputIndex++;
      }
    });
    return elements;
  };

  const handleReplay = () => {
    setInput("");
    setMistakes(0);
    setTimer(30);
    setStartTime(null);
    setEndTime(null);
    setIsCompleted(false);
    setCurrentTexts(texts[Math.floor(Math.random() * texts.length)]);
    setPointsEarned(100);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const calculatePoints = (mistakes: number) => {
    const textLength = currentTexts.replace(/\s/g, "").length;
    let pointsEarn: number = 0;

    if (mistakes < textLength) {
      if (mistakes === 0) {
        pointsEarn = 100;
      } else if (mistakes <= 10) {
        pointsEarn = 90;
      } else if (mistakes <= 20) {
        pointsEarn = 80;
      } else if (mistakes <= 30) {
        pointsEarn = 70;
      } else if (mistakes <= 40) {
        pointsEarn = 60;
      } else if (mistakes <= 50) {
        pointsEarn = 50;
      } else if (mistakes <= 60) {
        pointsEarn = 40;
      } else if (mistakes <= 70) {
        pointsEarn = 30;
      } else if (mistakes <= 80) {
        pointsEarn = 20;
      } else {
        pointsEarn = 10;
      }
    }
    setPointsEarned(pointsEarn);
  };

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(event.target.value);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleFontChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFontFamily(event.target.value);
    // console.log(event.target.value)
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const calculateWPM = () => {
    if (!startTime || !endTime) return 0;
    const takenTime = (endTime - startTime) / 60000;
    const textLength = currentTexts.split(" ").length;
    return parseFloat((textLength / takenTime).toFixed(2));
  };

  return (
    <div className={`game-container theme-${theme}`}>
      {!isFocus && <Focus />}
      {isCompleted ? (
        <EndGame
          handleReplay={handleReplay}
          mistakes={mistakes}
          points={pointsEarned}
          calculateWPM={calculateWPM}
        />
      ) : (
        <>
          <div className="game-status">
            <div>
              <IoMdTime className="status-icon" />
              <span>Timer: {timer}</span>
            </div>
            <div>
              <LuSkull className="status-icon" />
              <span>Mistakes: {mistakes}</span>
            </div>
            <div>
              <FaRegStar className="status-icon" />
              <span>Points: {pointsEarned}</span>
            </div>
            <div>
              <TbLetterCase className="status-icon" />
              <span>CapsLock: {capsLock ? "On" : "Off"} </span>
            </div>
          </div>
          <div className={`text-container  font-${fontFamily}`}>
            {userText()}
          </div>

          <input
            type="text"
            value={input}
            ref={inputRef}
            readOnly={isCompleted}
            placeholder="Start typing here..."
            onChange={handleChange}
            className="sr-only"
          />
          <button className="replay-btn" onClick={handleReplay}>
            <AiOutlineReload />
          </button>

          <div className="theme">
            <select onChange={handleThemeChange} className="theme-btn">
              <option value="" className="theme-opt">
                Select Theme
              </option>
              <option value="BnP" className="theme-opt">
                Black and red
              </option>
              <option value="BnO" className="theme-opt">
                Black and orange
              </option>
              <option value="BnY" className="theme-opt">
                Black and yellow
              </option>
              <option value="BnG" className="theme-opt">
                Black and green
              </option>
            </select>
            <div>
              <select onChange={handleFontChange} className="font-btn">
                <option value="" className="font-opt">
                  Select Font
                </option>
                <option value="Arial" className="font-opt">
                  Arial
                </option>
                <option value="CourierNew" className="font-opt">
                  Courier New
                </option>
                <option value="monospace" className="font-opt">
                  Monospace
                </option>
                <option value="TimesNewRoman" className="font-opt">
                  Times New Roman
                </option>
                <option value="Verdana" className="font-opt">
                  Verdana
                </option>
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
