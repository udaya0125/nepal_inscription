import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AddCategoryForm from "@/AddFormComponents/AddCategoryForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";

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
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        #
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Has Sub Category
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {allCategories.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-6 py-10 text-center text-gray-400"
                                        >
                                            No categories found.
                                        </td>
                                    </tr>
                                ) : (
                                    allCategories.map((category, index) => (
                                        <tr
                                            key={category.id}
                                            className="hover:bg-gray-50 transition"
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-800">
                                                {category.name}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                        category.has_sub_category
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-gray-100 text-gray-600"
                                                    }`}
                                                >
                                                    {category.has_sub_category
                                                        ? "Yes"
                                                        : "No"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handleEdit(category)
                                                        }
                                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                category.id,
                                                            )
                                                        }
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

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
