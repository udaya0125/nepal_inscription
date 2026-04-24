import AddCategoryForm from "@/AddFormComponents/AddCategoryForm";
import React from "react";

const Category = () => {
    const [allCategories, setAllCategories] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    // For fetching the category data
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axios.get(route("categories.index"));
                setAllCategories(response.data);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };

        fetchCategory();
    }, [reloadTrigger]);

    // For delete the category
    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(
                route("categories.destroy", { id: id }),
            );
            console.log(response.data);
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    // handleedit
    const handleEdit = (category) => {
        setEditingCategory(category);
    };

    // Handlapdate after the  edit
    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("categories.update", { id }),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error updating category", error);
            throw error;
        }
    };

    return (
        <div className="py-4 ">
            {/* Header with Add Button */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                        Category Management
                    </h1>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                >
                    <Plus size={18} />
                    <span>Create</span>
                </button>
            </div>
            <AddCategoryForm 
                showForm={showForm}
                setShowForm={setShowForm}
                handleCreate={handleCreate}
                handleUpdate={handleUpdate}
                editingCategory={editingCategory}
                setReloadTrigger={setReloadTrigger}
                reloadTrigger={reloadTrigger}
            />
        </div>
    );
};

export default Category;
