import React, { useState, useEffect, useRef } from "react";
import { Container, Text, VStack, Button, HStack, useToast } from "@chakra-ui/react";

const Index = () => {
  const [timer, setTimer] = useState(14400); // 4 hours in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [stopwatch, setStopwatch] = useState(() => {
    const savedTime = localStorage.getItem("stopwatch");
    return savedTime ? parseInt(savedTime, 10) : 0;
  });
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
  const [goalTime, setGoalTime] = useState(null);
  const [ripTock, setRipTock] = useState(300); // 5 minutes in seconds
  const [isRipTockRunning, setIsRipTockRunning] = useState(false);
  const [ripTockCount, setRipTockCount] = useState(0);
  const timerRef = useRef(null);
  const stopwatchRef = useRef(null);
  const ripTockRef = useRef(null);
  const toast = useToast();

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
        localStorage.setItem("stopwatch", stopwatch + 1);
      }, 1000);
    } else {
      clearInterval(stopwatchRef.current);
    }

    return () => clearInterval(stopwatchRef.current);
  }, [isStopwatchRunning]);

  useEffect(() => {
    if (isRipTockRunning) {
      ripTockRef.current = setInterval(() => {
        setRipTock((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else {
      clearInterval(ripTockRef.current);
    }

    return () => clearInterval(ripTockRef.current);
  }, [isRipTockRunning]);

  useEffect(() => {
    if (timer === 0) {
      setIsTimerRunning(false);
      setIsStopwatchRunning(false);
      setGoalTime(stopwatch);
    }
  }, [timer]);

  useEffect(() => {
    if (ripTock === 0) {
      if (ripTockCount === 0) {
        setIsTimerRunning(false);
        setRipTockCount(1);
        setRipTock(300);
        setIsRipTockRunning(true);
      } else {
        toast({
          title: "Break Time Over",
          description: "You better be back, you back?",
          status: "info",
          duration: null,
          isClosable: true,
          position: "top",
          onCloseComplete: () => {
            setRipTock(300);
            setIsRipTockRunning(false);
            setIsTimerRunning(true);
            setRipTockCount(0);
          },
        });
      }
    }
  }, [ripTock, ripTockCount, toast]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleTimerStartPause = () => {
    if (!isTimerRunning) {
      if (stopwatch === 0) {
        setIsStopwatchRunning(true);
      }
      setIsTimerRunning(true);
    } else {
      toast({
        title: "Nope!",
        description: "Wait at least 5 minutes before a break.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setIsRipTockRunning(true);
    }
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="2xl">4-Hour Timer</Text>
        <Text fontSize="4xl">{formatTime(timer)}</Text>
        <HStack spacing={4}>
          <Button colorScheme="teal" onClick={handleTimerStartPause}>
            {isTimerRunning ? "Pause" : "Start"}
          </Button>
          <Button colorScheme="red" onClick={() => setTimer(14400)}>
            Reset
          </Button>
        </HStack>
        <Text fontSize="2xl">Stopwatch</Text>
        <Text fontSize="4xl">{formatTime(stopwatch)}</Text>
        <HStack spacing={4}>
          <Button colorScheme="teal" isDisabled>
            {isStopwatchRunning ? "Running" : "Stopped"}
          </Button>
          <Button colorScheme="red" isDisabled>
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