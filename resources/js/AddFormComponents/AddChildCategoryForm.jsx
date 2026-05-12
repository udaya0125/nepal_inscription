// import axios from 'axios';
// import { X } from 'lucide-react';
// import React, { useEffect, useState } from 'react';
// import Select from 'react-select';

// const selectStyles = (hasError) => ({
//     control: (base, state) => ({
//         ...base,
//         borderColor: hasError ? '#f87171' : state.isFocused ? '#6366f1' : '#d1d5db',
//         backgroundColor: hasError ? '#fef2f2' : 'white',
//         borderRadius: '0.5rem',
//         padding: '0.125rem 0',
//         boxShadow: state.isFocused ? '0 0 0 2px rgba(99, 102, 241, 0.2)' : 'none',
//         '&:hover': {
//             borderColor: hasError ? '#f87171' : '#9ca3af',
//         },
//     }),
//     placeholder: (base) => ({
//         ...base,
//         color: '#9ca3af',
//         fontSize: '0.875rem',
//     }),
//     option: (base, state) => ({
//         ...base,
//         backgroundColor: state.isFocused ? '#e0e7ff' : state.isSelected ? '#6366f1' : 'white',
//         color: state.isSelected ? 'white' : '#374151',
//         fontSize: '0.875rem',
//     }),
//     menuPortal: (base) => ({ ...base, zIndex: 9999 }),
//     menu: (base) => ({ ...base, maxHeight: '220px' }),
//     menuList: (base) => ({ ...base, maxHeight: '200px', overflowY: 'auto' }),
// });

// const AddChildCategoryForm = ({
//     showForm,
//     setShowForm,
//     editingChildCategory,
//     setEditingChildCategory,
//     setReloadTrigger,
//     handleUpdate,
//     allCategory = [],
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [errors, setErrors] = useState({});
//     const [availableSubCategories, setAvailableSubCategories] = useState([]);

//     const [childCategoryForm, setChildCategoryForm] = useState({
//         name: '',
//         category_id: '',
//         sub_category_id: '',
//     });

//     useEffect(() => {
//         if (editingChildCategory) {
//             setChildCategoryForm({
//                 name: editingChildCategory.name || '',
//                 category_id: editingChildCategory.category_id || '',
//                 sub_category_id: editingChildCategory.sub_category_id || '',
//             });
//             setShowForm(true);
//         } else {
//             setChildCategoryForm({ name: '', category_id: '', sub_category_id: '' });
//             setAvailableSubCategories([]);
//         }
//     }, [editingChildCategory]);

//     useEffect(() => {
//         if (!childCategoryForm.category_id) {
//             setAvailableSubCategories([]);
//             return;
//         }
//         const selectedCategory = allCategory.find(
//             (cat) => String(cat.id) === String(childCategoryForm.category_id)
//         );
//         const subs = selectedCategory?.sub_categories || [];
//         const filteredSubs = subs.filter((sub) => sub.has_child_category);
//         setAvailableSubCategories(filteredSubs);

//         const stillValid = filteredSubs.some(
//             (s) => String(s.id) === String(childCategoryForm.sub_category_id)
//         );
//         if (!stillValid) {
//             setChildCategoryForm((prev) => ({ ...prev, sub_category_id: '' }));
//         }
//     }, [childCategoryForm.category_id, allCategory]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setChildCategoryForm((prev) => ({ ...prev, [name]: value }));
//         setErrors((prev) => ({ ...prev, [name]: '' }));
//     };

//     const handleSelectChange = (selectedOption, actionMeta) => {
//         const { name } = actionMeta;
//         const value = selectedOption ? selectedOption.value : '';
//         setChildCategoryForm((prev) => ({ ...prev, [name]: value }));
//         setErrors((prev) => ({ ...prev, [name]: '' }));
//     };

//     const validate = () => {
//         const newErrors = {};
//         if (!childCategoryForm.name.trim()) newErrors.name = 'Name is required.';
//         if (!childCategoryForm.category_id) newErrors.category_id = 'Please select a category.';
//         if (!childCategoryForm.sub_category_id) newErrors.sub_category_id = 'Please select a subcategory.';
//         return newErrors;
//     };

