import React, { useState, useEffect } from "react";

export default function ProductForm({
  initial,
  onCancel,
  onSubmit,
  categories,
  submitting,
}) {
  const safeCategories = Array.isArray(categories) && categories.length > 0
    ? categories
    : ["Electronics", "Clothing", "Books"];

  const fields = [
    { key: "name", label: "Name", type: "text", required: true },
    { key: "description", label: "Description", type: "textarea", required: true },
    { key: "price", label: "Price", type: "number", min: 0, step: 0.01, required: true },
    { key: "category", label: "Category", type: "select", options: safeCategories.filter(c => c !== "All") },
    { key: "sku", label: "SKU", type: "text" },
    { key: "stock", label: "Stock", type: "number", min: 0, required: true },
    { key: "imageUrl", label: "Image URL", type: "text", placeholder: "https://" },
    { key: "brand", label: "Brand", type: "text" },
    { key: "rating", label: "Rating", type: "number", min: 0, max: 5, step: 0.1 },
    { key: "tags", label: "Tags (comma separated)", type: "text" },
    { key: "isActive", label: "Active", type: "checkbox" },
  ];

  const [data, setData] = useState(() => {
    const init = {};
    fields.forEach(f => init[f.key] = f.type === "checkbox" ? true : "");
    return init;
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) {
      setData(prev => ({
        ...prev,
        ...initial,
        price: initial.price ?? "",
        stock: initial.stock ?? "",
      }));
    }
  }, [initial]);

  const validate = () => {
    const e = {};
    if (!data.name.trim()) e.name = "Name is required";
    if (!data.description.trim()) e.description = "Description is required";
    if (data.price === "" || Number(data.price) < 0) e.price = "Price must be 0 or greater";
    if (data.stock === "" || Number(data.stock) < 0) e.stock = "Stock must be 0 or greater";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      ...data,
      price: Number(data.price),
      stock: Number(data.stock),
      tags: Array.isArray(data.tags)
        ? data.tags
        : (data.tags || "").split(",").map(t => t.trim()).filter(Boolean),
    };
    onSubmit(payload);
  };

  const renderField = (field) => {
    if (field.type === "textarea") {
      return (
        <textarea
          value={data[field.key]}
          onChange={(e) => setData({ ...data, [field.key]: e.target.value })}
          required={field.required}
        />
      );
    }

    if (field.type === "select") {
      return (
        <select
          value={data[field.key]}
          onChange={(e) => setData({ ...data, [field.key]: e.target.value })}
        >
          {field.options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }

    if (field.type === "checkbox") {
      return (
        <input
          type="checkbox"
          checked={data[field.key]}
          onChange={(e) => setData({ ...data, [field.key]: e.target.checked })}
        />
      );
    }

    return (
      <input
        type={field.type}
        value={data[field.key]}
        onChange={(e) => setData({ ...data, [field.key]: e.target.value })}
        placeholder={field.placeholder || ""}
        min={field.min}
        max={field.max}
        step={field.step}
        required={field.required}
      />
    );
  };

  return (
    <form className="modal-content" onSubmit={handleSubmit} noValidate>
      <div className="modal-grid">
        {fields.map(f => (
          <div key={f.key} className={`form-field ${f.type === "checkbox" ? "checkbox-field" : ""}`}>
            <label className={f.type === "checkbox" ? "checkbox-label" : ""}>
              {f.label}
              {renderField(f)}
            </label>
            {errors[f.key] && <div className="field-error">{errors[f.key]}</div>}
          </div>
        ))}
      </div>

      <div className="modal-actions fixed-bottom">
        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
