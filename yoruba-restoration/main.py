import re
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from yotext import standardize, restore

app = FastAPI(title="Ede Yoruba Text Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://ede-zeta.vercel.app/",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RestoreRequest(BaseModel):
    text: str = Field(min_length=1, max_length=2000)

class RestoreResponse(BaseModel):
    originalText: str
    normalizedText: str
    restoredText: str
    changed: bool


# Manually verified phrases take priority over automatic restoration.
# Add more phrases here as you validate them with fluent Yoruba speakers.
PHRASE_OVERRIDES = {
    "soro soke": "sọ̀rọ̀ sókè",
}


def apply_phrase_overrides(text: str) -> str:
    for original, corrected in PHRASE_OVERRIDES.items():
        pattern = re.compile(
            rf"\b{re.escape(original)}\b",
            re.IGNORECASE,
        )

        def replace_phrase(match):
            replacement = corrected

            if match.group(0)[0].isupper():
                replacement = replacement[0].upper() + replacement[1:]

            return replacement

        text = pattern.sub(replace_phrase, text)

    return text


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/api/yoruba/restore", response_model=RestoreResponse)
def restore_yoruba(request: RestoreRequest):
    try:
        original = request.text

        # Canonicalise the Yoruba characters and combining marks.
        normalized = standardize(original)

        # Restore missing underdots and tone marks using sentence context.
        restored = restore(normalized)

        # Apply verified conversational phrases.
        restored = apply_phrase_overrides(restored)

        # Ensure the output uses canonical Unicode composition.
        restored = standardize(restored)

        return RestoreResponse(
            originalText=original,
            normalizedText=normalized,
            restoredText=restored,
            changed=original != restored,
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="Unable to restore Yoruba text",
        ) from error