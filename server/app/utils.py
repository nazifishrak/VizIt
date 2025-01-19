import re
import subprocess


def remove_markdown(text: str) -> str:
    """
    Extracts Python code from markdown code blocks in LLM responses.
    Handles variations of code block formatting and removes language identifiers.
    Returns the first valid code block found.
    """
    # Match code blocks with any of these variations:
    # ```python
    # ``` python
    # ```Python
    # ``` Python
    # ```
    pattern = r"```(?:\s*(?:python|Python))?\s*\n(.*?)\s*```"
    matches = re.findall(pattern, text, re.DOTALL | re.IGNORECASE)

    if matches:
        # Get the first code block and clean it
        code = matches[0].strip()
        # Remove any remaining language identifier at the start
        code = re.sub(r"^(?:python|Python)\s*\n", "", code, flags=re.IGNORECASE)
        # Remove any trailing whitespace or newlines
        return code.strip()

    # If no code blocks found, clean and return the text
    cleaned = text.replace("```", "").strip()
    return cleaned


def test_remove_markdown():
    """Test cases for remove_markdown function"""
    tests = [
        ("```python\nprint('hello')\n```", "print('hello')"),
        ("```\nprint('hello')\n```", "print('hello')"),
        ("``` Python\nprint('hello')\n```", "print('hello')"),
        ("Some text\n```python\nprint('hello')\n```\nMore text", "print('hello')"),
        ("python\nprint('hello')", "print('hello')"),
    ]

    for input_text, expected in tests:
        result = remove_markdown(input_text)
        assert result == expected, f"Failed: {input_text} -> {result} != {expected}"


def combine_video_and_audio(
    video_file_path: str, audio_file_path: str, combine_video_path: str
):
    # Input and output file paths
    # Run ffmpeg to combine video and audio with adjusted audio speed
    subprocess.run(
        [
            "ffmpeg",
            "-i",
            video_file_path,
            "-i",
            audio_file_path,
            "-c:v",
            "copy",
            "-filter:a",
            "atempo=0.9",  # Adjust audio speed by 1.25x
            "-c:a",
            "aac",
            "-strict",
            "experimental",
            combine_video_path,
        ]
    )
