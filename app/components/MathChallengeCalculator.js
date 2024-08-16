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
      <Box args={[3.2, 4, 0.2]} position={[0, 0, 0]}>
        <meshStandardMaterial color="gray" />
      </Box>
      {buttons.flat().map((btn, index) => (
        <Box
          key={index}
          args={[0.6, 0.6, 0.1]}
          position={[
            (index % 4 - 1.5) * 0.7,
            (Math.floor(index / 4) - 1.5) * 0.7,
            0.15
          ]}
          onClick={() => btn === '=' ? handleCalculate() : setDisplay(prev => prev + btn)}
        >
          <meshStandardMaterial color="white" />
          <Text
            position={[0, 0, 0.06]}
            fontSize={0.3}
            color="black"
            anchorX="center"
            anchorY="middle"
          >
            {btn}
          </Text>
        </Box>
      ))}
      <Box
        args={[2.8, 0.6, 0.1]}
        position={[0, 1.8, 0.15]}
        onClick={handleClear}
      >
        <meshStandardMaterial color="red" />
        <Text
          position={[0, 0, 0.06]}
          fontSize={0.3}
          color="white"
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

  useEffect(() => {
    if (showChallenge) {
      setChallenge(generateChallenge());
    }
  }, [showChallenge]);

  const handleCalculate = useCallback(() => {
    setShowChallenge(true);
    setUserAnswer('');
    setResult(null);
    setError('');
  }, []);

  const handleClear = useCallback(() => {
    setDisplay('');
    setShowChallenge(false);
    setUserAnswer('');
    setResult(null);
    setError('');
  }, []);

  const handleChallengeSubmit = useCallback(() => {
    if (parseFloat(userAnswer) === challenge.answer) {
      try {
        const calculationResult = eval(display);
        setResult(calculationResult);
        setShowChallenge(false);
      } catch (err) {
        setError('Invalid calculation. Please try again.');
      }
    } else {
      setError('Incorrect. Try again!');
      setUserAnswer('');
    }
  }, [challenge.answer, display, userAnswer]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Calculator
          setDisplay={setDisplay}
          handleCalculate={handleCalculate}
          handleClear={handleClear}
        />
      </Canvas>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        padding: '20px',
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: '0 0 10px 0'
      }}>
        Display: {display}
      </div>
      {showChallenge && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '10px',
          width: '300px'
        }}>
          <p>Solve this: {challenge.question}</p>
          <Input
            type="number"
            placeholder="Your answer"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
          />
          <Button onClick={handleChallengeSubmit} className="mt-2 w-full">Submit</Button>
          <Button onClick={() => setShowChallenge(false)} className="mt-2 w-full">Close</Button>
        </div>
      )}
      {result !== null && (
        <Alert className="fixed bottom-4 right-4 w-auto">
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