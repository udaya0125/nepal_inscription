import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AddCategoryForm from "@/AddFormComponents/AddCategoryForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import MyTable from "@/MyTable/MyTable";
import EditCategoryForm from "@/EditFormComponents/EditCategoryForm";

const Category = () => {
    const [allCategories, setAllCategories] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    // Fetch categories
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axios.get(route("ourcategories.index"));
                setAllCategories(response.data.data);
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

    // Open edit form
    const handleEdit = (category) => {
        setEditingCategory(category);
        setShowEditForm(true);
    };

    // Update category
    const handleUpdate = async (payload, id) => {
        try {
            const response = await axios.put(
                route("ourcategories.update", { id }),
                payload
            );
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
        []
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
                            onClick={() => setShowAddForm(true)}
                            className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                        >
                            <Plus size={18} />
                            <span>Create</span>
                        </button>
                    </div>

                    {/* Table */}
                    <MyTable columns={columns} data={tableData} />

                    {/* Add Form Modal */}
                    <AddCategoryForm
                        showForm={showAddForm}
                        setShowForm={setShowAddForm}
                        setReloadTrigger={setReloadTrigger}
                    />

                    {/* Edit Form Modal */}
                    <EditCategoryForm
                        showForm={showEditForm}
                        setShowForm={setShowEditForm}
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

// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import axios from "axios";
// import { Plus, Pencil, Trash2 } from "lucide-react";
// import AddCategoryForm from "@/AddFormComponents/AddCategoryForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import MyTable from "@/MyTable/MyTable";


// const Category = () => {
//     const [allCategories, setAllCategories] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingCategory, setEditingCategory] = useState(null);
//     const [showForm, setShowForm] = useState(false);

//     // Fetch categories
//     useEffect(() => {
//         const fetchCategory = async () => {
//             try {
//                 const response = await axios.get(route("ourcategories.index"));
//                 setAllCategories(response.data.data); // controller returns { success, data }
//             } catch (error) {
//                 console.error("Fetching error:", error);
//             }
//         };

//         fetchCategory();
//     }, [reloadTrigger]);

//     // Delete category
//     const handleDelete = async (id) => {
//         if (!confirm("Are you sure you want to delete this category?")) return;
//         try {
//             await axios.delete(route("ourcategories.destroy", { id }));
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.error("Delete error:", error);
//         }
//     };

//     // Open form for editing
//     const handleEdit = (category) => {
//         setEditingCategory(category);
//         setShowForm(true);
//     };

//     // Update category (called from AddCategoryForm)
//     const handleUpdate = async (payload, id) => {
//         try {
//             const response = await axios.put(
//                 route("ourcategories.update", { id }),
//                 payload, // plain JSON object — booleans stay as true/false
//             );
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.error("Update error:", error);
//             throw error;
//         }
//     };

//     // Define table columns
//     const columns = useMemo(
//         () => [
//             {
//                 Header: "S.N.",
//                 accessor: "serialNumber",
//                 Cell: ({ row }) => <span>{row.index + 1}</span>,
//                 width: 60,
//             },
//             {
//                 Header: "Name",
//                 accessor: "name",
//                 Cell: ({ value }) => (
//                     <span className="font-medium text-gray-800">{value}</span>
//                 ),
//             },
//             {
//                 Header: "Has Sub Category",
//                 accessor: "has_sub_category",
//                 Cell: ({ value }) => (
//                     <span
//                         className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                             value
//                                 ? "bg-green-100 text-green-700"
//                                 : "bg-red-100 text-red-700"
//                         }`}
//                     >
//                         {value ? "Yes" : "No"}
//                     </span>
//                 ),
//             },
//             {
//                 Header: "Actions",
//                 accessor: "actions",
//                 Cell: ({ row }) => (
//                     <div className="flex justify-start gap-2">
//                         <button
//                             onClick={() => handleEdit(row.original)}
//                             className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
//                             title="Edit"
//                         >
//                             <Pencil size={16} />
//                         </button>
//                         <button
//                             onClick={() => handleDelete(row.original.id)}
//                             className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
//                             title="Delete"
//                         >
//                             <Trash2 size={16} />
//                         </button>
//                     </div>
//                 ),
//                 width: 100,
//             },
//         ],
//         [] // Empty dependency array since handleEdit and handleDelete are stable
//     );

//     // Prepare data for the table
//     const tableData = useMemo(() => allCategories, [allCategories]);

//     return (
//         <>
//             <AdminWrapper>
//                 <div className="py-4">
//                     {/* Header */}
//                     <div className="mb-8 flex justify-between items-center">
//                         <div>
//                             <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
//                                 Category Management
//                             </h1>
//                         </div>
//                         <button
//                             onClick={() => {
//                                 setEditingCategory(null);
//                                 setShowForm(true);
//                             }}
//                             className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
//                         >
//                             <Plus size={18} />
//                             <span>Create</span>
//                         </button>
//                     </div>

//                     {/* Table */}
//                     <MyTable columns={columns} data={tableData} />

//                     {/* Modal Form */}
//                     <AddCategoryForm
//                         showForm={showForm}
//                         setShowForm={setShowForm}
//                         handleUpdate={handleUpdate}
//                         editingCategory={editingCategory}
//                         setEditingCategory={setEditingCategory}
//                         setReloadTrigger={setReloadTrigger}
//                     />
//                 </div>
//             </AdminWrapper>
//         </>
//     );
// };

// export default Category;
