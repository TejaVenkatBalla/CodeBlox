import { useState } from "react";
import { Box, Button, Text, useToast, HStack } from "@chakra-ui/react";
import { executeCode, explainErrorAPI } from "../api";

const Output = ({ editorRef, language, input }) => {
  const toast = useToast();
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isExplanation, setIsExplanation] = useState(false);

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
    try {
      setIsLoading(true);
      const { run: result } = await executeCode(language, sourceCode, input || "");
      setOutput(result.output.split("\n"));
      if (result.stderr) {
        setIsError(true);
        setErrorMessage(result.stderr);
        setIsExplanation(false);
      } else {
        setIsError(false);
        setErrorMessage("");
        setIsExplanation(false);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "An error occurred.",
        description: error.message || "Unable to run code",
        status: "error",
        duration: 6000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const explainError = async () => {
    const code = editorRef.current.getValue();
    const error = errorMessage;
    if (!code || !error) {
      toast({
        title: "No code or error to explain",
        status: "warning",
        duration: 4000,
      });
      return;
    }
    try {
      setIsLoading(true);
      const response = await explainErrorAPI(code, error, language);
      setOutput(response.explanation ? [response.explanation] : ["No explanation available"]);
      setIsExplanation(true);
      toast({
        title: "Error explanation received",
        status: "success",
        duration: 4000,
      });
    } catch (err) {
      toast({
        title: "Failed to get error explanation",
        description: err.message || "Unknown error",
        status: "error",
        duration: 6000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box w={{ base: "100%", md: "50%" }}>
      <Text mb={2} fontSize="lg">
        Output
      </Text>
      <HStack mb={4} spacing={4}>
        <Button
          variant="outline"
          colorScheme="green"
          isLoading={isLoading}
          onClick={runCode}
        >
          Run Code
        </Button>
        {isError && (
          <Button
            variant="outline"
            colorScheme="red"
            onClick={explainError}
          >
            Explain error
          </Button>
        )}
        <Button
          variant="outline"
          colorScheme="gray"
          onClick={() => {
            setOutput(null);
            setIsExplanation(false);
            setIsError(false);
          }}
        >
          Clear Output
        </Button>
      </HStack>
      <Box
        height="75vh"
        p={2}
        color={isExplanation ? "blue.400" : isError ? "red.400" : ""}
        border="1px solid"
        borderRadius={4}
        borderColor={isExplanation ? "blue.500" : isError ? "red.500" : "#333"}
        overflowY="auto"
        wordBreak="break-word"
        whiteSpace="pre-wrap"
      >
        {output
          ? output.map((line, i) => <Text key={i}>{line}</Text>)
          : 'Click "Run Code" to see the output here'}
      </Box>
    </Box>
  );
};

export default Output;
