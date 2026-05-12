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

// import axios from "axios";
// import { X, Upload } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import Select from "react-select";

// const AddPalaeographicalForm = ({
//     editingPalaeographical,
//     setShowForm,
//     setReloadTrigger,
//     setEditingPalaeographical,
//     allCategory = [],
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [filteredSubCategories, setFilteredSubCategories] = useState([]);
//     const [selectedCategoryHasSub, setSelectedCategoryHasSub] = useState(false);
//     const [imagePreview, setImagePreview] = useState(null);

//     const fieldOptions = {
//         period: [
//             { value: "Malla", label: "Malla" },
//             { value: "Licchavi", label: "Licchavi" },
//             { value: "Shah/Rana", label: "Shah/Rana" },
//         ],
//         script: [
//             { value: "Licchavi", label: "Licchavi" },
//             { value: "Newari", label: "Newari" },
//             { value: "Rañjanā", label: "Rañjanā" },
//             { value: "Devanāgarī", label: "Devanāgarī" },
//         ],
//         varna: [
//             { value: "Svaravarṇa", label: "Svaravarṇa" },
//             { value: "Vyañjanavarṇa", label: "Vyañjanavarṇa" },
//             { value: "Saṃyuktavarṇa", label: "Saṃyuktavarṇa" },
//         ],
//         symbols: [
//             { value: "Siddham | Maṅgala", label: "Siddham | Maṅgala" },
//             { value: "Visarga", label: "Visarga" },
//             { value: "Virāma", label: "Virāma" },
//             { value: "Avagraha", label: "Avagraha" },
//             { value: "Yojakacihna", label: "Yojakacihna" },
//         ],
//         citra: [
//             { value: "Licchavi", label: "Licchavi" },
//             { value: "Malla", label: "Malla" },
//             { value: "Shah/Rana", label: "Shah/Rana" },
//         ],
//     };

//     const emptyForm = {
//         category_id: "",
//         sub_category_id: "",
//         image: null,
//         image_name: "",
//         url: "",
//         period: "",
//         script: "",
//         varna: "",
//         symbols: "",
//         citra: "",
//     };

//     const [palaeographicalForm, setPalaeographicalForm] = useState(emptyForm);

//     // Custom styles for react-select
//     const selectStyles = {
//         control: (base, state) => ({
//             ...base,
//             borderColor: state.isFocused ? "#6366f1" : "#d1d5db",
//             boxShadow: state.isFocused
//                 ? "0 0 0 2px rgba(99,102,241,0.2)"
//                 : "none",
//             borderRadius: "0.5rem",
//             fontSize: "0.875rem",
//             minHeight: "38px",
//             "&:hover": {
//                 borderColor: "#6366f1",
//             },
//         }),
//         option: (base, state) => ({
//             ...base,
//             fontSize: "0.875rem",
//             backgroundColor: state.isSelected
//                 ? "#6366f1"
//                 : state.isFocused
//                 ? "#eef2ff"
//                 : "white",
//             color: state.isSelected ? "white" : "#1f2937",
//             cursor: "pointer",
//         }),
//         placeholder: (base) => ({
//             ...base,
//             color: "#9ca3af",
//             fontSize: "0.875rem",
//         }),
//         singleValue: (base) => ({
//             ...base,
//             color: "#1f2937",
//             fontSize: "0.875rem",
//         }),
//         menu: (base) => ({
//             ...base,
//             borderRadius: "0.5rem",
//             zIndex: 9999,
//             boxShadow:
//                 "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
//         }),
//         menuList: (base) => ({
//             ...base,
//             maxHeight: "180px",
//             overflowY: "auto",
//         }),
//     };

//     useEffect(() => {
//         if (editingPalaeographical) {
//             setPalaeographicalForm({
//                 category_id: editingPalaeographical.category_id || "",
//                 sub_category_id: editingPalaeographical.sub_category_id || "",
//                 image: null,
//                 image_name: editingPalaeographical.image_name || "",
//                 url: editingPalaeographical.url || "",
//                 period: editingPalaeographical.period || "",
//                 script: editingPalaeographical.script || "",
//                 varna: editingPalaeographical.varna || "",
//                 symbols: editingPalaeographical.symbols || "",
//                 citra: editingPalaeographical.citra || "",
//             });
//             setImagePreview(
//                 editingPalaeographical.image
//                     ? `/storage/${editingPalaeographical.image}`
//                     : null
//             );
//         } else {
//             setPalaeographicalForm(emptyForm);
//             setImagePreview(null);
//         }
//     }, [editingPalaeographical]);

//     useEffect(() => {
//         if (!palaeographicalForm.category_id || allCategory.length === 0) {
//             setFilteredSubCategories([]);
//             setSelectedCategoryHasSub(false);
//             return;
//         }

//         const found = allCategory.find(
//             (c) => c.id === parseInt(palaeographicalForm.category_id)
//         );

//         if (found && found.has_sub_category) {
//             setFilteredSubCategories(found.sub_categories || []);
//             setSelectedCategoryHasSub(true);
//         } else {
//             setFilteredSubCategories([]);
//             setSelectedCategoryHasSub(false);
//             setPalaeographicalForm((prev) => ({
//                 ...prev,
//                 sub_category_id: "",
//             }));
//         }
//     }, [palaeographicalForm.category_id, allCategory]);

