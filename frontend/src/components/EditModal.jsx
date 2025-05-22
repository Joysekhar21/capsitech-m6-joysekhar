import { useState, useEffect, useRef } from "react";
import { useTodo } from "../context/TodoContextProvider";
import { useFormik } from "formik";
import * as Yup from "yup";

const EditModal = ({ editModal, oldTodo, setEditModal }) => {
  const [loading, setLoading] = useState(false);
  const { editTodo } = useTodo();
  const modalRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      title: oldTodo.title,
      description: oldTodo.description,
      completed: oldTodo.completed,
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .min(3, "Title must be at least 3 characters")
        .required("Title is required"),
      description: Yup.string()
        .min(5, "Description must be at least 5 characters")
        .required("Description is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      await editTodo({
        id: oldTodo.id,
        ...values,
      });
      setLoading(false);
      setEditModal(false);
    },
    enableReinitialize: true,
  });

  // Optional: Close modal on outside click or Escape key
  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") setEditModal(false);
    }
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setEditModal(false);
      }
    }
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setEditModal]);

  if (!editModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md p-6 relative"
      >
        <h2 className="text-lg font-semibold mb-4">Edit Task</h2>
        <form onSubmit={formik.handleSubmit}>
          <label
            htmlFor="todo-title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Title
          </label>
          <input
            id="todo-title"
            name="title"
            type="text"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="my-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white"
          />
          {formik.touched.title && formik.errors.title && (
            <div className="text-sm text-red-500">{formik.errors.title}</div>
          )}

          <label
            htmlFor="todo-description"
            className="block text-sm font-medium mt-4 text-gray-700 dark:text-gray-300"
          >
            Description
          </label>
          <textarea
            id="todo-description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="my-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white"
          />
          {formik.touched.description && formik.errors.description && (
            <div className="text-sm text-red-500">{formik.errors.description}</div>
          )}

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={!formik.isValid || loading}
              className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-md hover:opacity-90 disabled:opacity-50"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => {
                setEditModal(false);
                formik.resetForm();
              }}
              className="ml-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-black dark:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
