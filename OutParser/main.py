
# # import os
# # from dotenv import load_dotenv
# # from langchain_google_genai import ChatGoogleGenerativeAI
# # from langchain_core.prompts import ChatPromptTemplate
# # from langchain_core.output_parsers import StrOutputParser

# # load_dotenv()

# # api_key = os.getenv("GEMINI_API_KEY")

# # if not api_key:
# #     raise ValueError("GEMINI_API_KEY not found in .env file")

# # print("API key found!", flush=True)

# # llm = ChatGoogleGenerativeAI(
# #     model="gemma-4-26b-a4b-it",
# #     temperature=0.7,
# #     api_key=api_key,
# #     max_retries=0,
# #     timeout=30
# # )

# # prompt = ChatPromptTemplate.from_messages([
# #     ("system", "You are a helpful assistant."),
# #     ("human", "{input}")
# # ])

# # chain = prompt | llm | StrOutputParser()

# # print("Starting chat... Type 'quit' to exit.")

# # while True:
# #     user_input = input("\nYou: ").strip()

# #     if user_input.lower() in ["quit", "exit"]:
# #         break

# #     if not user_input:
# #         continue

# #     try:
# #         print("Sending request to AI...", flush=True)

# #         response = chain.invoke({"input": user_input})

# #         print("AI:", response, flush=True)

# #     except Exception as e:
# #         print("ERROR:", repr(e), flush=True)

# # print("Chat ended.")

# import os 
# from io import BytesIO
# from pypdf import PdfReader 
# from dotenv import load_dotenv 
# from fastapi import FastAPI, UploadFile, File, HTTPException
# from langchain_google_genai import ChatGoogleGenerativeAI
# # from langchain_core.messages import HumanMessage 
# from langchain_core.prompts import ChatPromptTemplate
# from langchain_core.output_parsers import StrOutputParser

# app = FastAPI()
# load_dotenv()
# # THINKING_LEVEL = "low"

# llm = ChatGoogleGenerativeAI(
#     model="gemini-3.5-flash-lite",
#     google_api_key=os.getenv("GEMINI_API_KEY"),
#     # thinking_level = THINKING_LEVEL
# )

# # prompt = ChatPromptTemplate.from_messages([
# #     ("system", "You are a helpful assistant that summarizes documents."),
# #     ("human", "Write a concise summary of the following:\n\nCONCISE SUMMARY:")
# # ])

# # llm_with_url = llm.bind_tools([{"url_context": {}}])
# # URL ="https://www.salesforce.com/ap/small-business/types-of-businesses/"

# prompt_template = ChatPromptTemplate.from_messages([
#     ("system", "You are a helpful assistant that summarizes documents."),
#     ("human", "Write a concise summary of the following:\n\n{text}\n\nCONCISE SUMMARY:")
# ])

# chain = prompt_template| llm | StrOutputParser()

# # response = chain.invoke([
# #     HumanMessage(content=f"Write a concise summary of this page: {URL}")
# # ])

# # print(f"Thinking Level: {THINKING_LEVEL}")
# # print(f"Response    :\n{response}")

# # print(response)

# def read_pdf_file(file_contents: BytesIO) -> str:
#     try:
#         pdf_reader = PdfReader(file_contents)
#         return "\n".join(page.extract_text() or ""for page in pdf_reader.pages)
#     except Exception as e: 
#         raise HTTPException(status_code=400, detail="Could not read this PDF. It may be damaged or password-protected.") from e 

# MAX_PDF_BYTES = 10 * 1024 * 1024


# @app.post("/summarize-pdf", response_model=dict[str, str], summary="Upload a PDF and summarize it")
# def summarize_pdf(file: UploadFile = File(...)) -> dict[str, str]:
#     """Upload a text-based PDF (up to 10 MB) and return its filename and AI summary.

#     Extracted text is sent to the configured Gemini model. Scanned PDFs need OCR
#     before they can be summarized.
#     """
#     try:
#         if not file.filename or not file.filename.lower().endswith(".pdf"):
#             raise HTTPException(status_code=400, detail="Please upload a .pdf file.")

