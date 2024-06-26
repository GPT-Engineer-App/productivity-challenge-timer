import React, { useState, useEffect, useRef } from "react";
import { Container, Text, VStack, Button, HStack, useToast, Box, Slider, SliderTrack, SliderFilledTrack, SliderThumb } from "@chakra-ui/react";

const Index = () => {
  const [sliderValue, setSliderValue] = useState(14400);
  const [timer, setTimer] = useState(sliderValue);
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
        setStopwatch((prev) => {
          const newTime = prev + 1;
          localStorage.setItem("stopwatch", newTime);
          return newTime;
        });
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
          duration: 10000, // Set a duration to automatically close the toast after 10 seconds
          isClosable: true,
          position: "top-right", // Change position to top-right to avoid covering the timer
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

  useEffect(() => {
    setTimer(sliderValue);
  }, [sliderValue]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleTimerStartPause = () => {
    if (!isTimerRunning) {
      if (!isStopwatchRunning) {
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

  const progressPercentage = ((sliderValue - timer) / sliderValue) * 100;
  const ripTockProgressPercentage = ((300 - ripTock) / 300) * 100;

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Box width="100%" bg="gray.200" height="20px" mt={4}>
          <Box width={`${progressPercentage}%`} bg="teal.500" height="100%" />
        </Box>
        <Slider aria-label="slider-ex-1" defaultValue={14400} min={0} max={14400} step={60} onChange={(val) => setSliderValue(val)}>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
        <Text fontSize="2xl">4-Hour Timer</Text>
        <Text fontSize="4xl">{formatTime(timer)}</Text>
        <HStack spacing={4}>
          <Button colorScheme="teal" onClick={handleTimerStartPause}>
            {isTimerRunning ? "Pause" : "Start"}
          </Button>
          <Button colorScheme="red" onClick={() => setTimer(sliderValue)}>
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
        <Button colorScheme="red" onClick={() => setStopwatch(0)}>
          TIME WAITS FOR NO MAN
        </Button>
        {goalTime !== null && (
          <Text fontSize="xl" color="green.500">
            Your goal for tomorrow: Beat {formatTime(goalTime)}
          </Text>
        )}
        <Text fontSize="2xl">rip.tock Timer</Text>
        <Text fontSize="4xl">{formatTime(ripTock)}</Text>
        <Box width="100%" bg="yellow.200" height="30px" mt={4}>
          <Box width={`${ripTockProgressPercentage}%`} bg="yellow.500" height="100%" />
        </Box>
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
      </VStack>
    </Container>
  );
};

export default Index;