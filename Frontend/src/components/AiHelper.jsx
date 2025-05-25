import { useState } from "react";
import { Box, Button, Input, Text, VStack, useToast } from "@chakra-ui/react";
import { aiHelperAPI } from "../api";

const AiHelper = ({ language }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const askQuestion = async () => {
    if (!question.trim()) {
      toast({
        title: "Please enter a question",
        status: "warning",
        duration: 3000,
      });
      return;
    }
    try {
      setIsLoading(true);
      const response = await aiHelperAPI(question, language);
      setAnswer(response.answer || "No answer available");
    } catch (error) {
      toast({
        title: "Failed to get answer",
        description: error.message || "Unknown error",
        status: "error",
        duration: 6000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box w={{ base: "100%", md: "50%" }} p={4} border="1px solid" borderRadius={4} borderColor="#333"  color="white">
      <VStack spacing={4} align="stretch">
        <Input
          placeholder="Ask a coding question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}

        />
        <Button colorScheme="blue" onClick={askQuestion} isLoading={isLoading}>
          Ask AI Helper
        </Button>
        {answer && (
          <Box whiteSpace="pre-wrap" bg="#2d3748" p={3} borderRadius={4} minHeight="100px">
            <Text>{answer}</Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default AiHelper;
