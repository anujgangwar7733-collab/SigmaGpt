import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { ScaleLoader } from "react-spinners";
import { BASE_URL } from "./config";

function ChatWindow() {
  const { prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const getReply = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setNewChat(false);

    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: prompt,
          threadId: currThreadId,
        }),
      };

      const response = await fetch(`${BASE_URL}/api/chat`, options);
      const res = await response.json();
      console.log("Response:", res);
      setReply(res.reply);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Append new chat to Prevchat
  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content: reply,
        },
      ]);
    }
    setPrompt("");
  }, [reply]); // Jab naya reply backend se aayega tabhi trigger hoga

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>SigmaGPT <i className="fa-solid fa-chevron-down"></i></span>
        <div className="userIconDiv" onClick={handleProfileClick}>
          <div className="userIcon">
            <i className="fa-solid fa-user"></i>
          </div>
        </div>
      </div>
      <Chat />

      {isOpen && (
        <div className="dropDown">
          <div className="dropDownItem">
            <i className="fa-solid fa-cloud-arrow-up" style={{ marginRight: "10px" }}></i>
            Upgrade plan
          </div>
          <div className="dropDownItem">
            <i className="fa-solid fa-gear" style={{ marginRight: "10px" }}></i>
            Settings
          </div>
          <div className="dropDownItem" onClick={() => window.location.reload()}>
            <i className="fa-solid fa-right-from-bracket" style={{ marginRight: "10px" }}></i>
            Logout
          </div>
        </div>
      )}

      {loading && <ScaleLoader color="#fff" />}

      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask Anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)
            }
            onKeyDown={(e) => e.key === "Enter" && getReply()
            }
          />


          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">
          SigmaGPT can make mistakes. Check important info. See Cookie Preferences.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;