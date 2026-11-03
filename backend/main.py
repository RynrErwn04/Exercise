
# # from fastapi import FastAPI, Body

# # app = FastAPI()

# # BOOKS = [
# #     {"title": "Fourth Wing", "author": "Rebecca Yarros", "published_year": 2023},
# #     {"title": "On Freedom", "author": "Timothy Snyder", "published_year": 2024}
# # ]


# # # GET: Homepage
# # @app.get("/")
# # async def read_root():
# #     return {"message": "Hello World"}


# # # GET: List all books
# # @app.get("/books")
# # async def getAllBooks():
# #     return BOOKS


# # # GET: Find books by author and year (Query Parameters)
# # @app.get("/books/search")
# # async def get_book_by_query(author: str, published_year: int):
# #     books_to_return = []

# #     for book in BOOKS:
# #         if (book.get("author").casefold() == author.casefold()
# #                 and book.get("published_year") == published_year):
# #             books_to_return.append(book)

# #     return books_to_return


# # # GET: Find a book by title (Path Parameter)
# # @app.get("/books/{book_title}")
# # async def get_book(book_title: str):
# #     for book in BOOKS:
# #         if book.get("title").casefold() == book_title.casefold():
# #             return book

# #     return {"message": "Book Not Found"}


# # # POST: Create a new book
# # @app.post("/books/create_book")
# # async def create_book(new_book=Body()):
# #     BOOKS.append(new_book)

# #     return "Book Record Created Successfully"


# # # PUT: Update an existing book
# # @app.put("/books/update_book")
# # async def update_book(updated_book=Body()):
# #     for i in range(len(BOOKS)):
# #         if BOOKS[i].get("title").casefold() == updated_book.get("title").casefold():
# #             BOOKS[i] = updated_book
# #             return "Book Record Updated Successfully"

# #     return "Book Not Found"


# # # DELETE: Delete a book by title
# # @app.delete("/books/delete_book/{book_title}")
# # async def delete_book(book_title: str):
# #     for i, book in enumerate(BOOKS):
# #         if book.get("title").casefold() == book_title.casefold():
# #             BOOKS.pop(i)
# #             return "Book Record Deleted Successfully"

# #     return "Book Not Found"


# from fastapi import FastAPI
# from pydantic import BaseModel
# from typing import List
# from routers import right_window, left_window

# app = FastAPI()


# # class Receipt(BaseModel):
# #     date: str
# #     terminal: str
# #     transaction: str
# #     amount_RM: float


# # atm_database = [
# #     {
# #         "date": "06/08/2026",
# #         "terminal": "642251",
# #         "transaction": "withdrawal",
# #         "amount_RM": 500.01,
# #         "house_possessed": 6,
# #         "car_possessed": 7,
# #     }
# # ]


# # @app.get("/receipt-with-no-model")
# # def get_receipt_no_model():
# #     return atm_database


# # @app.get("/receipt-with-model", response_model=List[Receipt])
# # def get_receipt_with_model():
# #     return atm_database 

# app.include_router(
#     right_window.routers,
#     prefix="/right",
#     tags=["Right Window Buttons"]
# )

# app.include_router(
#     left_window.routers,
#     prefix="/left",
#     tags=["Left Window Buttons"]
# )


from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

app = FastAPI()

# Demo tokens
VALID_TOKENS = {
    "user123": {"username": "john_doe", "role": "user"},
    "admin456": {"username": "admin_user", "role": "admin"},
}

security = HTTPBearer()

# Authentication dependency
async def auth_dependency(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    if token not in VALID_TOKENS:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_info = VALID_TOKENS[token]
    print(f"Authentication executed for: {user_info['username']}")

    return user_info


# Admin authorization dependency
async def admin_dependency(
    user_info: dict = Depends(auth_dependency)
):
    if user_info.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    print(f"Admin access granted for: {user_info['username']}")

    return user_info


# Public endpoint
@app.get("/public")
async def public_endpoint():
    return {"message": "Public endpoint - no auth required"}


# Protected endpoint
@app.get("/protected")
async def protected_endpoint(
    user_info: dict = Depends(auth_dependency)
):
    return {
        "message": "Protected endpoint",
        "user": user_info["username"],
        "role": user_info["role"]
    }


# Admin endpoint
@app.get("/admin")
async def admin_endpoint(
    user_info: dict = Depends(admin_dependency)
):
    return {
        "message": "Admin endpoint",
        "user": user_info["username"],
        "role": user_info["role"]
    }
