import { useState, useEffect, useRef } from "react";
import {
  getAdminNews,
  createNews,
  updateNews,
  deleteNews,
  toggleNewsPublish,
} from "../../services/api";

const CATEGORIES = [
  "Gau Seva",
  "Gaushala",
  "Panchgavya",
  "Farmers",
  "Rural Development",
  "Government Updates",
];

const AdminNews = ({ token }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null); // null = create, obj = edit
  const [actionLoading, setActionLoading] = useState(false);

  // Form state
  const [form, setForm] = useState({
    title: "",
    category: CATEGORIES[0],
    date: new Date().toISOString().split("T")[0],
    summary: "",
    full_content: "",
    source_name: "",
    source_url: "",
    is_published: true,
    display_order: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const fileInputRef = useRef(null);

  // Delete confirmation
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    if (token) fetchNews();
  }, [token]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchNews = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAdminNews(token);
      setArticles(res.data || []);
    } catch (err) {
      setError(err.message || "Failed to load news.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Open modal for create ───
  const openCreateModal = () => {
    setEditingArticle(null);
    setForm({
      title: "",
      category: CATEGORIES[0],
      date: new Date().toISOString().split("T")[0],
      summary: "",
      full_content: "",
      source_name: "",
      source_url: "",
      is_published: true,
      display_order: 0,
    });
    setImageFile(null);
    setImagePreview(null);
    setRemoveExistingImage(false);
    setShowModal(true);
  };

  // ─── Open modal for edit ───
  const openEditModal = (article) => {
    setEditingArticle(article);
    setForm({
      title: article.title || "",
      category: article.category || CATEGORIES[0],
      date: article.date || new Date().toISOString().split("T")[0],
      summary: article.summary || "",
      full_content: article.full_content || "",
      source_name: article.source_name || "",
      source_url: article.source_url || "",
      is_published: article.is_published ?? true,
      display_order: article.display_order || 0,
    });
    setImageFile(null);
    setImagePreview(article.image_url || null);
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

    if (!form.title.trim() || !form.category || !form.date) {
      showToast("Title, category and date are required", "error");
      return;
    }

    setActionLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("category", form.category);
      formData.append("date", form.date);
      formData.append("summary", form.summary.trim());
      formData.append("full_content", form.full_content.trim());
      formData.append("source_name", form.source_name.trim());
      formData.append("source_url", form.source_url.trim());
      formData.append("is_published", form.is_published ? "true" : "false");
      formData.append("display_order", String(form.display_order || 0));

      if (imageFile) {
        formData.append("image", imageFile);
      }
      if (removeExistingImage) {
        formData.append("remove_image", "true");
      }

      if (editingArticle) {
        await updateNews(token, editingArticle.id, formData);
        showToast("News updated successfully");
      } else {
        await createNews(token, formData);
        showToast("News created successfully");
      }

      setShowModal(false);
      await fetchNews();
    } catch (err) {
      showToast(err.message || "Failed to save news", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleTogglePublish = async (article) => {
    try {
      await toggleNewsPublish(token, article.id);
      showToast(article.is_published ? "Article unpublished" : "Article published");
      await fetchNews();
    } catch (err) {
      showToast(err.message || "Failed to toggle publish", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    setActionLoading(true);
    try {
      await deleteNews(token, deleteModal.id);
      showToast("Article deleted");
      setDeleteModal(null);
      await fetchNews();
    } catch (err) {
      showToast(err.message || "Failed to delete", "error");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Toast */}
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

      {/* Header */}
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
          <h2 style={{ margin: 0 }}>📰 News Management</h2>
          <p style={{ color: "#64748b", margin: "6px 0 0" }}>
            Add, edit and delete news articles shown on the Gallery page
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
          ➕ Add News Article
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
          Loading news...
        </div>
      ) : articles.length === 0 ? (
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
          <div style={{ fontSize: "3rem", marginBottom: "12px" }}>📰</div>
          <h3 style={{ margin: "0 0 8px" }}>No news articles yet</h3>
          <p style={{ margin: "0 0 20px" }}>Add your first news article to get started</p>
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
            ➕ Add First Article
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "14px" }}>
          {articles.map((article) => (
            <div
              key={article.id}
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "16px",
                display: "flex",
                gap: "16px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {/* Image */}
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  background: "#f1f5f9",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {article.image_url ? (
                  <img
                    src={article.image_url}
                    alt={article.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span style={{ fontSize: "2rem", color: "#cbd5e1" }}>📰</span>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: "240px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "6px",
                  }}
                >
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: "12px",
                      fontSize: "0.72rem",
                      background: "#e0f2fe",
                      color: "#0369a1",
                      fontWeight: 600,
                    }}
                  >
                    {article.category}
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    {article.date}
                  </span>
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: "12px",
                      fontSize: "0.72rem",
                      background: article.is_published ? "#dcfce7" : "#fef3c7",
                      color: article.is_published ? "#166534" : "#92400e",
                      fontWeight: 600,
                    }}
                  >
                    {article.is_published ? "✅ Published" : "⏸ Draft"}
                  </span>
                </div>
                <h3
                  style={{
                    margin: "0 0 6px",
                    color: "#0f172a",
                    fontSize: "1.05rem",
                    lineHeight: 1.3,
                  }}
                >
                  {article.title}
                </h3>
                {article.summary && (
                  <p
                    style={{
                      margin: 0,
                      color: "#64748b",
                      fontSize: "0.85rem",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {article.summary}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  flexWrap: "wrap",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={() => handleTogglePublish(article)}
                  style={{
                    padding: "8px 12px",
                    background: article.is_published ? "#f59e0b" : "#16a34a",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                  }}
                >
                  {article.is_published ? "⏸ Unpublish" : "▶ Publish"}
                </button>
                <button
                  onClick={() => openEditModal(article)}
                  style={{
                    padding: "8px 12px",
                    background: "#3b82f6",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => setDeleteModal(article)}
                  style={{
                    padding: "8px 12px",
                    background: "#dc2626",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══════ MODAL: Add/Edit ═══════ */}
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
              maxWidth: "640px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "28px",
            }}
          >
            <h3 style={{ margin: "0 0 20px" }}>
              {editingArticle ? "✏️ Edit News Article" : "➕ Add News Article"}
            </h3>

            <form onSubmit={handleSubmit}>
              {/* Title */}
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter article headline"
                  style={inputStyle}
                  required
                />
              </div>

              {/* Category + Date */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                <div>
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
                <div>
                  <label style={labelStyle}>Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                  />
                </div>
              </div>

              {/* Summary */}
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Summary (short description)</label>
                <textarea
                  name="summary"
                  value={form.summary}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Brief summary shown on card"
                  style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
                />
              </div>

              {/* Full Content */}
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Full Content *</label>
                <textarea
                  name="full_content"
                  value={form.full_content}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Complete article content shown when user clicks Read More"
                  style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
                  required
                />
              </div>

              {/* Image Upload */}
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Image</label>

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
                  id="news-image-input"
                />
                <label
                  htmlFor="news-image-input"
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

              {/* Source */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                <div>
                  <label style={labelStyle}>Source Name</label>
                  <input
                    type="text"
                    name="source_name"
                    value={form.source_name}
                    onChange={handleChange}
                    placeholder="e.g. PIB India"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Source URL</label>
                  <input
                    type="url"
                    name="source_url"
                    value={form.source_url}
                    onChange={handleChange}
                    placeholder="https://..."
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Display order + Published */}
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
                    <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Publish immediately</span>
                  </label>
                </div>
              </div>

              {/* Buttons */}
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
                  {actionLoading ? "Saving..." : editingArticle ? "Update Article" : "Create Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════ DELETE CONFIRMATION ═══════ */}
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
              <h3 style={{ margin: "12px 0 8px" }}>Delete News Article?</h3>
              <p style={{ color: "#64748b", margin: 0, fontSize: "0.9rem" }}>
                "{deleteModal.title}"
              </p>
              <p style={{ color: "#dc2626", fontWeight: 600, marginTop: "12px", fontSize: "0.85rem" }}>
                This action cannot be undone. Image will also be deleted from Cloudinary.
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

export default AdminNews;