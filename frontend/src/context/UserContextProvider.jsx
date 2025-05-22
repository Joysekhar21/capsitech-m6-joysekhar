import toast from "react-hot-toast";
import React, { useContext, useState } from 'react'
import { UserContext } from "./UserContext";
import { useTodo } from "./TodoContextProvider";

import { BASE_URL } from "../utils/constant";
import { useNavigate } from "react-router";


const UserContextProvider = (props) => {
    const navigate = useNavigate()
    const {fetchTodos} = useTodo();
    const [user,setUser] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [isLoggedIn,setIsLoggedIn] = useState(true);
    const [loginModal,setLoginModal] = useState(false);
    const [loading,setLoading] = useState(true);

    const fetchUser = async () => {
        if (!localStorage.getItem("todo-accessToken")) {
          return console.log("Token not found");
        }
        setLoading(true);
        await fetch(`${BASE_URL}/api/auth/me`, {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("todo-accessToken")}`,
          },
        })
          .then((parsed) => parsed.json())
          .then((res) => {
            if (res.success) {
              setUser(res.user);
            }
            if (!res.success) {
              toast.error(res.message);
            }
          })
          .catch((err) => {
            toast.error("Something went wrong!");
            console.log(err);
          });
        setLoading(false);
      };

    //   const updateDetails = ({ name, email, password }) => {
    //     if (!localStorage.getItem("todo-accessToken")) {
    //       return console.log("Token not found");
    //     }
        
    //     if (!name || !email || !password)
    //       return console.log("All fields are required");
    //     fetch(`${BASE_URL}/api/v1/user/updateDetails`, {
    //       method: "put",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${localStorage.getItem("todo-accessToken")}`,
    //       },
    //       body: JSON.stringify({ name, email, password }),
    //     })
    //       .then((parsed) => parsed.json())
    //       .then((res) => {
    //         if (res.success) {
    //           setUser(res.user);
    //           toast.success("User details updated");
    //           localStorage.setItem("todo-accessToken", res.token);
    //         }
    //         if (!res.success) {
    //           toast.error(res.message);
    //         }
    //       })
    //       .catch((err) => {
    //         toast.error("Something went wrong!");
    //         console.log(err);
    //       });
    //   };

    //   const updatePassword = async (oldPassword, newPassword) => {
    //     if (!localStorage.getItem("todo-accessToken")) {
    //       return console.log("Token not found");
    //     }
    //     if (!oldPassword.trim() || !newPassword.trim())
    //       return console.log("All fields are required");
    //     await fetch(`${BASE_URL}/api/v1/user/changePassword`, {
    //       method: "PATCH",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${localStorage.getItem("todo-accessToken")}`,
    //       },
    //       body: JSON.stringify({ oldPassword, newPassword }),
    //     })
    //       .then((parsed) => parsed.json())
    //       .then((res) => {
    //         console.log(res)
    //         if (res.success) {
    //           setUser(res.user);
    //           toast.success("User Password updated");
    //         }
    //         if (!res.success) {
    //           toast.error(res.message);
    //         }
    //       })
    //       .catch((err) => {
    //         toast.error("Something went wrong!");
    //         console.log(err);
    //       });
    //   };


    //   const updateAvatar = async (file) => {
    //     if (!localStorage.getItem("todo-accessToken")) {
    //       return console.log("Token not found");
    //     }
    //     if (!file) return console.log("Please provide a file");
      
    //     const toastLoading = toast.loading("Uploading avatar...");
      
    //     const formData = new FormData();
    //     formData.append("image", file); 
      
    //     try {
    //       const response = await fetch(`${BASE_URL}/api/v1/user/updateImage`, {
    //         method: "PUT",
    //         headers: {
    //           Authorization: `Bearer ${localStorage.getItem("todo-accessToken")}`,
    //         },
    //         body: formData,
    //       });
      
    //       const res = await response.json();
      
    //       if (response.ok) {
    //         setUser((prev) => ({ ...prev, avatar: res.avatar }));
    //         toast.success("Avatar updated successfully", {
    //           id: toastLoading,
    //         });
    //       } else {
    //         toast.error(res.message || "Failed to update avatar", {
    //           id: toastLoading,
    //         });
    //       }
    //     } catch (err) {
    //       console.error(err);
    //       toast.error("Something went wrong!", {
    //         id: toastLoading,
    //       });
    //     }
    //   };
      
    const userLogin = ({email,password})=>{

        if (!email || !password) return console.log("All fields are required");
          fetch(`${BASE_URL}/api/auth/login`, {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          })
            .then((parsed) => parsed.json())
            .then((res) => {
                console.log(res)
              if (res.success) {
                setUser(res.user);
                localStorage.setItem("todo-accessToken", res.token);
                console.log(res.token)
                navigate("/home")
                fetchTodos();
                toast.success("Logged in successfully");
              }
              if (!res.success) {
                toast.error(res.message);
              }
            })
            .catch((err) => {
              console.log(err);
              toast.error("Something went wrong!");
            });
    }

    const userRegister = ({username,email,password})=>{
        if (!localStorage.getItem("todo-accessToken"))
            localStorage.removeItem("todo-accessToken");

        if (!username || !email || !password)
            return console.log("All fields are required");

        fetch(`${BASE_URL}/api/auth/register`,{
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email,username,password})
        })
        .then((parsed)=>parsed.json())
        .then((res)=>{
            console.log(res)
            if(res.success){
                setUser(res.user);
                localStorage.setItem("todo-accessToken",res.token)
                console.log("Saved token:", localStorage.getItem("todo-accessToken"));
                console.log(res.token);
                navigate("/")
                fetchTodos()
                toast.success("User Register Successfully");
            }
            if(!res.success){
                toast.error(res.message);
            }
        })
        .catch((err)=>{
            console.log(err);
            toast.error("Something Went Wrong!")
        })
    }

// const removeAvatar = ()=>{
//     const token = localStorage.getItem("todo-accessToken");
//     if (!token) return console.log("No token found");
  
//     const toastLoading = toast.loading("Deleting avatar...");
  
//     fetch(`${BASE_URL}/api/v1/user/deleteImage`, {
//       method: "DELETE",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then((res) => res.json())
//       .then((res) => {
//         if (res.success) {
//           setUser(res);
//           toast.success("Avatar deleted successfully", {
//             id: toastLoading,
//           });
//           setUser({ ...user, avatar: res.avatar });
//         } else {
//           toast.error(res?.message || "Something went wrong", {
//             id: toastLoading,
//           });
//         }
//       })
//       .catch((err) => {
//         console.error(err);
//         toast.error("Something went wrong", {
//           id: toastLoading,
//         });
//       });
// }



  return (
    <UserContext.Provider
    value={{
        isLoggedIn,
        user,
        loginModal,
        loading,
        setLoading,
        setLoginModal,
        setIsLoggedIn,
        setUser,
        fetchUser,
        userLogin,
        userRegister,
    }}
    >
        {props.children}
    </UserContext.Provider>
  )
}

export default UserContextProvider;

export const useUser = ()=>{
    return useContext(UserContext)
}
