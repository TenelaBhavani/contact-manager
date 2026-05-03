import { useEffect, useState } from "react";

const API = "http://localhost:8000/contacts"; // Backend API URL

function App() {
  const [contacts, setContacts] = useState([]); // Stores all contacts

  const [form, setForm] = useState({  // Stores form input values
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [editId, setEditId] = useState(null); // Tracks which contact is being edited

  // Fetch all contacts from backend
  const fetchContacts = async () => {
    const res = await fetch(API);      // API call
    const data = await res.json();     // Convert response to JSON
    setContacts(data);                 // Save in state
  };

  useEffect(() => {
    fetchContacts(); // Run once when component loads
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value }); // Update form field
  };

  // Add or Update contact
  const addContact = async () => {

    // Check required fields
    if (!form.first_name || !form.last_name || !form.email || !form.phone || !form.address) {
      alert("All fields are required");
      return;
    }

    // Email validation using regex
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email)) {
      alert("Enter a valid email");
      return;
    }

    // Phone must be exactly 10 digits
    if (!/^\d{10}$/.test(form.phone)) {
      alert("Phone must be 10 digits");
      return;
    }

    // Check duplicate email (ignore current editing item)
    const emailExists = contacts.some(
      (c) => c.email.toLowerCase() === form.email.toLowerCase() && c.id !== editId
    );
    if (emailExists) {
      alert("Email already exists");
      return;
    }

    // Check duplicate phone
    const phoneExists = contacts.some(
      (c) => c.phone === form.phone && c.id !== editId
    );
    if (phoneExists) {
      alert("Phone number already exists");
      return;
    }

    if (editId) {
      // UPDATE existing contact
      await fetch(`${API}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      alert("Contact updated");
      setEditId(null); // Clear edit mode
    } else {
      // ADD new contact
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      alert("Contact added");
    }

    // Reset form after submit
    setForm({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
    });

    fetchContacts(); // Refresh list
  };

  // Delete contact
  const deleteContact = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" }); // Delete API call
    fetchContacts(); // Refresh list
  };

  // Load selected contact into form for editing
  const editContact = (contact) => {
    setForm(contact);      // Fill form with selected contact data
    setEditId(contact.id); // Set edit mode
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        padding: "20px",
        background: "rgba(0,0,0,0.6)",
        borderRadius: "10px",
        color: "white",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Contact Manager</h2>

      {/* FORM INPUTS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <input name="first_name" placeholder="First Name" value={form.first_name} onChange={handleChange} /> {/* First name input */}
        <input name="last_name" placeholder="Last Name" value={form.last_name} onChange={handleChange} /> {/* Last name input */}
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} /> {/* Email input */}

        {/* Phone input (only numbers allowed) */}
        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numbers
            setForm({ ...form, phone: value });
          }}
        />

        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          style={{ gridColumn: "span 2" }}
        /> {/* Address input */}
      </div>

      {/* Add / Update button */}
      <button
        onClick={addContact}
        style={{
          width: "100%",
          padding: "10px",
          background: editId ? "#2196F3" : "#4CAF50", // Change color if editing
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        {editId ? "Update Contact" : "Add Contact"} {/* Dynamic button text */}
      </button>

      <hr style={{ margin: "20px 0" }} />

      {/* CONTACT LIST */}
      {contacts.map((c) => (
        <div
          key={c.id}
          style={{
            background: "rgba(255,255,255,0.1)",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "10px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <strong>{c.first_name} {c.last_name}</strong><br />
            <small>{c.email}</small><br />
            <small>{c.phone}</small><br />
            <small>{c.address}</small>
          </div>

          <div style={{ display: "flex", gap: "5px" }}>
            {/* Edit button */}
            <button
  onClick={() => editContact(c)}
  style={{
    background: "#2196F3",
    color: "white",
    border: "none",
    padding: "4px 8px",        // 👈 reduced
    cursor: "pointer",
    borderRadius: "4px",
    fontSize: "12px",          // 👈 smaller text
    height: "30px"
  }}
>
  Edit
</button>

<button
  onClick={() => deleteContact(c.id)}
  style={{
    background: "red",
    color: "white",
    border: "none",
    padding: "4px 8px",        // 👈 reduced
    cursor: "pointer",
    borderRadius: "4px",
    fontSize: "12px",
    height: "30px"
  }}
>
  Delete
</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;