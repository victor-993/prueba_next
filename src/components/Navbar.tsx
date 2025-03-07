"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); 

  return (
    <>
      <header className="bg-white py-2 flex flex-col items-center shadow-md">
        <h1 className="mx-auto flex items-center">
          <a href="/">
            <img 
              alt="logo" 
              src="https://colombia.aclimate.org/Environment/Colombia/logo.png" 
              className="text-center" 
            />
          </a>
        </h1>
      </header>

      <nav className="bg-green-500 p-4">
        <div className="container mx-auto flex justify-between items-center">

          <Link href="/" className="text-white text-xl font-bold">
            AClimate
          </Link>

          <button 
            className="md:hidden p-2 rounded focus:outline-none" 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={30} className="text-white" /> : <Menu size={30} className="text-white" />}
          </button>

          <ul className="hidden md:flex space-x-6">
            <li><Link href="/weather" className="text-white hover:underline">Weather</Link></li>
            <li><Link href="/crop" className="text-white hover:underline">Crops</Link></li>
            <li><Link href="/reports" className="text-white hover:underline">Reports</Link></li>
            <li><Link href="/about" className="text-white hover:underline">About</Link></li>
          </ul>
        </div>

        {isOpen && (
          <ul className="md:hidden bg-green-600 text-white p-4 space-y-3">
            <li><Link href="/weather" onClick={() => setIsOpen(false)}>Weather</Link></li>
            <li><Link href="/crop" onClick={() => setIsOpen(false)}>Crops</Link></li>
            <li><Link href="/reports" onClick={() => setIsOpen(false)}>Reports</Link></li>
            <li><Link href="/about" onClick={() => setIsOpen(false)}>About</Link></li>
          </ul>
        )}
      </nav>
    </>
  );
};

export default Navbar;