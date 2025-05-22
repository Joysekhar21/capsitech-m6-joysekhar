import { useEffect, useRef, useState } from "react";
import { useUser } from "../context/UserContextProvider";
import { useNavigate } from "react-router";

const Logout = () => {
  const { fetchUser, isLoggedIn, setLoginModal, setIsLoggedIn, user, setUser } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const getInitials = (name)=>{
    if(!name) return "";

    const words = name.split(" ");
    let initials = "";

    for(let i=0;i<Math.min(words.length,2);i++){
        initials+=words[i][0];
    }
    return initials.toUpperCase();
}


  useEffect(() => {
    

    if (!isLoggedIn) {
      localStorage.removeItem("todo-sortOrder");
    } else {
      fetchUser();
    }
  }, [isLoggedIn]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target )) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem("todo-accessToken");
    localStorage.removeItem("todo-sortOrder");
    setLoginModal(true);
    setIsLoggedIn(false);
    setMenuOpen(false);
    navigate("/")
  };

  return (
    <div className="relative z-10" ref={dropdownRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        title=""
        className="absolute w-12 h-12 lg:top-0 xl:top-0 2xl:top-0 md:top-0 mt-8 right-20 overflow-hidden rounded-full hover:ring-2 dark:hover:ring-white hover:ring-slate-950 text-slate-950 font-medium bg-slate-200 dark:text-slate-200 dark:bg-slate-800"
      >
        {getInitials(user?.username)}
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-32 rounded-md shadow-md bg-white dark:bg-slate-950 ring-1 ring-gray-200 dark:ring-slate-200 p-1">
          
          <button
            onClick={handleLogout}
            className="block w-full px-4 py-1 text-center text-red-400 rounded-md hover:bg-gray-100 hover:dark:bg-slate-800"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Logout;
