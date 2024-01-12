import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import autoScroll from "../package/index.ts";

import "./index.css";

function App() {
  const [list, setList] = useState<number[]>([]);
  useEffect(() => {
    const timeId = setInterval(() => {
      if (list.length > 999) {
        setList((list) => list.slice(0, 10));
      } else {
        setList((list) => [...list, list.length + 1]);
      }
    }, 200);
    return () => {
      clearInterval(timeId);
    };
  }, []);
  useEffect(() => autoScroll({ selector: "#list-container" }), []);
  return (
    <div className="panel">
      <div className="list-container" id="list-container">
        {/* {list.map((id) => (
          <div className="item" key={id}>
            {id}
          </div>
        ))} */}
        {/* <div>
          {list.map((id) => (
            <div className="item" key={id}>
              {id}
            </div>
          ))}
        </div> */}
        <div
          className="item"
          style={{
            height: list.length * 100,
          }}
        >
          Height Update [{list.length * 100}px]
        </div>
        <div className="loading">LOADING...</div>
      </div>
    </div>
  );
}

const rootDom = document.getElementById("app");
if (rootDom === null) throw new Error("Root dom not found");
createRoot(rootDom).render(<App />);
