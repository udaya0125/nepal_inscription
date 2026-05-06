import { SquarePen, Trash2 } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import AddUserForm from "@/AddFormComponents/AddUserForm";
import EditUserForm from "@/EditFormComponents/EditUserForm";
import MyTable from "@/MyTable/MyTable";

const UserManagement = () => {
    const [allUser, setAllUser] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // For fetching the user data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(route("ouruser.index"));

                // Handle both paginated and non-paginated responses
                if (response.data && Array.isArray(response.data.data)) {
                    setAllUser(response.data.data);
                } else if (Array.isArray(response.data)) {
                    setAllUser(response.data);
                } else {
                    console.error(
                        "Unexpected response structure:",
                        response.data,
                    );
                    setAllUser([]);
                    setError("Unexpected data format received from server.");
                }
            } catch (error) {
                console.error("fetching error ", error);
                setError("Failed to fetch users. Please try again later.");
                setAllUser([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [reloadTrigger]);

    // For delete the user
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        try {
            await axios.delete(route("ouruser.destroy", { id: id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
            alert("Error deleting user");
        }
    };

    // handleedit
    const handleEdit = (user) => {
        setEditingUser(user);
        setShowEditForm(true);
    };

    // Handle update after the edit
    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ouruser.update", { id }),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );
            setReloadTrigger((prev) => !prev);
            setShowEditForm(false);
            setEditingUser(null);
            return response.data;
        } catch (error) {
            console.log("Error updating user", error);
            throw error;
        }
    };

    // Handle create new user
    const handleCreate = async (formData) => {
        try {
            await axios.post(route("ouruser.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setReloadTrigger((prev) => !prev);
            setShowAddForm(false);
        } catch (error) {
            console.log("Error creating user", error);
            throw error;
        }
    };

    // Close Add form
    const handleCloseAddForm = () => {
        setShowAddForm(false);
    };

    // Close Edit form
    const handleCloseEditForm = () => {
        setShowEditForm(false);
        setEditingUser(null);
    };

    const columns = useMemo(
        () => [
            {
                Header: "ID",
                accessor: (row, i) => i + 1,
                id: "rowIndex",
                width: 60,
            },
            {
                Header: "Name",
                accessor: "name",
            },
            {
                Header: "Email",
                accessor: "email",
            },
            {
                Header: "Created At",
                accessor: "created_at",
                Cell: ({ value }) => {
                    return value ? new Date(value).toLocaleDateString() : "-";
                },
            },
            {
                Header: "Actions",
                accessor: "id",
                Cell: ({ row }) => (
                    <div className="flex space-x-3">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium transition-colors"
                            title="Edit user"
                        >
                            <SquarePen size={16} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="text-red-600 hover:text-red-900 text-sm font-medium transition-colors"
                            title="Delete user"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ),
            },
        ],
        [],
    );

    return (
        <>
            <AdminWrapper>
                <div className="">
                    <div className="flex flex-wrap items-center justify-between mb-6 md:mb-8">
                        <div className="flex items-center">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                User Management
                            </h1>
                        </div>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
                        >
                            Add New User
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-500">
                            {error}
                        </div>
                    ) : (
                        <MyTable columns={columns} data={allUser} />
                    )}
                </div>
            </AdminWrapper>

            {/* Add User Form Modal */}
            {showAddForm && (
                <AddUserForm
                    onCreate={handleCreate}
                    onClose={handleCloseAddForm}
                />
            )}

            {/* Edit User Form Modal */}
            {showEditForm && editingUser && (
                <EditUserForm
                    editingUser={editingUser}
                    onUpdate={handleUpdate}
                    onClose={handleCloseEditForm}
                />
            )}
        </>
    );
};

export default UserManagement;
