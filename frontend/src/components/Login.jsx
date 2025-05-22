import { useState, ChangeEvent, FormEvent } from "react";
import { useUser } from "../context/UserContextProvider";
import { CheckboxDemo } from "./CheckboxDemo";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router";

const Login = () => {
  const { loginModal, setLoginModal, isLoggedIn, setIsLoggedIn, userLogin } =
    useUser();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [creds, setCreds] = useState({
    email: "",
    password: "",
  });





  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
      password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/,
        "Password must include uppercase, lowercase, number, and special character"
      )
      .required("Password is required"),
    }),
    onSubmit: async(values) => {
      setLoading(true);
      await userLogin(values);
      setIsLoggedIn(true);
      setLoginModal(false);
      setLoading(false);
    },
  });
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md p-6 dark:selection:bg-slate-800 selection:bg-gray-300">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Login</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Login to continue</p>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <label htmlFor="login-email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            name="email"
            id="login-email"
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
          <label htmlFor="login-password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            name="password"
            id="login-password"
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
              setShowPassword={setShowPassword}
              label="Show Password"
              uniqueId="login-check"
            />
          </div>

          <div className="flex flex-wrap justify-end gap-2 mt-4">
            <button
              type="submit"
              className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-md transition disabled:opacity-50 selection:text-black dark:selection:text-white"
              disabled={
                loading || creds.password.length < 8 || creds.email.length < 4
                
              }
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                const testCreds = {
                  email: "test@user.com",
                  password: "Aab@9733",
                };
                setCreds(testCreds);
                formik.setValues(testCreds);
              }}
              className="bg-gray-200 text-black dark:bg-gray-700 dark:text-white px-4 py-2 rounded-md"
            >
              Test User
            </button>
            <Link
            to="/signup"
              onClick={() => {
                setLoginModal(false);
                setIsLoggedIn(false);
                setCreds({
                  email: "",
                  password: "",
                });
                formik.resetForm();
              }}><button
              type="button"
              className="border border-gray-300 dark:border-gray-600 text-black dark:text-white px-4 py-2 rounded-md"
            >
                
              Register
            </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
