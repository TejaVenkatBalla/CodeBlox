import { useRef, useState } from "react";
import { Box, HStack, Input, Button, useToast } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";
import AiHelper from "./AiHelper";
import CodingChallenge from "./CodingChallenge";

const CodeEditor = ({ language, setLanguage }) => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [input, setInput] = useState("");
  const toast = useToast();

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  const saveCodeLocally = () => {
    const code = editorRef.current.getValue();
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const filename = `code.${language === "javascript" ? "js" : language}`;
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      const elem = window.document.createElement("a");
      elem.href = window.URL.createObjectURL(blob);
      elem.download = filename;
      document.body.appendChild(elem);
      elem.click();
      document.body.removeChild(elem);
    }
  };

  const copyCodeToClipboard = () => {
    const code = editorRef.current.getValue();
    if (!code) {
      toast({
        title: "No code to copy",
        status: "warning",
        duration: 3000,
      });
      return;
    }
    navigator.clipboard.writeText(code).then(() => {
      toast({
        title: "Code copied to clipboard",
        status: "success",
        duration: 3000,
      });
    }).catch(() => {
      toast({
        title: "Failed to copy code",
        status: "error",
        duration: 3000,
      });
    });
  };

  return (
    <Box>
      <HStack spacing={4} align="center" flexDirection={{ base: "column", md: "row" }}>
        <Box w={{ base: "100%", md: "50%" }}>
          <HStack mb={4} spacing={4}>

            <LanguageSelector language={language} onSelect={onSelect} />
            
            <Button  onClick={saveCodeLocally}>
              Save Code
            </Button>
            <Button   onClick={copyCodeToClipboard}>
              Copy Code
            </Button>
            <Button  variant="outline"
            colorScheme="gray" onClick={() => {
              setValue("");
              if (editorRef.current) {
                editorRef.current.setValue("");
              }
            }}>
              Clear Editor
            </Button>
          </HStack>
          <Editor
            options={{
              minimap: {
                enabled: false,
              },
            }}
            height="60vh"
            theme="vs-dark"
            language={language}
            defaultValue={CODE_SNIPPETS[language]}
            onMount={onMount}
            value={value}
            onChange={(value) => setValue(value)}
          />
          <Input
            placeholder="Enter inputs here..."
            mt={4}
            mb={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </Box>
        

        <Output editorRef={editorRef} language={language} input={input} />
        
      </HStack>
    </Box>
  );
};
export default CodeEditor;
