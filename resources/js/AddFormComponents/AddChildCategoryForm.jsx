// import { X } from 'lucide-react';
// import React, { useEffect, useState } from 'react'

// const AddChildCategoryForm = ({ showForm, setShowForm, editingChildCategory, setEditingChildCategory, setReloadTrigger,handleUpdate }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [childCategoryForm, setChildCategoryForm] = useState({
//         name: "",
//         category_id: "",
//         sub_category_id: "",
//     });
//     //  Use Effect
//     useEffect(() => {
//         if (editingChildCategory) {
//             setChildCategoryForm({
//                 ...editingChildCategory,
//                 image: null,
//             });
//             setShowForm(true);
//         } else {
//             setChildCategoryForm({
//                 name: "",
//                 category_id: "",
//         sub_category_id: "",
//             });
//         }
//     }, [editingChildCategory]);

//     // Handle Create Category
//     const handleCreate = async (formData) => {
//         try {
//             await axios.post(route("ourchildcategories.store"), formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });

//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log("Error creating child category", error);
//             throw error;
//         }
//     };

//     // Handle Submit - now clearly separated paths
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         // Append all form data except image if it's empty
//         for (const key in childCategoryForm) {
//             if (childCategoryForm[key] !== null && childCategoryForm[key] !== "") {
//                 formData.append(key, childCategoryForm[key]);
//             }
//         }
//         try {
//             setSubmitting(true);

//             if (editingChildCategory) {
//                 // Editing existing child category
//                 await handleUpdate(formData, editingChildCategory.id);
//             } else {
//                 // Creating new child category
//                 await handleCreate(formData);
//             }
//             setChildCategoryForm({
//                 name: "",
//                 category_id: "",
//         sub_category_id: "",
//             });

//             setShowForm(false);
//             setEditingChildCategory(null);
//         } catch (error) {
//             console.log("Error saving data", error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // handle  change for image and the others

//     const handleChange = (e) => {
//         const { name, value, type, files } = e.target;
//         setChildCategoryForm((prev) => ({
//             ...prev,
//             [name]: type === "file" ? files[0] : value,
//         }));
//     };

//      if (!showForm) return null;
//   return (
//     <div>
//        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-bold text-gray-800">
//                         Add New Child  Category
//                     </h2>
//                     <button
//                         onClick={() => {
//                             setShowForm(false);
//                         }}
//                         className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>
//             </div>
//         </div>
//     </div>
//   )
// }

// export default AddChildCategoryForm


