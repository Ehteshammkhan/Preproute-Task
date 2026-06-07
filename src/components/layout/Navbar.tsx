import { useAuthStore } from "../../store/auth.store";
import preProuteLogo from "../../assets/Images/preProuteLogo.png";

function Navbar() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <img
        src={preProuteLogo}
        alt="PrepRoute Logo"
        className="h-8 w-auto"
      />

      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold">
          {user?.name?.charAt(0) || "A"}
        </div>

        <div>
          <p className="text-sm font-medium">
            {user?.name || "Admin"}
          </p>

          <p className="text-xs text-gray-500">
            {user?.role || "Admin"}
          </p>
        </div>
      </div>
    </header>
  );
}

export default Navbar;