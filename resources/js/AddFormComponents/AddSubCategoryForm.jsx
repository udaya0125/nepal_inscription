// import axios from "axios";
// import React, { useState, useEffect } from "react"; 
// import { X } from "lucide-react";                    

// const AddSubCategoryForm = ({
//     showForm,
//     setShowForm,
//     handleUpdate,               // ✅ Received from parent
//     editingSubCategory,
//     setEditingSubCategory,      // ✅ Received from parent
//     setReloadTrigger,
//     allCategory,
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [subCategoryForm, setSubCategoryForm] = useState({
//         category_id: "",
//         name: "",
//     });

//     useEffect(() => {
//         if (editingSubCategory) {
//             setSubCategoryForm({
//                 category_id: editingSubCategory.category_id || "",
//                 name: editingSubCategory.name || "",
//             });
//             setShowForm(true);
//         } else {
//             setSubCategoryForm({
//                 category_id: "",
//                 name: "",
//             });
//         }
//     }, [editingSubCategory]);

//     // ✅ handleCreate defined here, uses setReloadTrigger from props
//     const handleCreate = async (formData) => {
//         try {
//             await axios.post(route("oursubcategories.store"), formData, {  // ✅ Fixed route name
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log("Error creating subcategory", error);
//             throw error;
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();

//         for (const key in subCategoryForm) {
//             if (subCategoryForm[key] !== null && subCategoryForm[key] !== "") {
//                 formData.append(key, subCategoryForm[key]);
//             }
//         }

//         try {
//             setSubmitting(true);
//             if (editingSubCategory) {
//                 await handleUpdate(formData, editingSubCategory.id);
//             } else {
//                 await handleCreate(formData);
//             }

//             setSubCategoryForm({ category_id: "", name: "" });
//             setShowForm(false);
//             setEditingSubCategory(null);  // ✅ Use prop, not undefined variable
//         } catch (error) {
//             console.log("Error saving data", error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setSubCategoryForm((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     // ✅ Guard: don't render if showForm is false
//     if (!showForm) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-bold text-gray-800">
//                         {editingSubCategory ? "Edit SubCategory" : "Add New SubCategory"}
//                     </h2>
//                     <button
//                         onClick={() => {
//                             setShowForm(false);
//                             setEditingSubCategory(null);  // ✅ Fixed: was setEditingCategory
//                         }}
//                         className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     {/* Category Dropdown */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Category
//                         </label>
//                         <select
//                             name="category_id"
//                             value={subCategoryForm.category_id}
//                             onChange={handleChange}
//                             required
//                             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         >
//                             <option value="">Select a category</option>
//                             {allCategory
//                                 .filter((cat) => cat.has_sub_category)  // ✅ Only show eligible categories
//                                 .map((cat) => (
//                                     <option key={cat.id} value={cat.id}>
//                                         {cat.name}
//                                     </option>
//                                 ))}
//                         </select>
//                     </div>

//                     {/* SubCategory Name */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             SubCategory Name
//                         </label>
//                         <input
//                             type="text"
//                             name="name"
//                             value={subCategoryForm.name}
//                             onChange={handleChange}
//                             required
//                             placeholder="Enter subcategory name"
//                             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         />
//                     </div>

//                     {/* Submit Button */}
//                     <div className="flex justify-end gap-3 pt-2">
//                         <button
//                             type="button"
//                             onClick={() => {
//                                 setShowForm(false);
//                                 setEditingSubCategory(null);
//                             }}
//                             className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={submitting}
//                             className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
//                         >
//                             {submitting
//                                 ? "Saving..."
//                                 : editingSubCategory
//                                 ? "Update SubCategory"
//                                 : "Create SubCategory"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddSubCategoryForm;


import axios from "axios";
import React, { useState } from "react";
import { X } from "lucide-react";

const AddSubCategoryForm = ({
    showForm,
    setShowForm,
    setReloadTrigger,
    allCategory,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [subCategoryForm, setSubCategoryForm] = useState({
        category_id: "",
        name: "",
    });

    const handleCreate = async (formData) => {
        try {
            await axios.post(route("oursubcategories.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log("Error creating subcategory", error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        for (const key in subCategoryForm) {
            if (subCategoryForm[key] !== null && subCategoryForm[key] !== "") {
                formData.append(key, subCategoryForm[key]);
            }
        }

        try {
            setSubmitting(true);
            await handleCreate(formData);
            setSubCategoryForm({ category_id: "", name: "" });
            setShowForm(false);
        } catch (error) {
            console.log("Error saving data", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSubCategoryForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleClose = () => {
        setShowForm(false);
        setSubCategoryForm({ category_id: "", name: "" });
    };

    if (!showForm) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Add New SubCategory
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Category Dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>
                        <select
                            name="category_id"
                            value={subCategoryForm.category_id}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Select a category</option>
                            {allCategory
                                .filter((cat) => cat.has_sub_category)
                                .map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                        </select>
                    </div>

                    {/* SubCategory Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            SubCategory Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={subCategoryForm.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter subcategory name"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                        >
                            {submitting ? "Creating..." : "Create SubCategory"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSubCategoryForm;