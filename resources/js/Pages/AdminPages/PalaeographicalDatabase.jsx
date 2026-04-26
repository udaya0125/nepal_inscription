import AddPalaeographicalForm from '@/AddFormComponents/AddPalaeographicalForm';
import AdminWrapper from '@/AdminWrapper/AdminWrapper'
import React from 'react'

const PalaeographicalDatabase = () => {
      const [allUser, setAllUser] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const [showForm, setShowForm] = useState(false);


    // For fetching the user data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(route("users.index"));
                setAllUser(response.data);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };

        fetchUser();
    }, [reloadTrigger]);

    // For delete the user
    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(
                route("users.destroy", { id: id })
            );
            console.log(response.data);
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    // handleedit
    const handleEdit = (user) => {
        setEditingUser(user);
    };

    // Handlapdate after the  edit
    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("users.update", { id }),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error updating user", error);
            throw error;
        }
    };

  return (
    <>
    <AdminWrapper>
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
            <AddPalaeographicalForm
                showForm={showForm}
                setShowForm={setShowForm}
                handleCreate={handleCreate}
                handleUpdate={handleUpdate}
                editingCategory={editingCategory}
                setReloadTrigger={setReloadTrigger}
                reloadTrigger={reloadTrigger}
            />
        </div>
    </AdminWrapper>
    </>
  )
}

export default PalaeographicalDatabase
