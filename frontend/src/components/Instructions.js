import React from "react";
import "../../src/index.css";

function Instructions({ data }) {
  const steps = data?.legs?.[0]?.steps ?? [];

  const tripInstructions = steps.map((step) => (
    <li>{step.maneuver.instruction}</li>
  ));

  return (
    <div id="instructions">
      <p>
        <strong>
          Trip duration: {Math.floor(data?.duration / 60)} min 🚴{" "}
        </strong>
      </p>
      <ol>{tripInstructions}</ol>
    </div>
  );
}

export default Instructions;
