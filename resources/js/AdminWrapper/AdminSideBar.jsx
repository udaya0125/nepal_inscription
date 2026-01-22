// import React from "react";
// import { Link, usePage } from "@inertiajs/react";
// import { X, Menu, ListFilter, Building, LayoutDashboard, BookOpen } from "lucide-react";

// const AdminSideBar = ({
//     isMobileOpen,
//     onMobileToggle,
//     isCollapsed,
//     onToggleCollapse,
// }) => {
//     const { url } = usePage();
//     const currentPath = url.split("/")[1];

//     const isActive = (href) => {
//         const path = href.replace("/", "");
//         return currentPath === path || url.startsWith(href);
//     };

//     return (
//         <>
//             {isMobileOpen && (
//                 <div
//                     className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//                     onClick={onMobileToggle}
//                 />
//             )}

//             <div
//                 className={`
//                     fixed left-0 top-0 h-screen border-r z-50 transition-all duration-300
//                     ${isCollapsed ? "w-16" : "w-64"}
//                     ${
//                         isMobileOpen
//                             ? "translate-x-0"
//                             : "-translate-x-full lg:translate-x-0"
//                     }
//                 `}
//                 style={{
//                     backgroundColor: "#ffffff",
//                     borderColor: "#e5e7eb",
//                 }}
//             >
//                 {/* Content Container */}
//                 <div className="relative z-10 h-full">
//                     {/* Header */}
//                     <div
//                         className={`flex items-center justify-between p-4 border-b h-16 ${
//                             isCollapsed ? "px-3" : ""
//                         }`}
//                         style={{ borderColor: "#e5e7eb" }}
//                     >
//                         {!isCollapsed && (
//                             <div className="text-xl font-bold text-gray-800 whitespace-nowrap">
//                                 Nepal Inscription
//                             </div>
//                         )}
//                         <div className="flex items-center space-x-1">
//                             {/* Collapse Toggle Button - Only show on desktop */}
//                             <button
//                                 onClick={onToggleCollapse}
//                                 className="hidden lg:flex p-1.5 hover:bg-blue-50 rounded-lg transition-colors duration-200"
//                                 title={
//                                     isCollapsed
//                                         ? "Expand sidebar"
//                                         : "Collapse sidebar"
//                                 }
//                             >
//                                 <Menu className="w-4 h-4 text-gray-600" />
//                             </button>

//                             {/* Mobile Close Button */}
//                             <button
//                                 onClick={onMobileToggle}
//                                 className="lg:hidden p-1.5 hover:bg-blue-50 rounded-lg transition-colors duration-200"
//                             >
//                                 <X className="w-4 h-4 text-gray-600" />
//                             </button>
//                         </div>
//                     </div>

//                     {/* Menu Items */}
//                     <div
//                         className={`p-2 space-y-1 ${
//                             isCollapsed ? "px-2" : "px-3"
//                         }`}
//                     >
//                         {/* //-----------------------------------------
//                             // Dashboard Link
//                             //----------------------------------------- */}
//                         <Link
//                             href="/dashboard"
//                             className={`
//                                 flex items-center rounded-lg transition-colors duration-200 group relative
//                                 ${isCollapsed ? "p-3 justify-center" : "p-3"}
//                                 ${
//                                     isActive("/dashboard")
//                                         ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600"
//                                         : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
//                                 }
//                             `}
//                             title={isCollapsed ? "Dashboard" : ""}
//                         >
//                             <LayoutDashboard
//                                 className={`
//                                 ${isCollapsed ? "w-5 h-5" : "w-5 h-5"}
//                                 ${
//                                     isActive("/dashboard")
//                                         ? "text-blue-600"
//                                         : "text-gray-500 group-hover:text-blue-600"
//                                 }
//                             `}
//                             />
//                             {!isCollapsed && (
//                                 <span className="ml-3 font-medium whitespace-nowrap">
//                                     Dashboard
//                                 </span>
//                             )}
//                             {isCollapsed && (
//                                 <div
//                                     className="absolute left-full ml-2 px-2 py-1 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
//                                     style={{
//                                         backgroundColor: "#ffffff",
//                                         border: "1px solid #e5e7eb",
//                                         color: "#374151",
//                                         boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
//                                     }}
//                                 >
//                                     Dashboard
//                                 </div>
//                             )}
//                         </Link>

