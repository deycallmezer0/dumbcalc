"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Box } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

const generateChallenge = () => {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  const operators = ['+', '-', '*'];
  const operator = operators[Math.floor(Math.random() * operators.length)];
  const question = `${a} ${operator} ${b}`;
  const answer = eval(question);
  return { question, answer };
};

const Calculator = ({ setDisplay, handleCalculate, handleClear }) => {
  const mesh = useRef();

  useFrame(() => {
    mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
  });

  const buttons = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+']
  ];

  return (
    <motion.group
      ref={mesh}
      animate={{
        x: [0, 2, -2, 0],
        y: [0, 1, -1, 0],
        z: [0, 1, -1, 0]
      }}
      transition={{
        duration: 20,
        ease: "linear",
        repeat: Infinity
      }}
    >
      <Box args={[3.5, 4.5, 0.3]} position={[0, 0, 0]}>
        <meshPhongMaterial color="#2c3e50" shininess={100} />
      </Box>
      {buttons.flat().map((btn, index) => (
        <Box
          key={index}
          args={[0.7, 0.7, 0.1]}
          position={[
            (index % 4 - 1.5) * 0.8,
            (Math.floor(index / 4) - 1.5) * 0.8,
            0.2
          ]}
          onClick={() => btn === '=' ? handleCalculate() : setDisplay(prev => prev + btn)}
        >
          <meshPhongMaterial color="#ecf0f1" shininess={100} />
          <Text
            position={[0, 0, 0.06]}
            fontSize={0.35}
            color="#2c3e50"
            anchorX="center"
            anchorY="middle"
          >
            {btn}
          </Text>
        </Box>
      ))}
      <Box
        args={[3.1, 0.7, 0.1]}
        position={[0, 2, 0.2]}
        onClick={handleClear}
      >
        <meshPhongMaterial color="#e74c3c" shininess={100} />
        <Text
          position={[0, 0, 0.06]}
          fontSize={0.35}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          Clear
        </Text>
      </Box>
    </motion.group>
  );
};
const MathChallengeCalculator = () => {
  const [display, setDisplay] = useState('');
  const [challenge, setChallenge] = useState(generateChallenge());
  const [userAnswer, setUserAnswer] = useState('');
  const [showChallenge, setShowChallenge] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [resultTimeout, setResultTimeout] = useState(null);
  const [errorTimeout, setErrorTimeout] = useState(null);

  useEffect(() => {
    if (showChallenge) {
      setChallenge(generateChallenge());
    }
  }, [showChallenge]);

  const clearTimeouts = () => {
    if (resultTimeout) clearTimeout(resultTimeout);
    if (errorTimeout) clearTimeout(errorTimeout);
  };

  const handleCalculate = useCallback(() => {
    clearTimeouts();
    setShowChallenge(true);
    setUserAnswer('');
    setResult(null);
    setError('');
  }, []);

  const handleClear = useCallback(() => {
    clearTimeouts();
    setDisplay('');
    setShowChallenge(false);
    setUserAnswer('');
    setResult(null);
    setError('');
  }, []);

  const handleChallengeSubmit = useCallback(() => {
    clearTimeouts();
    if (parseFloat(userAnswer) === challenge.answer) {
      try {
        const calculationResult = eval(display);
        setResult(calculationResult);
        setShowChallenge(false);
        const timeout = setTimeout(() => setResult(null), 5000);
        setResultTimeout(timeout);
      } catch (err) {
        setError('Invalid calculation. Please try again.');
        const timeout = setTimeout(() => setError(''), 5000);
        setErrorTimeout(timeout);
      }
    } else {
      setError('Incorrect. Try again!');
      setUserAnswer('');
      const timeout = setTimeout(() => setError(''), 5000);
      setErrorTimeout(timeout);
    }
  }, [challenge.answer, display, userAnswer]);

  useEffect(() => {
    return () => clearTimeouts();
  }, []);

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center font-sans">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white mb-2">Dumb Calculator</h1>
        <p className="text-xl text-white mb-1">Created for the Hackathon with Lewis</p>
        <p className="text-lg text-white">Created by: Chris Holmes</p>
      </div>
      
      <div className="w-[500px] h-[500px] relative">
        <Canvas camera={{ position: [0, 0, 6] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Calculator
            setDisplay={setDisplay}
            handleCalculate={handleCalculate}
            handleClear={handleClear}
          />
        </Canvas>
        <div className="absolute top-4 left-4 bg-white bg-opacity-80 p-2 rounded">
          Display: {display}
        </div>
      </div>

      {showChallenge && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-80">
          <p className="text-lg font-semibold mb-4">Solve this: {challenge.question}</p>
          <Input
            type="number"
            placeholder="Your answer"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="mb-4"
          />
          <Button onClick={handleChallengeSubmit} className="w-full mb-2">Submit</Button>
          <Button onClick={() => setShowChallenge(false)} variant="outline" className="w-full">Close</Button>
        </div>
      )}
      
      {result !== null && (
        <Alert className="fixed bottom-4 right-4 w-auto bg-green-100 border-green-400 text-green-700">
          <AlertDescription>
            Your calculation result is: {result}
          </AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert variant="destructive" className="fixed bottom-4 right-4 w-auto">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default MathChallengeCalculator;