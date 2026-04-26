// import { X } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const AddPalaeographicalForm = ({ editingPalaeographical, setShowForm, setReloadTrigger, setEditingPalaeographical ,showForm }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [palaeographicalForm, setPalaeographicalForm] = useState({
//         category: "",
//         sub_category: "",
//         image: null,
//         image_name: "",
//         url: "",
//         period: "",
//         script: "",
//         varna: "",
//         symbols: "",
//         citra: "",
//     });
//     //  Use Effect
//     useEffect(() => {
//         if (editingPalaeographical) {
//             setPalaeographicalForm({
//                 ...editingPalaeographical,
//                 image: null,
//             });
//             setShowForm(true);
//         } else {
//             setPalaeographicalForm({
//                  category: "",
//         sub_category: "",
//         image: null,
//         image_name: "",
//         url: "",
//         period: "",
//         script: "",
//         varna: "",
//         symbols: "",
//         citra: "",
//             });
//         }
//     }, [editingPalaeographical]);

//     // Handle Create Palaeographical
//     const handleCreate = async (formData) => {
//         try {
//             await axios.post(route("palaeographical.store"), formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });

//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log("Error creating palaeographical", error);
//             throw error;
//         }
//     };

//     // Handle Submit - now clearly separated paths
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         // Append all form data except image if it's empty
//         for (const key in palaeographicalForm) {
//             if (
//                 palaeographicalForm[key] !== null &&
//                 palaeographicalForm[key] !== ""
//             ) {
//                 formData.append(key, palaeographicalForm[key]);
//             }
//         }
//         try {
//             setSubmitting(true);

//             if (editingPalaeographical) {
//                 // Editing existing palaeographical
//                 await handleUpdate(formData, editingPalaeographical.id);
//             } else {
//                 // Creating new palaeographical
//                 await handleCreate(formData);
//             }
//             setPalaeographicalForm({
//                  category: "",
//         sub_category: "",
//         image: null,
//         image_name: "",
//         url: "",
//         period: "",
//         script: "",
//         varna: "",
//         symbols: "",
//         citra: "",
//             });

//             setShowForm(false);
//             setEditingPalaeographical(null);
//         } catch (error) {
//             console.log("Error saving data", error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // handle  change for image and the others

//     const handleChange = (e) => {
//         const { name, value, type, files } = e.target;
//         setPalaeographicalForm((prev) => ({
//             ...prev,
//             [name]: type === "file" ? files[0] : value,
//         }));
//     };

//     return (
//         <div>
//             <div>
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//                     <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
//                         {/* Header - Same as AddEmployerForm */}
//                         <div className="flex justify-between items-center mb-6">
//                             <h2 className="text-2xl font-bold text-gray-800">
//                                 {editingPalaeographical
//                                     ? "Edit Palaeographical"
//                                     : "Add New Palaeographical"}
//                             </h2>
//                             <button
//                                 onClick={() => {
//                                     setShowForm(false);
//                                 }}
//                                 className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                             >
//                                 <X size={24} />
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AddPalaeographicalForm;


import axios from "axios";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

