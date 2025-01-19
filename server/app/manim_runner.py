import subprocess
import os
import time
import re
from typing import Optional

class ManimRenderError(Exception):
    pass

TEMP_DIR = os.path.join(os.path.dirname(__file__), "..", "temp")
VIDEOS_DIR = os.path.join(os.path.dirname(__file__), "..", "videos")

def _extract_scene_name(code: str) -> Optional[str]:
    match = re.search(r"class\s+(\w+)\(Scene\):", code)
    return match.group(1) if match else None

def _cleanup_temp_files(python_file: str) -> None:
    if os.path.exists(python_file):
        os.remove(python_file)

def run_manim_code(manim_code: str, cleanup: bool = False) -> str:
    try:
        # Create directories
        os.makedirs(TEMP_DIR, exist_ok=True)
        os.makedirs(VIDEOS_DIR, exist_ok=True)

        # Create temp file
        timestamp = int(time.time())
        python_file = os.path.join(TEMP_DIR, f"animation_{timestamp}.py")
        with open(python_file, "w", encoding="utf-8") as f:
            f.write(manim_code)

        # Extract scene name
        scene_name = _extract_scene_name(manim_code)
        if not scene_name:
            raise ManimRenderError("Could not find Scene class in provided code")

        # Build command to match terminal command
        cmd = [
            "manim",
            "-pql",  # preview quality, low quality, same as terminal
            "--media_dir", VIDEOS_DIR,
            python_file,
            scene_name
        ]

        print(f"Running Manim command: {' '.join(cmd)}")

        # Add LaTeX path to environment
        env = os.environ.copy()
        env["PATH"] = "/Library/TeX/texbin:" + env.get("PATH", "")

        # Run Manim
        process = subprocess.run(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=True,
            env=env
        )
# OLD WORKING ABSOLUTE
        # # Find video file (preview quality creates different path)
        # video_file = os.path.join(VIDEOS_DIR, "videos",f"animation_{timestamp}", "480p15", f"{scene_name}.mp4")
        # # if not os.path.exists(video_file):
        # #     raise ManimRenderError("Video file not found after rendering")

        # return video_file
# ***************************************

        abs_video_path = os.path.join(VIDEOS_DIR, "videos", f"animation_{timestamp}", "480p15", f"{scene_name}.mp4")
        
        # Convert to URL path
        relative_path = f"/videos/animation_{timestamp}/480p15/{scene_name}.mp4"
        
        if not os.path.exists(abs_video_path):
            raise ManimRenderError("Video file not found after rendering")

        return relative_path


    except subprocess.CalledProcessError as e:
        raise ManimRenderError(f"Manim render failed:\n{e.stderr}")
    
    finally:
        if cleanup:
            # _cleanup_temp_files(python_file)
            pass


