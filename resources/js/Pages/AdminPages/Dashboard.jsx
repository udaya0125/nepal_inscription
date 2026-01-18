import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import React from "react";

const Dashboard = () => {
    return (
        <>
            <AdminWrapper>
                <div
                    className=""
                    style={{
                        backgroundImage: "url('/images/bg.jpeg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundAttachment: "fixed",
                    }}
                >
                    {/* Dark overlay for better readability */}
                    <div className="absolute inset-0 bg-black/10 bg-opacity-40"></div>

                    <div className="relative z-10">
                        {/* Home Content with glassmorphism effect */}
                        <div className="min-h-[calc(100vh-4rem)]">
                            <div className=" w-full p-6">
                                <div>
                                    <h2>Dashboard</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminWrapper>
        </>
    );
};

export default Dashboard;
