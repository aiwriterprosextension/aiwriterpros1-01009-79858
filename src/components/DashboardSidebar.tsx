import { Link, useLocation } from "react-router-dom";
import { Home, Plus, FileText, BarChart3, Settings, Sparkles, ChevronDown, ArrowUpCircle, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const DashboardSidebar = () => {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();

  const isActive = (path: string) => location.pathname === path;

  const articleTypes = [
    { name: "Amazon Product Review", path: "/dashboard/create/amazon-review", enabled: true },
    { name: "Product Comparison", path: "/dashboard/create/product-comparison", enabled: true },
    { name: "Buying Guide", path: "/dashboard/create/buying-guide", enabled: true },
    { name: "How-To Article", path: "/dashboard/create/how-to-article", enabled: true },
    { name: "Product Roundup", path: "/dashboard/create/product-roundup", enabled: true },
  ];

  const handleNavClick = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 md:p-6 border-b border-sidebar-border flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2" onClick={handleNavClick}>
          <Sparkles className="h-6 w-6 md:h-7 md:w-7 text-primary" />
          <span className="text-base md:text-lg font-bold">AIWriterPros</span>
        </Link>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* User Profile */}
      <div className="p-4 md:p-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 md:w-10 md:h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-primary font-semibold text-sm md:text-base">G</span>
          </div>
          <div>
            <p className="font-semibold text-sm">Guest User</p>
            <p className="text-xs text-muted-foreground">Free Plan</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 md:p-4 space-y-1 md:space-y-2 overflow-y-auto">
        <Link
          to="/dashboard"
          onClick={handleNavClick}
          className={`flex items-center space-x-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg transition-colors ${
            isActive("/dashboard")
              ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
              : "text-sidebar-foreground hover:bg-sidebar-accent"
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-sm md:text-base">Dashboard</span>
        </Link>

        {/* Create New Article Dropdown */}
        <div>
          <button
            onClick={() => setCreateMenuOpen(!createMenuOpen)}
            className="w-full flex items-center justify-between px-3 md:px-4 py-2.5 md:py-3 rounded-lg transition-colors text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <div className="flex items-center space-x-3">
              <Plus className="h-5 w-5" />
              <span className="text-sm md:text-base">Create New Article</span>
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${createMenuOpen ? "rotate-180" : ""}`} />
          </button>

          {createMenuOpen && (
            <div className="mt-1 md:mt-2 ml-3 md:ml-4 space-y-0.5 md:space-y-1">
              {articleTypes.map((type) => (
                <Link
                  key={type.name}
                  to={type.path}
                  onClick={handleNavClick}
                  className={`block px-3 md:px-4 py-2 text-xs md:text-sm rounded-lg transition-colors ${
                    type.enabled
                      ? "text-sidebar-foreground hover:bg-sidebar-accent"
                      : "text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{type.name}</span>
                    {!type.enabled && (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded">Soon</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link
          to="/dashboard/articles"
          onClick={handleNavClick}
          className={`flex items-center space-x-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg transition-colors ${
            isActive("/dashboard/articles")
              ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
              : "text-sidebar-foreground hover:bg-sidebar-accent"
          }`}
        >
          <FileText className="h-5 w-5" />
          <span className="text-sm md:text-base">My Articles</span>
        </Link>

        <Link
          to="/dashboard/analytics"
          onClick={handleNavClick}
          className={`flex items-center space-x-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg transition-colors ${
            isActive("/dashboard/analytics")
              ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
              : "text-sidebar-foreground hover:bg-sidebar-accent"
          }`}
        >
          <BarChart3 className="h-5 w-5" />
          <span className="text-sm md:text-base">Analytics</span>
        </Link>

        <Link
          to="/dashboard/settings"
          onClick={handleNavClick}
          className={`flex items-center space-x-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg transition-colors ${
            isActive("/dashboard/settings")
              ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
              : "text-sidebar-foreground hover:bg-sidebar-accent"
          }`}
        >
          <Settings className="h-5 w-5" />
          <span className="text-sm md:text-base">Settings</span>
        </Link>

        <button
          onClick={() => {
            handleNavClick();
            signOut();
          }}
          className="flex items-center space-x-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg transition-colors text-sidebar-foreground hover:bg-sidebar-accent w-full"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm md:text-base">Logout</span>
        </button>
      </nav>

      {/* Upgrade CTA */}
      <div className="p-3 md:p-4 border-t border-sidebar-border">
        <div className="card-elevated p-3 md:p-4 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <div className="flex items-start space-x-2 mb-2">
            <ArrowUpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-xs md:text-sm mb-1">Upgrade to Pro</p>
              <p className="text-xs text-muted-foreground mb-2 md:mb-3">
                Get 50 articles/month and priority support
              </p>
              <Link to="/pricing" onClick={handleNavClick}>
                <Button size="sm" className="w-full bg-primary text-primary-foreground text-xs">
                  Upgrade Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile: Show hamburger menu that opens sheet
  if (isMobile) {
    return (
      <>
        {/* Mobile Header with Menu Button */}
        <div className="fixed top-0 left-0 right-0 z-40 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-base font-bold">AIWriterPros</span>
          </Link>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[280px]">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>
        {/* Spacer to account for fixed header */}
        <div className="h-14" />
      </>
    );
  }

  // Desktop/Tablet: Show regular sidebar
  return (
    <aside className="w-56 lg:w-64 bg-sidebar border-r border-sidebar-border h-screen sticky top-0 flex flex-col flex-shrink-0">
      <SidebarContent />
    </aside>
  );
};

export default DashboardSidebar;
