import React from "react";

function BestScore({ score }) {
  return (
    <div className="best-score">
      <div>
        {score.time.minutes}m, {score.time.seconds}s
      </div>
      <div>BEST SCORE</div>
      <div>{score.numberOfRolls} rolls</div>
    </div>
  );
}

export default BestScore;
