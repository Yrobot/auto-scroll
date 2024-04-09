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

enum Type {
  User = "USER",
  AI = "AI",
}

const mockData = [
  {
    from: Type.User,
    id: "001",
    message: "Hello, I am building a website for AI dialogue",
  },
  {
    from: Type.AI,
    id: "002",
    message:
      "Okay, that sounds like an interesting project! What difficulties did you encounter in setting up the AI dialogue website?",
  },
  {
    from: Type.User,
    id: "003",
    message:
      "When I was building the conversation list, I found that the page would not automatically scroll to the latest position of the conversation. When I talk to the AI, a better experience is that the page can automatically scroll to the bottom so that I can view the latest news.",
  },
  {
    from: Type.AI,
    id: "004",
    message:
      "Ah I see, that's a common issue with building chat/dialogue interfaces. Automatically scrolling to the latest message in the conversation is an important feature for providing a smooth and intuitive user experience. You can use the `@yrobot/auto-scroll` plugin, which can help you solve this problem very well, and it is developed using native js and adapts to all frameworks.",
  },
  ...[...Array(99)].map((_, i) => ({
    from: Type.AI,
    id: `00${5 + i}`,
    message: "Let's GOGOGOGOGOGOGOGOGO!!!",
  })),
];

type ChatList = typeof mockData;

const getMock = (offset: number): ChatList => {
  const result: ChatList = [];
  let tempIndex = 0;
  mockData.forEach((item) => {
    if (tempIndex > offset) return;
    result.push({
      ...item,
      message: item.message.slice(0, offset - tempIndex),
    });
    tempIndex += item.message.length;
  });
  return result;
};

const time = [20, 300];
const dynamicRun = ({
  callback,
  i = 0,
}: {
  callback: (options: { stop: () => void }) => void;
  i?: number;
}) => {
  const randomTime = time[0] + Math.floor(Math.random() * (time[1] - time[0]));
  console.log({ randomTime });
  const timeout = setTimeout(() => {
    i++;
    if (i > 999) return;
    const nextTimeout = dynamicRun({
      callback,
      i,
    });
    const stop = () => clearTimeout(nextTimeout);
    callback({
      stop,
    });
  }, randomTime);
  return timeout;
};

const defaultList = mockData.filter((item, i) => i < 3);

const useChatListStream = (): ChatList => {
  const range = [6, 16];
  const [list, setList] = useState<ChatList>(defaultList);
  useEffect(() => {
    let offset = defaultList.reduce(
      (acc, item) => acc + item.message.length,
      0
    );
    const end = mockData.reduce((acc, item) => acc + item.message.length, 0);
    dynamicRun({
      callback: ({ stop }) => {
        const step =
          range[0] + Math.floor(Math.random() * (range[1] - range[0]));
        console.log({ step });
        offset += step;
        const list = getMock(offset);
        setList(list);
        if (offset >= end) stop();
      },
    });
  }, []);
  return list;
};

const ChatList = ({ list }: { list: ChatList }) => (
  <>
    {list.map((item) => (
      <div
        className={`chat ${item.from === Type.AI ? "chat-start" : "chat-end"}`}
        key={item.id}
      >
        <div className="chat-bubble">{item.message}</div>
      </div>
    ))}
  </>
);

const codes = {
  default: `import autoScroll from "@yrobot/auto-scroll";

autoScroll({ selector: "#scroll-container-id" });`,
  escapeScrollUp: `import autoScroll, { escapeWhenUpPlugin } from "@yrobot/auto-scroll";

autoScroll({
  selector: "#scroll-container-id",
  plugins: [escapeWhenUpPlugin()],
});`,
};

const DefaultDemo = ({ list }) => {
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
        <div
          className="list-container artboard phone-1"
          id="default-list-container"
        >
          <ChatList list={list} />
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

const EscapeScrollUpDemo = ({ list }) => {
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
        <div
          className="list-container artboard phone-1"
          id="escape-scroll-up-list-container"
        >
          <ChatList list={list} />
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
  const list = useChatListStream();
  return (
    <div className="grid-table">
      <DefaultDemo list={list} />
      {/* <EscapeScrollUpDemo list={list}/> */}
    </div>
  );
}

const rootDom = document.getElementById("app");
if (rootDom === null) throw new Error("Root dom not found");
createRoot(rootDom).render(<App />);
