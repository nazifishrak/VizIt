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

    @abstractmethod
    def generate_voice_over_script(self, code: str) -> str:
        """
        Generate a script for voice over given the code of the video.
        """
        pass

    @abstractmethod
    def generate_voice_over(self, script: str) -> str:
        """
        Generates a mp3 file of voice over given the script.
        """
        pass
