import "../index.css";

type EndGameProps = {
  handleReplay: () => void;
  calculateWPM: () => number | 0;
  mistakes: number;
  points: number;
};

const EndGame = ({ handleReplay, mistakes, points, calculateWPM }: EndGameProps) => {
  return (
    <div className="game-end-wrapper">
      <p>
        WPM: <span>{calculateWPM()}</span>
      </p>
      <p>
        Total points: <span>{points}</span>
      </p>
      <p>
        Mistakes: <span>{mistakes}</span>
      </p>
      <button onClick={handleReplay}>Replay</button>
    </div>
  );
};

export default EndGame;
