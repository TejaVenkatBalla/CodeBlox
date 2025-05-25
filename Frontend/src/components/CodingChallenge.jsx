import { useState } from "react";
import { Box, Button, Text, VStack, useToast } from "@chakra-ui/react";
import { getCodingChallenge } from "../api";

const CodingChallenge = () => {
  const [challenge, setChallenge] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const fetchChallenge = async () => {
    try {
      setIsLoading(true);
      const data = await getCodingChallenge();
      setChallenge(data);
    } catch (error) {
      toast({
        title: "Failed to fetch challenge",
        description: error.message || "Unknown error",
        status: "error",
        duration: 6000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box w={{ base: "100%", md: "50%" }} border="1px solid" borderRadius={4} borderColor="#333" bg="#1a202c" color="white">
      <VStack spacing={4} align="stretch">
        <Button colorScheme="blue" onClick={fetchChallenge} isLoading={isLoading}>
          Try a Challenge
        </Button>
        {challenge && (
          <Box>
            <Text fontWeight="bold" fontSize="lg" mb={2}>
              {challenge.title || "No Title"}
            </Text>
            <Text whiteSpace="pre-wrap" mb={2}>
              {challenge.description || "No Description"}
            </Text>
            <Text fontStyle="italic" color="gray.400">
              Difficulty: {challenge.difficulty || "Unknown"}
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default CodingChallenge;
