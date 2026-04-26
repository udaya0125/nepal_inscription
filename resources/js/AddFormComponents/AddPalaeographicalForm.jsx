import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

const AddPalaeographicalForm = ({ editingPalaeographical, setShowForm, setReloadTrigger, setEditingPalaeographical ,showForm }) => {
    const [submitting, setSubmitting] = useState(false);
    const [palaeographicalForm, setPalaeographicalForm] = useState({
        category: "",
        sub_category: "",
        image: null,
        image_name: "",
        url: "",
        period: "",
        script: "",
        varna: "",
        symbols: "",
        citra: "",
    });
    //  Use Effect
    useEffect(() => {
        if (editingPalaeographical) {
            setPalaeographicalForm({
                ...editingPalaeographical,
                image: null,
            });
            setShowForm(true);
        } else {
            setPalaeographicalForm({
                 category: "",
        sub_category: "",
        image: null,
        image_name: "",
        url: "",
        period: "",
        script: "",
        varna: "",
        symbols: "",
        citra: "",
            });
        }
    }, [editingPalaeographical]);

    // Handle Create Palaeographical
    const handleCreate = async (formData) => {
        try {
            await axios.post(route("palaeographical.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log("Error creating palaeographical", error);
            throw error;
        }
    };

    // Handle Submit - now clearly separated paths
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        // Append all form data except image if it's empty
        for (const key in palaeographicalForm) {
            if (
                palaeographicalForm[key] !== null &&
                palaeographicalForm[key] !== ""
            ) {
                formData.append(key, palaeographicalForm[key]);
            }
        }
        try {
            setSubmitting(true);

            if (editingPalaeographical) {
                // Editing existing palaeographical
                await handleUpdate(formData, editingPalaeographical.id);
            } else {
                // Creating new palaeographical
                await handleCreate(formData);
            }
            setPalaeographicalForm({
                 category: "",
        sub_category: "",
        image: null,
        image_name: "",
        url: "",
        period: "",
        script: "",
        varna: "",
        symbols: "",
        citra: "",
            });

            setShowForm(false);
            setEditingPalaeographical(null);
        } catch (error) {
            console.log("Error saving data", error);
        } finally {
            setSubmitting(false);
        }
    };

    // handle  change for image and the others

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setPalaeographicalForm((prev) => ({
            ...prev,
            [name]: type === "file" ? files[0] : value,
        }));
    };

    return (
        <div>
            <div>
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                        {/* Header - Same as AddEmployerForm */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {editingPalaeographical
                                    ? "Edit Palaeographical"
                                    : "Add New Palaeographical"}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowForm(false);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddPalaeographicalForm;
