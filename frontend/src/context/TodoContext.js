import { createContext } from "react";

export const TodoContext = createContext({
  todos: [],
  loading: false,
  createModal: false,
  currentPage: 1,
  totalPages: 1,
  totalTodos: 0,
  completedTodos: 0,
  sortOrder: "desc",          // default sort order
  setSortOrder: () => {},     // setter for sortOrder
  setLoading: () => {},
  setCreateModal: () => {},
  setTodos: () => {},
  fetchTodos: (page = 1, sort = "desc") => {},  // updated to accept sort param
  createTodo: (todo) => {},
  editTodo: (id, updatedFields) => {},
  deleteTodo: (id) => {},
  setCurrentPage: () => {},
  setCompletedTodos: () => {},
  searchTodos: (query) => {},
});
