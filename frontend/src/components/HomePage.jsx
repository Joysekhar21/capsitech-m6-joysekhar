import React, { useEffect, useMemo, useState } from "react";
import { ModeToggle } from "./ModeToggle";
import CreateTodo from "./CreateTodo";
import TodoMap from "./TodoMap";
import { useUser } from "../context/UserContextProvider";
import { useTodo } from "../context/TodoContextProvider";
import Logout from "./Logout";

const HomePage = () => {
  const {
    todos,
    fetchTodos,
    searchTodos,
    setCreateModal,
    loading,
    currentPage,
    totalPages,
    setCurrentPage,
    totalTodos,
    completedTodos,
    setCompletedTodos,
    sortOrder,
    setSortOrder,
  } = useTodo();

  const { setIsLoggedIn, setLoginModal,user,setUser } = useUser();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("todo-accessToken");
    if (!token) {
      setIsLoggedIn(false);
      setLoginModal(true);
      return;
    }
    setIsLoggedIn(true);

    if (!isSearching) {
      fetchTodos(currentPage);
    }
  }, [currentPage, isSearching, fetchTodos, setIsLoggedIn, setLoginModal]);

  useEffect(() => {
    const savedSortOrder = localStorage.getItem("todo-sortOrder");
    if (savedSortOrder) {
      setSortOrder(savedSortOrder);
    }
  }, [setSortOrder]);

  useEffect(() => {
    if (typeof setCompletedTodos === "function") {
      const completed = todos.filter((todo) => todo.completed).length;
      setCompletedTodos(completed);
    }
  }, [todos, setCompletedTodos]);

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() === "") {
      setIsSearching(false);
      fetchTodos(currentPage);
    } else {
      setIsSearching(true);
      await searchTodos(query);
    }
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSortOrder(newSort);
    localStorage.setItem("todo-sortOrder", newSort);
    setCurrentPage(1);
  };

  const progressPercent =
    totalTodos === 0 ? 0 : Math.round((completedTodos / totalTodos) * 100);

  const maxPageButtons = 5;

  const getPaginationRange = () => {
    const totalPageCount = totalPages;
    const current = currentPage;
    const half = Math.floor(maxPageButtons / 2);

    let start = Math.max(current - half, 1);
    let end = Math.min(start + maxPageButtons - 1, totalPageCount);

    start = Math.max(end - maxPageButtons + 1, 1);

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const paginationNumbers = useMemo(() => getPaginationRange(), [
    totalPages,
    currentPage,
  ]);

  return (
    <main className="dark:selection:bg-slate-800 selection:bg-gray-300">
      
      <ModeToggle />
      <Logout/>
      <CreateTodo />

      <div className="w-full 2xl:p-16 xl:p-16 lg:p-16 md:p-10 p-6">
        <h1 className="text-4xl my-6 2xl:my-0 2xl:text-5xl xl:my-0 xl:text-5xl lg:text-5xl lg:my-0 md:text-5xl md:my-2">
          {user?.username.split(" ")[0]} Todos
        </h1>

        <div className="mb-3 mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <input
            type="text"
            placeholder="Search todos by title or description..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="flex-grow px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          />
          <select
            value={sortOrder}
            onChange={handleSortChange}
            className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        <div className="mb-6 mt-6">
          <div className="flex justify-between text-sm font-medium mb-1">
            <span>Progress Bar</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-4 rounded-full overflow-hidden">
            <div
              className="h-full bg-black dark:bg-white transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            <p>
              Total Todos: <span className="font-semibold">{totalTodos}</span>
            </p>
            <p>
              Completed Todos:{" "}
              <span className="font-semibold">{completedTodos}</span>
            </p>
          </div>
        </div>

        <ul className="flex 2xl:flex-row xl:flex-row lg:flex-row md:flex-row flex-col gap-8 pt-4">
          <li className="2xl:w-1/2 xl:w-1/2 lg:w-1/2 md:w-1/2 w-full">
            <h2 className="2xl:text-2xl xl:text-2xl lg:text-2xl md:text-2xl text-xl">
              Assigned Todos
            </h2>
            <TodoMap todos={todos.filter((todo) => !todo.completed)} />
            <button
              onClick={() => setCreateModal(true)}
              className="ml-2 mt-4 bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-md hover:opacity-90 transition disabled:opacity-50 selection:text-black dark:selection:text-white"
              disabled={loading}
            >
              Create Task
            </button>
          </li>

          <li className="2xl:w-1/2 xl:w-1/2 lg:w-1/2 md:w-1/2 w-full">
            <h2 className="2xl:text-2xl xl:text-2xl lg:text-2xl md:text-2xl text-xl">
              Completed
            </h2>
            <TodoMap todos={todos.filter((todo) => todo.completed)} />
          </li>
        </ul>

        {!isSearching && totalPages > 1 && (
          <div className="mt-10 flex justify-center items-center gap-2 flex-wrap">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-50"
            >
              Prev
            </button>

            {paginationNumbers[0] > 1 && (
              <>
                <button
                  onClick={() => setCurrentPage(1)}
                  className={`px-4 py-2 rounded ${
                    currentPage === 1
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "bg-gray-300 dark:bg-gray-700"
                  }`}
                >
                  1
                </button>
                {paginationNumbers[0] > 2 && <span className="px-2">...</span>}
              </>
            )}

            {paginationNumbers.map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-4 py-2 rounded ${
                  currentPage === pageNum
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-gray-300 dark:bg-gray-700"
                }`}
              >
                {pageNum}
              </button>
            ))}

            {paginationNumbers[paginationNumbers.length - 1] < totalPages && (
              <>
                {paginationNumbers[paginationNumbers.length - 1] < totalPages - 1 && (
                  <span className="px-2">...</span>
                )}
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`px-4 py-2 rounded ${
                    currentPage === totalPages
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "bg-gray-300 dark:bg-gray-700"
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default HomePage;
