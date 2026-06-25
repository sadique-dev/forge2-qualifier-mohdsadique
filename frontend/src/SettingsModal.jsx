import { useState } from "react";
import { TAG_COLORS } from "./CardModal";

export default function SettingsModal({ onClose, members, tags, onAddMember, onAddTag }) {
  const [activeTab, setActiveTab] = useState("members");
  
  // Member Form State
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  
  // Tag Form State
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState(TAG_COLORS[0]);

  const [error, setError] = useState("");

  async function submitMember(e) {
    e.preventDefault();
    if (!memberName.trim()) return;
    try {
      await onAddMember(memberName.trim(), memberEmail.trim() || null);
      setMemberName("");
      setMemberEmail("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function submitTag(e) {
    e.preventDefault();
    if (!tagName.trim()) return;
    try {
      await onAddTag(tagName.trim(), tagColor);
      setTagName("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal settings-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">x</button>

        <div className="modal-heading">
          <p className="eyebrow">Board Settings</p>
          <h2>Manage Members & Tags</h2>
        </div>

        <div className="settings-tabs">
          <button 
            className={`settings-tab-btn ${activeTab === "members" ? "active" : ""}`}
            onClick={() => { setActiveTab("members"); setError(""); }}
          >
            Members
          </button>
          <button 
            className={`settings-tab-btn ${activeTab === "tags" ? "active" : ""}`}
            onClick={() => { setActiveTab("tags"); setError(""); }}
          >
            Tags
          </button>
        </div>

        {error && <div className="error-banner" style={{ margin: "10px 0" }}>{error}</div>}

        {activeTab === "members" ? (
          <div className="settings-section">
            <form onSubmit={submitMember} className="settings-form">
              <h3>Add New Member</h3>
              <div className="form-group">
                <label className="field-label">Name</label>
                <input 
                  placeholder="e.g. Priya Sharma" 
                  value={memberName} 
                  onChange={(e) => setMemberName(e.target.value)} 
                  required
                />
              </div>
              <div className="form-group">
                <label className="field-label">Email</label>
                <input 
                  type="email" 
                  placeholder="e.g. priya@example.com" 
                  value={memberEmail} 
                  onChange={(e) => setMemberEmail(e.target.value)} 
                />
              </div>
              <button type="submit" className="settings-submit-btn" disabled={!memberName.trim()}>
                Add Member
              </button>
            </form>

            <div className="settings-list-container">
              <h3>Existing Members ({members.length})</h3>
              <ul className="settings-list">
                {members.map((m) => (
                  <li key={m.id} className="settings-list-item">
                    <span className="settings-item-name">{m.name}</span>
                    {m.email && <span className="settings-item-sub">{m.email}</span>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="settings-section">
            <form onSubmit={submitTag} className="settings-form">
              <h3>Add New Tag</h3>
              <div className="form-group">
                <label className="field-label">Tag Name</label>
                <input 
                  placeholder="e.g. priority" 
                  value={tagName} 
                  onChange={(e) => setTagName(e.target.value)} 
                  required
                />
              </div>
              <div className="form-group">
                <label className="field-label">Color</label>
                <div className="color-palette">
                  {TAG_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`color-swatch ${tagColor === color ? "selected" : ""}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setTagColor(color)}
                    />
                  ))}
                </div>
              </div>
              <button type="submit" className="settings-submit-btn" disabled={!tagName.trim()}>
                Add Tag
              </button>
            </form>

            <div className="settings-list-container">
              <h3>Existing Tags ({tags.length})</h3>
              <ul className="settings-list tag-grid">
                {tags.map((t) => (
                  <li key={t.id} className="settings-list-item tag-item" style={{ borderLeft: `4px solid ${t.color}` }}>
                    <span className="settings-item-name">{t.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
