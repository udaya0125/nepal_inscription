import AddPalaeographicalForm from "@/AddFormComponents/AddPalaeographicalForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import axios from "axios";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

const PalaeographicalDatabase = () => {
    const [allPalaeographical, setAllPalaeographical] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingPalaeographical, setEditingPalaeographical] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // For fetching the palaeographical data
    useEffect(() => {
        const fetchPalaeographical = async () => {
            try {
                const response = await axios.get(
                    route("palaeographical.index"),
                );
                setAllPalaeographical(response.data);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };

        fetchPalaeographical();
        const fetchCategory = async () => {
            try {
                const response = await axios.get(
                    route("categorywithsubcategory.indexWithSubCategory"),
                );
                setAllCategory(response.data.data || []);
            } catch (error) {
                console.error("Error fetching category:", error);
                setAllCategory([]);
            }
        };
        fetchCategory();
    }, [reloadTrigger]);

    // For delete the palaeographical
    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(
                route("palaeographical.destroy", { id: id }),
            );
            console.log(response.data);
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    // handleedit
    const handleEdit = (palaeographical) => {
        setEditingPalaeographical(palaeographical);
    };

    // Handlapdate after the  edit
    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("palaeographical.update", { id }),
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
            console.log("Error updating palaeographical", error);
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
                                Palaeographical Management
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
                        // handleCreate={handleCreate}
                        handleUpdate={handleUpdate}
                        editingPalaeographical={editingPalaeographical}
                        setReloadTrigger={setReloadTrigger}
                        reloadTrigger={reloadTrigger}
                    />
                </div>
            </AdminWrapper>
        </>
    );
};

export default PalaeographicalDatabase;
