import { useState } from "react";

export default function Calculator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const calculate = async () => {
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
      <button onClick={calculate} className="button">
        Calculate
      </button>
      <div className="result">{result}</div>
    </div>
  );
}
