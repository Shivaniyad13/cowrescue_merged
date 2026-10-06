import { useState, useEffect, useRef } from "react";
import {
  getAdminGallery,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  toggleGalleryPublish,
} from "../../services/api";

const CATEGORIES = [
  "Events",
  "Community",
  "Awareness",
  "Campaigns",
  "Cow Care",
  "Gaushala",
  "Other",
];

const AdminGalleryImages = ({ token }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: CATEGORIES[0],
    description: "",
    alt_text: "",
    is_published: true,
    display_order: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const fileInputRef = useRef(null);

  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    if (token) fetchImages();
  }, [token]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchImages = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAdminGallery(token);
      setImages(res.data || []);
    } catch (err) {
      setError(err.message || "Failed to load gallery.");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingImage(null);
    setForm({
      title: "",
      category: CATEGORIES[0],
      description: "",
      alt_text: "",
      is_published: true,
      display_order: 0,
    });
    setImageFile(null);
    setImagePreview(null);
    setRemoveExistingImage(false);
    setShowModal(true);
  };

  const openEditModal = (image) => {
    setEditingImage(image);
    setForm({
      title: image.title || "",
      category: image.category || CATEGORIES[0],
      description: image.description || "",
      alt_text: image.alt_text || "",
      is_published: image.is_published ?? true,
      display_order: image.display_order || 0,
    });
    setImageFile(null);
    setImagePreview(image.image_url || null);
    setRemoveExistingImage(false);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("Image must be under 5MB", "error");
      return;
    }
    if (!file.type.startsWith("image/")) {
      showToast("Only image files allowed", "error");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setRemoveExistingImage(false);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveExistingImage(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.category) {
      showToast("Title and category are required", "error");
      return;
    }

    if (!editingImage && !imageFile) {
      showToast("Please select an image", "error");
      return;
    }

    setActionLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("category", form.category);
      formData.append("description", form.description.trim());
      formData.append("alt_text", form.alt_text.trim() || form.title.trim());
      formData.append("is_published", form.is_published ? "true" : "false");
      formData.append("display_order", String(form.display_order || 0));

      if (imageFile) formData.append("image", imageFile);
      if (removeExistingImage) formData.append("remove_image", "true");

      if (editingImage) {
        await updateGalleryImage(token, editingImage.id, formData);
        showToast("Image updated successfully");
      } else {
        await createGalleryImage(token, formData);
        showToast("Image added successfully");
      }

      setShowModal(false);
      await fetchImages();
    } catch (err) {
      showToast(err.message || "Failed to save", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleTogglePublish = async (img) => {
    try {
      await toggleGalleryPublish(token, img.id);
      showToast(img.is_published ? "Unpublished" : "Published");
      await fetchImages();
    } catch (err) {
      showToast(err.message || "Failed to toggle", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    setActionLoading(true);
    try {
      await deleteGalleryImage(token, deleteModal.id);
      showToast("Image deleted");
      setDeleteModal(null);
      await fetchImages();
    } catch (err) {
      showToast(err.message || "Failed to delete", "error");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 9999,
            padding: "14px 20px",
            borderRadius: "8px",
            color: "#fff",
            background: toast.type === "error" ? "#dc2626" : "#16a34a",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            maxWidth: "400px",
          }}
        >
          {toast.type === "error" ? "⚠️ " : "✅ "} {toast.message}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>🖼️ Gallery Images</h2>
          <p style={{ color: "#64748b", margin: "6px 0 0" }}>
            Add, edit and delete gallery images shown on the Gallery page
          </p>
        </div>
        <button
          onClick={openCreateModal}
          style={{
            padding: "12px 24px",
            background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontSize: "0.95rem",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(22, 163, 74, 0.3)",
          }}
        >
          ➕ Add Image
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: "12px",
            background: "#fee",
            color: "#991b1b",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>
          <div style={{ fontSize: "2rem" }}>🔄</div>
          Loading gallery...
        </div>
      ) : images.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px",
            color: "#64748b",
            background: "#f8fafc",
            borderRadius: "10px",
            border: "2px dashed #cbd5e1",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🖼️</div>
          <h3 style={{ margin: "0 0 8px" }}>No gallery images yet</h3>
          <p style={{ margin: "0 0 20px" }}>Add your first image to get started</p>
          <button
            onClick={openCreateModal}
            style={{
              padding: "12px 24px",
              background: "#16a34a",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            ➕ Add First Image
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "16px",
          }}
        >
          {images.map((img) => (
            <div
              key={img.id}
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              {/* Image */}
              <div
                style={{
                  width: "100%",
                  aspectRatio: "4/3",
                  background: "#f1f5f9",
                  overflow: "hidden",
                }}
              >
                {img.image_url ? (
                  <img
                    src={img.image_url}
                    alt={img.alt_text || img.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2rem",
                      color: "#cbd5e1",
                    }}
                  >
                    🖼️
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "6px",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: "12px",
                      fontSize: "0.7rem",
                      background: "#e0f2fe",
                      color: "#0369a1",
                      fontWeight: 600,
                    }}
                  >
                    {img.category}
                  </span>
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: "12px",
                      fontSize: "0.7rem",
                      background: img.is_published ? "#dcfce7" : "#fef3c7",
                      color: img.is_published ? "#166534" : "#92400e",
                      fontWeight: 600,
                    }}
                  >
                    {img.is_published ? "✅ Live" : "⏸ Draft"}
                  </span>
                </div>
                <h3
                  style={{
                    margin: "0 0 10px",
                    fontSize: "0.9rem",
                    lineHeight: 1.3,
                    color: "#0f172a",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    minHeight: "36px",
                  }}
                >
                  {img.title}
                </h3>
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                  <button
                    onClick={() => handleTogglePublish(img)}
                    style={{
                      flex: 1,
                      padding: "6px 8px",
                      background: img.is_published ? "#f59e0b" : "#16a34a",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                    }}
                  >
                    {img.is_published ? "⏸" : "▶"}
                  </button>
                  <button
                    onClick={() => openEditModal(img)}
                    style={{
                      flex: 1,
                      padding: "6px 8px",
                      background: "#3b82f6",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => setDeleteModal(img)}
                    style={{
                      flex: 1,
                      padding: "6px 8px",
                      background: "#dc2626",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div
          onClick={() => !actionLoading && setShowModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
            overflowY: "auto",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "14px",
              width: "100%",
              maxWidth: "560px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "28px",
            }}
          >
            <h3 style={{ margin: "0 0 20px" }}>
              {editingImage ? "✏️ Edit Image" : "➕ Add Image"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. 3rd National Panchgavya Day"
                  style={inputStyle}
                  required
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Category *</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Description (optional)</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="2"
                  style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
                />
              </div>

              {/* Image Upload */}
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>
                  Image {!editingImage ? "*" : ""}
                </label>

                {imagePreview ? (
                  <div style={{ position: "relative", marginBottom: "10px" }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        width: "100%",
                        maxHeight: "240px",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        padding: "6px 14px",
                        background: "#dc2626",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                      }}
                    >
                      ✕ Remove
                    </button>
                  </div>
                ) : null}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                  id="gallery-image-input"
                />
                <label
                  htmlFor="gallery-image-input"
                  style={{
                    display: "block",
                    padding: "14px",
                    border: "2px dashed #cbd5e1",
                    borderRadius: "10px",
                    textAlign: "center",
                    cursor: "pointer",
                    background: "#f8fafc",
                    color: "#64748b",
                    fontSize: "0.9rem",
                  }}
                >
                  📷 {imagePreview ? "Change Image" : "Click to Upload Image"}
                  <div style={{ fontSize: "0.75rem", marginTop: "4px", color: "#94a3b8" }}>
                    Max 5MB • JPG, PNG, WEBP
                  </div>
                </label>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                <div>
                  <label style={labelStyle}>Display Order</label>
                  <input
                    type="number"
                    name="display_order"
                    value={form.display_order}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", paddingTop: "24px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      name="is_published"
                      checked={form.is_published}
                      onChange={handleChange}
                      style={{ width: "18px", height: "18px" }}
                    />
                    <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Publish</span>
                  </label>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={actionLoading}
                  style={{
                    padding: "12px 24px",
                    background: "#fff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  style={{
                    padding: "12px 28px",
                    background: actionLoading ? "#94a3b8" : "#16a34a",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: actionLoading ? "not-allowed" : "pointer",
                    fontWeight: 700,
                  }}
                >
                  {actionLoading ? "Saving..." : editingImage ? "Update" : "Add Image"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div
          onClick={() => !actionLoading && setDeleteModal(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "14px",
              maxWidth: "440px",
              width: "100%",
              padding: "28px",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div style={{ fontSize: "3rem" }}>🗑️</div>
              <h3 style={{ margin: "12px 0 8px" }}>Delete Image?</h3>
              <p style={{ color: "#64748b", margin: 0, fontSize: "0.9rem" }}>
                "{deleteModal.title}"
              </p>
              <p style={{ color: "#dc2626", fontWeight: 600, marginTop: "12px", fontSize: "0.85rem" }}>
                Image will be deleted from Cloudinary too.
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                onClick={() => setDeleteModal(null)}
                disabled={actionLoading}
                style={{
                  padding: "10px 24px",
                  background: "#fff",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading}
                style={{
                  padding: "10px 24px",
                  background: actionLoading ? "#94a3b8" : "#dc2626",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: actionLoading ? "not-allowed" : "pointer",
                  fontWeight: 700,
                }}
              >
                {actionLoading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontWeight: 600,
  fontSize: "0.88rem",
  color: "#334155",
};

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  fontSize: "0.95rem",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

export default AdminGalleryImages;