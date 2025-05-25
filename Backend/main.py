from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
import os
from dotenv import load_dotenv
import json
import traceback

load_dotenv()

app = FastAPI()

#origins = ["http://localhost:5173"]  # Vite dev

app.add_middleware(
    CORSMiddleware,
    # allow_origins=origins,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Python code execution API!"}

class CodeRequest(BaseModel):
    code: str
    stdin: str = ""

@app.post("/run")
def run_code(request: CodeRequest):
    try:
        process = subprocess.Popen(
            ['python3', '-c', request.code], # need to use python3 in server
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        stdout, stderr = process.communicate(input=request.stdin, timeout=5)
        return {"output": stdout, "error": stderr}
    except subprocess.TimeoutExpired:
        return {"output": "", "error": "⏳ Execution timed out"}


class ErrorRequest(BaseModel):
    error: str
    code: str
    language: str = "python"

@app.post("/explain-error")
def explain_error(req: ErrorRequest):
    try:
        model = "gemini-1.5-flash"
        llm = ChatGoogleGenerativeAI(model=model)
        prompt = f"""
        A beginner programmer encountered this error:

        Code:
        {req.code}

        Program language: {req.language}

        Error:
        {req.error}

        Please explain this error in simple terms and suggest a fix with an example.
        """
        response = llm.invoke([HumanMessage(content=prompt)])
        return {"explanation": response.content}
    except Exception as e:
        return {"explanation": "Could not generate an explanation right now.", "error": str(e)}

class QuestionRequest(BaseModel):
    question: str
    language: str

@app.post("/ai-helper")
def ai_helper(req: QuestionRequest):
    try:
        model = "gemini-1.5-flash"
        llm = ChatGoogleGenerativeAI(model=model)
        prompt = f"""
        You are an AI coding assistant. Answer the following coding-related question clearly and concisely.
        The user is coding in {req.language}.

        Question:
        {req.question}
        """
        response = llm.invoke([HumanMessage(content=prompt)])
        return {"answer": response.content}
    except Exception as e:
        return {"answer": "Could not generate an answer right now.", "error": str(e)}

@app.get("/coding-challenge")
def coding_challenge():
    try:
        model = "gemini-1.5-flash"
        llm = ChatGoogleGenerativeAI(model=model)
        prompt = """
        You are an AI assistant that generates beginner-level coding challenges for young coders learning to code.
        Please provide a single coding challenge with a title, description, and difficulty level in JSON format.
        """
        try:
            response = llm.invoke([HumanMessage(content=prompt)])
            #print("Response content:", response.content)
            # Clean response content to remove markdown code block formatting if present
            cleaned_content = response.content.strip()
            if cleaned_content.startswith("```"):
                # Remove the first line (```json or ```) and the last line (```)
                lines = cleaned_content.splitlines()
                if len(lines) >= 3:
                    cleaned_content = "\n".join(lines[1:-1])
            challenge = json.loads(cleaned_content)
            
        except Exception as inner_e:
            print("Error during LLM invocation or JSON parsing:", str(inner_e))
            print(traceback.format_exc())
            challenge = {
                "title": "Hello World",
                "description": "Write a program that prints 'Hello, World!'",
                "difficulty": "Beginner"
            }
        return challenge
    except Exception as e:
        print("Outer exception in /coding-challenge:", str(e))
        print(traceback.format_exc())
        return {"error": "Could not generate a challenge right now.", "details": str(e)}
