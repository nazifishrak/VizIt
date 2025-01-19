from anthropic import Anthropic
from typing import Optional

class ClaudeProvider:
    def __init__(self, api_key: str):
        self.client = Anthropic(api_key=api_key)
        self.model = "claude-3-5-sonnet-20240620"

    def generate_script(self, prompt: str) -> str:
        """
        Calls Claude 3.5 Sonnet to generate an educational script.
        """
        try:
            response = self.client.messages.create(
                model=self.model,
                messages=[{
                    "role": "user",
                    "content": f"Create an educational video script with an intuitive explanation and your answer will be fed to an agent that generates manim script: {prompt}."
                }],
                temperature=0.7,
                max_tokens=4096  # Sonnet has lower token limit
            )
            return response.content[0].text.strip()
        except Exception as e:
            raise Exception(f"Claude script generation failed: {str(e)}")

    def generate_manim_code(self, script: str) -> str:
        """
        Calls Claude 3.5 Sonnet to generate Manim code.
        """
        try:
            response = self.client.messages.create(
                model=self.model,
                messages=[{
                    "role": "user",
                    "content": f"Generate Manim code that will create a short video explaining the concepts for the following script BUT VERY IMPORTANT YOU DONT OUTPUT ANYTHING ELSE OTHER THAN THE PYTHON CODE you response will be copied by a python engine and run ALSO DONY USE anything like SVGMobject or any sort of files OR ANY EXTERNAL RESOURCES like musics or image files SHOULD *NOT* BE USED. Also note, make sure everything fits within the screen and doesnt go out and secondly also dont clutter the screen while transitioning flush the old stuff in a reasonable way so that it looks perfectly made, just the video no sound nothing even if the screen says about music or anything dont add music HERE IS THE script: {script}"
                }],
                temperature=0.7,
                max_tokens=4096
            )
            return response.content[0].text.strip()
        except Exception as e:
            raise Exception(f"Claude Manim code generation failed: {str(e)}")