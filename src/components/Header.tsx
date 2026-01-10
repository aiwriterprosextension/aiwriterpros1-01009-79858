import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);

  const articleTypes = [
    { name: "Amazon Product Reviews", path: "/amazon-product-review-generator", available: true },
    { name: "Product Comparisons", path: "/product-comparison-generator", available: true },
    { name: "Buying Guides", path: "/buying-guide-generator", available: true },
    { name: "How-To Articles", path: "/how-to-article-generator", available: true },
    { name: "Product Roundups", path: "/product-roundup-generator", available: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">AIWriterPros</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            
            {/* Features Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setFeaturesOpen(true)}
              onMouseLeave={() => setFeaturesOpen(false)}
            >
              <button className="flex items-center text-sm font-medium text-foreground hover:text-primary transition-colors">
                Features
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              
              {featuresOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-popover border border-border rounded-lg shadow-xl py-2 z-50">
                  {articleTypes.map((type) => (
                    <Link
                      key={type.path}
                      to={type.path}
                      className="flex items-center justify-between px-4 py-2 hover:bg-muted transition-colors"
                    >
                      <span className="text-sm text-foreground">{type.name}</span>
                      {type.available ? (
                        <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                          Available
                        </span>
                      ) : (
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                          Coming Soon
                        </span>
                      )}
                    </Link>
                  ))}
                  <div className="border-t border-border mt-2 pt-2">
                    <Link to="/" className="block px-4 py-2 text-sm text-primary hover:bg-muted transition-colors">
                      View All Features →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link to="/pricing" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link to="/about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          {/* CTA Button & Theme Toggle */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <Link to="/auth">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started Free
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link
              to="/"
              className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            
            <div className="px-4 py-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Features</p>
              {articleTypes.map((type) => (
                <Link
                  key={type.path}
                  to={type.path}
                  className="flex items-center justify-between py-2 text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{type.name}</span>
                  {type.available ? (
                    <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                      Available
                    </span>
                  ) : (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                      Soon
                    </span>
                  )}
                </Link>
              ))}
            </div>

            <Link
              to="/pricing"
              className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            
            <div className="px-4 pt-4">
              <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-primary text-primary-foreground">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
