import React from 'react'

const AddChildCategoryForm = ({ showForm, setShowForm, editingChildCategory, setEditingChildCategory, setReloadTrigger,handleUpdate }) => {
    const [submitting, setSubmitting] = useState(false);
    const [childCategoryForm, setChildCategoryForm] = useState({
        name: "",
        category_id: "",
        sub_category_id: "",
    });
    //  Use Effect
    useEffect(() => {
        if (editingChildCategory) {
            setChildCategoryForm({
                ...editingChildCategory,
                image: null,
            });
            setShowForm(true);
        } else {
            setChildCategoryForm({
                name: "",
                category_id: "",
        sub_category_id: "",
            });
        }
    }, [editingChildCategory]);

    // Handle Create Category
    const handleCreate = async (formData) => {
        try {
            await axios.post(route("ourchildcategories.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log("Error creating child category", error);
            throw error;
        }
    };

    // Handle Submit - now clearly separated paths
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        // Append all form data except image if it's empty
        for (const key in childCategoryForm) {
            if (childCategoryForm[key] !== null && childCategoryForm[key] !== "") {
                formData.append(key, childCategoryForm[key]);
            }
        }
        try {
            setSubmitting(true);

            if (editingChildCategory) {
                // Editing existing child category
                await handleUpdate(formData, editingChildCategory.id);
            } else {
                // Creating new child category
                await handleCreate(formData);
            }
            setChildCategoryForm({
                name: "",
                category_id: "",
        sub_category_id: "",
            });

            setShowForm(false);
            setEditingChildCategory(null);
        } catch (error) {
            console.log("Error saving data", error);
        } finally {
            setSubmitting(false);
        }
    };

    // handle  change for image and the others

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setChildCategoryForm((prev) => ({
            ...prev,
            [name]: type === "file" ? files[0] : value,
        }));
    };

     if (!showForm) return null;
  return (
    <div>
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Add New Child  Category
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
  )
}

export default AddChildCategoryForm
