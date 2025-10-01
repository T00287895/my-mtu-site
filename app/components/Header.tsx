'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { FaBars } from 'react-icons/fa';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userGroup, setUserGroup] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
    const savedGroup = localStorage.getItem('userGroup');
    setUserGroup(savedGroup);

    const handleStorageChange = () => {
      const newSavedGroup = localStorage.getItem('userGroup');
      setUserGroup(newSavedGroup);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isHomePage = pathname === '/';
  const scheduleLink = userGroup ? `/schedule/${userGroup}` : '#';

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold">
          <Link href="/">My MTU</Link>
        </div>

        {/* Hamburger Button */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <FaBars />
          </button>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-4">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          {isClient && (!isHomePage || userGroup) && (
            <Link href={scheduleLink} className="hover:text-gray-300">Schedule</Link>
          )}
        </nav>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="md:hidden mt-4">
          <Link href="/" className="block py-2 px-4 hover:bg-gray-700">Home</Link>
          {isClient && (!isHomePage || userGroup) && (
            <Link href={scheduleLink} className="block py-2 px-4 hover:bg-gray-700">Schedule</Link>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
