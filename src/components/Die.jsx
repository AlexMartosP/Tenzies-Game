import React from "react";

function Die({ value, isHeld, holdDice, status }) {
  return (
    <button
      className={`die ${isHeld && "holding"}`}
      onClick={holdDice}
      disabled={status === "pending" ? false : true}
    >
      {value}
    </button>
  );
}

export default Die;
