import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const chatWidth = 480;

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [open, setOpen] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [bgText, setBgText] = useState("");

  // ✨ Landing typing animation
  useEffect(() => {
    const text = "Hi, I am EVA";
    let i = 0;

    const interval = setInterval(() => {
      setTypingText(text.slice(0, i + 1));
      i++;
      if (i === text.length) clearInterval(interval);
    }, 80);

    return () => clearInterval(interval);
  }, []);

  // ✨ Background text animation
  useEffect(() => {
    if (open) {
      const text = "🌍 Plan your dream trip with Lumiere...";
      let i = 0;

      const interval = setInterval(() => {
        setBgText(text.slice(0, i + 1));
        i++;
        if (i === text.length) clearInterval(interval);
      }, 40);

      return () => clearInterval(interval);
    }
  }, [open]);

  // 🚀 Initial message when chat opens
  useEffect(() => {
    if (open) {
      setChat([
        {
          sender: "bot",
          text: "✈️ Welcome to Lumiere Holidays!\nMay I help you with booking your holiday?",
          options: ["Yes", "No"],
        },
      ]);
    }
  }, [open]);

  // 📩 Send message
  const sendMessage = async (text = null) => {
    const msg = text || message;
    if (!msg.trim()) return;

    const updatedChat =
      msg === "__start__"
        ? [...chat]
        : [...chat, { sender: "user", text: msg }];
    setChat(updatedChat);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/chat/", {
        message: msg,
      });

      setChat([
        ...updatedChat,
        {
          sender: "bot",
          text: res.data.reply,
          options: res.data.options || [],
        },
      ]);
    } catch (err) {
      setChat([
        ...updatedChat,
        { sender: "bot", text: "⚠️ Server error", options: [] },
      ]);
    }

    setMessage("");
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >

      {/* 🔥 LANDING */}
      {!open && (
        <div
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "600px",
              padding: "60px",
              borderRadius: "30px",
              textAlign: "center",
              backdropFilter: "blur(20px)",
              background: "rgba(255,255,255,0.25)",
              boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ fontSize: "30px", color: "#333" }}>
              {typingText}
            </div>

            <h1 style={{ color: "#2b7cd3", fontSize: "70px" }}>EVA</h1>

            <p style={{ fontSize: "20px", color: "#333" }}>
              Your intelligent AI travel companion ✈️
            </p>

            <button
              onClick={() => setOpen(true)}
              style={{
                marginTop: "30px",
                padding: "16px 40px",
                fontSize: "20px",
                borderRadius: "30px",
                background: "#2b7cd3",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Let’s Chat
            </button>
          </div>
        </div>
      )}

       
{open && (
  <div
    style={{
      position: "absolute",
      top: "50%",

      // 👇 KEY LOGIC
      left:
        window.innerWidth > 1200
          ? "50%"   // big screen → TRUE CENTER
          : window.innerWidth > 900
          ? "42%"   // medium → slight shift
          : "50%",  // small → center

      transform: "translate(-50%, -50%)",

      maxWidth: "700px",
      width: "90%",
      textAlign: "center",
      fontSize: "clamp(26px, 3vw, 52px)",
      color: "white",
      fontWeight: "800",
      textShadow: "0 4px 20px rgba(0,0,0,0.8)",
      lineHeight: "1.3",
      padding: "10px",
    }}
  >
    {bgText}
  </div>
)}
      {/* 💬 CHAT BOX */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            width: "480px",
            height: "680px",
            backdropFilter: "blur(25px)",
            background: "rgba(255,255,255,0.35)",
            borderRadius: "25px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
          }}
        >

          {/* HEADER */}
          <div
            style={{
              background: "#2b7cd3",
              color: "white",
              padding: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTopLeftRadius: "25px",
              borderTopRightRadius: "25px",
            }}
          >
            ✈️ Lumiere

            <div style={{ display: "flex", gap: "8px" }}>
              {/* 🔄 RESET */}
              <button
                onClick={() => sendMessage("__start__")}
                style={{
                  background: "transparent",
                  color: "white",
                  border: "none",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
              >
                🔄
              </button>

              {/* ❌ CLOSE */}
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "2px 8px",
                  cursor: "pointer",
                }}
              >
                X
              </button>
            </div>
          </div>

          {/* CHAT */}
          <div style={{ flex: 1, padding: "15px", overflowY: "auto" }}>
            {chat.map((msg, i) => (
              <div key={i}>
                <div style={{ textAlign: msg.sender === "user" ? "right" : "left" }}>
                  <div
                    style={{
                      display: "inline-block",
                      background: msg.sender === "user" ? "#2b7cd3" : "#e3f2fd",
                      color: msg.sender === "user" ? "white" : "black",
                      padding: "10px",
                      borderRadius: "12px",
                      margin: "5px",
                      maxWidth: "75%",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>

                {msg.options &&
                  msg.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessage(opt)}
                      style={{
                        margin: "5px",
                        padding: "8px 14px",
                        borderRadius: "10px",
                        background: "#2b7cd3",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {opt}
                    </button>
                  ))}
              </div>
            ))}
          </div>

          {/* INPUT */}
          <div style={{ display: "flex", padding: "12px", background: "rgba(255,255,255,0.6)" }}>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid #ccc",
              }}
            />
            <button
              onClick={() => sendMessage()}
              style={{
                marginLeft: "10px",
                padding: "10px 16px",
                background: "#2b7cd3",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

export default App;