import React from 'react';
import { Menu } from 'lucide-react';
import { Link } from './Link';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Menu className="h-6 w-6 text-gray-500" />
            <Link href="/" className="ml-4 text-xl font-bold text-gray-900">
              Minimal Blog
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};