//     const handleChange = (e) => {
//         const { name, value, type, files } = e.target;
//         if (type === "file" && files[0]) {
//             setPalaeographicalForm((prev) => ({ ...prev, [name]: files[0] }));
//             setImagePreview(URL.createObjectURL(files[0]));
//         } else {
//             setPalaeographicalForm((prev) => ({ ...prev, [name]: value }));
//         }
//     };

//     const handleSelectChange = (name) => (selected) => {
//         setPalaeographicalForm((prev) => ({
//             ...prev,
//             [name]: selected ? selected.value : "",
//         }));
//     };

//     const getSelectValue = (options, value) =>
//         options.find((opt) => opt.value === value) || null;

//     const categoryOptions = allCategory.map((cat) => ({
//         value: cat.id,
//         label: cat.name,
//     }));

//     const subCategoryOptions = filteredSubCategories.map((sub) => ({
//         value: sub.id,
//         label: sub.name,
//     }));

//     const handleCreate = async (formData) => {
//         await axios.post(route("ourpalaeographical.store"), formData, {
//             headers: { "Content-Type": "multipart/form-data" },
//         });
//         setReloadTrigger((prev) => !prev);
//     };

//     const handleUpdate = async (formData, id) => {
//         formData.append("_method", "PUT");
//         await axios.post(
//             route("ourpalaeographical.update", { id }),
//             formData,
//             {
//                 headers: { "Content-Type": "multipart/form-data" },
//             }
//         );
//         setReloadTrigger((prev) => !prev);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();

//         for (const key in palaeographicalForm) {
//             if (key === "image") {
//                 if (palaeographicalForm.image) {
//                     formData.append("image", palaeographicalForm.image);
//                 }
//             } else if (key === "sub_category_id") {
//                 formData.append(
//                     "sub_category_id",
//                     selectedCategoryHasSub && palaeographicalForm.sub_category_id
//                         ? palaeographicalForm.sub_category_id
//                         : ""
//                 );
//             } else if (
//                 palaeographicalForm[key] !== null &&
//                 palaeographicalForm[key] !== ""
//             ) {
//                 formData.append(key, palaeographicalForm[key]);
//             }
//         }

//         try {
//             setSubmitting(true);
//             if (editingPalaeographical) {
//                 await handleUpdate(formData, editingPalaeographical.id);
//             } else {
//                 await handleCreate(formData);
//             }
//             setPalaeographicalForm(emptyForm);
//             setImagePreview(null);
//             setShowForm(false);
//             setEditingPalaeographical(null);
//         } catch (error) {
//             console.error("Error saving data", error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const handleClose = () => {
//         setShowForm(false);
//         setEditingPalaeographical(null);
//         setPalaeographicalForm(emptyForm);
//         setImagePreview(null);
//     };

//     const inputClass =
//         "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

//     const labelClass = "block text-sm font-medium text-gray-700 mb-1";

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             {/* Outer card — NO overflow here so dropdowns aren't clipped */}
//             <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col">

//                 {/* Fixed header */}
//                 <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
//                     <h2 className="text-2xl font-bold text-gray-800">
//                         {editingPalaeographical
//                             ? "Edit Palaeographical"
//                             : "Add New Palaeographical"}
//                     </h2>
//                     <button
//                         onClick={handleClose}
//                         className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>

//                 {/* Scrollable body — overflow-y-auto is ONLY here */}
//                 <div className="overflow-y-auto flex-1 px-6 py-4">
//                     <form onSubmit={handleSubmit} className="space-y-4">

//                         {/* Category + Sub Category — same row */}
//                         <div className="flex gap-3">
//                             <div className="flex-1">
//                                 <label className={labelClass}>
//                                     Category{" "}
//                                     <span className="text-red-500">*</span>
//                                 </label>
//                                 <Select
//                                     options={categoryOptions}
//                                     value={
//                                         categoryOptions.find(
//                                             (opt) =>
//                                                 opt.value ===
//                                                 parseInt(
//                                                     palaeographicalForm.category_id
//                                                 )
//                                         ) || null
//                                     }
//                                     onChange={(selected) =>
//                                         setPalaeographicalForm((prev) => ({
//                                             ...prev,
//                                             category_id: selected
//                                                 ? selected.value
//                                                 : "",
//                                         }))
//                                     }
//                                     placeholder="Select Category"
//                                     styles={selectStyles}
//                                     menuPlacement="auto"
//                                     isClearable
//                                 />
//                             </div>

//                             {selectedCategoryHasSub && (
//                                 <div className="flex-1">
//                                     <label className={labelClass}>
//                                         Sub Category
//                                     </label>
//                                     <Select
//                                         options={subCategoryOptions}
//                                         value={
//                                             subCategoryOptions.find(
//                                                 (opt) =>
//                                                     opt.value ===
//                                                     parseInt(
//                                                         palaeographicalForm.sub_category_id
//                                                     )
//                                             ) || null
//                                         }
//                                         onChange={(selected) =>
//                                             setPalaeographicalForm((prev) => ({
//                                                 ...prev,
//                                                 sub_category_id: selected
//                                                     ? selected.value
//                                                     : "",
//                                             }))
//                                         }
//                                         placeholder="Select Sub Category"
//                                         styles={selectStyles}
//                                         menuPlacement="auto"
//                                         isClearable
//                                     />
//                                 </div>
//                             )}
//                         </div>

