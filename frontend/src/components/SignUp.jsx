import { useState, ChangeEvent, FormEvent } from "react";
import { useUser } from "../context/UserContextProvider";
import { CheckboxDemo } from "./CheckboxDemo";
import { useFormik } from "formik";
import * as Yup from "yup"
import { Link } from "react-router";



const SignUp = () => {
  const { setIsLoggedIn, setLoginModal, isLoggedIn, loginModal, userRegister } =
    useUser();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [creds, setCreds] = useState({
    username: "",
    email: "",
    password: "",
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required("Name is required")
        .matches(/^[A-Za-z\s]+$/, "Only letters and spaces are allowed"),
      email: Yup.string()
        .email("Invalid email")
        .required("Email is required"),
      password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(/^(?=.*[a-z])/, "Must include a lowercase letter")
        .matches(/^(?=.*[A-Z])/, "Must include an uppercase letter")
        .matches(/^(?=.*\d)/, "Must include a number")
        .matches(/^(?=.*[^A-Za-z0-9])/, "Must include a special character"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      localStorage.removeItem("todo-accessToken");
      await userRegister(values);
      setIsLoggedIn(true);
      setLoginModal(false);
      setLoading(false);
    },
  });

  const handleChange = (e) => {
    const input = e.target ;
    setCreds({ ...creds, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    localStorage.removeItem("todo-accessToken");
    await userRegister(creds);
    setIsLoggedIn(true);
    setLoginModal(false);
    setLoading(false);
  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md p-6 dark:selection:bg-slate-800 selection:bg-gray-300">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Register</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Create an account to continue</p>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            placeholder="Enter your name"
            name="username"
            id="name"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md mb-3 bg-white dark:bg-gray-800 text-black dark:text-white"
            value={formik.values.name}
            onChange={(e) => {
              formik.handleChange(e);
              setCreds({ ...creds, username: e.target.value });
            }}
            onBlur={formik.handleBlur}
          />
          {formik.touched.username && formik.errors.username && (
            <p className="text-sm text-red-500 mb-2">{formik.errors.username}</p>
          )}

          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            placeholder="Enter the email"
            name="email"
            id="email"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md mb-3 bg-white dark:bg-gray-800 text-black dark:text-white"
            value={formik.values.email}
            onChange={(e) => {
              formik.handleChange(e);
              setCreds({ ...creds, email: e.target.value });
            }}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-sm text-red-500 mb-2">{formik.errors.email}</p>
          )}
        
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            name="password"
            id="password"
            type={showPassword ? "text" : "password"}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md mb-3 bg-white dark:bg-gray-800 text-black dark:text-white"
            value={formik.values.password}
            onChange={(e) => {
              formik.handleChange(e);
              setCreds({ ...creds, password: e.target.value });
            }}
            onBlur={formik.handleBlur}            
          />
          
          {formik.touched.password && formik.errors.password && (
            <p className="text-sm text-red-500 mb-2">{formik.errors.password}</p>
          )}
          <div className="my-2">
            <CheckboxDemo
              uniqueId="register-check"
              setShowPassword={setShowPassword}
              label="Show Password"
            />
          </div>
          <div className="flex justify-end space-x-2 mt-4">
         
            <button
              type="submit"
              className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-md transition disabled:opacity-50 selection:text-black dark:selection:text-white"
              disabled={
                loading ||
                creds.password.length < 8 ||
                creds.email.length < 4 ||
                creds.username.length < 1
                
              }
            >
            
              Register
            </button>
            <Link
             to="/"
              onClick={() => {
                setLoginModal(true);
                setIsLoggedIn(false);
                setCreds({
                  username: "",
                  email: "",
                  password: "",
                });
                formik.resetForm();
              }}>
                <button
                type="button"
              className="border border-gray-300 dark:border-gray-600 text-black dark:text-white px-4 py-2 rounded-md"
            >
           
              Login
            
            </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;