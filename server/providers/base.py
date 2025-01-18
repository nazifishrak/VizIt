# providers/base.py

from abc import ABC, abstractmethod

class LLMProvider(ABC):
    @abstractmethod
    def generate_script(self, prompt: str) -> str:
        """
        Generate an educational video script from a given prompt.
        """
        pass

    @abstractmethod
    def generate_manim_code(self, script: str) -> str:
        """
        Generate a valid Python script for Manim from the educational script.
        """
        pass