//                         {/* Image — dashed upload box */}
//                         <div className="space-y-2">
//                             <label className={labelClass}>Image</label>
//                             <div className="border-2 border-dashed border-gray-400 rounded-xl p-6 text-center hover:border-indigo-400 transition-all duration-300 relative bg-white">
//                                 {imagePreview ? (
//                                     <div className="space-y-2">
//                                         <img
//                                             src={imagePreview}
//                                             alt="Preview"
//                                             className="mx-auto h-40 w-full object-cover rounded-lg shadow-lg"
//                                         />
//                                         <p className="text-sm text-gray-500">
//                                             Click to change image
//                                         </p>
//                                     </div>
//                                 ) : (
//                                     <div className="space-y-3">
//                                         <Upload className="mx-auto h-10 w-10 text-gray-400" />
//                                         <p className="text-sm text-gray-700">
//                                             Click to upload image
//                                         </p>
//                                         <p className="text-xs text-gray-400">
//                                             JPG, JPEG, PNG supported
//                                         </p>
//                                     </div>
//                                 )}
//                                 <input
//                                     type="file"
//                                     name="image"
//                                     accept="image/jpg,image/jpeg,image/png"
//                                     onChange={handleChange}
//                                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                                 />
//                             </div>
//                         </div>

//                         {/* Image Name + URL — same row */}
//                         <div className="flex gap-3">
//                             <div className="flex-1">
//                                 <label className={labelClass}>Image Name</label>
//                                 <input
//                                     type="text"
//                                     name="image_name"
//                                     value={palaeographicalForm.image_name}
//                                     onChange={handleChange}
//                                     placeholder="Enter image name"
//                                     className={inputClass}
//                                 />
//                             </div>
//                             <div className="flex-1">
//                                 <label className={labelClass}>URL</label>
//                                 <input
//                                     type="text"
//                                     name="url"
//                                     value={palaeographicalForm.url}
//                                     onChange={handleChange}
//                                     placeholder="https://..."
//                                     className={inputClass}
//                                 />
//                             </div>
//                         </div>

//                         {/* Period + Script — same row */}
//                         <div className="flex gap-3">
//                             <div className="flex-1">
//                                 <label className={labelClass}>Period</label>
//                                 <Select
//                                     options={fieldOptions.period}
//                                     value={getSelectValue(
//                                         fieldOptions.period,
//                                         palaeographicalForm.period
//                                     )}
//                                     onChange={handleSelectChange("period")}
//                                     placeholder="Select Period"
//                                     styles={selectStyles}
//                                     menuPlacement="auto"
//                                     isClearable
//                                 />
//                             </div>
//                             <div className="flex-1">
//                                 <label className={labelClass}>Script</label>
//                                 <Select
//                                     options={fieldOptions.script}
//                                     value={getSelectValue(
//                                         fieldOptions.script,
//                                         palaeographicalForm.script
//                                     )}
//                                     onChange={handleSelectChange("script")}
//                                     placeholder="Select Script"
//                                     styles={selectStyles}
//                                     menuPlacement="auto"
//                                     isClearable
//                                 />
//                             </div>
//                         </div>

//                         {/* Varna + Symbols — same row */}
//                         <div className="flex gap-3">
//                             <div className="flex-1">
//                                 <label className={labelClass}>Varna</label>
//                                 <Select
//                                     options={fieldOptions.varna}
//                                     value={getSelectValue(
//                                         fieldOptions.varna,
//                                         palaeographicalForm.varna
//                                     )}
//                                     onChange={handleSelectChange("varna")}
//                                     placeholder="Select Varna"
//                                     styles={selectStyles}
//                                     menuPlacement="auto"
//                                     isClearable
//                                 />
//                             </div>
//                             <div className="flex-1">
//                                 <label className={labelClass}>Symbols</label>
//                                 <Select
//                                     options={fieldOptions.symbols}
//                                     value={getSelectValue(
//                                         fieldOptions.symbols,
//                                         palaeographicalForm.symbols
//                                     )}
//                                     onChange={handleSelectChange("symbols")}
//                                     placeholder="Select Symbols"
//                                     styles={selectStyles}
//                                     menuPlacement="auto"
//                                     isClearable
//                                 />
//                             </div>
//                         </div>

//                         {/* Citra — full width */}
//                         <div>
//                             <label className={labelClass}>Citra</label>
//                             <Select
//                                 options={fieldOptions.citra}
//                                 value={getSelectValue(
//                                     fieldOptions.citra,
//                                     palaeographicalForm.citra
//                                 )}
//                                 onChange={handleSelectChange("citra")}
//                                 placeholder="Select Citra"
//                                 styles={selectStyles}
//                                 menuPlacement="auto"
//                                 isClearable
//                             />
//                         </div>

//                         {/* Submit */}
//                         <div className="flex justify-end gap-3 pt-2 pb-2">
//                             <button
//                                 type="button"
//                                 onClick={handleClose}
//                                 className="px-5 py-2 rounded-full border border-gray-300 text-sm hover:bg-gray-50"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 type="submit"
//                                 disabled={submitting}
//                                 className="px-5 py-2 rounded-full bg-indigo-600 text-white text-sm hover:bg-indigo-700 disabled:opacity-60"
//                             >
//                                 {submitting
//                                     ? "Saving..."
//                                     : editingPalaeographical
//                                     ? "Update"
//                                     : "Create"}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AddPalaeographicalForm;


