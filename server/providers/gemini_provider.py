# providers/gemini_provider.py

import google.generativeai as palm
from .base import LLMProvider

class GeminiProvider(LLMProvider):
    def __init__(self, api_key: str):
        palm.configure(api_key=api_key)
        # This is an example. Please confirm the correct model name for Gemini:
        self.model = "models/chat-bison-001"  # or "gemini-pro" if available

    def generate_script(self, prompt: str) -> str:
        """
        Calls Gemini (via google.generativeai) to generate an educational script explaining the topic.
        """
        # Some models require "palm.chat", others "palm.generate_text". 
        # We'll illustrate with chat:
        messages = f"Create an educational video script in the style of 3Blue1Brown explaining: {prompt}\nFocus on visual understanding."
        response = palm.chat(
            model=self.model,
            messages=messages,
            temperature=0.7
        )
        # 'response.last' typically gives the last message from the chat
        # Or you might need to parse differently depending on the library version
        return response.last if response else ""

    def generate_manim_code(self, script: str) -> str:
        """
        Calls Gemini to generate a Manim Python script from the educational script.
        """
        rules = (
            "You are a code generator that ONLY outputs Python code for Manim animations.\n"
            "Rules:\n"
            "1. Output ONLY valid Python code\n"
            "2. No extra markdown in the outputs\n"
            "3. NO comments about changes or improvements\n"
            "4. NO markdown formatting\n"
            "5. NO introduction or conclusion text\n"
            "6. Start with \"from manim import *\"\n"
            "7. Include exactly one Scene class\n\n"
        )
        # For single-turn text generation, consider palm.generate_text
        # but this example uses palm.chat to keep consistency.
        user_prompt = f"{rules}Create Manim animation for:\n{script}"
        response = palm.chat(
            model=self.model,
            messages=user_prompt,
            temperature=0.2
        )
        return response.last if response else ""


