import React from "react";
import { FaUsers, FaLightbulb, FaMicrophone, FaRocket } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      
      {/* Hero Section */}
      <div className="pt-32 pb-20 px-6 text-center bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Empowering Researchers
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Your Friendly Researchers is a community-driven platform where curiosity meets clarity. 
            We bridge the gap between complex academic concepts and real-world understanding.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">Our Mission</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              We believe that research shouldn't be locked behind ivory towers. Our mission is to democratize knowledge 
              by creating a space where students, early-career researchers, and curious minds can share their insights 
              without the jargon.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Whether you're discussing the latest tech trends, exploring historical events, or debating scientific theories, 
              YFR is your stage.
            </p>
          </div>
          <div className="bg-indigo-100 dark:bg-indigo-900/30 p-8 rounded-2xl flex items-center justify-center">
             <FaRocket className="text-9xl text-indigo-500 opacity-80" />
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-20 px-6 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Why Join YFR?</h2>
          <div className="grid md:grid-cols-3 gap-10">
            
            <div className="text-center space-y-4 p-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto text-2xl">
                <FaUsers />
              </div>
              <h3 className="text-xl font-bold">Community Driven</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Built by researchers, for researchers. Connect with peers who share your passion for discovery.
              </p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto text-2xl">
                <FaLightbulb />
              </div>
              <h3 className="text-xl font-bold">Research Backed</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We value accuracy and depth. Dive deep into topics with content that goes beyond the surface.
              </p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mx-auto text-2xl">
                <FaMicrophone />
              </div>
              <h3 className="text-xl font-bold">Candid Discussions</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Real conversations about the challenges and triumphs of the research journey.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl font-bold">Ready to share your voice?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Join thousands of listeners and creators on Your Friendly Researchers today.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/" className="px-8 py-3 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition-transform hover:scale-105">
              Get Started
            </Link>
            <Link to="/categories" className="px-8 py-3 border border-gray-300 dark:border-gray-600 rounded-full font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-transform hover:scale-105">
              Explore Content
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}
