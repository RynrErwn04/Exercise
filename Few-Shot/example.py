import os 
from dotenv import load_dotenv 
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
llm = ChatGoogleGenerativeAI(model="gemini-3.5-flash-lite", api_key=GEMINI_API_KEY)

# examples = [
#     {"review": "Great quality for reasonable price. Excellent!", "sentiment": "Positive"},
#     {"review": "The beans were stable and bitter. Disappointing.", "sentiment": "Negative"},
#     {"review": "Standard medium roast coffee. Nothing special. ", "sentiment": "Neutral"}
# ]

# example_prompt = PromptTemplate(
#     input_variables=["review", "sentiment"],
#     template= "Coffee Review: {review}\nSentiment: {sentiment}"
# )

# prompt = FewShotPromptTemplate(
#     examples=examples, 
#     example_prompt=example_prompt,
#     prefix="Analyze the coffee review sentiment.\nRespond with ONLY ONE WORD: Positve, Negative, Mixed, or Neutral.\n",
#     suffix="Coffee Review: {input}\nSentiment:",
#     input_variables=["input"]
# )

# chain = prompt | llm | StrOutputParser()

# print("Coffee Review Sentiment Analzyer (type 'quit' to exit)")
# while True: 
#     review = input("Enter coffee review: ").strip()
#     if not review: 
#         continue 
#     if review.lower() == 'quit': 
#         break 
#     try: 
#         response = chain.invoke({"input": review})
#         print(response.strip())
#     except Exception as e: 
#         print(f"Error: {e}")

#     print("\nProgram ended.")

prompt_template = """
Question: 11 factories can make 22 cars per hour. How much time would it take 22 factories to make 88 cars ? 
Answer: Let me solve this step by step: 
1. A factory can make 22/11=2 cars per hour. 
2. 22 factories can make 22*2=44 cars per hour. 
3. Making 88 cars would take 88/44=2 hours. 

Therefore, the answer is 2 hours.

Now, solve this new problem using the same step-by-step approach: 
Question: {question}
Answer: 
"""
prompt = PromptTemplate(
    input_variables=["question"],
    template=prompt_template
)

chain = prompt | llm | StrOutputParser()

def solve_math_problem(problem):
    try:
        response = chain.invoke({"question": problem})
        print(f"Problem: {problem}\n")
        print(f"Solution:\n{response}\n")
        print("-"* 50 + "\n")
    except Exception as e: 
        print(f"An error occured: {str(e)}")

new_problem = """5 people can create 5 donuts every 5 minutes. 
How much time would it take 25 people to make 100 donuts?
Return the answer immedaitely."""

solve_math_problem(new_problem)