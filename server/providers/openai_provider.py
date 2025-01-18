from openai import OpenAI

class OpenAIProvider:
    def __init__(self, api_key):
        self.client = OpenAI(api_key=api_key)

    def generate_script(self, prompt: str) -> str:
        """
        Calls OpenAI to generate an educational script explaining the topic.
        """
        response = self.client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a teacher."},
                {"role": "user", "content": f"Create an educational video script with an intuitive explainanation and your answer will be fed to an agent that generates manim script: {prompt}."}
            ],
            temperature=0.7,
            max_tokens=500
        )
        return response.choices[0].message.content.strip()

    def generate_manim_code(self, script: str) -> str:
        """
        Calls OpenAI to generate Manim code from the script.
        """
        response = self.client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a expert at manim the python package."},
                {"role": "user", "content": f"Generate Manim code that will create a short video explaining the concepts for the following script BUT VERY IMPORTANT YOU DONT OUTPUT ANYTHING ELSE OTHER THAN THE PYTHON CODE you response will be copied by a python engine and run: {script}"}
            ],
            temperature=0.7,
            max_tokens=500
        )
        return response.choices[0].message.content.strip()