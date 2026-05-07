// import axios from "axios";
// import React, { useState, useEffect } from "react";
// import { X } from "lucide-react";

// const EditSubCategoryForm = ({
//     showForm,
//     setShowForm,
//     editingSubCategory,
//     setEditingSubCategory,
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
//         }
//     }, [editingSubCategory]);

//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("oursubcategories.update", { id }),
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                 }
//             );
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error updating subcategory", error);
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
//             await handleUpdate(formData, editingSubCategory.id);
//             handleClose();
//         } catch (error) {
//             console.log("Error updating data", error);
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

//     const handleClose = () => {
//         setShowForm(false);
//         setEditingSubCategory(null);
//         setSubCategoryForm({ category_id: "", name: "" });
//     };

//     if (!showForm || !editingSubCategory) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-bold text-gray-800">
//                         Edit SubCategory
//                     </h2>
//                     <button
//                         onClick={handleClose}
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
//                                 .filter((cat) => cat.has_sub_category)
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
//                             onClick={handleClose}
//                             className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={submitting}
//                             className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
//                         >
//                             {submitting ? "Updating..." : "Update SubCategory"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default EditSubCategoryForm;


import axios from "axios";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Select from "react-select";

const EditSubCategoryForm = ({
    showForm,
    setShowForm,
    editingSubCategory,
    setEditingSubCategory,
    setReloadTrigger,
    allCategory,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [subCategoryForm, setSubCategoryForm] = useState({
        category_id: "",
        name: "",
    });
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        if (editingSubCategory) {
            setSubCategoryForm({
                category_id: editingSubCategory.category_id || "",
                name: editingSubCategory.name || "",
            });
            
            // Set the selected category for React Select
            const category = allCategory.find(
                (cat) => cat.id === editingSubCategory.category_id
            );
            if (category) {
                setSelectedCategory({
                    value: category.id,
                    label: category.name,
                });
            } else {
                setSelectedCategory(null);
            }
        }
    }, [editingSubCategory, allCategory]);


    // Add this useEffect to lock body scroll when form mounts
useEffect(() => {
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    
    // Cleanup function to restore scroll when component unmounts
    return () => {
        document.body.style.overflow = 'unset';
        document.body.style.position = 'static';
        document.body.style.width = 'auto';
    };
}, []); // Empty dependency array means this runs once on mount

    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("oursubcategories.update", { id }),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error updating subcategory", error);
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
            await handleUpdate(formData, editingSubCategory.id);
            handleClose();
        } catch (error) {
            console.log("Error updating data", error);
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

    const handleCategoryChange = (selectedOption) => {
        setSelectedCategory(selectedOption);
        setSubCategoryForm((prev) => ({
            ...prev,
            category_id: selectedOption ? selectedOption.value : "",
        }));
    };

    const handleClose = () => {
        setShowForm(false);
        setEditingSubCategory(null);
        setSubCategoryForm({ category_id: "", name: "" });
        setSelectedCategory(null);
    };

    // Prepare options for React Select
    const categoryOptions = allCategory
        .filter((cat) => cat.has_sub_category)
        .map((cat) => ({
            value: cat.id,
            label: cat.name,
        }));

    if (!showForm || !editingSubCategory) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Edit SubCategory
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Category Dropdown with React Select */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>
                        <Select
                            options={categoryOptions}
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            placeholder="Select a category"
                            isClearable
                            isSearchable
                            required
                            className="react-select-container"
                            classNamePrefix="react-select"
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    borderColor: '#d1d5db',
                                    '&:hover': {
                                        borderColor: '#9ca3af',
                                    },
                                }),
                            }}
                        />
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
                            {submitting ? "Updating..." : "Update SubCategory"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditSubCategoryForm;