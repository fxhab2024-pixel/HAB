from pydantic import BaseModel, EmailStr

class RegisterIn(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "sme"  # sme | admin

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class AnswersIn(BaseModel):
    user_id: int
    business_model: str
    market_position: str
    operations: str
    finance: str
