import { NavLink } from "react-router-dom";

import dashboardIcon from "../../assets/Icons/dashBoardIcon.svg";
import createTestIcon from "../../assets/Icons/createTest.svg";

const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: dashboardIcon,
  },
  {
    label: "Test Creation",
    path: "/tests/create",
    icon: createTestIcon,
  },
  {
    label: "Test Tracking",
    path: "/test-tracking",
    icon: createTestIcon,
  },
];

function Sidebar() {
  return (
    <aside className="min-h-[calc(100vh-64px)] w-64 border-r border-gray-200 bg-white px-5 py-8">
      <nav className="space-y-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `relative flex items-center gap-4 rounded-xl px-5 py-4 text-base font-medium transition ${
                isActive
                  ? "bg-blue-50 text-blue-600 before:absolute before:left-0 before:top-2 before:h-10 before:w-1 before:rounded-r-full before:bg-blue-600"
                  : "text-gray-500 hover:bg-gray-50"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <img
                  src={item.icon}
                  alt={item.label}
                  className={`h-6 w-6 ${
                    isActive ? "opacity-100" : "opacity-60"
                  }`}
                />

                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;