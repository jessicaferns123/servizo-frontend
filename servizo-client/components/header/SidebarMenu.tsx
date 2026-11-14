'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { menuItems } from '@/lib/menu';

export default function SidebarMenu({
  role,
  claims,
  onNavigate,
  onLogout,
}: {
  role: string;
  claims: string[];
  onNavigate: (path: string) => void;
  onLogout: () => void;
}) {
  console.log(claims)
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});

  const toggleModule = (title: string) => {
    setOpenModules((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div className="p-2 space-y-3">
      {menuItems.map((item) => {
        if (!claims.includes(item.claim)) return null; // ✅ Skip if main item claim is not allowed

        if (item.type === 'link') {
          return (
            <button
              key={item.label}
              onClick={() => item.path && onNavigate(item.path)}
              className="w-full text-left font-semibold bg-gray-100 px-2 py-2 rounded hover:text-[#F15A29] cursor-pointer"
            >
              {item.label}
            </button>

            // <div
            //   key={item.label}
            //   onClick={() => item.path && onNavigate(item.path)}
            //   className="block text-sm text-gray-700 hover:text-[#F15A29] transition py-3 cursor-pointer"
            // >
            //   {item.label}
            // </div>
          );
        }

        // Filter children based on claim
        const visibleChildren = item.children.filter((child) =>
          claims.includes(child.claim)
        );
        console.log(visibleChildren)
        if (visibleChildren.length === 0) return null; // ✅ Skip module if no visible children

        return (
          <div key={item.title}>
            <button
              onClick={() => toggleModule(item.title)}
              className="w-full flex justify-between items-center font-semibold py-2 px-2 bg-gray-100 rounded"
            >
              {item.title}
              {openModules[item.title] ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            {openModules[item.title] && (
              <div className="ml-4 mt-1 space-y-1">
                {visibleChildren.map((child) => (
                  <div
                    key={child.label}
                    onClick={() => onNavigate(child.path)}
                    className="block text-sm text-gray-700 hover:text-[#F15A29] transition py-3 border-b cursor-pointer"
                  >
                    {child.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