//     const handleCreate = async (formData) => {
//         await axios.post(route('ourchildcategories.store'), formData, {
//             headers: { 'Content-Type': 'multipart/form-data' },
//         });
//         setReloadTrigger((prev) => !prev);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const validationErrors = validate();
//         if (Object.keys(validationErrors).length > 0) {
//             setErrors(validationErrors);
//             return;
//         }
//         const formData = new FormData();
//         Object.entries(childCategoryForm).forEach(([key, val]) => {
//             if (val !== null && val !== '') formData.append(key, val);
//         });
//         try {
//             setSubmitting(true);
//             if (editingChildCategory) {
//                 await handleUpdate(formData, editingChildCategory.id);
//             } else {
//                 await handleCreate(formData);
//             }
//             resetAndClose();
//         } catch (error) {
//             if (error.response?.data?.errors) {
//                 const serverErrors = {};
//                 Object.entries(error.response.data.errors).forEach(([key, msgs]) => {
//                     serverErrors[key] = msgs[0];
//                 });
//                 setErrors(serverErrors);
//             } else if (error.response?.data?.message) {
//                 setErrors({ general: error.response.data.message });
//             } else {
//                 setErrors({ general: 'Something went wrong. Please try again.' });
//             }
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const resetAndClose = () => {
//         setChildCategoryForm({ name: '', category_id: '', sub_category_id: '' });
//         setErrors({});
//         setAvailableSubCategories([]);
//         setShowForm(false);
//         setEditingChildCategory(null);
//     };

//     const validCategories = allCategory.filter(
//         (cat) => cat.has_sub_category && cat.sub_categories?.length > 0
//     );

//     const categoryOptions = validCategories.map((cat) => ({ value: cat.id, label: cat.name }));
//     const subCategoryOptions = availableSubCategories.map((sub) => ({ value: sub.id, label: sub.name }));

//     const selectedCategory = categoryOptions.find(
//         (opt) => String(opt.value) === String(childCategoryForm.category_id)
//     );
//     const selectedSubCategory = subCategoryOptions.find(
//         (opt) => String(opt.value) === String(childCategoryForm.sub_category_id)
//     );

//     if (!showForm) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
//                 {/* Header */}
//                 <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
//                     <div>
//                         <h2 className="text-xl font-bold text-gray-900">
//                             {editingChildCategory ? 'Edit Child Category' : 'Add Child Category'}
//                         </h2>
//                         <p className="text-sm text-gray-500 mt-0.5">
//                             {editingChildCategory
//                                 ? 'Update the details below'
//                                 : 'Fill in the details to create a new child category'}
//                         </p>
//                     </div>
//                     <button
//                         type="button"
//                         onClick={resetAndClose}
//                         className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
//                     >
//                         <X size={20} />
//                     </button>
//                 </div>

//                 {/* Form */}
//                 <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
//                     {errors.general && (
//                         <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
//                             {errors.general}
//                         </div>
//                     )}

//                     {/* Name */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                             Child Category Name <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                             type="text"
//                             name="name"
//                             value={childCategoryForm.name}
//                             onChange={handleChange}
//                             placeholder="e.g. Men's Running Shoes"
//                             className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
//                                 errors.name
//                                     ? 'border-red-400 bg-red-50'
//                                     : 'border-gray-300 bg-white hover:border-gray-400'
//                             }`}
//                         />
//                         {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>}
//                     </div>

//                     {/* Category */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                             Parent Category <span className="text-red-500">*</span>
//                         </label>
//                         <Select
//                             name="category_id"
//                             options={categoryOptions}
//                             value={selectedCategory || null}
//                             onChange={handleSelectChange}
//                             placeholder="Select a category..."
//                             isClearable
//                             menuPortalTarget={document.body}
//                             menuPosition="fixed"
//                             className="react-select-container"
//                             classNamePrefix="react-select"
//                             styles={selectStyles(!!errors.category_id)}
//                         />
//                         {errors.category_id && (
//                             <p className="mt-1.5 text-xs text-red-600">{errors.category_id}</p>
//                         )}
//                     </div>

//                     {/* Subcategory */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                             Parent Subcategory <span className="text-red-500">*</span>
//                         </label>
//                         <Select
//                             name="sub_category_id"
//                             options={subCategoryOptions}
//                             value={selectedSubCategory || null}
//                             onChange={handleSelectChange}
//                             placeholder={
//                                 !childCategoryForm.category_id
//                                     ? 'Select a category first...'
//                                     : subCategoryOptions.length === 0
//                                     ? 'No subcategories available'
//                                     : 'Select a subcategory...'
//                             }
//                             isClearable
//                             isDisabled={!childCategoryForm.category_id || subCategoryOptions.length === 0}
//                             menuPortalTarget={document.body}
//                             menuPosition="fixed"
//                             className="react-select-container"
//                             classNamePrefix="react-select"
//                             styles={selectStyles(!!errors.sub_category_id)}
//                         />
//                         {errors.sub_category_id && (
//                             <p className="mt-1.5 text-xs text-red-600">{errors.sub_category_id}</p>
//                         )}
//                         {childCategoryForm.category_id && subCategoryOptions.length === 0 && (
//                             <p className="mt-1.5 text-xs text-amber-600">
//                                 This category has no subcategories that allow child categories.
//                             </p>
//                         )}
//                     </div>

//                     {/* Actions */}
//                     <div className="flex gap-3 pt-1">
//                         <button
//                             type="button"
//                             onClick={resetAndClose}
//                             className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={submitting}
//                             className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                         >
//                             {submitting ? (
//                                 <>
//                                     <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
//                                     </svg>
//                                     {editingChildCategory ? 'Updating...' : 'Creating...'}
//                                 </>
//                             ) : editingChildCategory ? (
//                                 'Update Child Category'
//                             ) : (
//                                 'Create Child Category'
//                             )}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddChildCategoryForm;


import axios from 'axios';
import { X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const selectStyles = (hasError) => ({
    control: (base, state) => ({
        ...base,
        borderColor: hasError ? '#f87171' : state.isFocused ? '#6366f1' : '#d1d5db',
        backgroundColor: hasError ? '#fef2f2' : 'white',
        borderRadius: '0.5rem',
        padding: '0.125rem 0',
        boxShadow: state.isFocused ? '0 0 0 2px rgba(99, 102, 241, 0.2)' : 'none',
        '&:hover': {
            borderColor: hasError ? '#f87171' : '#9ca3af',
        },
    }),
    placeholder: (base) => ({
        ...base,
        color: '#9ca3af',
        fontSize: '0.875rem',
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused ? '#e0e7ff' : state.isSelected ? '#6366f1' : 'white',
        color: state.isSelected ? 'white' : '#374151',
        fontSize: '0.875rem',
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    menu: (base) => ({ ...base, maxHeight: '220px' }),
    menuList: (base) => ({ ...base, maxHeight: '200px', overflowY: 'auto' }),
});

const AddChildCategoryForm = ({
    showForm,
    setShowForm,
    setReloadTrigger,
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

     // Lock body scroll when modal is open
    useEffect(() => {
        if (showForm) {
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = '15px'; // Prevent layout shift
        } else {
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0px';
        }

        // Cleanup function
        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0px';
        };
    }, [showForm]);

    // Reset form when modal opens
    useEffect(() => {
        if (showForm) {
            setChildCategoryForm({ name: '', category_id: '', sub_category_id: '' });
            setAvailableSubCategories([]);
            setErrors({});
        }
    }, [showForm]);

    useEffect(() => {
        if (!childCategoryForm.category_id) {
            setAvailableSubCategories([]);
            return;
        }
        const selectedCategory = allCategory.find(
            (cat) => String(cat.id) === String(childCategoryForm.category_id)
        );
        const subs = selectedCategory?.sub_categories || [];
        const filteredSubs = subs.filter((sub) => sub.has_child_category);
        setAvailableSubCategories(filteredSubs);

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

    const handleSelectChange = (selectedOption, actionMeta) => {
        const { name } = actionMeta;
        const value = selectedOption ? selectedOption.value : '';
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
            await handleCreate(formData);
            resetAndClose();
        } catch (error) {
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
    };

    const validCategories = allCategory.filter(
        (cat) => cat.has_sub_category && cat.sub_categories?.length > 0
    );

    const categoryOptions = validCategories.map((cat) => ({ value: cat.id, label: cat.name }));
    const subCategoryOptions = availableSubCategories.map((sub) => ({ value: sub.id, label: sub.name }));

    const selectedCategory = categoryOptions.find(
        (opt) => String(opt.value) === String(childCategoryForm.category_id)
    );
    const selectedSubCategory = subCategoryOptions.find(
        (opt) => String(opt.value) === String(childCategoryForm.sub_category_id)
    );

    if (!showForm) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Add Child Category</h2>
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
                            placeholder="Add Child Category Name"
                            className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                                errors.name
                                    ? 'border-red-400 bg-red-50'
                                    : 'border-gray-300 bg-white hover:border-gray-400'
                            }`}
                        />
                        {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>}
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Parent Category <span className="text-red-500">*</span>
                        </label>
                        <Select
                            name="category_id"
                            options={categoryOptions}
                            value={selectedCategory || null}
                            onChange={handleSelectChange}
                            placeholder="Select a category..."
                            isClearable
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            className="react-select-container"
                            classNamePrefix="react-select"
                            styles={selectStyles(!!errors.category_id)}
                        />
                        {errors.category_id && (
                            <p className="mt-1.5 text-xs text-red-600">{errors.category_id}</p>
                        )}
                    </div>

                    {/* Subcategory */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Parent Subcategory <span className="text-red-500">*</span>
                        </label>
                        <Select
                            name="sub_category_id"
                            options={subCategoryOptions}
                            value={selectedSubCategory || null}
                            onChange={handleSelectChange}
                            placeholder={
                                !childCategoryForm.category_id
                                    ? 'Select a category first...'
                                    : subCategoryOptions.length === 0
                                    ? 'No subcategories available'
                                    : 'Select a subcategory...'
                            }
                            isClearable
                            isDisabled={!childCategoryForm.category_id || subCategoryOptions.length === 0}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            className="react-select-container"
                            classNamePrefix="react-select"
                            styles={selectStyles(!!errors.sub_category_id)}
                        />
                        {errors.sub_category_id && (
                            <p className="mt-1.5 text-xs text-red-600">{errors.sub_category_id}</p>
                        )}
                        {childCategoryForm.category_id && subCategoryOptions.length === 0 && (
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
                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Creating...
                                </>
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