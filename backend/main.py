from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson import ObjectId

app = FastAPI()

# ✅ CORS (allow frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ MongoDB Atlas connection
client = MongoClient("mongodb+srv://Admin:22B21A4276@cluster0.13gzs.mongodb.net/contact_db?retryWrites=true&w=majority")
db = client["contact_db"]
collection = db["contacts"]

# ✅ Convert MongoDB data to JSON
def serialize(contact):
    return {
        "id": str(contact["_id"]),
        "first_name": contact.get("first_name", ""),
        "last_name": contact.get("last_name", ""),
        "email": contact.get("email", ""),
        "phone": contact.get("phone", ""),
        "address": contact.get("address", ""),
    }

# ✅ GET all contacts
@app.get("/contacts")
def get_contacts():
    contacts = collection.find()
    return [serialize(c) for c in contacts]

# ✅ CREATE contact
@app.post("/contacts")
def add_contact(contact: dict):
    result = collection.insert_one(contact)
    return {"id": str(result.inserted_id)}

# ✅ UPDATE contact
@app.put("/contacts/{id}")
def update_contact(id: str, contact: dict):
    collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": contact}
    )
    return {"message": "Updated"}

# ✅ DELETE contact
@app.delete("/contacts/{id}")
def delete_contact(id: str):
    collection.delete_one({"_id": ObjectId(id)})
    return {"message": "Deleted"}