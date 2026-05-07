from rest_framework.decorators import api_view
from rest_framework.response import Response
from openai import OpenAI
import os

# 🔐 OpenAI Client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# 👤 Store user conversation state
user_state = {}


# 🔁 Reset User
def reset_user(user_id):
    user_state[user_id] = {
        "step": "ask_booking",
        "ended": False
    }


# 🔥 AI + FALLBACK ITINERARY
def generate_itinerary(destination, days):

    prompt = f"""
    Create a {days}-day travel itinerary for {destination}.

    Keep it simple and structured like:

    Day 1:
    Day 2:
    Day 3:
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "user", "content": prompt}
            ],
        )

        return response.choices[0].message.content

    except Exception as e:

        print("❌ OPENAI ERROR:", str(e))

        # 🔥 SMART FALLBACK (WORKS WITHOUT API MONEY)

        activities = [
            f"Explore top attractions in {destination}",
            "Enjoy local food and sightseeing",
            "Visit cultural landmarks and temples",
            "Try adventure activities / water sports",
            "Relax at scenic spots and beaches",
            "Explore local markets and shopping",
            "Visit nearby hidden gems",
            "Enjoy nightlife and local experiences",
            "Leisure day and photography",
            "Wrap-up and return journey"
        ]

        plan = ""

        for i in range(1, days + 1):
            activity = activities[i - 1]
            plan += f"Day {i}: {activity}\n"

        return plan


# =========================================================
# MAIN CHAT API
# =========================================================

@api_view(['POST'])
def chat_api(request):

    user_id = "demo"

    message = request.data.get("message", "").strip().lower()

    # 🔁 Restart
    if message == "__start__":

        reset_user(user_id)

        return Response({
            "reply": "✈️ Welcome to Lumiere Holidays!\n\nMay I help you with booking your holiday?",
            "options": ["Yes", "No"]
        })

    # 👤 First time user
    if user_id not in user_state:
        reset_user(user_id)

    state = user_state[user_id]

    # 🔒 Conversation ended
    if state["ended"]:
        return Response({
            "reply": "🔁 Click Restart to start again.",
            "options": []
        })

    step = state["step"]

    # =====================================================
    # STEP 1 → ASK BOOKING
    # =====================================================

    if step == "ask_booking":

        if message not in ["yes", "no"]:
            return Response({
                "reply": "❌ Please click Yes or No.",
                "options": ["Yes", "No"]
            })

        if message == "no":

            state["ended"] = True

            return Response({
                "reply": "😊 No problem! Have a great day ✈️",
                "options": []
            })

        state["step"] = "ask_name"

        return Response({
            "reply": "😊 Great!\n\nMay I know your name?",
            "options": []
        })

    # =====================================================
    # STEP 2 → ASK NAME
    # =====================================================

    elif step == "ask_name":

        if message in ["yes", "no"] or len(message) < 2:

            return Response({
                "reply": "❌ Please enter your real name.",
                "options": []
            })

        state["name"] = message.capitalize()

        state["step"] = "ask_place"

        return Response({
            "reply": f"😊 Nice to meet you, {state['name']}!\n\nWhere are you planning to travel?",
            "options": ["Goa", "Kerala", "Manali", "Bali"]
        })

    # =====================================================
    # STEP 3 → ASK PLACE
    # =====================================================

    elif step == "ask_place":

        valid_places = ["goa", "kerala", "manali", "bali"]

        if message not in valid_places:

            return Response({
                "reply": "❌ Please select a place.",
                "options": ["Goa", "Kerala", "Manali", "Bali"]
            })

        state["destination"] = message.capitalize()

        state["step"] = "ask_days"

        return Response({
            "reply": "🗓️ How many days are you planning?",
            "options": []
        })

    # =====================================================
    # STEP 4 → ASK DAYS
    # =====================================================

    elif step == "ask_days":

        if not message.isdigit():

            return Response({
                "reply": "❌ Enter number only.",
                "options": []
            })

        days = int(message)

        if days <= 0:

            return Response({
                "reply": "❌ Days must be greater than 0.",
                "options": []
            })

        # 🔥 Limit to 10 days
        if days > 10:
            days = 10

        state["days"] = days

        state["step"] = "booking_confirm"

        # 🔥 AI / FALLBACK
        itinerary = generate_itinerary(
            state["destination"],
            days
        )

        return Response({
            "reply": f"✨ Here’s your AI-generated itinerary:\n\n{itinerary}",
            "options": [
                "Proceed to Booking",
                "Not Interested"
            ]
        })

    # =====================================================
    # STEP 5 → BOOKING CONFIRM
    # =====================================================

    elif step == "booking_confirm":

        if message not in [
            "proceed to booking",
            "not interested"
        ]:

            return Response({
                "reply": "❌ Please select an option.",
                "options": [
                    "Proceed to Booking",
                    "Not Interested"
                ]
            })

        # ❌ User not interested
        if message == "not interested":

            state["ended"] = True

            return Response({
                "reply": "😊 No problem! Have a great day ✈️",
                "options": []
            })

        # ✅ Proceed
        state["step"] = "ask_phone"

        return Response({
            "reply": "📞 Please enter your 10-digit phone number:",
            "options": []
        })

    # =====================================================
    # STEP 6 → PHONE NUMBER
    # =====================================================

    elif step == "ask_phone":

        if not message.isdigit() or len(message) != 10:

            return Response({
                "reply": "❌ Please enter a valid 10-digit phone number.",
                "options": []
            })

        state["phone"] = message

        state["step"] = "anything_else"

        return Response({
            "reply": (
                "✅ Thank you! Our travel expert will contact you shortly.\n\n"
                "Anything else?"
            ),
            "options": ["Yes", "No"]
        })

    # =====================================================
    # STEP 7 → FINAL
    # =====================================================

    elif step == "anything_else":

        if message not in ["yes", "no"]:

            return Response({
                "reply": "❌ Please click Yes or No.",
                "options": ["Yes", "No"]
            })

        state["ended"] = True

        if message == "yes":

            return Response({
                "reply": "👨‍💼 Connecting you to a travel expert...\n\nHave a great day ✈️",
                "options": []
            })

        return Response({
            "reply": "😊 Thank you! Have a wonderful day ✈️",
            "options": []
        })