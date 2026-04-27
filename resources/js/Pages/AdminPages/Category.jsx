import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AddCategoryForm from "@/AddFormComponents/AddCategoryForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import MyTable from "@/MyTable/MyTable";


const Category = () => {
    const [allCategories, setAllCategories] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // Fetch categories
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axios.get(route("ourcategories.index"));
                setAllCategories(response.data.data); // controller returns { success, data }
            } catch (error) {
                console.error("Fetching error:", error);
            }
        };

        fetchCategory();
    }, [reloadTrigger]);

    // Delete category
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this category?")) return;
        try {
            await axios.delete(route("ourcategories.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    // Open form for editing
    const handleEdit = (category) => {
        setEditingCategory(category);
        setShowForm(true);
    };

    // Update category (called from AddCategoryForm)
    const handleUpdate = async (payload, id) => {
        try {
            const response = await axios.put(
                route("ourcategories.update", { id }),
                payload, // plain JSON object — booleans stay as true/false
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.error("Update error:", error);
            throw error;
        }
    };

    // Define table columns
    const columns = useMemo(
        () => [
            {
                Header: "S.N.",
                accessor: "serialNumber",
                Cell: ({ row }) => <span>{row.index + 1}</span>,
                width: 60,
            },
            {
                Header: "Name",
                accessor: "name",
                Cell: ({ value }) => (
                    <span className="font-medium text-gray-800">{value}</span>
                ),
            },
            {
                Header: "Has Sub Category",
                accessor: "has_sub_category",
                Cell: ({ value }) => (
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            value
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                        }`}
                    >
                        {value ? "Yes" : "No"}
                    </span>
                ),
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: ({ row }) => (
                    <div className="flex justify-start gap-2">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="Edit"
                        >
                            <Pencil size={16} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ),
                width: 100,
            },
        ],
        [] // Empty dependency array since handleEdit and handleDelete are stable
    );

    // Prepare data for the table
    const tableData = useMemo(() => allCategories, [allCategories]);

    return (
        <>
            <AdminWrapper>
                <div className="py-4">
                    {/* Header */}
                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                                Category Management
                            </h1>
                        </div>
                        <button
                            onClick={() => {
                                setEditingCategory(null);
                                setShowForm(true);
                            }}
                            className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                        >
                            <Plus size={18} />
                            <span>Create</span>
                        </button>
                    </div>

                    {/* Table */}
                    <MyTable columns={columns} data={tableData} />

                    {/* Modal Form */}
                    <AddCategoryForm
                        showForm={showForm}
                        setShowForm={setShowForm}
                        handleUpdate={handleUpdate}
                        editingCategory={editingCategory}
                        setEditingCategory={setEditingCategory}
                        setReloadTrigger={setReloadTrigger}
                    />
                </div>
            </AdminWrapper>
        </>
    );
};

export default Category;


// import AddCategoryForm from "@/AddFormComponents/AddCategoryForm";
// import React from "react";

// const Category = () => {
//     const [allCategories, setAllCategories] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingCategory, setEditingCategory] = useState(null);

//     // For fetching the category data
//     useEffect(() => {
//         const fetchCategory = async () => {
//             try {
//                 const response = await axios.get(route("categories.index"));
//                 setAllCategories(response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//         fetchCategory();
//     }, [reloadTrigger]);

//     // For delete the category
//     const handleDelete = async (id) => {
//         try {
//             const response = await axios.delete(
//                 route("categories.destroy", { id: id }),
//             );
//             console.log(response.data);
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     // handleedit
//     const handleEdit = (category) => {
//         setEditingCategory(category);
//     };

//     // Handlapdate after the  edit
//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("categories.update", { id }),
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                 },
//             );
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error updating category", error);
//             throw error;
//         }
//     };

//     return (
//         <div className="py-4 ">
//             {/* Header with Add Button */}
//             <div className="mb-8 flex justify-between items-center">
//                 <div>
//                     <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
//                         Category Management
//                     </h1>
//                 </div>
//                 <button
//                     onClick={() => setShowForm(true)}
//                     className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
//                 >
//                     <Plus size={18} />
//                     <span>Create</span>
//                 </button>
//             </div>
//             <AddCategoryForm 
//                 showForm={showForm}
//                 setShowForm={setShowForm}
//                 handleCreate={handleCreate}
//                 handleUpdate={handleUpdate}
//                 editingCategory={editingCategory}
//                 setReloadTrigger={setReloadTrigger}
//                 reloadTrigger={reloadTrigger}
//             />
//         </div>
//     );
// };

// export default Category;
