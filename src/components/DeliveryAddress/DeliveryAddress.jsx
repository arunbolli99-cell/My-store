
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import apiService from "../../api/apiService";
import "./DeliveryAddress.css";

function DeliveryAddress({ onSelectAddress, selectedAddressId }) {
    const { isLoggedIn } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    // Addresses state
    const [addresses, setAddresses] = useState([]);

    const [showAddForm, setShowAddForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [newAddress, setNewAddress] = useState({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: ""
    });

    useEffect(() => {
        if (!isLoggedIn) {
            // If used as a page, redirect. If component, handle parent logic.
            // navigate("/sign-in"); 
            return;
        }
        fetchAddresses();
    }, [isLoggedIn]);

    const fetchAddresses = async () => {
        setLoading(true);
        try {
            const data = await apiService.getAddresses();
            let fetchedAddresses = [];
            if (Array.isArray(data)) {
                fetchedAddresses = data;
            } else if (data && data.addresses) {
                fetchedAddresses = data.addresses;
            }

            setAddresses(fetchedAddresses);

            // Default selection: if no address is selected and we have addresses, select the latest one (last in list)
            if (!selectedAddressId && fetchedAddresses.length > 0 && onSelectAddress) {
                onSelectAddress(fetchedAddresses[fetchedAddresses.length - 1]);
            }
        } catch (err) {
            console.error("Failed to fetch addresses", err);
            setError("Failed to load addresses.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await apiService.addAddress(newAddress);
            await fetchAddresses(); // Refresh list from server

            setShowAddForm(false);
            setNewAddress({ fullName: "", phone: "", address: "", city: "", state: "", pincode: "" });
        } catch (err) {
            console.error("Failed to save address", err);
            setError("Failed to save address. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAddress = async (e, addressId) => {
        e.stopPropagation(); // Prevent card click event
        if (!window.confirm("Are you sure you want to delete this address?")) return;

        setLoading(true);
        try {
            await apiService.deleteAddress(addressId);
            await fetchAddresses();
            // If the deleted address was selected, deselect it
            if (selectedAddressId === addressId && onSelectAddress) {
                onSelectAddress(null);
            }
        } catch (err) {
            console.error("Failed to delete address", err);
            setError("Failed to delete address.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setShowAddForm(false);
        setError("");
    }

    return (
        <div className="delivery-address-container">
            {!showAddForm && <h2>Saved Addresses</h2>}

            {error && <p className="error-message">{error}</p>}
            {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}

            {!showAddForm ? (
                <div className="address-list">
                    {addresses.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#666' }}>No saved addresses found.</p>
                    ) : (
                        addresses.map((addr) => (
                            <div
                                key={addr._id || addr.id}
                                className={`address-card ${selectedAddressId === (addr._id || addr.id) ? 'selected' : ''}`}
                                onClick={() => onSelectAddress && onSelectAddress(addr)}
                            >
                                {/* Selected Indicator (Top Left) */}
                                {selectedAddressId === (addr._id || addr.id) && <div className="selected-badge">✓ Selected</div>}

                                <div className="address-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                                        <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                                    </svg>
                                </div>

                                <div className="card-header">
                                    <h4>{addr.fullName}</h4>
                                </div>

                                <p className="phone-text">{addr.phone}</p>
                                <p className="address-text">
                                    {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                                </p>

                                <button
                                    className="delete-address-btn"
                                    onClick={(e) => handleDeleteAddress(e, addr._id || addr.id)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))
                    )}

                    <button
                        className="submit_btn"
                        onClick={() => setShowAddForm(true)}
                        style={{ marginTop: '20px' }}
                    >
                        + Add New Address
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSaveAddress} className="address-form">
                    <h3>Add New Address</h3>

                    <div className="form-group">
                        <label>Full Name *</label>
                        <input
                            type="text"
                            name="fullName"
                            value={newAddress.fullName}
                            onChange={handleInputChange}
                            placeholder="Enter full name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone *</label>
                        <input
                            type="tel"
                            name="phone"
                            value={newAddress.phone}
                            onChange={handleInputChange}
                            placeholder="Enter 10-digit phone number"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Address *</label>
                        <textarea
                            rows="3"
                            name="address"
                            value={newAddress.address}
                            onChange={handleInputChange}
                            placeholder="Enter address"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>City *</label>
                        <input
                            type="text"
                            name="city"
                            value={newAddress.city}
                            onChange={handleInputChange}
                            placeholder="City"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>State *</label>
                        <input
                            type="text"
                            name="state"
                            value={newAddress.state}
                            onChange={handleInputChange}
                            placeholder="State"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Pincode *</label>
                        <input
                            type="text"
                            name="pincode"
                            value={newAddress.pincode}
                            onChange={handleInputChange}
                            placeholder="Enter pincode"
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="submit_btn" disabled={loading}>
                            {loading ? "Saving..." : "Save Address"}
                        </button>
                        <button
                            type="button"
                            className="submit_btn cancel-btn"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default DeliveryAddress;