#         contents = file.file.read(MAX_PDF_BYTES + 1)
#         if len(contents) > MAX_PDF_BYTES:
#             raise HTTPException(status_code=413, detail="PDF must be 10 MB or smaller.")
#         if not contents:
#             raise HTTPException(status_code=400, detail="The uploaded file is empty.")

#         text = read_pdf_file(BytesIO(contents)).strip()
#         if not text:
#             raise HTTPException(
#                 status_code=400,
#                 detail="No readable text was found. Scanned PDFs need OCR first.",
#             )

#         try:
#             summary = chain.invoke({"text": text})
#         except Exception as exc:
#             raise HTTPException(
#                 status_code=502,
#                 detail="The AI service could not summarize the PDF. Check your Gemini API key, model access, and quota, then try again.",
#             ) from exc

#         if not summary or not summary.strip():
#             raise HTTPException(status_code=502, detail="The AI service returned an empty summary. Please try again.")

#         return {"filename": file.filename, "summary": summary}
#     finally:
#         file.file.close()

import os
import base64
# from fastapi import FastAPI, File, UploadFile, HTTPException
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv
# from typing import Dict
import streamlit as st

load_dotenv()
llm = ChatGoogleGenerativeAI(
    model="gemini-3.5-flash-lite",
    api_key=os.getenv("GEMINI_API_KEY")
)

# app = FastAPI()


# def encode_image(image_content: bytes) -> str:
#     return base64.b64encode(image_content).decode()


# @app.post("/analyze-image")
# async def analyze_image(file: UploadFile = File(...)) -> Dict[str, str]:
#     if not file.content_type or file.content_type not in ["image/jpeg", "image/png"]:
#         raise HTTPException(
#             status_code=400,
#             detail="Invalid or missing file type. Only JPEG and PNG are allowed.",
#         )

#     contents = await file.read()

#     if len(contents) > 10_000_000:
#         raise HTTPException(status_code=400, detail="File too large. Maximum size is 10MB.")

#     image = encode_image(contents)

#     prompt = ChatPromptTemplate.from_messages([
#         ("system", "You are a nutrition expert capable of analyzing food images and providing detailed nutritional advice."),
#         ("human", [
#             {
#                 "type": "text",
#                 "text": """Analyze the image and provide a comprehensive nutritional breakdown and health advice. Follow these steps:
#                 1. Analyze the ingredients.
#                 2. Make calorie calculations.
#                 """,
#             },
#             {
#                 "type": "image_url",
#                 "image_url": {
#                     "url": f"data:{file.content_type};base64,{image}",
#                 },
#             },
#         ]),
#     ])
#     try:
#         chain = prompt | llm | StrOutputParser()
#         res = await chain.ainvoke({})
#     except Exception as e:
#         print(str(e))
#         raise HTTPException(status_code=500, detail="An error occurred while analyzing the image.")

#     return {"analysis": res}

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant that can describe images."),
    (
        "human",
        [
            {"type": "text", "text": "{input}"},
            {
                "type": "image_url",
                "image_url": {"url": "data:{mime_type};base64,{image}"},
            },
        ],
    ),
])

chain = prompt | llm | StrOutputParser()

st.title("Image Analysis Using Gemini")

col1, col2 = st.columns(2)

with col1:
    uploaded_file = st.file_uploader("Upload your image", type=["jpg", "png"])
    question = st.text_input("Enter a question")

with col2:
    if uploaded_file is None:
        st.write("Image Preview")
    else:
        image_bytes = uploaded_file.getvalue()
        st.image(image_bytes, use_container_width=True)

        if question:
            image = base64.b64encode(image_bytes).decode("ascii")
            with st.spinner("Analyzing image..."):
                try:
                    response = chain.invoke({
                        "input": question,
                        "image": image,
                        "mime_type": uploaded_file.type,
                    })
                except Exception as exc:
                    st.error(f"Could not analyze the image: {exc}")
                else:
                    st.write(response)