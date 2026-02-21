import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./Account.css";
import DeliveryAddress from "../../components/DeliveryAddress/DeliveryAddress";
import { apiService, API_BASE_URL } from "../../api/apiService";
import { updateUserProfile } from "../../redux/slices/authSlice";

function AccountPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, firstName, lastName, email, phone, user } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: firstName || "",
    lastName: lastName || "",
    email: email || "",
    phone: phone || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/sign-in");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    setFormData({
      firstName: firstName || "",
      lastName: lastName || "",
      email: email || "",
      phone: phone || "",
    });
  }, [firstName, lastName, email, phone]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      const dataToUpdate = new FormData();
      dataToUpdate.append("firstName", formData.firstName);
      dataToUpdate.append("lastName", formData.lastName);
      dataToUpdate.append("email", formData.email);
      dataToUpdate.append("phone", formData.phone);

      if (fileInputRef.current.files[0]) {
        dataToUpdate.append("profilePic", fileInputRef.current.files[0]);
      }

      // API call to update profile
      const response = await apiService.updateProfile(dataToUpdate);

      // Update local state and Redux
      dispatch(updateUserProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        profilePic: response.user?.profilePic || previewImage // Use backend URL if available
      }));

      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Failed to update profile. Ensure your backend has the PUT /update-profile endpoint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-page-container">
      <div className="account-header">
        <h2>Account Dashboard</h2>
      </div>

      <div className="account-dashboard-vertical">
        <main className="account-content">
          {/* Centered Profile Section (Top) */}
          <section className="content-section profile-info-centered">
            <div className="profile-edit-actions">
              {!isEditing ? (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  <i className="bi bi-pencil-square"></i> Edit Profile
                </button>
              ) : (
                <div className="edit-controls">
                  <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                  <button className="save-btn" onClick={handleSave} disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>

            {error && <p className="error-message-alt">{error}</p>}

            <div className="profile-top-info">
              <div
                className={`user-avatar-main ${isEditing ? 'editable' : ''}`}
                onClick={handleImageClick}
              >
                {previewImage || user?.profilePic ? (
                  <img
                    src={previewImage || (user.profilePic.startsWith('data:') ? user.profilePic : `${API_BASE_URL}${user.profilePic}`)}
                    alt="Profile"
                    className="profile-img-large"
                  />
                ) : (
                  <i className="bi bi-person-circle"></i>
                )}
                {isEditing && <div className="avatar-overlay"><i className="bi bi-camera-fill"></i></div>}
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </div>
              <div className="user-name-main">
                {isEditing ? (
                  <div className="name-edit-group">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="First Name"
                      className="edit-input-main"
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Last Name"
                      className="edit-input-main"
                    />
                  </div>
                ) : (
                  <>
                    <h3>{firstName || "User"} {lastName || ""}</h3>
                    <p>Verified Premium Member</p>
                  </>
                )}
              </div>
            </div>

            <div className="profile-details-grid">
              <div className="info-card">
                <i className="bi bi-envelope-fill"></i>
                <div className="info-text">
                  <span className="info-label">Email Address</span>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="edit-input-small"
                    />
                  ) : (
                    <span className="info-value">{email || "Not provided"}</span>
                  )}
                </div>
              </div>
              <div className="info-card">
                <i className="bi bi-telephone-fill"></i>
                <div className="info-text">
                  <span className="info-label">Phone Number</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="edit-input-small"
                    />
                  ) : (
                    <span className="info-value">{phone || "Not provided"}</span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Address Section */}
          <section className="content-section">
            <div className="section-title">
              <i className="bi bi-geo-alt-fill"></i>
              <h3>Manage Your Addresses</h3>
            </div>
            <div className="user-address">
              <DeliveryAddress />
            </div>
          </section>

          {/* Activity Section */}
          <section className="content-section">
            <div className="section-title">
              <i className="bi bi-clock-history"></i>
              <h3>Shopping History</h3>
            </div>
            <p className="activity-placeholder">
              Your recent shopping activities and history will appear here.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}

export default AccountPage;