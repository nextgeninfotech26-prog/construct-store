import { useEffect, useState } from "react";
import api from "./../api.js"

export default function ProfilePage() {

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        image_url: ""
    });

    const token = localStorage.getItem("token");

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {

            const response = await api.get(
                "/profile"
            );

            setFormData(response.data);

        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const updateProfile = async () => {

        try {

            await api.put(
                "/profile/update",
                formData
            );

            alert("Profile Updated");

        } catch (error) {
            console.error(error);
        }
    };

    const uploadImage = async (e) => {

        const file = e.target.files[0];

        if (!file) return;

        const data = new FormData();

        data.append("file", file);

        try {

            const response = await api.post(
                "/profile/upload-image",
                data
            );

            setFormData({
                ...formData,
                image_url: response.data.image_url
            });

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-5">

            <h2 className="text-3xl font-bold mb-5">
                My Profile
            </h2>

            <div className="mb-4">

                <img
                    src={`http://localhost:8000${formData.image_url}`}
                    alt=""
                    className="w-32 h-32 rounded-full object-cover"
                />

                <input
                    type="file"
                    onChange={uploadImage}
                    className="mt-3"
                />

            </div>

            <div className="grid gap-4">

                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
                    className="border p-3 rounded"
                />

                <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="border p-3 rounded bg-gray-100"
                />

                <input
                    type="text"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                    placeholder="Phone"
                    className="border p-3 rounded"
                />

                <textarea
                    name="address"
                    value={formData.address || ""}
                    onChange={handleChange}
                    placeholder="Address"
                    className="border p-3 rounded"
                />

                <input
                    type="text"
                    name="city"
                    value={formData.city || ""}
                    onChange={handleChange}
                    placeholder="City"
                    className="border p-3 rounded"
                />

                <input
                    type="text"
                    name="state"
                    value={formData.state || ""}
                    onChange={handleChange}
                    placeholder="State"
                    className="border p-3 rounded"
                />

                <input
                    type="text"
                    name="pincode"
                    value={formData.pincode || ""}
                    onChange={handleChange}
                    placeholder="Pincode"
                    className="border p-3 rounded"
                />

                <button
                    onClick={updateProfile}
                    className="bg-blue-600 text-white p-3 rounded"
                >
                    Update Profile
                </button>

            </div>

        </div>
    );
}