// import axios from "axios";
// import { X, Upload } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import Select from "react-select";

// const AddPalaeographicalForm = ({
//     setShowForm,
//     setReloadTrigger,
//     allCategory = [],
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [filteredSubCategories, setFilteredSubCategories] = useState([]);
//     const [selectedCategoryHasSub, setSelectedCategoryHasSub] = useState(false);
//     const [imagePreview, setImagePreview] = useState(null);

//     // Add this useEffect to lock body scroll when form mounts
// useEffect(() => {
//     // Lock body scroll
//     document.body.style.overflow = 'hidden';
//     document.body.style.position = 'fixed';
//     document.body.style.width = '100%';
    
//     // Cleanup function to restore scroll when component unmounts
//     return () => {
//         document.body.style.overflow = 'unset';
//         document.body.style.position = 'static';
//         document.body.style.width = 'auto';
//     };
// }, []); // Empty dependency array means this runs once on mount

//     const fieldOptions = {
//         period: [
//             { value: "Malla", label: "Malla" },
//             { value: "Licchavi", label: "Licchavi" },
//             { value: "Shah/Rana", label: "Shah/Rana" },
//         ],
//         script: [
//             { value: "Licchavi", label: "Licchavi" },
//             { value: "Newari", label: "Newari" },
//             { value: "Rañjanā", label: "Rañjanā" },
//             { value: "Devanāgarī", label: "Devanāgarī" },
//         ],
//         varna: [
//             { value: "Svaravarṇa", label: "Svaravarṇa" },
//             { value: "Vyañjanavarṇa", label: "Vyañjanavarṇa" },
//             { value: "Saṃyuktavarṇa", label: "Saṃyuktavarṇa" },
//         ],
//         symbols: [
//             { value: "Siddham | Maṅgala", label: "Siddham | Maṅgala" },
//             { value: "Visarga", label: "Visarga" },
//             { value: "Virāma", label: "Virāma" },
//             { value: "Avagraha", label: "Avagraha" },
//             { value: "Yojakacihna", label: "Yojakacihna" },
//         ],
//         citra: [
//             { value: "Licchavi", label: "Licchavi" },
//             { value: "Malla", label: "Malla" },
//             { value: "Shah/Rana", label: "Shah/Rana" },
//         ],
//     };

//     const emptyForm = {
//         category_id: "",
//         sub_category_id: "",
//         image: null,
//         image_name: "",
//         url: "",
//         period: "",
//         script: "",
//         varna: "",
//         symbols: "",
//         citra: "",
//     };

//     const [palaeographicalForm, setPalaeographicalForm] = useState(emptyForm);

//     // Custom styles for react-select
//     const selectStyles = {
//         control: (base, state) => ({
//             ...base,
//             borderColor: state.isFocused ? "#6366f1" : "#d1d5db",
//             boxShadow: state.isFocused
//                 ? "0 0 0 2px rgba(99,102,241,0.2)"
//                 : "none",
//             borderRadius: "0.5rem",
//             fontSize: "0.875rem",
//             minHeight: "38px",
//             "&:hover": {
//                 borderColor: "#6366f1",
//             },
//         }),
//         option: (base, state) => ({
//             ...base,
//             fontSize: "0.875rem",
//             backgroundColor: state.isSelected
//                 ? "#6366f1"
//                 : state.isFocused
//                 ? "#eef2ff"
//                 : "white",
//             color: state.isSelected ? "white" : "#1f2937",
//             cursor: "pointer",
//         }),
//         placeholder: (base) => ({
//             ...base,
//             color: "#9ca3af",
//             fontSize: "0.875rem",
//         }),
//         singleValue: (base) => ({
//             ...base,
//             color: "#1f2937",
//             fontSize: "0.875rem",
//         }),
//         menu: (base) => ({
//             ...base,
//             borderRadius: "0.5rem",
//             zIndex: 9999,
//             boxShadow:
//                 "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
//         }),
//         menuList: (base) => ({
//             ...base,
//             maxHeight: "180px",
//             overflowY: "auto",
//         }),
//     };

//     useEffect(() => {
//         setPalaeographicalForm(emptyForm);
//         setImagePreview(null);
//         setFilteredSubCategories([]);
//         setSelectedCategoryHasSub(false);
//     }, []);

//     useEffect(() => {
//         if (!palaeographicalForm.category_id || allCategory.length === 0) {
//             setFilteredSubCategories([]);
//             setSelectedCategoryHasSub(false);
//             return;
//         }

//         const found = allCategory.find(
//             (c) => c.id === parseInt(palaeographicalForm.category_id)
//         );

//         if (found && found.has_sub_category) {
//             setFilteredSubCategories(found.sub_categories || []);
//             setSelectedCategoryHasSub(true);
//         } else {
//             setFilteredSubCategories([]);
//             setSelectedCategoryHasSub(false);
//             setPalaeographicalForm((prev) => ({
//                 ...prev,
//                 sub_category_id: "",
//             }));
//         }
//     }, [palaeographicalForm.category_id, allCategory]);

//     const handleChange = (e) => {
//         const { name, value, type, files } = e.target;
//         if (type === "file" && files[0]) {
//             setPalaeographicalForm((prev) => ({ ...prev, [name]: files[0] }));
//             setImagePreview(URL.createObjectURL(files[0]));
//         } else {
//             setPalaeographicalForm((prev) => ({ ...prev, [name]: value }));
//         }
//     };

