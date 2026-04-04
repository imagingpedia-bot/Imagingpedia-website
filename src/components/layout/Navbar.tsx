import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isAuthenticated, getCurrentUser, logout } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";
import Logo from "@/assets/Untitled (5).png";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Image Guided Procedures", path: "/courses" },
  { name: "Question Banks", path: "/practice-test" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
  { name: "Exam Tracks", path: "/start-test" },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [authed, setAuthed] = useState<boolean>(isAuthenticated());
  const [displayName, setDisplayName] = useState<string>(getCurrentUser()?.name || "");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    // Update auth state on navigation or storage changes
    const update = () => {
      const auth = isAuthenticated();
      setAuthed(auth);
      setDisplayName(getCurrentUser()?.name || "");
    };
    update();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "imagingpedia_current_user_email" || e.key === "imagingpedia_users") {
        update();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = () => {
    logout();
    setAuthed(false);
    setDisplayName("");
    toast({ title: "Logged out", description: "You have been signed out." });
    navigate("/", { replace: true });
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-slate-950/55 backdrop-blur-md py-4"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 md:gap-3">
          <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
            <img 
              src={Logo} 
              alt="logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-display text-3xl font-semibold text-foreground" style={{ fontFamily: 'Codec Pro, sans-serif', fontWeight: 600 }}>
            Imaging<span className="gradient-text">pedia</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center rounded-full border border-cyan-200/15 bg-slate-900/35 backdrop-blur-xl p-1 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_12px_40px_rgba(0,0,0,0.25)]">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "rounded-full px-7 py-2 text-base font-semibold transition-all duration-200",
                location.pathname === link.path
                  ? "bg-[#23d3c8] text-slate-950 shadow-[0_8px_22px_rgba(35,211,200,0.42)]"
                  : "text-slate-200/85 hover:text-white"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {/* {authed ? (
            <>
              <span className="text-sm text-muted-foreground">Hello, {displayName.split(" ")[0]}</span>
              <Button variant="outline" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="ghost" onClick={handleLogout}>Log Out</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Log In</Link>
              </Button>
              <Button variant="hero" asChild>
                <Link to="/signup">Start Learning</Link>
              </Button>
            </>
          )} */}
          <Button variant="ghost" size="sm" asChild className="rounded-full bg-[#23d3c8] hover:bg-[#2e6e87] text-slate-950  text-xs px-4">
            <Link to="/admin/login">Admin</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-950/85 backdrop-blur-xl border-t border-cyan-100/10"
          >
            <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "text-base font-semibold py-2 transition-colors",
                    location.pathname === link.path
                      ? "text-[#23d3c8]"
                      : "text-slate-200/85"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-border/50">
                {/* {authed ? (
                  <>
                    <Button variant="outline" asChild className="w-full">
                      <Link to="/dashboard">Dashboard</Link>
                    </Button>
                    <Button variant="secondary" className="w-full" onClick={handleLogout}>
                      Log Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" asChild className="w-full">
                      <Link to="/login">Log In</Link>
                    </Button>
                    <Button variant="hero" asChild className="w-full">
                      <Link to="/signup">Start Learning</Link>
                    </Button>
                  </>
                )} */}
                <Button variant="ghost" asChild className="w-full text-xs rounded-full bg-[#23d3c8] hover:bg-[#37dfd4] text-slate-950 shadow-[0_8px_22px_rgba(35,211,200,0.42)]">
                  <Link to="/admin/login">Admin Login</Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
