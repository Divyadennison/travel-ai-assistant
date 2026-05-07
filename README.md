# ✈️ Lumiere AI Travel Assistant

An AI-driven travel itinerary assistant built using React and Django REST Framework.

The system helps travel agencies automate customer interaction by collecting travel preferences, generating itineraries, and capturing leads for follow-up.

---

# 🚀 Features

- Interactive chatbot interface
- Destination selection
- Trip duration planning
- AI/Fallback itinerary generation
- Lead management workflow
- Booking simulation
- Responsive UI
- Django REST API integration

---

# 🧠 AI Workflow

## Input Phase
- User selects destination
- User selects trip duration
- User preferences are captured

## Processing Phase
- Backend processes user request
- AI/Fallback itinerary generator creates a day-by-day plan
- Lead details are stored

## Output Phase
- User receives generated itinerary
- User can proceed to booking
- Travel agent receives lead information for follow-up

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Axios
- CSS

## Backend
- Django
- Django REST Framework
- Python

---



# ⚙️ Installation & Setup

## Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py runserver
```

## Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

# 🌐 Application Flow

User → React Frontend → Django Backend → AI/Fallback Itinerary Generator → Lead Management → Travel Agent Follow-up