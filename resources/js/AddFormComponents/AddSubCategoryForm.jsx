// import axios from "axios";
// import React, { useState } from "react";
// import { X } from "lucide-react";

// const AddSubCategoryForm = ({
//     showForm,
//     setShowForm,
//     setReloadTrigger,
//     allCategory,
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [subCategoryForm, setSubCategoryForm] = useState({
//         category_id: "",
//         name: "",
//     });

//     const handleCreate = async (formData) => {
//         try {
//             await axios.post(route("oursubcategories.store"), formData, {
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
//             await handleCreate(formData);
//             setSubCategoryForm({ category_id: "", name: "" });
//             setShowForm(false);
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

//     const handleClose = () => {
//         setShowForm(false);
//         setSubCategoryForm({ category_id: "", name: "" });
//     };

//     if (!showForm) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-bold text-gray-800">
//                         Add New SubCategory
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
//                             {submitting ? "Creating..." : "Create SubCategory"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddSubCategoryForm;

// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { X } from "lucide-react";
// import Select from "react-select";

// const AddSubCategoryForm = ({
//     showForm,
//     setShowForm,
//     setReloadTrigger,
//     allCategory,
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [subCategoryForm, setSubCategoryForm] = useState({
//         category_id: "",
//         name: "",
//     });
//     const [selectedCategory, setSelectedCategory] = useState(null);


//     const handleCreate = async (formData) => {
//         try {
//             await axios.post(route("oursubcategories.store"), formData, {
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
//             await handleCreate(formData);
//             setSubCategoryForm({ category_id: "", name: "" });
//             setSelectedCategory(null);
//             setShowForm(false);
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

//     const handleCategoryChange = (selectedOption) => {
//         setSelectedCategory(selectedOption);
//         setSubCategoryForm((prev) => ({
//             ...prev,
//             category_id: selectedOption ? selectedOption.value : "",
//         }));
//     };

//     const handleClose = () => {
//         setShowForm(false);
//         setSubCategoryForm({ category_id: "", name: "" });
//         setSelectedCategory(null);
//     };

//     // Prepare options for React Select
//     const categoryOptions = allCategory
//         .filter((cat) => cat.has_sub_category)
//         .map((cat) => ({
//             value: cat.id,
//             label: cat.name,
//         }));

//     if (!showForm) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-bold text-gray-800">
//                         Add New SubCategory
//                     </h2>
//                     <button
//                         onClick={handleClose}
//                         className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     {/* Category Dropdown with React Select */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Category
//                         </label>
//                         <Select
//                             options={categoryOptions}
//                             value={selectedCategory}
//                             onChange={handleCategoryChange}
//                             placeholder="Select a category"
//                             isClearable
//                             isSearchable
//                             required
//                             className="react-select-container"
//                             classNamePrefix="react-select"
//                             styles={{
//                                 control: (base) => ({
//                                     ...base,
//                                     borderColor: '#d1d5db',
//                                     '&:hover': {
//                                         borderColor: '#9ca3af',
//                                     },
//                                 }),
//                             }}
//                         />
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
//                             {submitting ? "Creating..." : "Create SubCategory"}
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
import Select from "react-select";

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
        has_child_category: false,
    });
    const [selectedCategory, setSelectedCategory] = useState(null);

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
                formData.append(
                    key,
                    key === "has_child_category"
                        ? subCategoryForm[key] ? 1 : 0
                        : subCategoryForm[key]
                );
            }
        }

        // Ensure has_child_category is always appended (even when false)
        if (!formData.has("has_child_category")) {
            formData.append("has_child_category", 0);
        }

        try {
            setSubmitting(true);
            await handleCreate(formData);
            setSubCategoryForm({ category_id: "", name: "", has_child_category: false });
            setSelectedCategory(null);
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

    const handleToggleChange = (e) => {
        setSubCategoryForm((prev) => ({
            ...prev,
            has_child_category: e.target.checked,
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
        setSubCategoryForm({ category_id: "", name: "", has_child_category: false });
        setSelectedCategory(null);
    };

    const categoryOptions = allCategory
        .filter((cat) => cat.has_sub_category)
        .map((cat) => ({
            value: cat.id,
            label: cat.name,
        }));

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
                                    borderColor: "#d1d5db",
                                    "&:hover": {
                                        borderColor: "#9ca3af",
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

                    {/* Has Child Category Toggle */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Has Child Category
                        </label>
                        <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                            <div>
                                <p className="text-sm font-medium text-gray-800">
                                    Allow child categories
                                </p>
                                <p className="text-xs text-gray-500">
                                    Enable if this subcategory can have further nested categories
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer ml-4 flex-shrink-0">
                                <input
                                    type="checkbox"
                                    name="has_child_category"
                                    checked={subCategoryForm.has_child_category}
                                    onChange={handleToggleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-10 h-6 bg-gray-300 peer-checked:bg-indigo-600 rounded-full transition-colors duration-200 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-transform after:duration-200 peer-checked:after:translate-x-4" />
                            </label>
                        </div>
                    </div>

                    {/* Submit Buttons */}
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