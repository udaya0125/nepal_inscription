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

    const fieldOptions = {
        period: ["Malla", "Licchavi", "Shah/Rana"],
        script: ["Licchavi", "Newari", "Rañjanā", "Devanāgarī"],
        varna: ["Svaravarṇa", "Vyañjanavarṇa", "Saṃyuktavarṇa"],
        symbols: ["Siddham | Maṅgala", "Visarga", "Virāma", "Avagraha", "Yojakacihna"],
        citra: ["Licchavi", "Malla", "Shah/Rana"],
    };

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
    const [imagePreview, setImagePreview] = useState(null);

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
            setImagePreview(
                editingPalaeographical.image
                    ? `/storage/${editingPalaeographical.image}`
                    : null
            );
        } else {
            setPalaeographicalForm(emptyForm);
            setImagePreview(null);
        }
    }, [editingPalaeographical]);

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
            setFilteredSubCategories(found.sub_categories || []);
            setSelectedCategoryHasSub(true);
        } else {
            setFilteredSubCategories([]);
            setSelectedCategoryHasSub(false);
            setPalaeographicalForm((prev) => ({ ...prev, sub_category_id: "" }));
        }
    }, [palaeographicalForm.category_id, allCategory]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file" && files[0]) {
            setPalaeographicalForm((prev) => ({ ...prev, [name]: files[0] }));
            setImagePreview(URL.createObjectURL(files[0]));
        } else {
            setPalaeographicalForm((prev) => ({ ...prev, [name]: value }));
        }
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
            setImagePreview(null);
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
        setImagePreview(null);
    };

    const selectClass =
        "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

    const labelClass = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {editingPalaeographical ? "Edit Palaeographical" : "Add New Palaeographical"}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Category + Sub Category — same row */}
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className={labelClass}>
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="category_id"
                                value={palaeographicalForm.category_id}
                                onChange={handleChange}
                                required
                                className={selectClass}
                            >
                                <option value="">Select Category</option>
                                {allCategory.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedCategoryHasSub && (
                            <div className="flex-1">
                                <label className={labelClass}>Sub Category</label>
                                <select
                                    name="sub_category_id"
                                    value={palaeographicalForm.sub_category_id}
                                    onChange={handleChange}
                                    className={selectClass}
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
                    </div>

                    {/* Image — improved upload UI */}
                    <div>
                        <label className={labelClass}>Image</label>
                        <div className="flex items-center gap-4">
                            {/* Preview */}
                            <div className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 shrink-0">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-center text-gray-400 text-xs px-1">
                                        <div className="text-2xl mb-0.5">🖼️</div>
                                        No image
                                    </div>
                                )}
                            </div>

                            {/* Upload button */}
                            <label className="flex-1 cursor-pointer">
                                <div className="border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-500 hover:bg-gray-50 transition-colors flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-indigo-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4" />
                                    </svg>
                                    <span>
                                        {palaeographicalForm.image
                                            ? palaeographicalForm.image.name
                                            : "Click to upload JPG / PNG"}
                                    </span>
                                </div>
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/jpg,image/jpeg,image/png"
                                    onChange={handleChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Image Name + URL — same row */}
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className={labelClass}>Image Name</label>
                            <input
                                type="text"
                                name="image_name"
                                value={palaeographicalForm.image_name}
                                onChange={handleChange}
                                placeholder="Enter image name"
                                className={selectClass}
                            />
                        </div>
                        <div className="flex-1">
                            <label className={labelClass}>URL</label>
                            <input
                                type="text"
                                name="url"
                                value={palaeographicalForm.url}
                                onChange={handleChange}
                                placeholder="https://..."
                                className={selectClass}
                            />
                        </div>
                    </div>

                    {/* Period + Script — same row */}
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className={labelClass}>Period</label>
                            <select
                                name="period"
                                value={palaeographicalForm.period}
                                onChange={handleChange}
                                className={selectClass}
                            >
                                <option value="">Select Period</option>
                                {fieldOptions.period.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className={labelClass}>Script</label>
                            <select
                                name="script"
                                value={palaeographicalForm.script}
                                onChange={handleChange}
                                className={selectClass}
                            >
                                <option value="">Select Script</option>
                                {fieldOptions.script.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Varna + Symbols — same row */}
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className={labelClass}>Varna</label>
                            <select
                                name="varna"
                                value={palaeographicalForm.varna}
                                onChange={handleChange}
                                className={selectClass}
                            >
                                <option value="">Select Varna</option>
                                {fieldOptions.varna.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className={labelClass}>Symbols</label>
                            <select
                                name="symbols"
                                value={palaeographicalForm.symbols}
                                onChange={handleChange}
                                className={selectClass}
                            >
                                <option value="">Select Symbols</option>
                                {fieldOptions.symbols.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Citra — full width */}
                    <div>
                        <label className={labelClass}>Citra</label>
                        <select
                            name="citra"
                            value={palaeographicalForm.citra}
                            onChange={handleChange}
                            className={selectClass}
                        >
                            <option value="">Select Citra</option>
                            {fieldOptions.citra.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
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