from fastapi import APIRouter
from pydantic import BaseModel 

routers = APIRouter()

class RightWindowAction(BaseModel):
    action: str #Up or Down 

right_current_position = []

@routers.put("/action")
def operate_left_window(command: RightWindowAction):
    right_current_position.append(command)
    return {"Result": f"Window moved {command.action}"}

@routers.get("/current")
def get_window_status():
    return {"Current_Position": right_current_position}