import React, { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

const AddCategoryForm = ({ showForm, setShowForm, setReloadTrigger }) => {
    const [submitting, setSubmitting] = useState(false);
    const [categoryForm, setCategoryForm] = useState({
        name: "",
        has_sub_category: false,
    });

    // Create new category
    const handleCreate = async (payload) => {
        await axios.post(route("ourcategories.store"), payload);
        setReloadTrigger((prev) => !prev);
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            name: categoryForm.name,
            has_sub_category: Boolean(categoryForm.has_sub_category),
        };

        try {
            setSubmitting(true);
            await handleCreate(payload);
            
            // Reset and close
            setCategoryForm({ name: "", has_sub_category: false });
            setShowForm(false);
        } catch (error) {
            console.error("Error creating category:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCategoryForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleClose = () => {
        setCategoryForm({ name: "", has_sub_category: false });
        setShowForm(false);
    };

    if (!showForm) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Add New Category
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={categoryForm.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter category name"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    {/* Has Sub Category */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="has_sub_category"
                            name="has_sub_category"
                            checked={categoryForm.has_sub_category}
                            onChange={handleChange}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <label
                            htmlFor="has_sub_category"
                            className="text-sm font-medium text-gray-700"
                        >
                            Has Sub Category
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-5 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Creating..." : "Create Category"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCategoryForm;



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { X } from "lucide-react";

// const AddCategoryForm = ({
//     showForm,
//     setShowForm,
//     handleUpdate,
//     editingCategory,
//     setEditingCategory,
//     setReloadTrigger,
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [categoryForm, setCategoryForm] = useState({
//         name: "",
//         has_sub_category: false,
//     });

//     // Populate form when editing
//     useEffect(() => {
//         if (editingCategory) {
//             setCategoryForm({
//                 name: editingCategory.name,
//                 has_sub_category: editingCategory.has_sub_category,
//             });
//         } else {
//             setCategoryForm({
//                 name: "",
//                 has_sub_category: false,
//             });
//         }
//     }, [editingCategory]);

//     // Create new category — send JSON so booleans stay as true/false
//     const handleCreate = async (payload) => {
//         await axios.post(route("ourcategories.store"), payload);
//         setReloadTrigger((prev) => !prev);
//     };

//     // Handle form submit (create or update)
//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         // Plain object — booleans stay as true/false, no FormData coercion needed
//         const payload = {
//             name: categoryForm.name,
//             has_sub_category: Boolean(categoryForm.has_sub_category),
//         };

//         try {
//             setSubmitting(true);

//             if (editingCategory) {
//                 await handleUpdate(payload, editingCategory.id);
//             } else {
//                 await handleCreate(payload);
//             }

//             // Reset and close
//             setCategoryForm({ name: "", has_sub_category: false });
//             setEditingCategory(null);
//             setShowForm(false);
//         } catch (error) {
//             console.error("Error saving category:", error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setCategoryForm((prev) => ({
//             ...prev,
//             [name]: type === "checkbox" ? checked : value,
//         }));
//     };

//     const handleClose = () => {
//         setCategoryForm({ name: "", has_sub_category: false });
//         setEditingCategory(null);
//         setShowForm(false);
//     };

//     // Don't render if not shown
//     if (!showForm) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
//                 {/* Header */}
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-bold text-gray-800">
//                         {editingCategory ? "Edit Category" : "Add New Category"}
//                     </h2>
//                     <button
//                         onClick={handleClose}
//                         className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>

//                 {/* Form */}
//                 <form onSubmit={handleSubmit} className="space-y-5">
//                     {/* Name */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Category Name <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                             type="text"
//                             name="name"
//                             value={categoryForm.name}
//                             onChange={handleChange}
//                             required
//                             placeholder="Enter category name"
//                             className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                         />
//                     </div>

//                     {/* Has Sub Category */}
//                     <div className="flex items-center gap-3">
//                         <input
//                             type="checkbox"
//                             id="has_sub_category"
//                             name="has_sub_category"
//                             checked={categoryForm.has_sub_category}
//                             onChange={handleChange}
//                             className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                         />
//                         <label
//                             htmlFor="has_sub_category"
//                             className="text-sm font-medium text-gray-700"
//                         >
//                             Has Sub Category
//                         </label>
//                     </div>

//                     {/* Actions */}
//                     <div className="flex justify-end gap-3 pt-2">
//                         <button
//                             type="button"
//                             onClick={handleClose}
//                             className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={submitting}
//                             className="px-5 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
//                         >
//                             {submitting
//                                 ? "Saving..."
//                                 : editingCategory
//                                 ? "Update Category"
//                                 : "Create Category"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddCategoryForm;