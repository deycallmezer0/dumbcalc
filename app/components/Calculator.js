"use client";

import { useState } from "react";

export default function Calculator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [mathProblem, setMathProblem] = useState(generateMathProblem());
  const [userAnswer, setUserAnswer] = useState("");

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleUserAnswerChange = (e) => {
    setUserAnswer(e.target.value);
  };

  const calculate = async () => {
    if (parseInt(userAnswer) !== mathProblem.answer) {
      setResult("Incorrect answer to the math problem.");
      return;
    }
    try {
      const response = await fetch("/api/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      });
      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      setResult("Error calculating");
    }
  };

  return (
    <div className="calculator">
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Enter calculation"
        className="input"
      />
      <div className="math-problem">
        Solve this to proceed: {mathProblem.num1} + {mathProblem.num2} = ?
      </div>
      <input
        type="text"
        value={userAnswer}
        onChange={handleUserAnswerChange}
        placeholder="Your answer"
        className="input"
      />
      <button onClick={calculate} className="button">
        Calculate
      </button>
      <div className="result">{result}</div>
    </div>
  );
}
