import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, CSSProperties, useState, useEffect } from "react";
import { RingLoader } from "react-spinners";

function ChatWindow() {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    prevChats,
    setPrevChats,
    setNewChat,
  } = useContext(MyContext);

  const getReply = async () => {
    setLoading(true);
    setNewChat(false);
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

    try {
      const response = await fetch("http://localhost:8080/api/chat", options);
      const res = await response.json();
      console.log(res);
      setReply(res.reply);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  //Append new chat to previous chats
  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        { role: "user", content: prompt },
        { role: "assistant", content: reply },
      ]);
    }
    setPrompt("");
  }, [reply]);

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <div className="chatWindow">
        <div className="navbar">
          <span>
            Inquiro<i className="fa-solid fa-angle-down"></i>
          </span>
          <div className="userIconDiv" onClick={handleProfileClick}>
            <span className="userIcon">
              <i className="fa-solid fa-user"></i>
            </span>
          </div>
        </div>
        {isOpen && (
          <div className="dropDown">
            <div className="dropDownItem">
              <i class="fa-solid fa-cloud-arrow-up"></i>Upgrade Plan
            </div>
            <div className="dropDownItem">
              <i class="fa-solid fa-gear"></i>Settings
            </div>
            <div className="dropDownItem">
              <i class="fa-solid fa-arrow-right-from-bracket"></i>Log Out
            </div>
          </div>
        )}
        <Chat></Chat>
        <RingLoader color="#fff" size={30} loading={loading}></RingLoader>
        <div className="chatInput">
          <div className="inputBox">
            <input
              type="text"
              placeholder="Ask Anything"
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
              }}
              onKeyDown={(e) => {
                e.key === "Enter" ? getReply() : "";
              }}
            />
            <div className="submit" onClick={getReply}>
              <i className="fa-solid fa-paper-plane"></i>
            </div>
          </div>
          <p className="info">
            Inquiro can make mistakes.Check important information.
          </p>
        </div>
      </div>
    </>
  );
}

export default ChatWindow;
