import React from 'react'

const AddPalaeographicalForm = () => {
        
    const [submitting, setSubmitting] = useState(false);
    const [userForm, setUserForm] = useState({
        fullname: "",
        email: "",
        image: "",
        address: "",
        role: "",
        status: "",
        date: "",
        auth: "",
    });
    //  Use Effect
    useEffect(() => {
        if (editingPalaeographical) {
            setUserForm({
                ...editingPalaeographical,
                image: null,
            });
            setShowForm(true);
        } else {
            setUserForm({
                fullname: "",
                email: "",
                image: "",
                address: "",
                role: "",
                status: "",
                date: "",
                auth: "",
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
            console.log("Error creating user", error);
            throw error;
        }
    };

    // Handle Submit - now clearly separated paths
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        // Append all form data except image if it's empty
        for (const key in userForm) {
            if (userForm[key] !== null && userForm[key] !== "") {
                formData.append(key, userForm[key]);
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
            setUserForm({
                fullname: "",
                email: "",
                address: "",
                role: "",
                status: "",
                date: "",
                auth: "",
                image: null,
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
        setUserForm((prev) => ({
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
                                setEditingPalaeographical(null);
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
  )
}

export default AddPalaeographicalForm
