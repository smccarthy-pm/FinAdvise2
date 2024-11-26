import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';

export function ProfileMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
        <User className="h-5 w-5 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">{user?.name || 'Profile'}</span>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <div className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              )}
            </Menu.Item>
          </div>

          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={cn(
                    'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                    active ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                  )}
                  onClick={() => navigate('/settings')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </button>
              )}
            </Menu.Item>
          </div>

          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={cn(
                    'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                    active ? 'bg-red-50 text-red-600' : 'text-gray-700'
                  )}
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}