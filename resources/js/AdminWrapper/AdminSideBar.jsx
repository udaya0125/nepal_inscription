import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { X, Menu, ListFilter, Building, LayoutDashboard, BookOpen } from "lucide-react";

const AdminSideBar = ({
    isMobileOpen,
    onMobileToggle,
    isCollapsed,
    onToggleCollapse,
}) => {
    const { url } = usePage();
    const currentPath = url.split("/")[1];

    const isActive = (href) => {
        const path = href.replace("/", "");
        return currentPath === path || url.startsWith(href);
    };

    return (
        <>
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onMobileToggle}
                />
            )}

            <div
                className={`
                    fixed left-0 top-0 h-screen border-r z-50 transition-all duration-300
                    ${isCollapsed ? "w-16" : "w-64"}
                    ${
                        isMobileOpen
                            ? "translate-x-0"
                            : "-translate-x-full lg:translate-x-0"
                    }
                `}
                style={{
                    backgroundColor: "#efe2c4",
                    borderColor: "#d4c8a8",
                }}
            >
                {/* Content Container */}
                <div className="relative z-10 h-full">
                    {/* Header */}
                    <div
                        className={`flex items-center justify-between p-4 border-b h-16 ${
                            isCollapsed ? "px-3" : ""
                        }`}
                        style={{ borderColor: "#d4c8a8" }}
                    >
                        {!isCollapsed && (
                            <div className="text-lg font-bold text-[#5d4c2e] whitespace-nowrap">
                                Nepal Inscription
                            </div>
                        )}
                        <div className="flex items-center space-x-1">
                            {/* Collapse Toggle Button - Only show on desktop */}
                            <button
                                onClick={onToggleCollapse}
                                className="hidden lg:flex p-1.5 hover:bg-[#d4c8a8] hover:bg-opacity-30 rounded-lg transition-colors duration-200"
                                title={
                                    isCollapsed
                                        ? "Expand sidebar"
                                        : "Collapse sidebar"
                                }
                            >
                                <Menu className="w-4 h-4 text-[#5d4c2e]" />
                            </button>

                            {/* Mobile Close Button */}
                            <button
                                onClick={onMobileToggle}
                                className="lg:hidden p-1.5 hover:bg-[#d4c8a8] hover:bg-opacity-30 rounded-lg transition-colors duration-200"
                            >
                                <X className="w-4 h-4 text-[#5d4c2e]" />
                            </button>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div
                        className={`p-2 space-y-1 ${
                            isCollapsed ? "px-2" : "px-3"
                        }`}
                    >
                        {/* //-----------------------------------------
                            // Dashboard Link
                            //----------------------------------------- */}
                        <Link
                            href="/dashboard"
                            className={`
                                flex items-center rounded-lg transition-colors duration-200 group relative
                                ${isCollapsed ? "p-3 justify-center" : "p-3"}
                                ${
                                    isActive("/dashboard")
                                        ? "bg-[#d4c8a8] text-[#5d4c2e] font-semibold border-l-4 border-[#8b7b5e]"
                                        : "text-[#8b7b5e] hover:bg-[#d4c8a8] hover:bg-opacity-30 hover:text-[#5d4c2e]"
                                }
                            `}
                            title={isCollapsed ? "Dashboard" : ""}
                        >
                            <LayoutDashboard
                                className={`
                                ${isCollapsed ? "w-5 h-5" : "w-5 h-5"}
                                ${
                                    isActive("/dashboard")
                                        ? "text-[#5d4c2e]"
                                        : "text-[#8b7b5e] group-hover:text-[#5d4c2e]"
                                }
                            `}
                            />
                            {!isCollapsed && (
                                <span className="ml-3 font-medium whitespace-nowrap">
                                    Dashboard
                                </span>
                            )}
                            {isCollapsed && (
                                <div
                                    className="absolute left-full ml-2 px-2 py-1 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
                                    style={{
                                        backgroundColor: "#efe2c4",
                                        border: "1px solid #d4c8a8",
                                        color: "#5d4c2e",
                                    }}
                                >
                                    Dashboard
                                </div>
                            )}
                        </Link>

                        {/* //-----------------------------------------
                            // Inscription Link
                            //----------------------------------------- */}
                        <Link
                            href="/inscriptions"
                            className={`
                                flex items-center rounded-lg transition-colors duration-200 group relative
                                ${isCollapsed ? "p-3 justify-center" : "p-3"}
                                ${
                                    isActive("/inscriptions")
                                        ? "bg-[#d4c8a8] text-[#5d4c2e] font-semibold border-l-4 border-[#8b7b5e]"
                                        : "text-[#8b7b5e] hover:bg-[#d4c8a8] hover:bg-opacity-30 hover:text-[#5d4c2e]"
                                }
                            `}
                            title={isCollapsed ? "Inscriptions" : ""}
                        >
                            <BookOpen
                                className={`
                                ${isCollapsed ? "w-5 h-5" : "w-5 h-5"}
                                ${
                                    isActive("/inscriptions")
                                        ? "text-[#5d4c2e]"
                                        : "text-[#8b7b5e] group-hover:text-[#5d4c2e]"
                                }
                            `}
                            />
                            {!isCollapsed && (
                                <span className="ml-3 font-medium whitespace-nowrap">
                                    Inscriptions
                                </span>
                            )}
                            {isCollapsed && (
                                <div
                                    className="absolute left-full ml-2 px-2 py-1 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
                                    style={{
                                        backgroundColor: "#efe2c4",
                                        border: "1px solid #d4c8a8",
                                        color: "#5d4c2e",
                                    }}
                                >
                                    Inscriptions
                                </div>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminSideBar;