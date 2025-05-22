import { useState } from "react";

const TooltipDemo = ({ text }) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <button className="px-3 py-1 rounded-md bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-sm font-medium">
        Hover
      </button>

      {show && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max max-w-xs rounded-md bg-black text-white text-sm px-3 py-2 z-50 shadow-lg">
          {text}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-2 h-2 rotate-45 bg-black"></div>
        </div>
      )}
    </div>
  );
};

export default TooltipDemo;
