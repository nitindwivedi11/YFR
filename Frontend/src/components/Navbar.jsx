import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DarkToggle from "./DarkToggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  console.log("Navbar: Current user:", user);
  const nav = useNavigate();

  const handleLogout = () => { logout(); nav("/"); };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow fixed w-full z-50 top-0 left-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="YFR" className="h-10 w-auto mr-3" />
            <span className="font-bold text-lg text-indigo-600 dark:text-indigo-400">Your Friendly Researchers</span>
          </Link>

          <div className="hidden md:flex gap-6 items-center">
            <Link to="/" className="hover:text-indigo-600">Home</Link>
           {  user && <Link to="/categories" className="hover:text-indigo-600">Categories</Link>}
            <Link to="/about" className="hover:text-indigo-600">About</Link>
            <Link to="/contact" className="hover:text-indigo-600">Contact</Link>
            <DarkToggle />
            {user ? (
              <>
                <Link to="/upload" className="hover:text-indigo-600">Upload</Link>
                <Link to="/request-category" className="hover:text-indigo-600">Request Category</Link>
                <Link to="/profile" className="px-3 py-1 border rounded-md text-sm">{user.name}</Link>
                {user.role === "admin" && <Link to="/admin" className="px-3 py-1 bg-indigo-600 text-white rounded-md">Admin</Link>}
                <button onClick={handleLogout} className="px-3 py-1 border rounded-md text-sm">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-1 border rounded-md text-sm">Login</Link>
                <Link to="/signup" className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm">Signup</Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <DarkToggle />
            <button onClick={() => setIsOpen(!isOpen)} className="text-2xl text-indigo-600">{isOpen ? "✖" : "☰"}</button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 shadow px-4 py-4 flex flex-col space-y-3">
          <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/categories" onClick={() => setIsOpen(false)}>Categories</Link>
          <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
          {user ? (
            <>
              <Link to="/upload" onClick={() => setIsOpen(false)}>Upload Podcast</Link>
              <Link to="/request-category" onClick={() => setIsOpen(false)}>Request Category</Link>
              <Link to="/ " onClick={() => setIsOpen(false)} className="font-semibold">{user.name}</Link>
              {user.role === "admin" && <Link to="/admin" onClick={() => setIsOpen(false)} className="text-indigo-600">Admin Dashboard</Link>}
              <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-left text-red-500">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
              <Link to="/signup" onClick={() => setIsOpen(false)} className="text-indigo-600 font-semibold">Signup</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
