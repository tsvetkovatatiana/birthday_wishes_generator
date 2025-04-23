from typing import Union, List

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class PersonDetails(BaseModel):
    name: str
    hobbies: Union[List[str], None] = None
    personality: Union[List[str], None] = None
    specific_message: Union[str, None] = None

class BirthdayWishResponse(BaseModel):
    wish: str


wishes_db = {}
wish_id_counter = 0

@app.get("/")
def read_root():
    return {"message": "Welcome to the Birthday Wish Generator API"}

@app.post("/generate_wish/", response_model=BirthdayWishResponse)
async def generate_birthday_wish(person_details: PersonDetails):
    """
    Generates a birthday wish based on the provided details.

    Args:
        person_details: Information about the birthday person.

    Returns:
        A BirthdayWishResponse containing the generated wish.
    """
    prompt = f"Write a warm and celebratory birthday wish for {person_details.name}."
    if person_details.hobbies:
        prompt += f" They enjoy {', '.join(person_details.hobbies)}."
    if person_details.personality:
        prompt += f" They are known for being {', '.join(person_details.personality)}."
    if person_details.specific_message:
        prompt += f" Please also include this message: '{person_details.specific_message}'."

    # --- Integration with LLM (Ollama in this case) ---
    import subprocess

    try:
        ollama_process = subprocess.run(
            ["ollama", "run", "llama3", prompt],
            capture_output=True,
            text=True,
            check=True,
        )
        generated_wish = ollama_process.stdout.strip()
        return {"wish": generated_wish}
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500,
                            detail=f"Error generating wish: {e}")
    except FileNotFoundError:
        raise HTTPException(status_code=500,
                            detail="Ollama command not found. Please ensure Ollama is installed and in your PATH.")
    except Exception as e:
        raise HTTPException(status_code=500,
                            detail=f"An unexpected error occurred: {e}")

@app.get("/wishes/{wish_id}", response_model=BirthdayWishResponse)
async def get_wish(wish_id: int):
    """
    Retrieves a previously generated birthday wish by its ID.
    """
    if wish_id in wishes_db:
        return {"wish": wishes_db[wish_id]}
    else:
        raise HTTPException(status_code=404, detail="Wish not found")

@app.get("/wishes/")
async def list_wishes():
    """
    Lists all previously generated birthday wishes (for demonstration).
    """
    return wishes_db

# Example of storing a generated wish
@app.post("/store_wish/", response_model=BirthdayWishResponse)
async def store_generated_wish(wish_text: str):
    """
    Stores a generated birthday wish.
    """
    global wish_id_counter
    wish_id_counter += 1
    wishes_db[wish_id_counter] = wish_text
    return {"wish": wish_text}
