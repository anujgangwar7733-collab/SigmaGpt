import "./sidebar.css";
import blackLogo from "./assets/blacklogo.png";
import {useContext, useEffect} from "react";
import { MyContext } from "./MyContext";


function Sidebar() {
    const {allThreads , setAllThreads,currThreadId} = useContext(MyContext);

    const getAllThreads = async()=>{

      try {
        const response = await fetch("http:localhost:8080/api/thread");
        const res =await response.json();
        const filteredData = res.map(thread=>({ThreadId:thread.ThreadId,title:thread.title}))
        console.log(filteredData);
        console.log(res);
      } catch(err){
        console.log(err)
      }
    };

    useEffect(()=>{
      getAllThreads();
    } ,[currThreadId])
;
  return (
    <section className="sidebar">
      {/* new chat button */}
      <button>
        <img src={blackLogo} alt="gpt logo" className="logo" />
        {/* icon link */}
        <span><i className="fa-solid fa-pen-to-square"></i></span>
      </button>

      {/* history */}
      <ul className="history">
         filterData?.map((thread,idx) => {
           <li key={idx}>{thread.title}</li>
         })
      </ul>

      {/* sign */}
      <div className="sign">
        <p>Founded by Anuj Gangwar </p>

      </div>
    </section>
  );
}

export default Sidebar;
