# app/manim_runner.py

import subprocess
import os
import time

TEMP_DIR = "temp"    # Adjust to your liking
VIDEOS_DIR = "videos"

os.makedirs(TEMP_DIR, exist_ok=True)
os.makedirs(VIDEOS_DIR, exist_ok=True)

def run_manim_code(manim_code: str) -> str:
    """
    Write the Manim code to a temporary .py file,
    run Manim, and return the path to the rendered video.
    """
    timestamp = int(time.time())
    python_file_path = os.path.join(TEMP_DIR, f"animation_{timestamp}.py")
    with open(python_file_path, "w", encoding="utf-8") as f:
        f.write(manim_code)

    # We'll generate an output with -o (scene name must be consistent with your code).
    # Adjust the scene name if you have a different Scene class name, e.g., MyScene.
    scene_name = _extract_scene_name(manim_code) or "Scene"

    # Render video in the local "videos" folder
    # The -o sets the output file name or directory. See Manim docs for details.
    cmd = [
        "manim",
        python_file_path,
        scene_name,
        "-pql",
        "--renderer=cairo",
        "--media_dir", VIDEOS_DIR,  # place media in the "videos" directory
    ]

    print("Running command:", " ".join(cmd))

    process = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if process.returncode != 0:
        raise RuntimeError(
            f"Manim render failed: {process.stderr}"
        )

    # Look for .mp4 in the generated directory. Usually Manim places it in videos/<file_name>/1080p60/
    # We'll attempt to parse from stdout or just guess from the standard Manim naming convention.
    # Typical Manim path: videos/animation_YYYY-##-##/1080p60/MyScene.mp4
    # You might do a deeper search in the folder for .mp4 if needed.
    video_file_path = None
    for line in process.stdout.splitlines():
        if line.endswith(".mp4"):
            # e.g. "File ready at: <some path>MyScene.mp4"
            if "File ready at:" in line:
                video_file_path = line.split("File ready at:")[-1].strip()
                break

    if not video_file_path:
        # fallback: guess from known manim structure
        video_file_path = os.path.join(VIDEOS_DIR, f"1080p60/{scene_name}.mp4")

    return video_file_path

def _extract_scene_name(manim_code: str) -> str:
    """
    Very naive approach to find `class MyScene(Scene):`
    and extract "MyScene".
    """
    import re
    match = re.search(r"class\s+(\w+)\(Scene\):", manim_code)
    return match.group(1) if match else None
