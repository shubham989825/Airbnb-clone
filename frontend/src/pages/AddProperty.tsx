import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import "../styles/AddProperty.css";

interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
}

const AddProperty = () => {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [city, setCity] = useState("");
    const [imageFiles, setImageFiles] = useState<FileList | null>(null);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [guests, setGuests] = useState("");
    const [bedrooms, setBedrooms] = useState("");
    const [bathrooms, setBathrooms] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await axiosInstance.get("/profile");
                setCurrentUser(response.data.user);
            } catch (error: any) {
                console.error("Failed to fetch current user:", error);
                if (error.response?.status === 401) {
                    alert("Your session has expired. Please log in again.");
                } else {
                    alert("Failed to load user data. Please try refreshing the page.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();
    }, []);

   const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!currentUser) {
    alert("Please log in to add a property");
    return;
  }

  if (!title || !price || !city || !description || !category || !guests || !bedrooms || !bathrooms || !phone || !email) {
    alert("Please fill in all required fields");
    return;
  }

  try {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("price", price);
    formData.append("location", city);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("guests", guests);
    formData.append("bedrooms", bedrooms);
    formData.append("bathrooms", bathrooms);
    formData.append("Phone", phone);
    formData.append("Email", email);

    // 👇 append images
    if (imageFiles) {
      console.log("Uploading images:", imageFiles);
      console.log("Number of images:", imageFiles.length);
      for (let i = 0; i < imageFiles.length; i++) {
        console.log(`Appending image ${i}:`, imageFiles[i]);
        formData.append("images", imageFiles[i]);
      }
    }

    // Debug: Log all FormData entries
    console.log("FormData entries:");
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
    }

    await axiosInstance.post("/listings", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    alert("Property Added Successfully");

  } catch (error) {
    console.error(error);
    alert("Error adding property");
  }
};

     return (
    <div className="add-property-page">
      <h2>Add New Property</h2>

      {loading ? (
        <p>Loading...</p>
      ) : !currentUser ? (
        <p>Unable to load user data. Please log in again.</p>
      ) : currentUser.role !== 'host' ? (
        <p>You need to become a host to add properties. Please go to your profile and click "Become a Host".</p>
      ) : (
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
          type="tel"
          placeholder="Contact Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Contact Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImageFiles(e.target.files)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="villa">Villa</option>
          <option value="cabin">Cabin</option>
          <option value="hotel">Hotel</option>
          <option value="other">Other</option>
        </select>

        <input
          type="number"
          placeholder="Maximum Guests"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          min="1"
          required
        />

        <input
          type="number"
          placeholder="Number of Bedrooms"
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          min="0"
          required
        />

        <input
          type="number"
          placeholder="Number of Bathrooms"
          value={bathrooms}
          onChange={(e) => setBathrooms(e.target.value)}
          min="0"
          step="0.5"
          required
        />

        <textarea
          placeholder="Property Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <button type="submit">Add Property</button>

      </form>
      )}
    </div>
  );
};

export default AddProperty;