//     const handleSelectChange = (name) => (selected) => {
//         setPalaeographicalForm((prev) => ({
//             ...prev,
//             [name]: selected ? selected.value : "",
//         }));
//     };

//     const getSelectValue = (options, value) =>
//         options.find((opt) => opt.value === value) || null;

//     const categoryOptions = allCategory.map((cat) => ({
//         value: cat.id,
//         label: cat.name,
//     }));

//     const subCategoryOptions = filteredSubCategories.map((sub) => ({
//         value: sub.id,
//         label: sub.name,
//     }));

//     const handleCreate = async (formData) => {
//         await axios.post(route("ourpalaeographical.store"), formData, {
//             headers: { "Content-Type": "multipart/form-data" },
//         });
//         setReloadTrigger((prev) => !prev);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();

//         for (const key in palaeographicalForm) {
//             if (key === "image") {
//                 if (palaeographicalForm.image) {
//                     formData.append("image", palaeographicalForm.image);
//                 }
//             } else if (key === "sub_category_id") {
//                 formData.append(
//                     "sub_category_id",
//                     selectedCategoryHasSub && palaeographicalForm.sub_category_id
//                         ? palaeographicalForm.sub_category_id
//                         : ""
//                 );
//             } else if (
//                 palaeographicalForm[key] !== null &&
//                 palaeographicalForm[key] !== ""
//             ) {
//                 formData.append(key, palaeographicalForm[key]);
//             }
//         }

//         try {
//             setSubmitting(true);
//             await handleCreate(formData);
//             setPalaeographicalForm(emptyForm);
//             setImagePreview(null);
//             setShowForm(false);
//         } catch (error) {
//             console.error("Error saving data", error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const handleClose = () => {
//         setShowForm(false);
//         setPalaeographicalForm(emptyForm);
//         setImagePreview(null);
//     };

//     const inputClass =
//         "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

//     const labelClass = "block text-sm font-medium text-gray-700 mb-1";

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
//                 <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
//                     <h2 className="text-2xl font-bold text-gray-800">
//                         Add New Palaeographical
//                     </h2>
//                     <button
//                         onClick={handleClose}
//                         className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>

//                 <div className="overflow-y-auto flex-1 px-6 py-4">
//                     <form onSubmit={handleSubmit} className="space-y-4">
//                         <div className="flex gap-3">
//                             <div className="flex-1">
//                                 <label className={labelClass}>
//                                     Category{" "}
//                                     <span className="text-red-500">*</span>
//                                 </label>
//                                 <Select
//                                     options={categoryOptions}
//                                     value={
//                                         categoryOptions.find(
//                                             (opt) =>
//                                                 opt.value ===
//                                                 parseInt(
//                                                     palaeographicalForm.category_id
//                                                 )
//                                         ) || null
//                                     }
//                                     onChange={(selected) =>
//                                         setPalaeographicalForm((prev) => ({
//                                             ...prev,
//                                             category_id: selected
//                                                 ? selected.value
//                                                 : "",
//                                         }))
//                                     }
//                                     placeholder="Select Category"
//                                     styles={selectStyles}
//                                     menuPlacement="auto"
//                                     isClearable
//                                 />
//                             </div>

//                             {selectedCategoryHasSub && (
//                                 <div className="flex-1">
//                                     <label className={labelClass}>
//                                         Sub Category
//                                     </label>
//                                     <Select
//                                         options={subCategoryOptions}
//                                         value={
//                                             subCategoryOptions.find(
//                                                 (opt) =>
//                                                     opt.value ===
//                                                     parseInt(
//                                                         palaeographicalForm.sub_category_id
//                                                     )
//                                             ) || null
//                                         }
//                                         onChange={(selected) =>
//                                             setPalaeographicalForm((prev) => ({
//                                                 ...prev,
//                                                 sub_category_id: selected
//                                                     ? selected.value
//                                                     : "",
//                                             }))
//                                         }
//                                         placeholder="Select Sub Category"
//                                         styles={selectStyles}
//                                         menuPlacement="auto"
//                                         isClearable
//                                     />
//                                 </div>
//                             )}
//                         </div>

//                         <div className="space-y-2">
//                             <label className={labelClass}>Image</label>
//                             <div className="border-2 border-dashed border-gray-400 rounded-xl p-6 text-center hover:border-indigo-400 transition-all duration-300 relative bg-white">
//                                 {imagePreview ? (
//                                     <div className="space-y-2">
//                                         <img
//                                             src={imagePreview}
//                                             alt="Preview"
//                                             className="mx-auto h-40 w-full object-cover rounded-lg shadow-lg"
//                                         />
//                                         <p className="text-sm text-gray-500">
//                                             Click to change image
//                                         </p>
//                                     </div>
//                                 ) : (
//                                     <div className="space-y-3">
//                                         <Upload className="mx-auto h-10 w-10 text-gray-400" />
//                                         <p className="text-sm text-gray-700">
//                                             Click to upload image
//                                         </p>
//                                         <p className="text-xs text-gray-400">
//                                             JPG, JPEG, PNG supported
//                                         </p>
//                                     </div>
//                                 )}
//                                 <input
//                                     type="file"
//                                     name="image"
//                                     accept="image/jpg,image/jpeg,image/png"
//                                     onChange={handleChange}
//                                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                                 />
//                             </div>
//                         </div>

