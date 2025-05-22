import { useState } from "react";
import { CheckSquare2, Trash, Edit, Square } from "lucide-react";

import { useTodo } from "../context/TodoContextProvider";

const TodoOptions = ({ todo, setEditModal }) => {
  const { deleteTodo, editTodo } = useTodo();
  const [loading, setLoading] = useState(false);

  const handleComplete = async (completed) => {
    setLoading(true);
    try {
      await editTodo({ completed, id: todo.id });
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
    setLoading(false);
  };
  console.log(todo.completed)
  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteTodo(todo.id);
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
    setLoading(false);
  };

  const Tooltip = ({ label, children }) => (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        {label}
      </div>
    </div>
  );

  return (
    <div className="flex flex-row gap-2">
      {!todo.completed && (
        <Tooltip label="Mark as complete">
          <button
            className="hover:bg-gray-300 hover:dark:bg-slate-800 p-2 rounded-md"
            disabled={loading}
            onClick={() => handleComplete(true)}
          >
            <Square />
          </button>
        </Tooltip>
      )}

      {todo.completed && (
        <Tooltip label="Mark as incomplete">
          <button
            className="hover:bg-gray-300 hover:dark:bg-slate-800 p-2 rounded-md"
            disabled={loading}
            onClick={() => handleComplete(false)}
          >
            <CheckSquare2 />
          </button>
        </Tooltip>
      )}

      <Tooltip label="Edit task">
        <button
          className="hover:bg-gray-300 hover:dark:bg-slate-800 p-2 rounded-md"
          disabled={loading}
          onClick={() => setEditModal(true)}
        >
          <Edit />
        </button>
      </Tooltip>

      <Tooltip label="Delete Task">
        <button
          className="hover:bg-red-400 hover:dark:bg-red-800 p-2 rounded-md"
          disabled={loading}
          onClick={handleDelete}
        >
          <Trash />
        </button>
      </Tooltip>
    </div>
  );
};

export default TodoOptions;
