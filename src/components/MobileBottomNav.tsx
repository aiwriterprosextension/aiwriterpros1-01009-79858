import { Link, useLocation } from "react-router-dom";
import { Home, FileText, PlusCircle, BarChart3, Settings } from "lucide-react";

const navItems = [
  { path: "/dashboard", icon: Home, label: "Home" },
  { path: "/dashboard/articles", icon: FileText, label: "Articles" },
  { path: "/dashboard/create/amazon-review", icon: PlusCircle, label: "Create" },
  { path: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  { path: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function MobileBottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full px-1 transition-colors ${
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`h-5 w-5 ${item.path.includes("create") ? "h-6 w-6" : ""}`} />
              <span className="text-[10px] mt-1 font-medium truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileBottomNav;