//                         {/* //-----------------------------------------
//                             // Inscription Link
//                             //----------------------------------------- */}
//                         <Link
//                             href="/inscriptions"
//                             className={`
//                                 flex items-center rounded-lg transition-colors duration-200 group relative
//                                 ${isCollapsed ? "p-3 justify-center" : "p-3"}
//                                 ${
//                                     isActive("/inscriptions")
//                                         ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600"
//                                         : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
//                                 }
//                             `}
//                             title={isCollapsed ? "Inscriptions" : ""}
//                         >
//                             <BookOpen
//                                 className={`
//                                 ${isCollapsed ? "w-5 h-5" : "w-5 h-5"}
//                                 ${
//                                     isActive("/inscriptions")
//                                         ? "text-blue-600"
//                                         : "text-gray-500 group-hover:text-blue-600"
//                                 }
//                             `}
//                             />
//                             {!isCollapsed && (
//                                 <span className="ml-3 font-medium whitespace-nowrap">
//                                     Inscriptions
//                                 </span>
//                             )}
//                             {isCollapsed && (
//                                 <div
//                                     className="absolute left-full ml-2 px-2 py-1 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
//                                     style={{
//                                         backgroundColor: "#ffffff",
//                                         border: "1px solid #e5e7eb",
//                                         color: "#374151",
//                                         boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
//                                     }}
//                                 >
//                                     Inscriptions
//                                 </div>
//                             )}
//                         </Link>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default AdminSideBar;

import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    X,
    Menu,
    FileText,
    LayoutDashboard,
    BookOpen,
    ChevronDown,
    ChevronRight,
    Users,
    Images,
    Calendar,
    Handshake,
} from "lucide-react";