const AddPalaeographicalForm = ({
    editingPalaeographical,
    setShowForm,
    setReloadTrigger,
    setEditingPalaeographical,
    allCategory = [],
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);
    const [selectedCategoryHasSub, setSelectedCategoryHasSub] = useState(false);

    const emptyForm = {
        category_id: "",
        sub_category_id: "",
        image: null,
        image_name: "",
        url: "",
        period: "",
        script: "",
        varna: "",
        symbols: "",
        citra: "",
    };

    const [palaeographicalForm, setPalaeographicalForm] = useState(emptyForm);

    // Populate form when editing
    useEffect(() => {
        if (editingPalaeographical) {
            setPalaeographicalForm({
                category_id: editingPalaeographical.category_id || "",
                sub_category_id: editingPalaeographical.sub_category_id || "",
                image: null,
                image_name: editingPalaeographical.image_name || "",
                url: editingPalaeographical.url || "",
                period: editingPalaeographical.period || "",
                script: editingPalaeographical.script || "",
                varna: editingPalaeographical.varna || "",
                symbols: editingPalaeographical.symbols || "",
                citra: editingPalaeographical.citra || "",
            });
        } else {
            setPalaeographicalForm(emptyForm);
        }
    }, [editingPalaeographical]);

    // Depends on BOTH category_id AND allCategory
    // so it re-runs when allCategory finishes loading
    useEffect(() => {
        if (!palaeographicalForm.category_id || allCategory.length === 0) {
            setFilteredSubCategories([]);
            setSelectedCategoryHasSub(false);
            return;
        }

        const found = allCategory.find(
            (c) => c.id === parseInt(palaeographicalForm.category_id)
        );

        if (found && found.has_sub_category) {
            setFilteredSubCategories(found.subCategories || []);
            setSelectedCategoryHasSub(true);
            // Do NOT clear sub_category_id here — preserve it when editing
        } else {
            setFilteredSubCategories([]);
            setSelectedCategoryHasSub(false);
            setPalaeographicalForm((prev) => ({ ...prev, sub_category_id: "" }));
        }
    }, [palaeographicalForm.category_id, allCategory]); // allCategory in deps

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setPalaeographicalForm((prev) => ({
            ...prev,
            [name]: type === "file" ? files[0] : value,
        }));
    };

    const handleCreate = async (formData) => {
        await axios.post(route("ourpalaeographical.store"), formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        setReloadTrigger((prev) => !prev);
    };

    const handleUpdate = async (formData, id) => {
        formData.append("_method", "PUT");
        await axios.post(route("ourpalaeographical.update", { id }), formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        setReloadTrigger((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        for (const key in palaeographicalForm) {
            if (key === "image") {
                if (palaeographicalForm.image) {
                    formData.append("image", palaeographicalForm.image);
                }
            } else if (key === "sub_category_id") {
                // Send empty string if no subcategory (Laravel will treat as null if nullable)
                formData.append(
                    "sub_category_id",
                    selectedCategoryHasSub && palaeographicalForm.sub_category_id
                        ? palaeographicalForm.sub_category_id
                        : ""
                );
            } else if (
                palaeographicalForm[key] !== null &&
                palaeographicalForm[key] !== ""
            ) {
                formData.append(key, palaeographicalForm[key]);
            }
        }

        try {
            setSubmitting(true);
            if (editingPalaeographical) {
                await handleUpdate(formData, editingPalaeographical.id);
            } else {
                await handleCreate(formData);
            }
            setPalaeographicalForm(emptyForm);
            setShowForm(false);
            setEditingPalaeographical(null);
        } catch (error) {
            console.error("Error saving data", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setShowForm(false);
        setEditingPalaeographical(null);
        setPalaeographicalForm(emptyForm);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {editingPalaeographical
                            ? "Edit Palaeographical"
                            : "Add New Palaeographical"}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="category_id"
                            value={palaeographicalForm.category_id}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Select Category</option>
                            {allCategory.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sub Category — only shown if category has subcategories */}
                    {selectedCategoryHasSub && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sub Category
                            </label>
                            <select
                                name="sub_category_id"
                                value={palaeographicalForm.sub_category_id}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">Select Sub Category</option>
                                {filteredSubCategories.map((sub) => (
                                    <option key={sub.id} value={sub.id}>
                                        {sub.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Image
                        </label>
                        {editingPalaeographical?.image && (
                            <img
                                src={`/storage/${editingPalaeographical.image}`}
                                alt="current"
                                className="w-16 h-16 object-cover rounded mb-2"
                            />
                        )}
                        <input
                            type="file"
                            name="image"
                            accept="image/jpg,image/jpeg,image/png"
                            onChange={handleChange}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-indigo-50 file:text-indigo-700"
                        />
                    </div>

                    {/* Image Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Image Name
                        </label>
                        <input
                            type="text"
                            name="image_name"
                            value={palaeographicalForm.image_name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            URL
                        </label>
                        <input
                            type="text"
                            name="url"
                            value={palaeographicalForm.url}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Period */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Period
                        </label>
                        <input
                            type="text"
                            name="period"
                            value={palaeographicalForm.period}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Script */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Script
                        </label>
                        <input
                            type="text"
                            name="script"
                            value={palaeographicalForm.script}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Varna */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Varna
                        </label>
                        <input
                            type="text"
                            name="varna"
                            value={palaeographicalForm.varna}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Symbols */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Symbols
                        </label>
                        <input
                            type="text"
                            name="symbols"
                            value={palaeographicalForm.symbols}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Citra */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Citra
                        </label>
                        <input
                            type="text"
                            name="citra"
                            value={palaeographicalForm.citra}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-5 py-2 rounded-full border border-gray-300 text-sm hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-5 py-2 rounded-full bg-indigo-600 text-white text-sm hover:bg-indigo-700 disabled:opacity-60"
                        >
                            {submitting
                                ? "Saving..."
                                : editingPalaeographical
                                ? "Update"
                                : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPalaeographicalForm;