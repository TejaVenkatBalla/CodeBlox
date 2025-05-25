import { Box, HStack, Heading } from "@chakra-ui/react";
import { useState } from "react";
import CodeEditor from "./components/CodeEditor";
import AiHelper from "./components/AiHelper";
import CodingChallenge from "./components/CodingChallenge";

function App() {
  const [language, setLanguage] = useState("javascript");

  return (
    <Box minH="100vh" bg="#0f0a19" color="gray.500" px={6} py={8}>
      <Heading mb={6} color="white" fontSize="3xl" textAlign="center">
        CodeBlox: AI-Powered Coding Playground
      </Heading>
      <CodeEditor language={language} setLanguage={setLanguage} />
      <HStack 
        spacing={4} 
        align="start" 
        flexDirection={{ base: "column", md: "row" }}
      >      
        <AiHelper language={language} />
        <CodingChallenge  />
      </HStack>

    </Box>
    
  );
}

export default App;
