import "./sidebar.css";
import blackLogo from "./assets/blacklogo.png";
import {useContext, useEffect} from "react";
import { MyContext } from "./MyContext";
import {v1 as uuidv1} from "uuid";
import { BASE_URL } from "./config";

function Sidebar() {
    const { allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, reply, setReply, setCurrThreadId, setPrevChats } = useContext(MyContext);

    const getAllThreads = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/threads`);
        const res = await response.json();
        if (Array.isArray(res)) {
          setAllThreads(res);
        }
      } catch (err) {
        console.log(err);
      }
    };

    useEffect(() => {
      getAllThreads();
    }, [currThreadId, reply]);
  
    const createNewChat = () => {
      setNewChat(true);
      setPrompt("");
      setReply(null);
      setPrevChats([]);
      setCurrThreadId(uuidv1());
    };

    const changeThread = async (newThreadId) => {
      setCurrThreadId(newThreadId);
      setNewChat(false);
      setReply(null);
      try {
        const response = await fetch(`${BASE_URL}/api/thread/${newThreadId}`);
        const messages = await response.json();
        if (Array.isArray(messages)) {
          setPrevChats(messages);
        }
      } catch (err) {
        console.log(err);
      }
    };

    const deleteThread = async (e, threadIdToDelete) => {
      e.stopPropagation();
      try {
        await fetch(`${BASE_URL}/api/thread/${threadIdToDelete}`, {
          method: "DELETE"
        });
        setAllThreads((prev) =>
          prev.filter((t) => t._id !== threadIdToDelete && t.threadId !== threadIdToDelete)
        );
        if (currThreadId === threadIdToDelete) {
          createNewChat();
        }
      } catch (err) {
        console.log(err);
      }
    };

  return (
    <section className="sidebar">
      {/* new chat button */}
      <button onClick={createNewChat}>
        <img src={blackLogo} alt="gpt logo" className="logo" />
        {/* icon link */}
        <span><i className="fa-solid fa-pen-to-square"></i></span>
      </button>

      {/* history */}

      <ul className="history">
        {allThreads?.map((thread, idx) => {
          const tId = thread.threadId || thread._id;
          const uniqueKey = thread._id || `${tId}_${idx}`;
          return (
            <li
              key={uniqueKey}
              className={currThreadId === tId ? "highlighted" : ""}
              onClick={() => changeThread(tId)}
            >
              <span>{thread.title}</span>
              <i
                className="fa-solid fa-trash"
                onClick={(e) => deleteThread(e, thread._id || tId)}
              ></i>
            </li>
          );
        })}
      </ul>

      {/* sign */}
      <div className="sign">
        <p>Founded by Anuj Gangwar </p>

      </div>
    </section>
  );
}

export default Sidebar;
