import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

import autoScroll, { escapeWhenUpPlugin } from "../package/index.ts";

import "./index.css";

function PrismImport() {
  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/themes/prism.min.css"
        rel="stylesheet"
      />
      <script src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/prism.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/components/prism-javascript.min.js"></script>
    </>
  );
}

const JsCodeBox = ({ code, className = "" }) => (
  <div className={"w-full overflow-x-auto select-text  " + className}>
    <pre className="language-javascript">
      <code className="language-javascript">{code}</code>
    </pre>
  </div>
);

const Navbar = ({ title = "AI Assistant" }) => (
  <div className="navbar bg-base-300 min-h-[48px] px-2 pt-7 flex-none">
    <div className="flex-1">
      <button className="btn btn-ghost btn-sm btn-circle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <span className="text-sm font-semibold ml-2">{title}</span>
    </div>
    <div className="flex-none">
      <button className="btn btn-ghost btn-sm btn-circle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </button>
    </div>
  </div>
);

const Phone = ({ children }) => (
  <div className="mockup-phone select-none">
    <div className="camera"></div>
    <div className="display bg-base-200 flex flex-col h-[640px]">
      {children}
    </div>
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
    message: "Hi! I'm building a chat interface for my AI app",
  },
  {
    from: Type.AI,
    id: "002",
    message:
      "Hello! That sounds exciting. What kind of features are you working on?",
  },
  {
    from: Type.User,
    id: "003",
    message:
      "I'm struggling with auto-scrolling. When new messages arrive, the chat doesn't scroll down automatically. Users have to manually scroll to see the latest responses.",
  },
  {
    from: Type.AI,
    id: "004",
    message:
      "I understand - auto-scrolling is crucial for chat UX. There are a few considerations:\n\n1. Should it always scroll, or pause when users read history?\n2. How to handle rapid message updates?\n3. Smooth scrolling vs instant jump?\n\nHave you looked into specialized libraries for this?",
  },
  {
    from: Type.User,
    id: "005",
    message:
      "Not really. I tried implementing it myself but it's tricky to get right, especially handling user scroll behavior.",
  },
  {
    from: Type.AI,
    id: "006",
    message:
      "You might want to check out `@yrobot/auto-scroll`. It's a lightweight solution that:\n\n• Works with any framework (vanilla JS, React, Vue, etc.)\n• Handles edge cases automatically\n• Includes plugins like 'escape when scrolling up'\n• Very simple API\n\nWould you like to see how to implement it?",
  },
  ...[...Array(30)].map((_, i) => ({
    from: Type.AI,
    id: `00${7 + i}`,
    message: `Step ${i + 1}: ${
      [
        "Install the package via npm or yarn",
        "Import it into your project",
        "Configure with your container selector",
        "Add optional plugins if needed",
        "Test with streaming messages",
        "Adjust settings based on UX feedback",
      ][i % 6]
    }...`,
  })),
  {
    from: Type.User,
    id: "998",
    message: "This is exactly what I needed! The documentation is clear too.",
  },
  {
    from: Type.AI,
    id: "999",
    message:
      "Glad I could help! Feel free to ask if you have any questions during implementation. Good luck with your project! 🚀",
  },
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
  // console.log({ randomTime });
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

const useChatListStream = (): { list: ChatList; done: boolean } => {
  const range = [6, 16];
  const [list, setList] = useState<ChatList>(defaultList);
  const [done, setDone] = useState<boolean>(false);
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
        // console.log({ step });
        offset += step;
        const list = getMock(offset);
        setList(list);
        if (offset >= end) {
          setDone(true);
          stop();
        }
      },
    });
  }, []);
  return { list, done };
};

const ChatList = ({
  data: { list, done },
}: {
  data: ReturnType<typeof useChatListStream>;
}) => (
  <>
    {list.map((item) => (
      <div
        className={`chat ${item.from === Type.AI ? "chat-start" : "chat-end"}`}
        key={item.id}
      >
        <div className="chat-bubble">{item.message}</div>
      </div>
    ))}
    {done && (
      <div className="chat chat-start">
        <div className="chat-bubble chat-bubble-success">
          <span
            className="underline cursor-pointer"
            onClick={() => {
              window.location.reload();
            }}
          >
            Click here to replay
          </span>
        </div>
      </div>
    )}
  </>
);

const codes = {
  default: `import autoScroll from "@yrobot/auto-scroll";

autoScroll({ 
  selector: "#scroll-container-id",
  // container: document.getElementById("default-list-container") // Or you could pass the container element directly
});
`,
  escapeScrollUp: `import autoScroll, { escapeWhenUpPlugin } from "@yrobot/auto-scroll";

autoScroll({
  selector: "#scroll-container-id",
  plugins: [escapeWhenUpPlugin()],
});`,
};

const DefaultDemo = ({ data }) => {
  useEffect(
    () =>
      autoScroll({
        // selector: "#default-list-container",
        container: document.getElementById("default-list-container"),
      }),
    []
  );
  return (
    <div className="panel">
      <h3>Default (auto scroll always)</h3>
      <Phone>
        <Navbar title="Chat Demo" />
        <div
          className="list-container artboard phone-1 flex-1 overflow-y-auto"
          id="default-list-container"
        >
          <ChatList data={data} />
        </div>
      </Phone>
      <JsCodeBox className="mt-4" code={codes.default} />
    </div>
  );
};

const EscapeScrollUpDemo = ({ data }) => {
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
        <Navbar title="Smart Scroll" />
        <div
          className="list-container artboard phone-1 flex-1 overflow-y-auto"
          id="escape-scroll-up-list-container"
        >
          <ChatList data={data} />
        </div>
      </Phone>
      <JsCodeBox className="mt-4" code={codes.escapeScrollUp} />
    </div>
  );
};

function App() {
  const data = useChatListStream();
  return (
    <div className="grid-table">
      <DefaultDemo data={data} />
      <EscapeScrollUpDemo data={data} />
      <PrismImport />
    </div>
  );
}

const rootDom = document.getElementById("app");
if (rootDom === null) throw new Error("Root dom not found");
createRoot(rootDom).render(<App />);
