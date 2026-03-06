import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import "../styles/AddPropert.css";

const AddProperty = () => {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [city, setCity] = useState("");
    const [image, setImage] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await axiosInstance.post("/lisitngs", {
                title,
                price,
                city,
                image,
                description
            });

            alert("Property Added Successfully");
            setTitle("");
            setPrice("");
            setCity("");
            setImage("");
            setDescription("");
        } catch (error) {
            console.error(error);
            alert('Error adding property');
        }
    };

     return (
    <div className="add-property-page">

      <h2>Add New Property</h2>

      <form onSubmit={handleSubmit} className="add-property-form">

        <input
          type="text"
          placeholder="Property Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Price per night"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <textarea
          placeholder="Property Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">Add Property</button>

      </form>

    </div>
  );
};

export default AddProperty;