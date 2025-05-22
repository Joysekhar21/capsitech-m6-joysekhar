import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SignUp from './components/SignUp'
import Login from './components/Login'

import { ThemeProvider } from './components/ThemeProvider'
import { Toaster } from 'react-hot-toast'
import { Navigate, Route, Routes } from 'react-router'
import HomePage from './components/HomePage'
// import ProfilePage from './components/ProfilePage'

const ProtectedRoute = ({ children }) => {
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem('todo-accessToken') !== null; // Or however you track authentication
  
  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  
  
  return (
    <ThemeProvider storageKey="todo-app-theme">
      <Toaster position='bottom-center'/>
      <Routes>
        <Route
        element={
          <Login/>
        }
        path="/"
        />
      <Route path='/home' exact element={
        <ProtectedRoute>
          <HomePage/>
        </ProtectedRoute>
        }/>
      {/* <Route path='/profile' exact element={
        <ProtectedRoute>
          <ProfilePage/>
        </ProtectedRoute>
        }/> */}
        <Route
        element={
          <SignUp/>
        }
        path='/signup'
        />
        <Route
        element={
          <Login/>
        }
        path="/login"
        />
      </Routes>
    </ThemeProvider>
  )
}

export default App
