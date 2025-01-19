# app/main.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from providers.claude_provider import ClaudeProvider
from .config import Settings
from fastapi.staticfiles import StaticFiles
import os

from .config import settings
from .utils import remove_markdown, combine_video_and_audio
from .manim_runner import run_manim_code
from providers.openai_provider import OpenAIProvider
from providers.gemini_provider import GeminiProvider
from fastapi.middleware.cors import CORSMiddleware


load_dotenv()
settings = Settings()


app = FastAPI()
# Get absolute path to videos directory
VIDEOS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "videos"))

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with specific domains if needed
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all HTTP headers
)

# Mount videos directory
app.mount("/videos", StaticFiles(directory=VIDEOS_DIR), name="videos")


class GenerateRequest(BaseModel):
    question: str
    provider: str = (
        None  # 'openai' or 'gemini'; optional if you want to override default
    )


@app.post("/generate")
def generate_video(req: GenerateRequest):
    """
    Endpoint that takes the 'question' and optionally 'provider'
    Then:
      1) Generates an educational script
      2) Generates Manim code
      3) Cleans the code
      4) Renders video
      5) Returns the video path or URL
    """
    try:
        provider = req.provider or settings.LLM_PROVIDER
        cl_api = settings.CLAUDE_API_KEY
        claude_prov = ClaudeProvider(cl_api)
        print(f"Provider: {provider}")

        if provider == "openai":
            api_key = settings.OPENAI_API_KEY
            print(f"OpenAI API Key: {api_key}")
            if not api_key:
                raise HTTPException(status_code=400, detail="OpenAI API key not set.")
            llm_provider = OpenAIProvider(api_key)
        elif provider == "gemini":
            api_key = settings.GEMINI_API_KEY
            print(f"Gemini API Key: {api_key}")
            if not api_key:
                raise HTTPException(status_code=400, detail="Gemini API key not set.")
            llm_provider = GeminiProvider(api_key)
        else:
            raise HTTPException(
                status_code=400, detail=f"Unsupported provider: {provider}"
            )

        # 1) Generate the script
        script = llm_provider.generate_script(req.question)

        # 2) Generate Manim code from the script
        # manim_code_raw = llm_provider.generate_manim_code(script)
        manim_code_raw = claude_prov.generate_manim_code(script)

        # 3) Clean the code to remove markdown
        manim_code_clean = remove_markdown(manim_code_raw)

        # 4) Run Manim
        video_file_name, video_path = run_manim_code(manim_code_clean)

        # 5) Generate voice over script
        voice_over_script = llm_provider.generate_voice_over_script(manim_code_clean)

        # 5) Generate voiceover
        voiceover_path = llm_provider.generate_voice_over(voice_over_script)

        # 6) Combine video and voiceover

        if not os.path.exists("videos/final"):
            os.makedirs("videos/final")

        combine_video_and_audio(
            f"videos{video_path}", voiceover_path, f"videos/final/{video_file_name}.mp4"
        )

        # if not video_path or not os.path.exists(video_path):
        #     raise HTTPException(status_code=500, detail="Video not found after rendering.")

        # Return a local path or you might want to create a publicly accessible URL
        return {
            "question": req.question,
            "script": script,
            "manim_code": manim_code_clean,
            "video_path": f"final/{video_file_name}.mp4",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