const AdminSideBar = ({
    isMobileOpen,
    onMobileToggle,
    isCollapsed,
    onToggleCollapse,
}) => {
    const { url } = usePage();
    // const currentPath = url.split("/")[1];
     const currentPath = url.split("/")[1];
    const [openDropdown, setOpenDropdown] = useState(null);

    //   const isActive = (href) => {
    //     const path = href.replace("/", "");
    //     return currentPath === path || url.startsWith(href);
    //   };

    const isActive = (href) => {
        const path = href.replace("/", "");
        return currentPath === path;
    };

    const toggleDropdown = (dropdownName) => {
        if (openDropdown === dropdownName) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(dropdownName);
        }
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
                    backgroundColor: "#ffffff",
                    borderColor: "#e5e7eb",
                }}
            >
                {/* Content Container */}
                <div className="relative z-10 h-full">
                    {/* Header */}
                    <div
                        className={`flex items-center justify-between p-4 border-b h-16 ${
                            isCollapsed ? "px-3" : ""
                        }`}
                        style={{ borderColor: "#e5e7eb" }}
                    >
                        {!isCollapsed && (
                            <div className="text-xl font-bold text-gray-800 whitespace-nowrap">
                                Nepal Inscription
                            </div>
                        )}
                        <div className="flex items-center space-x-1">
                            {/* Collapse Toggle Button - Only show on desktop */}
                            <button
                                onClick={onToggleCollapse}
                                className="hidden lg:flex p-1.5 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                title={
                                    isCollapsed
                                        ? "Expand sidebar"
                                        : "Collapse sidebar"
                                }
                            >
                                <Menu className="w-4 h-4 text-gray-600" />
                            </button>

                            {/* Mobile Close Button */}
                            <button
                                onClick={onMobileToggle}
                                className="lg:hidden p-1.5 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            >
                                <X className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div
                        className={`p-2 space-y-1 overflow-y-auto h-[calc(100vh-4rem)] ${
                            isCollapsed ? "px-2" : "px-3"
                        }`}
                    >
                        {/* Dashboard Link */}
                        <Link
                            href="/"
                            className={`
                flex items-center rounded-lg transition-colors duration-200 group relative
                ${isCollapsed ? "p-3 justify-center" : "p-3"}
                ${
                    isActive("/")
                        ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600"
                        : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                }
              `}
                            title={isCollapsed ? "Dashboard" : ""}
                        >
                            <LayoutDashboard
                                className={`
                  ${isCollapsed ? "w-5 h-5" : "w-5 h-5"}
                  ${
                      isActive("/")
                          ? "text-blue-600"
                          : "text-gray-500 group-hover:text-blue-600"
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
                                        backgroundColor: "#ffffff",
                                        border: "1px solid #e5e7eb",
                                        color: "#374151",
                                        boxShadow:
                                            "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                    }}
                                >
                                    Dashboard
                                </div>
                            )}
                        </Link>

                        {/* Inscriptions Link */}
                        <Link
                            href="/inscriptions"
                            className={`
                flex items-center rounded-lg transition-colors duration-200 group relative
                ${isCollapsed ? "p-3 justify-center" : "p-3"}
                ${
                    isActive("/inscriptions")
                        ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600"
                        : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                }
              `}
                            title={isCollapsed ? "Inscriptions" : ""}
                        >
                            <BookOpen
                                className={`
                  ${isCollapsed ? "w-5 h-5" : "w-5 h-5"}
                  ${
                      isActive("/inscriptions")
                          ? "text-blue-600"
                          : "text-gray-500 group-hover:text-blue-600"
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
                                        backgroundColor: "#ffffff",
                                        border: "1px solid #e5e7eb",
                                        color: "#374151",
                                        boxShadow:
                                            "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                    }}
                                >
                                    Inscriptions
                                </div>
                            )}
                        </Link>

                        {/* Page Dropdown */}
                        <div className="space-y-1">
              <button
                onClick={() => !isCollapsed && toggleDropdown('page')}
                className={`
                  w-full flex items-center rounded-lg transition-colors duration-200 group relative
                  ${isCollapsed ? "p-3 justify-center" : "p-3 justify-between"}
                  ${
                    isActive("/our-teams") || 
                    isActive("/gallery") ||
                    isActive("/events") ||
                    isActive("/partners")
                      ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                  }
                `}
                title={isCollapsed ? "Page" : ""}
              >
                <div className="flex items-center">
                  <FileText
                    className={`
                      ${isCollapsed ? "w-5 h-5" : "w-5 h-5"}
                      ${
                        isActive("/our-teams") || 
                        isActive("/gallery") ||
                        isActive("/events") ||
                        isActive("/partners")
                          ? "text-blue-600"
                          : "text-gray-500 group-hover:text-blue-600"
                      }
                    `}
                  />
                  {!isCollapsed && (
                    <span className="ml-3 font-medium whitespace-nowrap">
                      Page
                    </span>
                  )}
                </div>
                
                {!isCollapsed && (
                  <ChevronDown
                    className={`
                      w-4 h-4 transition-transform duration-200
                      ${openDropdown === 'page' ? 'rotate-180' : ''}
                      ${
                        isActive("/our-teams") || 
                        isActive("/gallery") ||
                        isActive("/events") ||
                        isActive("/partners")
                          ? "text-blue-600"
                          : "text-gray-400"
                      }
                    `}
                  />
                )}

                {isCollapsed && (
                  <div
                    className="absolute left-full ml-2 px-2 py-1 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
                    style={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      color: "#374151",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    Page
                  </div>
                )}
              </button>

              
              {!isCollapsed && openDropdown === 'page' && (
                <div className="ml-4 space-y-1 pl-4 border-l border-gray-200">
                 
                  <Link
                    href="/our-teams"
                    className={`
                      flex items-center p-2 rounded-lg transition-colors duration-200
                      ${
                        isActive("/our-teams")
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                      }
                    `}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    <span className="text-sm whitespace-nowrap">
                      Our Teams
                    </span>
                  </Link>

                  
                  <Link
                    href="/gallery"
                    className={`
                      flex items-center p-2 rounded-lg transition-colors duration-200
                      ${
                        isActive("/gallery")
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                      }
                    `}
                  >
                    <Images className="w-4 h-4 mr-2" />
                    <span className="text-sm whitespace-nowrap">
                      Gallery
                    </span>
                  </Link>

                  
                  <Link
                    href="/events"
                    className={`
                      flex items-center p-2 rounded-lg transition-colors duration-200
                      ${
                        isActive("/events")
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                      }
                    `}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm whitespace-nowrap">
                      Events
                    </span>
                  </Link>

                 
                  <Link
                    href="/partners"
                    className={`
                      flex items-center p-2 rounded-lg transition-colors duration-200
                      ${
                        isActive("/partners")
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                      }
                    `}
                  >
                    <Handshake className="w-4 h-4 mr-2" />
                    <span className="text-sm whitespace-nowrap">
                      Partners
                    </span>
                  </Link>
                </div>
              )}

            
              {isCollapsed && (
                <div className="relative">
                  <div
                    className="absolute left-full top-0 ml-2 py-2 w-48 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto z-50"
                    style={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                   
                    <Link
                      href="/our-teams"
                      className={`
                        flex items-center px-3 py-2 text-sm transition-colors duration-200
                        ${
                          isActive("/our-teams")
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                        }
                      `}
                      onClick={(e) => {
                        e.stopPropagation();
                        onMobileToggle();
                      }}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Our Teams
                    </Link>

                    
                    <Link
                      href="/gallery"
                      className={`
                        flex items-center px-3 py-2 text-sm transition-colors duration-200
                        ${
                          isActive("/gallery")
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                        }
                      `}
                      onClick={(e) => {
                        e.stopPropagation();
                        onMobileToggle();
                      }}
                    >
                      <Images className="w-4 h-4 mr-2" />
                      Gallery
                    </Link>

                
                    <Link
                      href="/events"
                      className={`
                        flex items-center px-3 py-2 text-sm transition-colors duration-200
                        ${
                          isActive("/events")
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                        }
                      `}
                      onClick={(e) => {
                        e.stopPropagation();
                        onMobileToggle();
                      }}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Events
                    </Link>

                   
                    <Link
                      href="/partners"
                      className={`
                        flex items-center px-3 py-2 text-sm transition-colors duration-200
                        ${
                          isActive("/partners")
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                        }
                      `}
                      onClick={(e) => {
                        e.stopPropagation();
                        onMobileToggle();
                      }}
                    >
                      <Handshake className="w-4 h-4 mr-2" />
                      Partners
                    </Link>
                  </div>
                </div>
              )}
            </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminSideBar;