import axios from 'axios';
import { X, ChevronDown } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const AddChildCategoryForm = ({
    showForm,
    setShowForm,
    editingChildCategory,
    setEditingChildCategory,
    setReloadTrigger,
    handleUpdate,
    allCategory = [],
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [availableSubCategories, setAvailableSubCategories] = useState([]);

    const [childCategoryForm, setChildCategoryForm] = useState({
        name: '',
        category_id: '',
        sub_category_id: '',
    });

    // Populate form when editing
    useEffect(() => {
        if (editingChildCategory) {
            setChildCategoryForm({
                name: editingChildCategory.name || '',
                category_id: editingChildCategory.category_id || '',
                sub_category_id: editingChildCategory.sub_category_id || '',
            });
            setShowForm(true);
        } else {
            setChildCategoryForm({ name: '', category_id: '', sub_category_id: '' });
            setAvailableSubCategories([]);
        }
    }, [editingChildCategory]);

    // When category_id changes, populate subcategories from allCategory
    useEffect(() => {
        if (!childCategoryForm.category_id) {
            setAvailableSubCategories([]);
            return;
        }

        const selectedCategory = allCategory.find(
            (cat) => String(cat.id) === String(childCategoryForm.category_id)
        );

        const subs = selectedCategory?.sub_categories || [];
        // Only show subcategories that allow child categories
        const filteredSubs = subs.filter((sub) => sub.has_child_category);
        setAvailableSubCategories(filteredSubs);

        // Reset sub_category_id if it no longer belongs to new category
        const stillValid = filteredSubs.some(
            (s) => String(s.id) === String(childCategoryForm.sub_category_id)
        );
        if (!stillValid) {
            setChildCategoryForm((prev) => ({ ...prev, sub_category_id: '' }));
        }
    }, [childCategoryForm.category_id, allCategory]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setChildCategoryForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};
        if (!childCategoryForm.name.trim()) newErrors.name = 'Name is required.';
        if (!childCategoryForm.category_id) newErrors.category_id = 'Please select a category.';
        if (!childCategoryForm.sub_category_id) newErrors.sub_category_id = 'Please select a subcategory.';
        return newErrors;
    };

    const handleCreate = async (formData) => {
        await axios.post(route('ourchildcategories.store'), formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        setReloadTrigger((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const formData = new FormData();
        Object.entries(childCategoryForm).forEach(([key, val]) => {
            if (val !== null && val !== '') formData.append(key, val);
        });

        try {
            setSubmitting(true);
            if (editingChildCategory) {
                await handleUpdate(formData, editingChildCategory.id);
            } else {
                await handleCreate(formData);
            }
            resetAndClose();
        } catch (error) {
            // Handle Laravel validation errors
            if (error.response?.data?.errors) {
                const serverErrors = {};
                Object.entries(error.response.data.errors).forEach(([key, msgs]) => {
                    serverErrors[key] = msgs[0];
                });
                setErrors(serverErrors);
            } else if (error.response?.data?.message) {
                setErrors({ general: error.response.data.message });
            } else {
                setErrors({ general: 'Something went wrong. Please try again.' });
            }
        } finally {
            setSubmitting(false);
        }
    };

    const resetAndClose = () => {
        setChildCategoryForm({ name: '', category_id: '', sub_category_id: '' });
        setErrors({});
        setAvailableSubCategories([]);
        setShowForm(false);
        setEditingChildCategory(null);
    };

    // Only show categories that have sub_categories & allow subcategories
    const validCategories = allCategory.filter(
        (cat) => cat.has_sub_category && cat.sub_categories?.length > 0
    );

    if (!showForm) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {editingChildCategory ? 'Edit Child Category' : 'Add Child Category'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {editingChildCategory
                                ? 'Update the details below'
                                : 'Fill in the details to create a new child category'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={resetAndClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
                    {/* General error */}
                    {errors.general && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                            {errors.general}
                        </div>
                    )}

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Child Category Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={childCategoryForm.name}
                            onChange={handleChange}
                            placeholder="e.g. Men's Running Shoes"
                            className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                                errors.name
                                    ? 'border-red-400 bg-red-50'
                                    : 'border-gray-300 bg-white hover:border-gray-400'
                            }`}
                        />
                        {errors.name && (
                            <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>
                        )}
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Parent Category <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                name="category_id"
                                value={childCategoryForm.category_id}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 pr-10 rounded-lg border text-sm appearance-none transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                                    errors.category_id
                                        ? 'border-red-400 bg-red-50'
                                        : 'border-gray-300 bg-white hover:border-gray-400'
                                }`}
                            >
                                <option value="">— Select a category —</option>
                                {validCategories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                size={16}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            />
                        </div>
                        {errors.category_id && (
                            <p className="mt-1.5 text-xs text-red-600">{errors.category_id}</p>
                        )}
                    </div>

                    {/* Subcategory */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Parent Subcategory <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                name="sub_category_id"
                                value={childCategoryForm.sub_category_id}
                                onChange={handleChange}
                                disabled={!childCategoryForm.category_id}
                                className={`w-full px-4 py-2.5 pr-10 rounded-lg border text-sm appearance-none transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed ${
                                    errors.sub_category_id
                                        ? 'border-red-400 bg-red-50'
                                        : 'border-gray-300 bg-white hover:border-gray-400'
                                }`}
                            >
                                <option value="">
                                    {!childCategoryForm.category_id
                                        ? '— Select a category first —'
                                        : availableSubCategories.length === 0
                                        ? '— No subcategories available —'
                                        : '— Select a subcategory —'}
                                </option>
                                {availableSubCategories.map((sub) => (
                                    <option key={sub.id} value={sub.id}>
                                        {sub.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                size={16}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            />
                        </div>
                        {errors.sub_category_id && (
                            <p className="mt-1.5 text-xs text-red-600">{errors.sub_category_id}</p>
                        )}
                        {childCategoryForm.category_id && availableSubCategories.length === 0 && (
                            <p className="mt-1.5 text-xs text-amber-600">
                                This category has no subcategories that allow child categories.
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={resetAndClose}
                            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <svg
                                        className="animate-spin h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8H4z"
                                        />
                                    </svg>
                                    {editingChildCategory ? 'Updating...' : 'Creating...'}
                                </>
                            ) : editingChildCategory ? (
                                'Update Child Category'
                            ) : (
                                'Create Child Category'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddChildCategoryForm;