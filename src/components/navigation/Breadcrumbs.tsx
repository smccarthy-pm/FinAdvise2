import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routes: Record<string, string> = {
  '/': 'Assistant',
  '/dashboard': 'Dashboard',
  '/calendar': 'Calendar',
  '/crm': 'Client Management',
  '/marketplace': 'Marketplace'
};

export function Breadcrumbs() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600">
      <Link 
        to="/" 
        className="flex items-center hover:text-indigo-600"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
        const label = routes[path];
        if (!label) return null;
        
        return (
          <React.Fragment key={path}>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link 
              to={path}
              className="hover:text-indigo-600"
            >
              {label}
            </Link>
          </React.Fragment>
        );
      })}
    </nav>
  );
}