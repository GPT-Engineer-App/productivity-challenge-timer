import React, { useState, useEffect, useRef } from "react";
import { Container, Text, VStack, Button, HStack } from "@chakra-ui/react";

const Index = () => {
  const [timer, setTimer] = useState(14400); // 4 hours in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [stopwatch, setStopwatch] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
  const [goalTime, setGoalTime] = useState(null);
  const timerRef = useRef(null);
  const stopwatchRef = useRef(null);

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isTimerRunning]);

  useEffect(() => {
    if (isStopwatchRunning) {
      stopwatchRef.current = setInterval(() => {
        setStopwatch((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(stopwatchRef.current);
    }

    return () => clearInterval(stopwatchRef.current);
  }, [isStopwatchRunning]);

  useEffect(() => {
    if (timer === 0) {
      setIsTimerRunning(false);
      setIsStopwatchRunning(false);
      setGoalTime(stopwatch);
    }
  }, [timer]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="2xl">4-Hour Timer</Text>
        <Text fontSize="4xl">{formatTime(timer)}</Text>
        <HStack spacing={4}>
          <Button colorScheme="teal" onClick={() => setIsTimerRunning(!isTimerRunning)}>
            {isTimerRunning ? "Pause" : "Start"}
          </Button>
          <Button colorScheme="red" onClick={() => setTimer(14400)}>
            Reset
          </Button>
        </HStack>
        <Text fontSize="2xl">Stopwatch</Text>
        <Text fontSize="4xl">{formatTime(stopwatch)}</Text>
        <HStack spacing={4}>
          <Button colorScheme="teal" onClick={() => setIsStopwatchRunning(!isStopwatchRunning)}>
            {isStopwatchRunning ? "Pause" : "Start"}
          </Button>
          <Button colorScheme="red" onClick={() => setStopwatch(0)}>
            Reset
          </Button>
        </HStack>
        {goalTime !== null && (
          <Text fontSize="xl" color="green.500">
            Your goal for tomorrow: Beat {formatTime(goalTime)}
          </Text>
        )}
      </VStack>
    </Container>
  );
};

export default Index;