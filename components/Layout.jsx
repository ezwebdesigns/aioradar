import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-gradient-bg text-text-light">
      {/* 1. La barre latérale fixe */}
      <Sidebar />
      
      {/* 2. Le contenu principal - Décalé par la largeur de la Sidebar */}
      <main className="flex-1 ml-64 p-8 pt-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;