import React, { useState, useEffect, useRef } from "react";
import { Container, Text, VStack, Button, HStack, useToast, Box } from "@chakra-ui/react";

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
  const [isTikTokSoundOn, setIsTikTokSoundOn] = useState(true);
  const [isDingSoundOn, setIsDingSoundOn] = useState(true);
  const [responseTimes, setResponseTimes] = useState([]);
  const [ripTockStartTime, setRipTockStartTime] = useState(null);
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
        setRipTockStartTime(Date.now());
        toast({
          title: "Break Time Over",
          description: "You better be back, you back?",
          status: "info",
          duration: null,
          isClosable: true,
          position: "top",
          onCloseComplete: () => {
            const responseTime = (Date.now() - ripTockStartTime) / 1000;
            setResponseTimes((prev) => [...prev, responseTime]);
            setRipTock(300);
            setIsRipTockRunning(false);
            setIsTimerRunning(true);
            setRipTockCount(0);
          },
          action: (
            <Button colorScheme="teal" onClick={() => {
              const responseTime = (Date.now() - ripTockStartTime) / 1000;
              setResponseTimes((prev) => [...prev, responseTime]);
              setRipTock(300);
              setIsRipTockRunning(false);
              setIsTimerRunning(true);
              setRipTockCount(0);
              toast.closeAll();
            }}>
              Yes
            </Button>
          ),
        });
      }
    }
  }, [ripTock, ripTockCount, toast, ripTockStartTime]);

  useEffect(() => {
    let tikTokAudio;
    if (isTimerRunning && isTikTokSoundOn) {
      tikTokAudio = new Audio('/sounds/tiktok.mp3');
      tikTokAudio.loop = true;
      tikTokAudio.play();
    } else if (tikTokAudio) {
      tikTokAudio.pause();
    }
    return () => {
      if (tikTokAudio) {
        tikTokAudio.pause();
      }
    };
  }, [isTimerRunning, isTikTokSoundOn]);

  useEffect(() => {
    if (ripTock === 0 && isDingSoundOn) {
      const dingAudio = new Audio('/sounds/ding.mp3');
      dingAudio.play();
    }
  }, [ripTock, isDingSoundOn]);

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

  const progressPercentage = ((14400 - timer) / 14400) * 100;

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
        <Text fontSize="2xl">rip.tock Timer</Text>
        <Text fontSize="4xl">{formatTime(ripTock)}</Text>
        <HStack spacing={4}>
          <Button colorScheme="teal" onClick={() => setIsDingSoundOn(!isDingSoundOn)}>
            {isDingSoundOn ? "Mute Ding" : "Unmute Ding"}
          </Button>
        </HStack>
        <HStack spacing={4}>
          <Button colorScheme="teal" onClick={() => setIsTikTokSoundOn(!isTikTokSoundOn)}>
            {isTikTokSoundOn ? "Mute TikTok" : "Unmute TikTok"}
          </Button>
        </HStack>
        <Text fontSize="xl" color="green.500">
          Average Response Time: {responseTimes.length > 0 ? (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(2) : "N/A"} seconds
        </Text>
        <Box width="100%" bg="gray.200" height="10px" mt={4}>
          <Box width={`${progressPercentage}%`} bg="teal.500" height="100%" />
        </Box>
      </VStack>
    </Container>
  );
};

export default Index;