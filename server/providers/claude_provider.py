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
                    "content": f"Create an educational video script with an intuitive explanation of the concepts, write the script in a way so that in can be animated with manim and your answer will be fed to an agent that generates manim script: {prompt}."
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
                    "content": f"""
Create a Manim animation video (v0.18.1) with these requirements:

TECHNICAL REQUIREMENTS:
1. Import only 'from manim import *'
2. No external resources (SVG, images, music, etc.)
3. Use only built-in Manim objects and animations
4. No additional Python packages

ANIMATION GUIDELINES:
1. Set appropriate animation durations (self.wait(1.5) between transitions)
2. Clear screen smoothly between sections make sure not to overlay texts unintentionally
3. Keep content within screen bounds
4. Use consistent scaling for objects
5. Add smooth transitions between scenes

REQUIRED FEATURES:
1. Use Scene or ThreeDScene class
2. Include descriptive titles in the appropriate space
3. Show mathematical concepts step by step
4. Use appropriate colors and layouts

ERROR PREVENTION:
1. Use get_riemann_rectangles() instead of get_area()
2. Check object positions before animations
3. Include proper cleanup between scenes

Create an educational animation for this topic:
{script}

OUTPUT ONLY THE PYTHON CODE.
"""
                }],
                temperature=0.7,
                max_tokens=4096
            )
            return response.content[0].text.strip()
        except Exception as e:
            raise Exception(f"Claude Manim code generation failed: {str(e)}")