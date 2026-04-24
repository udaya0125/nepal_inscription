import React from "react";

const AddCategoryForm = ({ showForm, setShowForm, handleCreate, handleUpdate, editingCategory, setReloadTrigger, reloadTrigger , setEditingCategory }) => {
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [categoryForm, setCategoryForm] = useState({
        name: "",
        has_sub_category: false,
    });
    //  Use Effect
    useEffect(() => {
        if (editingCategory) {
            setCategoryForm({
                ...editingCategory,
                image: null,
            });
            setShowForm(true);
        } else {
            setCategoryForm({
                name: "",
                has_sub_category: false,
            });
        }
    }, [editingCategory]);

    // Handle Create Category
    const handleCreate = async (formData) => {
        try {
            await axios.post(route("categories.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log("Error creating category", error);
            throw error;
        }
    };

    // Handle Submit - now clearly separated paths
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        // Append all form data except image if it's empty
        for (const key in categoryForm) {
            if (categoryForm[key] !== null && categoryForm[key] !== "") {
                formData.append(key, categoryForm[key]);
            }
        }
        try {
            setSubmitting(true);

            if (editingCategory) {
                // Editing existing category
                await handleUpdate(formData, editingCategory.id);
            } else {
                // Creating new category
                await handleCreate(formData);
            }
            setCategoryForm({
                name: "",
                has_sub_category: false,
            });

            setShowForm(false);
            setEditingCategory(null);
        } catch (error) {
            console.log("Error saving data", error);
        } finally {
            setSubmitting(false);
        }
    };

    // handle  change for image and the others

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setCategoryForm((prev) => ({
            ...prev,
            [name]: type === "file" ? files[0] : value,
        }));
    };

    return (
        <div>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                    {/* Header - Same as AddEmployerForm */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {editingCustomer
                                ? "Edit Customer"
                                : "Add New Customer"}
                        </h2>
                        <button
                            onClick={() => {
                                setShowForm(false);
                                setEditingCategory(null);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCategoryForm;
