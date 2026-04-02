from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class Transaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    date: str
    amount: float
    category: str
    type: str  # "income" or "expense"
    description: Optional[str] = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TransactionCreate(BaseModel):
    date: str
    amount: float
    category: str
    type: str
    description: Optional[str] = ""

class TransactionUpdate(BaseModel):
    date: Optional[str] = None
    amount: Optional[float] = None
    category: Optional[str] = None
    type: Optional[str] = None
    description: Optional[str] = None

class Insight(BaseModel):
    total_balance: float
    total_income: float
    total_expense: float
    highest_spending_category: Optional[dict] = None
    monthly_comparison: Optional[dict] = None
    category_breakdown: List[dict] = []


@api_router.get("/")
async def root():
    return {"message": "Financial Dashboard API"}

@api_router.get("/transactions", response_model=List[Transaction])
async def get_transactions(days: int = 30):
    # Calculate date filter for last N days
    cutoff_date = datetime.now(timezone.utc) - timedelta(days=days)
    
    transactions = await db.transactions.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for txn in transactions:
        if isinstance(txn['created_at'], str):
            txn['created_at'] = datetime.fromisoformat(txn['created_at'])
    
    return transactions

@api_router.post("/transactions", response_model=Transaction)
async def create_transaction(input: TransactionCreate):
    txn_dict = input.model_dump()
    txn_obj = Transaction(**txn_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = txn_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    _ = await db.transactions.insert_one(doc)
    return txn_obj

@api_router.put("/transactions/{transaction_id}", response_model=Transaction)
async def update_transaction(transaction_id: str, input: TransactionUpdate):
    # Find existing transaction
    existing = await db.transactions.find_one({"id": transaction_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    # Update only provided fields
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    
    if update_data:
        await db.transactions.update_one(
            {"id": transaction_id},
            {"$set": update_data}
        )
    
    # Fetch and return updated transaction
    updated = await db.transactions.find_one({"id": transaction_id}, {"_id": 0})
    if isinstance(updated['created_at'], str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    
    return Transaction(**updated)

@api_router.delete("/transactions/{transaction_id}")
async def delete_transaction(transaction_id: str):
    result = await db.transactions.delete_one({"id": transaction_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return {"message": "Transaction deleted successfully"}

@api_router.get("/insights", response_model=Insight)
async def get_insights(days: int = 30):
    transactions = await db.transactions.find({}, {"_id": 0}).to_list(1000)
    
    if not transactions:
        return Insight(
            total_balance=0.0,
            total_income=0.0,
            total_expense=0.0,
            highest_spending_category=None,
            monthly_comparison=None,
            category_breakdown=[]
        )
    
    # Calculate totals
    total_income = sum(t['amount'] for t in transactions if t['type'] == 'income')
    total_expense = sum(t['amount'] for t in transactions if t['type'] == 'expense')
    total_balance = total_income - total_expense
    
    # Category breakdown for expenses
    category_totals = {}
    for t in transactions:
        if t['type'] == 'expense':
            cat = t['category']
            category_totals[cat] = category_totals.get(cat, 0) + t['amount']
    
    category_breakdown = [
        {"category": cat, "amount": amt}
        for cat, amt in category_totals.items()
    ]
    
    # Highest spending category
    highest_spending = None
    if category_totals:
        highest_cat = max(category_totals.items(), key=lambda x: x[1])
        highest_spending = {"category": highest_cat[0], "amount": highest_cat[1]}
    
    # Monthly comparison (simplified - compare this month vs previous period)
    now = datetime.now(timezone.utc)
    current_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    current_month_txns = [t for t in transactions if datetime.fromisoformat(t['date']) >= current_month_start]
    previous_month_txns = [t for t in transactions if datetime.fromisoformat(t['date']) < current_month_start]
    
    current_balance = sum(t['amount'] if t['type'] == 'income' else -t['amount'] for t in current_month_txns)
    previous_balance = sum(t['amount'] if t['type'] == 'income' else -t['amount'] for t in previous_month_txns)
    
    monthly_comparison = {
        "current_period": current_balance,
        "previous_period": previous_balance,
        "change": current_balance - previous_balance
    }
    
    return Insight(
        total_balance=total_balance,
        total_income=total_income,
        total_expense=total_expense,
        highest_spending_category=highest_spending,
        monthly_comparison=monthly_comparison,
        category_breakdown=category_breakdown
    )

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()