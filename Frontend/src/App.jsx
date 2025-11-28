// src/App.jsx
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/ToastProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";


// Lazy-loaded pages for faster initial load
const Home = lazy(() => import("./pages/Home"));
const Categories = lazy(() => import("./pages/Categories"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Profile = lazy(() => import("./pages/Profile"));
const UploadPodcast = lazy(() => import("./pages/UploadPodcast"));
const PodcastDetails = lazy(() => import("./pages/PodcastDetails"));
const CategoryRequest = lazy(() => import("./pages/CategoryRequest"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        {/* react-hot-toast Toaster: ensures toast() calls render */}
        

        <Router>
          <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Navbar />

            {/* Suspense around routes so lazy pages show fallback while loading */}
            <main className="flex-1">
              <Suspense fallback={<div className="pt-24 text-center p-8">Loading...</div>}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/categories" element={
                    <ProtectedRoute>

                      <Categories />
                    </ProtectedRoute>
                    } />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/upload" element={<ProtectedRoute><UploadPodcast /></ProtectedRoute>} />
                  <Route path="/podcast/:id" element={<PodcastDetails />} />
                  <Route path="/request-category" element={<ProtectedRoute><CategoryRequest /></ProtectedRoute>} />
                  <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
                </Routes>
              </Suspense>
            </main>

            <Footer />
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}
