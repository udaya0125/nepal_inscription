import React, { useState, useRef, useEffect } from "react";
import { Menu, UserCircle, Settings, LogOut, ChevronDown } from "lucide-react";
import { Link, usePage, router } from "@inertiajs/react";

const AdminNavBar = ({ onMenuToggle }) => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);
    const { auth } = usePage().props;
    const user = auth?.user;

    const toggleUserMenu = () => {
        setIsUserMenuOpen((prev) => !prev);
    };

    const handleLogout = async () => {
        try {
            await axios.post(route("logout"));
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout error:", error);
            window.location.href = "/login";
        }
    };

    // Close menu when clicking outside or pressing Escape key
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target)
            ) {
                setIsUserMenuOpen(false);
            }
        };

        const handleEscapeKey = (event) => {
            if (event.key === "Escape") {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscapeKey);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscapeKey);
        };
    }, []);

    // Close menu when route changes
    useEffect(() => {
        setIsUserMenuOpen(false);
    }, [window.location.pathname]);

    return (
        <nav 
            className="fixed top-0 right-0 w-full lg:w-[98%] h-16 border-b z-30"
            // style={{
            //     backgroundImage: "url('/images/bg.jpeg')",
            //     backgroundSize: "cover",
            //     backgroundPosition: "center",
            //     backgroundRepeat: "no-repeat",
            //     backgroundColor: "#efe2c4", // Fallback color
            // }}
        >
            {/* Background Overlay - Adjusted for better contrast */}
            {/* <div className="absolute inset-0 bg-black/10 bg-opacity-40"></div> */}
            
            <div className="relative z-10 h-full px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-full">
                    {/* Left side - Menu toggle and branding */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={onMenuToggle}
                            className="lg:hidden p-2 rounded-lg hover:bg-[#d4c8a8] hover:bg-opacity-30 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#8b7b5e] focus:ring-opacity-50"
                            aria-label="Toggle menu"
                        >
                            <Menu className="w-5 h-5 text-[#5d4c2e]" />
                        </button>
                    </div>

                    {/* Right side - User menu */}
                    <div className="flex items-center space-x-4">
                        {/* Optional: Add notifications or other icons here */}

                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={toggleUserMenu}
                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#d4c8a8] hover:bg-opacity-30 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#8b7b5e] focus:ring-opacity-50"
                                aria-expanded={isUserMenuOpen}
                                aria-haspopup="true"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-[#d4c8a8]">
                                        {user?.image ? (
                                            <img
                                                src={user.image}
                                                alt={`${
                                                    user?.name || "User"
                                                } profile`}
                                                className="w-full h-full rounded-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display =
                                                        "none";
                                                }}
                                            />
                                        ) : (
                                            <UserCircle className="w-6 h-6 text-[#5d4c2e]" />
                                        )}
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <span className="text-sm font-medium text-[#5d4c2e] block">
                                            {user?.name || "Guest"}
                                        </span>
                                    </div>
                                </div>
                                <ChevronDown
                                    className={`w-4 h-4 text-[#5d4c2e] transition-transform duration-200 ${
                                        isUserMenuOpen ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            {/* User dropdown menu */}
                            {isUserMenuOpen && (
                                <div 
                                    className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border py-2 z-40"
                                    // style={{
                                    //     backgroundImage: "url('/images/bg.jpeg')",
                                    //     backgroundSize: "cover",
                                    //     backgroundPosition: "center",
                                    //     backgroundRepeat: "no-repeat",
                                    //     backgroundColor: "#efe2c4",
                                    //     borderColor: "#d4c8a8",
                                    // }}
                                >
                                    {/* Background Overlay for dropdown */}
                                    {/* <div className="absolute inset-0 bg-black/10 bg-opacity-50 rounded-lg"></div> */}
                                    
                                    <div className="relative z-10">
                                        {/* User info section */}
                                        <div className="px-4 py-3 border-b" style={{ borderColor: "#d4c8a8" }}>
                                            <p className="text-sm font-medium text-[#5d4c2e] truncate">
                                                {user?.name || "Guest"}
                                            </p>
                                            <p className="text-sm text-[#8b7b5e] truncate mt-1">
                                                {user?.email || ""}
                                            </p>
                                        </div>

                                        {/* Logout section */}
                                        <div className="border-t pt-1" style={{ borderColor: "#d4c8a8" }}>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full px-4 py-2 text-sm text-[#a0522d] hover:bg-[#d4c8a8] hover:bg-opacity-30 transition-colors duration-150 focus:outline-none focus:bg-[#d4c8a8] focus:bg-opacity-30"
                                            >
                                                <LogOut className="w-4 h-4 mr-3" />
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavBar;