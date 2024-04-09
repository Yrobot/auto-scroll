import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

import autoScroll, { escapeWhenUpPlugin } from "../package/index.ts";

import "./index.css";

const Phone = ({ children }) => (
  <div className="mockup-phone">
    <div className="camera"></div>
    <div className="display bg-base-200">{children}</div>
  </div>
);

const useDynamicList = ({ max = 999 }: { max?: number } = {}) => {
  const [list, setList] = useState<number[]>([]);
  const dataRef = useRef({
    len: 0,
    max,
  });
  dataRef.current.len = list.length;
  dataRef.current.max = max;
  useEffect(() => {
    const timeId = setInterval(() => {
      if (dataRef.current.len < dataRef.current.max) {
        setList((list) => [...list, list.length + 1]);
      }
    }, 200);
    return () => {
      clearInterval(timeId);
    };
  }, []);
  return list;
};

const codes = {
  default: `import autoScroll from "@yrobot/auto-scroll";

autoScroll({ selector: "#scroll-container-id" });`,
  escapeScrollUp: `import autoScroll, { escapeWhenUpPlugin } from "@yrobot/auto-scroll";

autoScroll({
  selector: "#scroll-container-id",
  plugins: [escapeWhenUpPlugin()],
});`,
};

const DefaultDemo = () => {
  const list = useDynamicList();
  useEffect(
    () =>
      autoScroll({
        selector: "#default-list-container",
      }),
    []
  );
  return (
    <div className="panel">
      <h3>Default (auto scroll always)</h3>
      <Phone>
        <div className="list-container" id="default-list-container">
          {list.map((id) => (
            <div className="item" key={id}>
              {id}
            </div>
          ))}
          <div className="loading">LOADING...</div>
        </div>
      </Phone>
      <div className="code-block mt-4">
        <pre>
          <code>{codes.default}</code>
        </pre>
      </div>
    </div>
  );
};

const EscapeScrollUpDemo = () => {
  const list = useDynamicList();
  useEffect(
    () =>
      autoScroll({
        selector: "#escape-scroll-up-list-container",
        plugins: [escapeWhenUpPlugin()],
      }),
    []
  );
  return (
    <div className="panel">
      <h3>Stop Auto Scroll When User Scroll Up</h3>
      <Phone>
        <div className="list-container" id="escape-scroll-up-list-container">
          {list.map((id) => (
            <div className="item" key={id}>
              {id}
            </div>
          ))}
          <div className="loading">LOADING...</div>
        </div>
      </Phone>
      <div className="code-block mt-4">
        <pre>
          <code>{codes.escapeScrollUp}</code>
        </pre>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="grid-table">
      <DefaultDemo />
      <EscapeScrollUpDemo />
    </div>
  );
}

const rootDom = document.getElementById("app");
if (rootDom === null) throw new Error("Root dom not found");
createRoot(rootDom).render(<App />);
