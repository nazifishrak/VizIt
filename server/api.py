import logging
from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel

# Configure the logging
logging.basicConfig(
    level=logging.DEBUG, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI(debug=True)


@app.get("/")
def read_root():
    logger.info("Root endpoint called")
    return {"Hello": "World"}


class PromptRequest(BaseModel):
    prompt: str


@app.post("/generate/")
async def generate(prompt_request: PromptRequest):
    prompt = prompt_request.prompt

    logger.info(f"Received prompt: {prompt}")

    try:
        logger.debug("Processing prompt...")

        result = "All good!"
        return {"prompt": result}
    except Exception as e:
        logger.error(f"Error while processing prompt: {e}")
        return {"error": "Something went wrong"}