//                         <div className="flex gap-3">
//                             <div className="flex-1">
//                                 <label className={labelClass}>Image Name</label>
//                                 <input
//                                     type="text"
//                                     name="image_name"
//                                     value={palaeographicalForm.image_name}
//                                     onChange={handleChange}
//                                     placeholder="Enter image name"
//                                     className={inputClass}
//                                 />
//                             </div>
//                             <div className="flex-1">
//                                 <label className={labelClass}>URL</label>
//                                 <input
//                                     type="text"
//                                     name="url"
//                                     value={palaeographicalForm.url}
//                                     onChange={handleChange}
//                                     placeholder="https://..."
//                                     className={inputClass}
//                                 />
//                             </div>
//                         </div>

//                         <div className="flex gap-3">
//                             <div className="flex-1">
//                                 <label className={labelClass}>Period</label>
//                                 <Select
//                                     options={fieldOptions.period}
//                                     value={getSelectValue(
//                                         fieldOptions.period,
//                                         palaeographicalForm.period
//                                     )}
//                                     onChange={handleSelectChange("period")}
//                                     placeholder="Select Period"
//                                     styles={selectStyles}
//                                     menuPlacement="auto"
//                                     isClearable
//                                 />
//                             </div>
//                             <div className="flex-1">
//                                 <label className={labelClass}>Script</label>
//                                 <Select
//                                     options={fieldOptions.script}
//                                     value={getSelectValue(
//                                         fieldOptions.script,
//                                         palaeographicalForm.script
//                                     )}
//                                     onChange={handleSelectChange("script")}
//                                     placeholder="Select Script"
//                                     styles={selectStyles}
//                                     menuPlacement="auto"
//                                     isClearable
//                                 />
//                             </div>
//                         </div>

//                         <div className="flex gap-3">
//                             <div className="flex-1">
//                                 <label className={labelClass}>Varna</label>
//                                 <Select
//                                     options={fieldOptions.varna}
//                                     value={getSelectValue(
//                                         fieldOptions.varna,
//                                         palaeographicalForm.varna
//                                     )}
//                                     onChange={handleSelectChange("varna")}
//                                     placeholder="Select Varna"
//                                     styles={selectStyles}
//                                     menuPlacement="auto"
//                                     isClearable
//                                 />
//                             </div>
//                             <div className="flex-1">
//                                 <label className={labelClass}>Symbols</label>
//                                 <Select
//                                     options={fieldOptions.symbols}
//                                     value={getSelectValue(
//                                         fieldOptions.symbols,
//                                         palaeographicalForm.symbols
//                                     )}
//                                     onChange={handleSelectChange("symbols")}
//                                     placeholder="Select Symbols"
//                                     styles={selectStyles}
//                                     menuPlacement="auto"
//                                     isClearable
//                                 />
//                             </div>
//                         </div>

//                         <div>
//                             <label className={labelClass}>Citra</label>
//                             <Select
//                                 options={fieldOptions.citra}
//                                 value={getSelectValue(
//                                     fieldOptions.citra,
//                                     palaeographicalForm.citra
//                                 )}
//                                 onChange={handleSelectChange("citra")}
//                                 placeholder="Select Citra"
//                                 styles={selectStyles}
//                                 menuPlacement="auto"
//                                 isClearable
//                             />
//                         </div>

//                         <div className="flex justify-end gap-3 pt-2 pb-2">
//                             <button
//                                 type="button"
//                                 onClick={handleClose}
//                                 className="px-5 py-2 rounded-full border border-gray-300 text-sm hover:bg-gray-50"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 type="submit"
//                                 disabled={submitting}
//                                 className="px-5 py-2 rounded-full bg-indigo-600 text-white text-sm hover:bg-indigo-700 disabled:opacity-60"
//                             >
//                                 {submitting ? "Saving..." : "Create"}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AddPalaeographicalForm;

import axios from "axios";
import { X, Upload } from "lucide-react";
import React, { useEffect, useState } from "react";
import Select from "react-select";

