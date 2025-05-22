import React, { useContext, useEffect, useState, useCallback } from 'react';
import { TodoContext } from './TodoContext';
import toast from 'react-hot-toast';
import { BASE_URL } from '../utils/constant';

const TodoContextProvider = (props) => {
  const [todos, setTodos] = useState([]);
  const [createModal, setCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTodos, setTotalTodos] = useState(0);
  const [completedTodos, setCompletedTodos] = useState(0);

  // Persist sort order in localStorage
  const initialSortOrder = localStorage.getItem('todo-sortOrder') || 'desc';
  const [sortOrder, setSortOrder] = useState(initialSortOrder);

  useEffect(() => {
    localStorage.setItem('todo-sortOrder', sortOrder);
  }, [sortOrder]);

  const fetchTodos = useCallback(
    async (page = currentPage, sort = sortOrder) => {
      const token = localStorage.getItem('todo-accessToken');
      if (!token) return;

      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/api/todo?page=${page}&sort=${sort}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const res = await response.json();
        if (res.success) {
          setTodos(res.todos);
          setCurrentPage(res.pagination.currentPage || page);
          setTotalPages(res.pagination.totalPages || 1);
          setTotalTodos(res.pagination.totalTodos || res.todos.length);
          setCompletedTodos(res.todos.filter((t) => t.completed).length);
        } else {
          toast.error(res.message || 'Failed to fetch todos');
        }
      } catch (err) {
        toast.error('Error fetching todos');
      } finally {
        setLoading(false);
      }
    },
    [currentPage, sortOrder]
  );

  const searchTodos = useCallback(
    async (query) => {
      const token = localStorage.getItem('todo-accessToken');
      if (!token) return;
      if (!query || query.trim() === '') return toast.error('Search query is empty');

      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/api/todo/search?query=${encodeURIComponent(query)}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.success) {
          setTodos(data.todos);
          setCurrentPage(1);
          setTotalPages(1);
          setTotalTodos(data.total || data.todos.length);
          setCompletedTodos(data.todos.filter((t) => t.completed).length);
        } else {
          toast.error(data.message || 'Search failed');
        }
      } catch (err) {
        toast.error('Search failed');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createTodo = async (todo) => {
    const token = localStorage.getItem('todo-accessToken');
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/todo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(todo),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Todo created');
        fetchTodos(currentPage, sortOrder);
      } else {
        toast.error(data.message || 'Failed to create todo');
      }
    } catch (err) {
      toast.error('Failed to create todo');
    } finally {
      setLoading(false);
    }
  };

  const editTodo = async ({ title, description, completed, id }) => {
  if (!localStorage.getItem("todo-accessToken")) return;
  if (!id || (title === undefined && description === undefined && completed === undefined)) return;

  const toastLoading = toast.loading("Please wait...");
  try {
    const response = await fetch(`${BASE_URL}/api/todo/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("todo-accessToken")}`,
      },
      body: JSON.stringify({ description, title, completed }),
    });

    const res = await response.json();
    if (res.success) {
      // Refresh todos after edit to keep pagination and stats in sync
      await fetchTodos(currentPage,sortOrder);
      toast.success(completed ? "Task marked as completed" : "Task updated", { id: toastLoading });
    } else {
      toast.error(res.message, { id: toastLoading });
    }
  } catch (error) {
    toast.error("Something went wrong!", { id: toastLoading });
    console.error(error);
  }
};

  const deleteTodo = async (id) => {
    const token = localStorage.getItem('todo-accessToken');
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/todo/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Todo deleted');
        fetchTodos(currentPage, sortOrder);
      } else {
        toast.error(data.message || 'Failed to delete todo');
      }
    } catch (err) {
      toast.error('Failed to delete todo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        setTodos,
        createModal,
        setCreateModal,
        loading,
        setLoading,
        currentPage,
        setCurrentPage,
        totalPages,
        totalTodos,
        completedTodos,
        sortOrder,
        setSortOrder,
        fetchTodos,
        searchTodos,
        createTodo,
        editTodo,
        deleteTodo,
        setCompletedTodos,
      }}
    >
      {props.children}
    </TodoContext.Provider>
  );
};

export default TodoContextProvider;

export const useTodo = () => useContext(TodoContext);