const AddPalaeographicalForm = ({
    setShowForm,
    setReloadTrigger,
    allCategory = [],
    allChildCategories = [],
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);
    const [selectedCategoryHasSub, setSelectedCategoryHasSub] = useState(false);
    const [filteredChildCategories, setFilteredChildCategories] = useState([]);
    const [selectedSubCategoryHasChild, setSelectedSubCategoryHasChild] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.width = "100%";
        return () => {
            document.body.style.overflow = "unset";
            document.body.style.position = "static";
            document.body.style.width = "auto";
        };
    }, []);

    const fieldOptions = {
        period: [
            { value: "Malla", label: "Malla" },
            { value: "Licchavi", label: "Licchavi" },
            { value: "Shah/Rana", label: "Shah/Rana" },
        ],
        script: [
            { value: "Licchavi", label: "Licchavi" },
            { value: "Newari", label: "Newari" },
            { value: "Rañjanā", label: "Rañjanā" },
            { value: "Devanāgarī", label: "Devanāgarī" },
        ],
        varna: [
            { value: "Svaravarṇa", label: "Svaravarṇa" },
            { value: "Vyañjanavarṇa", label: "Vyañjanavarṇa" },
            { value: "Saṃyuktavarṇa", label: "Saṃyuktavarṇa" },
        ],
        symbols: [
            { value: "Siddham | Maṅgala", label: "Siddham | Maṅgala" },
            { value: "Visarga", label: "Visarga" },
            { value: "Virāma", label: "Virāma" },
            { value: "Avagraha", label: "Avagraha" },
            { value: "Yojakacihna", label: "Yojakacihna" },
        ],
        citra: [
            { value: "Licchavi", label: "Licchavi" },
            { value: "Malla", label: "Malla" },
            { value: "Shah/Rana", label: "Shah/Rana" },
        ],
    };

    const emptyForm = {
        category_id: "",
        sub_category_id: "",
        child_category_id: "",
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

    const selectStyles = {
        control: (base, state) => ({
            ...base,
            borderColor: state.isFocused ? "#6366f1" : "#d1d5db",
            boxShadow: state.isFocused
                ? "0 0 0 2px rgba(99,102,241,0.2)"
                : "none",
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
            minHeight: "38px",
            "&:hover": { borderColor: "#6366f1" },
        }),
        option: (base, state) => ({
            ...base,
            fontSize: "0.875rem",
            backgroundColor: state.isSelected
                ? "#6366f1"
                : state.isFocused
                ? "#eef2ff"
                : "white",
            color: state.isSelected ? "white" : "#1f2937",
            cursor: "pointer",
        }),
        placeholder: (base) => ({
            ...base,
            color: "#9ca3af",
            fontSize: "0.875rem",
        }),
        singleValue: (base) => ({
            ...base,
            color: "#1f2937",
            fontSize: "0.875rem",
        }),
        menu: (base) => ({
            ...base,
            borderRadius: "0.5rem",
            zIndex: 9999,
            boxShadow:
                "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
        }),
        menuList: (base) => ({
            ...base,
            maxHeight: "180px",
            overflowY: "auto",
        }),
    };

    useEffect(() => {
        setPalaeographicalForm(emptyForm);
        setImagePreview(null);
        setFilteredSubCategories([]);
        setSelectedCategoryHasSub(false);
        setFilteredChildCategories([]);
        setSelectedSubCategoryHasChild(false);
    }, []);

    // Watch category_id → populate sub-categories
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
            setPalaeographicalForm((prev) => ({
                ...prev,
                sub_category_id: "",
                child_category_id: "",
            }));
        }
    }, [palaeographicalForm.category_id, allCategory]);

    // Watch sub_category_id → filter child categories from allChildCategories prop
    useEffect(() => {
        if (
            !palaeographicalForm.sub_category_id ||
            allChildCategories.length === 0
        ) {
            setFilteredChildCategories([]);
            setSelectedSubCategoryHasChild(false);
            return;
        }

        const subId = parseInt(palaeographicalForm.sub_category_id);
        const foundSub = filteredSubCategories.find((s) => s.id === subId);

        if (foundSub && foundSub.has_child_category) {
            const children = allChildCategories.filter(
                (c) => c.sub_category_id === subId
            );
            setFilteredChildCategories(children);
            setSelectedSubCategoryHasChild(true);
        } else {
            setFilteredChildCategories([]);
            setSelectedSubCategoryHasChild(false);
            setPalaeographicalForm((prev) => ({
                ...prev,
                child_category_id: "",
            }));
        }
    }, [
        palaeographicalForm.sub_category_id,
        filteredSubCategories,
        allChildCategories,
    ]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file" && files[0]) {
            setPalaeographicalForm((prev) => ({ ...prev, [name]: files[0] }));
            setImagePreview(URL.createObjectURL(files[0]));
        } else {
            setPalaeographicalForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSelectChange = (name) => (selected) => {
        setPalaeographicalForm((prev) => ({
            ...prev,
            [name]: selected ? selected.value : "",
        }));
    };

    const getSelectValue = (options, value) =>
        options.find((opt) => opt.value === value) || null;

    const categoryOptions = allCategory.map((cat) => ({
        value: cat.id,
        label: cat.name,
    }));

    const subCategoryOptions = filteredSubCategories.map((sub) => ({
        value: sub.id,
        label: sub.name,
    }));

    const childCategoryOptions = filteredChildCategories.map((child) => ({
        value: child.id,
        label: child.name,
    }));

    const handleCreate = async (formData) => {
        await axios.post(route("ourpalaeographical.store"), formData, {
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
                    selectedCategoryHasSub &&
                        palaeographicalForm.sub_category_id
                        ? palaeographicalForm.sub_category_id
                        : ""
                );
            } else if (key === "child_category_id") {
                formData.append(
                    "child_category_id",
                    selectedSubCategoryHasChild &&
                        palaeographicalForm.child_category_id
                        ? palaeographicalForm.child_category_id
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
            await handleCreate(formData);
            setPalaeographicalForm(emptyForm);
            setImagePreview(null);
            setShowForm(false);
        } catch (error) {
            console.error("Error saving data", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setShowForm(false);
        setPalaeographicalForm(emptyForm);
        setImagePreview(null);
    };

    const inputClass =
        "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Add New Palaeographical
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 px-6 py-4">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Category + Sub Category */}
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label className={labelClass}>
                                    Category{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <Select
                                    options={categoryOptions}
                                    value={
                                        categoryOptions.find(
                                            (opt) =>
                                                opt.value ===
                                                parseInt(
                                                    palaeographicalForm.category_id
                                                )
                                        ) || null
                                    }
                                    onChange={(selected) =>
                                        setPalaeographicalForm((prev) => ({
                                            ...prev,
                                            category_id: selected
                                                ? selected.value
                                                : "",
                                            sub_category_id: "",
                                            child_category_id: "",
                                        }))
                                    }
                                    placeholder="Select Category"
                                    styles={selectStyles}
                                    menuPlacement="auto"
                                    isClearable
                                />
                            </div>

                            {selectedCategoryHasSub && (
                                <div className="flex-1">
                                    <label className={labelClass}>
                                        Sub Category
                                    </label>
                                    <Select
                                        options={subCategoryOptions}
                                        value={
                                            subCategoryOptions.find(
                                                (opt) =>
                                                    opt.value ===
                                                    parseInt(
                                                        palaeographicalForm.sub_category_id
                                                    )
                                            ) || null
                                        }
                                        onChange={(selected) =>
                                            setPalaeographicalForm((prev) => ({
                                                ...prev,
                                                sub_category_id: selected
                                                    ? selected.value
                                                    : "",
                                                child_category_id: "",
                                            }))
                                        }
                                        placeholder="Select Sub Category"
                                        styles={selectStyles}
                                        menuPlacement="auto"
                                        isClearable
                                    />
                                </div>
                            )}
                        </div>

                        {/* Child Category — only when sub has children */}
                        {selectedSubCategoryHasChild && (
                            <div>
                                <label className={labelClass}>
                                    Child Category
                                </label>
                                <Select
                                    options={childCategoryOptions}
                                    value={
                                        childCategoryOptions.find(
                                            (opt) =>
                                                opt.value ===
                                                parseInt(
                                                    palaeographicalForm.child_category_id
                                                )
                                        ) || null
                                    }
                                    onChange={(selected) =>
                                        setPalaeographicalForm((prev) => ({
                                            ...prev,
                                            child_category_id: selected
                                                ? selected.value
                                                : "",
                                        }))
                                    }
                                    placeholder="Select Child Category"
                                    styles={selectStyles}
                                    menuPlacement="auto"
                                    isClearable
                                />
                            </div>
                        )}

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <label className={labelClass}>Image</label>
                            <div className="border-2 border-dashed border-gray-400 rounded-xl p-6 text-center hover:border-indigo-400 transition-all duration-300 relative bg-white">
                                {imagePreview ? (
                                    <div className="space-y-2">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="mx-auto h-40 w-full object-cover rounded-lg shadow-lg"
                                        />
                                        <p className="text-sm text-gray-500">
                                            Click to change image
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <Upload className="mx-auto h-10 w-10 text-gray-400" />
                                        <p className="text-sm text-gray-700">
                                            Click to upload image
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            JPG, JPEG, PNG supported
                                        </p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/jpg,image/jpeg,image/png"
                                    onChange={handleChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Image Name + URL */}
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label className={labelClass}>Image Name</label>
                                <input
                                    type="text"
                                    name="image_name"
                                    value={palaeographicalForm.image_name}
                                    onChange={handleChange}
                                    placeholder="Enter image name"
                                    className={inputClass}
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
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Period + Script */}
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label className={labelClass}>Period</label>
                                <Select
                                    options={fieldOptions.period}
                                    value={getSelectValue(
                                        fieldOptions.period,
                                        palaeographicalForm.period
                                    )}
                                    onChange={handleSelectChange("period")}
                                    placeholder="Select Period"
                                    styles={selectStyles}
                                    menuPlacement="auto"
                                    isClearable
                                />
                            </div>
                            <div className="flex-1">
                                <label className={labelClass}>Script</label>
                                <Select
                                    options={fieldOptions.script}
                                    value={getSelectValue(
                                        fieldOptions.script,
                                        palaeographicalForm.script
                                    )}
                                    onChange={handleSelectChange("script")}
                                    placeholder="Select Script"
                                    styles={selectStyles}
                                    menuPlacement="auto"
                                    isClearable
                                />
                            </div>
                        </div>

                        {/* Varna + Symbols */}
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label className={labelClass}>Varna</label>
                                <Select
                                    options={fieldOptions.varna}
                                    value={getSelectValue(
                                        fieldOptions.varna,
                                        palaeographicalForm.varna
                                    )}
                                    onChange={handleSelectChange("varna")}
                                    placeholder="Select Varna"
                                    styles={selectStyles}
                                    menuPlacement="auto"
                                    isClearable
                                />
                            </div>
                            <div className="flex-1">
                                <label className={labelClass}>Symbols</label>
                                <Select
                                    options={fieldOptions.symbols}
                                    value={getSelectValue(
                                        fieldOptions.symbols,
                                        palaeographicalForm.symbols
                                    )}
                                    onChange={handleSelectChange("symbols")}
                                    placeholder="Select Symbols"
                                    styles={selectStyles}
                                    menuPlacement="auto"
                                    isClearable
                                />
                            </div>
                        </div>

                        {/* Citra */}
                        <div>
                            <label className={labelClass}>Citra</label>
                            <Select
                                options={fieldOptions.citra}
                                value={getSelectValue(
                                    fieldOptions.citra,
                                    palaeographicalForm.citra
                                )}
                                onChange={handleSelectChange("citra")}
                                placeholder="Select Citra"
                                styles={selectStyles}
                                menuPlacement="auto"
                                isClearable
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-3 pt-2 pb-2">
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
                                {submitting ? "Saving..." : "Create"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddPalaeographicalForm;