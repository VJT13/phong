import { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import AdminLogin from './AdminLogin';

// Utility: convert Google Drive shareable link to a direct viewable image url
function convertGoogleDriveUrl(url) {
  if (!url || typeof url !== 'string') return url;
  const driveRegExp = /(?:https?:\/\/)?(?:drive|docs)\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([a-zA-Z0-9_-]+)/i;
  const match = url.match(driveRegExp);
  if (match && match[1]) {
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }
  return url;
}

// Utility: convert local factory path to optimized thumbnail path for previewing in admin panel
function getAdminPreviewUrl(src) {
  if (!src) return '';
  if (src.includes('/images/factory/') && !src.includes('/images/factory/thumb/') && !src.includes('/images/factory/full/')) {
    return src.replace('/images/factory/', '/images/factory/thumb/');
  }
  return src;
}

// Utility: convert Google Drive PDF sharing link to a clean web preview link
function convertGoogleDrivePdfUrl(url) {
  if (!url || typeof url !== 'string') return url;
  const driveRegExp = /(?:https?:\/\/)?(?:drive|docs)\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([a-zA-Z0-9_-]+)/i;
  const match = url.match(driveRegExp);
  if (match && match[1]) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  return url;
}

export default function AdminDashboard() {
  const { data, loading, error, updatePortfolio, resetToDefault, isAuthenticated, logout, getInquiries, deleteInquiry } = usePortfolio();
  const [activeTab, setActiveTab] = useState('hero');
  const [localData, setLocalData] = useState(null);
  const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });
  const [inquiries, setInquiries] = useState([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);

  // Fetch inquiries when inquiries tab is active
  useEffect(() => {
    if (activeTab === 'inquiries' && isAuthenticated) {
      const fetchInquiries = async () => {
        setInquiriesLoading(true);
        const res = await getInquiries();
        setInquiriesLoading(false);
        if (res && res.success) {
          setInquiries(res.data);
        } else {
          setSaveStatus({ type: 'error', message: res.error || 'Failed to fetch inquiries' });
          setTimeout(() => setSaveStatus({ type: '', message: '' }), 5000);
        }
      };
      fetchInquiries();
    }
  }, [activeTab, isAuthenticated]);

  const handleDeleteInquiry = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa liên hệ này không? Hành động này không thể hoàn tác.")) {
      setSaveStatus({ type: 'info', message: 'Đang xóa liên hệ...' });
      const result = await deleteInquiry(id);
      if (result && result.success) {
        setInquiries(prev => prev.filter(inq => inq._id !== id));
        setSaveStatus({ type: 'success', message: 'Đã xóa liên hệ thành công!' });
      } else {
        setSaveStatus({ type: 'error', message: result.error || 'Xóa thất bại.' });
      }
      setTimeout(() => setSaveStatus({ type: '', message: '' }), 5000);
    }
  };

  // Sync context data to local state for form editing
  useEffect(() => {
    if (data) {
      setLocalData(JSON.parse(JSON.stringify(data)));
    }
  }, [data]);

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  if (loading || !localData) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        <p>Loading Dashboard Configuration...</p>
      </div>
    );
  }

  const handleSave = async () => {
    setSaveStatus({ type: 'info', message: 'Saving to MongoDB Atlas...' });
    const result = await updatePortfolio(localData);
    if (result.success) {
      setSaveStatus({ type: 'success', message: 'Configuration saved successfully!' });
    } else {
      setSaveStatus({ type: 'error', message: result.error || 'Failed to save configuration.' });
    }
    setTimeout(() => setSaveStatus({ type: '', message: '' }), 5000);
  };

  const handleReset = async () => {
    if (window.confirm("Are you sure you want to reset ALL configurations to original factory defaults? This will overwrite your current database content.")) {
      setSaveStatus({ type: 'info', message: 'Resetting to defaults...' });
      const result = await resetToDefault();
      if (result.success) {
        setSaveStatus({ type: 'success', message: 'Reset successfully! Re-syncing data...' });
      } else {
        setSaveStatus({ type: 'error', message: result.error || 'Failed to reset.' });
      }
      setTimeout(() => setSaveStatus({ type: '', message: '' }), 5000);
    }
  };

  const handleNestedChange = (section, field, value) => {
    setLocalData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Capabilities Categories CRUD Managers
  const updateCapabilityCategory = (index, field, value) => {
    const newCategories = [...localData.capabilities.categories];
    newCategories[index][field] = value;
    setLocalData(prev => ({
      ...prev,
      capabilities: { ...prev.capabilities, categories: newCategories }
    }));
  };

  // Advantages CRUD Managers
  const updateAdvantage = (index, field, value) => {
    const newAdvantages = [...localData.advantages];
    newAdvantages[index][field] = value;
    setLocalData(prev => ({ ...prev, advantages: newAdvantages }));
  };

  // Factory Stats CRUD Managers
  const updateFactoryStat = (index, field, value) => {
    const newStats = [...localData.factory.stats];
    newStats[index][field] = value;
    setLocalData(prev => ({
      ...prev,
      factory: { ...prev.factory, stats: newStats }
    }));
  };

  // Factory Gallery CRUD Managers
  const updateGalleryImage = (index, field, value) => {
    const newGallery = [...localData.factory.gallery];
    newGallery[index] = {
      ...newGallery[index],
      [field]: field === 'src' ? convertGoogleDriveUrl(value) : value
    };
    setLocalData(prev => ({
      ...prev,
      factory: { ...prev.factory, gallery: newGallery }
    }));
  };

  const addGalleryImage = () => {
    setLocalData(prev => ({
      ...prev,
      factory: {
        ...prev.factory,
        gallery: [...prev.factory.gallery, { src: '/images/factory/factory-1.jpg', alt: 'New Production Image' }]
      }
    }));
  };

  const removeGalleryImage = (index) => {
    const newGallery = localData.factory.gallery.filter((_, i) => i !== index);
    setLocalData(prev => ({
      ...prev,
      factory: { ...prev.factory, gallery: newGallery }
    }));
  };

  // Certifications CRUD Managers
  const updateCert = (index, field, value) => {
    const newCerts = [...localData.certifications.list];
    newCerts[index] = {
      ...newCerts[index],
      [field]: field === 'pdfUrl' ? convertGoogleDrivePdfUrl(value) : value
    };
    setLocalData(prev => ({
      ...prev,
      certifications: { ...prev.certifications, list: newCerts }
    }));
  };

  const addCert = () => {
    const newId = localData.certifications.list.length > 0 
      ? Math.max(...localData.certifications.list.map(c => c.id || 0)) + 1 
      : 1;
    
    const newCert = {
      id: newId,
      title: 'New Certificate Title',
      icon: '🏆',
      pdfUrl: '',
      shortDesc: 'Short description of the new certificate.',
      longDesc: 'Detailed description of the new certificate, shown inside the PDF viewer modal.'
    };

    setLocalData(prev => ({
      ...prev,
      certifications: {
        ...prev.certifications,
        list: [...prev.certifications.list, newCert]
      }
    }));
  };

  const removeCert = (index) => {
    const newCerts = localData.certifications.list.filter((_, i) => i !== index);
    setLocalData(prev => ({
      ...prev,
      certifications: { ...prev.certifications, list: newCerts }
    }));
  };

  // Client Countries CRUD Managers
  const updateClientCountry = (index, field, value) => {
    const newCountries = [...localData.clients.countries];
    newCountries[index][field] = value;
    setLocalData(prev => ({
      ...prev,
      clients: { ...prev.clients, countries: newCountries }
    }));
  };

  const addClientCountry = () => {
    setLocalData(prev => ({
      ...prev,
      clients: {
        ...prev.clients,
        countries: [...prev.clients.countries, { name: 'New Country', code: 'EU' }]
      }
    }));
  };

  const removeClientCountry = (index) => {
    const newCountries = localData.clients.countries.filter((_, i) => i !== index);
    setLocalData(prev => ({
      ...prev,
      clients: { ...prev.clients, countries: newCountries }
    }));
  };

  // Sourcing steps CRUD Managers
  const updateSourcingStep = (index, field, value) => {
    const newSourcing = [...localData.sourcing];
    newSourcing[index][field] = value;
    setLocalData(prev => ({ ...prev, sourcing: newSourcing }));
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="admin-header-left">
          <a href="#" className="admin-back-btn">← Back to Site</a>
          <h1 className="admin-header-title">Portfolio Manager</h1>
          <p className="admin-header-subtitle">Customize landing page details stored in MongoDB Atlas</p>
        </div>
        <div className="admin-header-right" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button onClick={logout} className="admin-btn-secondary" style={{ border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444' }}>Logout</button>
          <button onClick={handleSave} className="admin-btn-primary">Save Changes</button>
        </div>
      </header>

      {/* Floating Save Status Message */}
      {saveStatus.message && (
        <div className={`admin-status-toast status-${saveStatus.type}`}>
          <span className="toast-icon">
            {saveStatus.type === 'success' && '✅'}
            {saveStatus.type === 'error' && '❌'}
            {saveStatus.type === 'info' && '⏳'}
          </span>
          <span className="toast-message">{saveStatus.message}</span>
        </div>
      )}

      {error && (
        <div className="admin-alert admin-alert-warning" style={{ margin: '1rem 2rem 0 2rem' }}>
          ⚠️ <strong>Offline Fallback Mode</strong>: {error}
        </div>
      )}

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <button onClick={() => setActiveTab('hero')} className={`admin-tab-btn ${activeTab === 'hero' ? 'active' : ''}`}>
            ✨ Hero (Split Screen)
          </button>
          <button onClick={() => setActiveTab('capabilities')} className={`admin-tab-btn ${activeTab === 'capabilities' ? 'active' : ''}`}>
            ⚙️ Capabilities
          </button>
          <button onClick={() => setActiveTab('advantages')} className={`admin-tab-btn ${activeTab === 'advantages' ? 'active' : ''}`}>
            🏆 Advantages (10 Items)
          </button>
          <button onClick={() => setActiveTab('factory')} className={`admin-tab-btn ${activeTab === 'factory' ? 'active' : ''}`}>
            🏭 Factory & Gallery
          </button>
          <button onClick={() => setActiveTab('certs')} className={`admin-tab-btn ${activeTab === 'certs' ? 'active' : ''}`}>
            🎖️ Certifications
          </button>
          <button onClick={() => setActiveTab('clients')} className={`admin-tab-btn ${activeTab === 'clients' ? 'active' : ''}`}>
            🌍 EU Clients
          </button>
          <button onClick={() => setActiveTab('sourcing')} className={`admin-tab-btn ${activeTab === 'sourcing' ? 'active' : ''}`}>
            ❓ Sourcing FAQs
          </button>
          <button onClick={() => setActiveTab('contact')} className={`admin-tab-btn ${activeTab === 'contact' ? 'active' : ''}`}>
            📩 Quotation & Contact
          </button>
          <button onClick={() => setActiveTab('inquiries')} className={`admin-tab-btn ${activeTab === 'inquiries' ? 'active' : ''}`}>
            📥 Khách hàng liên hệ
          </button>
          <button onClick={() => setActiveTab('settings')} className={`admin-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}>
            🔧 System Settings
          </button>
        </aside>

        <main className="admin-content-area">
          {/* HERO TAB */}
          {activeTab === 'hero' && localData.hero && (
            <div className="admin-card">
              <h2 className="admin-card-title">Hero Split Screen Config</h2>
              
              <h3 className="admin-subheading">Left Side: Company Info</h3>
              <div className="admin-form-group">
                <label className="admin-label">Europe Client Badge Text</label>
                <input type="text" className="admin-input" value={localData.hero.badge || ''} onChange={(e) => handleNestedChange('hero', 'badge', e.target.value)} />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Main Heading (Company)</label>
                <input type="text" className="admin-input" value={localData.hero.companyHeading || ''} onChange={(e) => handleNestedChange('hero', 'companyHeading', e.target.value)} />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Sub Heading (Company)</label>
                <textarea className="admin-textarea" value={localData.hero.companySubheading || ''} onChange={(e) => handleNestedChange('hero', 'companySubheading', e.target.value)} />
              </div>
              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Head Office Address</label>
                  <input type="text" className="admin-input" value={localData.hero.headOffice || ''} onChange={(e) => handleNestedChange('hero', 'headOffice', e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Factory Address</label>
                  <input type="text" className="admin-input" value={localData.hero.factoryAddress || ''} onChange={(e) => handleNestedChange('hero', 'factoryAddress', e.target.value)} />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Company Image Path / URL (Left Card Image)</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '80px', height: '60px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--surface-alt)', overflow: 'hidden', flexShrink: 0, background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {localData.hero.companyImage ? (
                      <img 
                        src={getAdminPreviewUrl(localData.hero.companyImage)} 
                        alt="Company Preview" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>No Image</span>
                    )}
                  </div>
                  <input type="text" className="admin-input" value={localData.hero.companyImage || ''} onChange={(e) => handleNestedChange('hero', 'companyImage', convertGoogleDriveUrl(e.target.value))} />
                </div>
              </div>

              <h3 className="admin-subheading mt-6">Right Side: Sourcing Manager (Orin Bui)</h3>
              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Full Name</label>
                  <input type="text" className="admin-input" value={localData.hero.me?.name || ''} onChange={(e) => {
                    const newMe = { ...localData.hero.me, name: e.target.value };
                    handleNestedChange('hero', 'me', newMe);
                  }} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Role Title</label>
                  <input type="text" className="admin-input" value={localData.hero.me?.role || ''} onChange={(e) => {
                    const newMe = { ...localData.hero.me, role: e.target.value };
                    handleNestedChange('hero', 'me', newMe);
                  }} />
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Photo Path / URL</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '50px', height: '60px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--surface-alt)', overflow: 'hidden', flexShrink: 0, background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {localData.hero.me?.photo ? (
                      <img 
                        src={getAdminPreviewUrl(localData.hero.me.photo)} 
                        alt="Avatar Preview" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>No Photo</span>
                    )}
                  </div>
                  <input type="text" className="admin-input" value={localData.hero.me?.photo || ''} onChange={(e) => {
                    const newMe = { ...localData.hero.me, photo: convertGoogleDriveUrl(e.target.value) };
                    handleNestedChange('hero', 'me', newMe);
                  }} />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Bio Paragraphs (Use double line breaks to separate paragraphs)</label>
                <textarea 
                  className="admin-textarea" 
                  style={{ minHeight: '120px' }}
                  value={localData.hero.me?.paragraphs?.join('\n\n') || ''} 
                  onChange={(e) => {
                    const paras = e.target.value.split('\n\n').filter(p => p.trim() !== '');
                    const newMe = { ...localData.hero.me, paragraphs: paras };
                    handleNestedChange('hero', 'me', newMe);
                  }} 
                />
              </div>

              <div className="admin-grid-3">
                <div className="admin-form-group">
                  <label className="admin-label">Mobile (WhatsApp)</label>
                  <input type="text" className="admin-input" value={localData.hero.me?.mobile || ''} onChange={(e) => {
                    const newMe = { ...localData.hero.me, mobile: e.target.value };
                    handleNestedChange('hero', 'me', newMe);
                  }} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Email</label>
                  <input type="email" className="admin-input" value={localData.hero.me?.email || ''} onChange={(e) => {
                    const newMe = { ...localData.hero.me, email: e.target.value };
                    handleNestedChange('hero', 'me', newMe);
                  }} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">LinkedIn Profile URL</label>
                  <input type="text" className="admin-input" value={localData.hero.me?.linkedin || ''} onChange={(e) => {
                    const newMe = { ...localData.hero.me, linkedin: e.target.value };
                    handleNestedChange('hero', 'me', newMe);
                  }} />
                </div>
              </div>
            </div>
          )}

          {/* CAPABILITIES TAB */}
          {activeTab === 'capabilities' && localData.capabilities && (
            <div className="admin-card">
              <h2 className="admin-card-title">Threaded Rod Capabilities</h2>
              <div className="admin-form-group">
                <label className="admin-label">Headline Title</label>
                <input type="text" className="admin-input" value={localData.capabilities.headline || ''} onChange={(e) => handleNestedChange('capabilities', 'headline', e.target.value)} />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Sub-headline Description</label>
                <textarea className="admin-textarea" value={localData.capabilities.subheadline || ''} onChange={(e) => handleNestedChange('capabilities', 'subheadline', e.target.value)} />
              </div>

              <h3 className="admin-subheading mt-6">Capabilities Categories</h3>
              <div className="admin-grid-2">
                {localData.capabilities.categories.map((category, idx) => (
                  <div key={idx} className="admin-subcard">
                    <h4 className="admin-subcard-title">Category {idx + 1}</h4>
                    <div className="admin-form-group">
                      <label className="admin-label">Title</label>
                      <input type="text" className="admin-input" value={category.title} onChange={(e) => updateCapabilityCategory(idx, 'title', e.target.value)} />
                    </div>
                    <div className="admin-form-group" style={{ marginBottom: 0 }}>
                      <label className="admin-label">Items (One item per line)</label>
                      <textarea 
                        className="admin-textarea" 
                        style={{ minHeight: '120px' }}
                        value={category.items.join('\n')} 
                        onChange={(e) => {
                          const items = e.target.value.split('\n').filter(i => i.trim() !== '');
                          updateCapabilityCategory(idx, 'items', items);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ADVANTAGES TAB */}
          {activeTab === 'advantages' && localData.advantages && (
            <div className="admin-card">
              <h2 className="admin-card-title">Competitive Advantages (10 Items)</h2>
              <p className="admin-helper-text" style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Note: The 1st advantage (usually EU Anti-Dumping) is automatically featured at the top of the section with a glowing gradient layout.
              </p>
              
              <div className="admin-advantages-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {localData.advantages.map((adv, idx) => (
                  <div key={idx} className="admin-subcard" style={{ borderLeft: idx === 0 ? '4px solid #f59e0b' : '1px solid rgba(255,255,255,0.06)' }}>
                    <h4 className="admin-subcard-title" style={{ color: idx === 0 ? '#f59e0b' : 'var(--accent)' }}>
                      Advantage {idx + 1} {idx === 0 && "(Featured Highlight)"}
                    </h4>
                    <div className="admin-form-group">
                      <label className="admin-label">Title</label>
                      <input type="text" className="admin-input" value={adv.title} onChange={(e) => updateAdvantage(idx, 'title', e.target.value)} />
                    </div>
                    <div className="admin-form-group" style={{ marginBottom: 0 }}>
                      <label className="admin-label">Description Paragraph</label>
                      <textarea className="admin-textarea" style={{ minHeight: '80px' }} value={adv.desc} onChange={(e) => updateAdvantage(idx, 'desc', e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FACTORY TAB */}
          {activeTab === 'factory' && localData.factory && (
            <div className="admin-card">
              <h2 className="admin-card-title">Factory Facilities & Gallery Configuration</h2>
              
              <div className="admin-form-group">
                <label className="admin-label">Section Title</label>
                <input type="text" className="admin-input" value={localData.factory.title || ''} onChange={(e) => handleNestedChange('factory', 'title', e.target.value)} />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Section Subtitle</label>
                <textarea className="admin-textarea" value={localData.factory.subtitle || ''} onChange={(e) => handleNestedChange('factory', 'subtitle', e.target.value)} />
              </div>

              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Location (e.g. Phu Tho Province)</label>
                  <input type="text" className="admin-input" value={localData.factory.location || ''} onChange={(e) => handleNestedChange('factory', 'location', e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Production Process (e.g. Full In-House...)</label>
                  <input type="text" className="admin-input" value={localData.factory.processType || ''} onChange={(e) => handleNestedChange('factory', 'processType', e.target.value)} />
                </div>
              </div>

              <h3 className="admin-subheading mt-6">Factory Statistics counters</h3>
              <div className="admin-grid-3">
                {localData.factory.stats && localData.factory.stats.map((stat, idx) => (
                  <div key={idx} className="admin-subcard">
                    <h4 className="admin-subcard-title">Stat {idx + 1}</h4>
                    <div className="admin-form-group">
                      <label className="admin-label">Value Number</label>
                      <input type="number" className="admin-input" value={stat.number} onChange={(e) => updateFactoryStat(idx, 'number', parseInt(e.target.value) || 0)} />
                    </div>
                    <div className="admin-form-group" style={{ marginBottom: 0 }}>
                      <label className="admin-label">Description Label</label>
                      <input type="text" className="admin-input" value={stat.label} onChange={(e) => updateFactoryStat(idx, 'label', e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="admin-subheading mt-8">Gallery Photo List ({localData.factory.gallery.length} Images)</h3>
              <div className="admin-gallery-manager" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {localData.factory.gallery.map((img, idx) => (
                  <div key={idx} className="admin-subcard" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div className="gallery-preview-wrapper" style={{ width: '80px', height: '60px', overflow: 'hidden', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
                      <img src={getAdminPreviewUrl(img.src)} alt={img.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.opacity = 0.3; }} />
                    </div>
                    <div className="admin-grid-2" style={{ flexGrow: 1, gap: '0.75rem' }}>
                      <div className="admin-form-group" style={{ marginBottom: 0 }}>
                        <label className="admin-label">Image Path / URL</label>
                        <input type="text" className="admin-input" value={img.src} onChange={(e) => updateGalleryImage(idx, 'src', e.target.value)} />
                      </div>
                      <div className="admin-form-group" style={{ marginBottom: 0 }}>
                        <label className="admin-label">Description / Alt Caption</label>
                        <input type="text" className="admin-input" value={img.alt} onChange={(e) => updateGalleryImage(idx, 'alt', e.target.value)} />
                      </div>
                    </div>
                    <button 
                      onClick={() => removeGalleryImage(idx)} 
                      className="admin-btn-secondary" 
                      style={{ padding: '0.5rem 0.75rem', border: '1px solid #ef4444', color: '#ef4444', height: 'fit-content', marginTop: '1rem' }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
                
                <button onClick={addGalleryImage} className="admin-btn-secondary" style={{ width: '100%', borderStyle: 'dashed', color: 'var(--accent)' }}>
                  + Add New Image to Gallery
                </button>
              </div>
            </div>
          )}

          {/* CERTIFICATIONS TAB */}
          {activeTab === 'certs' && localData.certifications && (
            <div className="admin-card">
              <h2 className="admin-card-title">Certifications Configuration</h2>
              
              <div className="admin-grid-3">
                <div className="admin-form-group">
                  <label className="admin-label">Badge Text</label>
                  <input type="text" className="admin-input" value={localData.certifications.badge} onChange={(e) => handleNestedChange('certifications', 'badge', e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Section Title</label>
                  <input type="text" className="admin-input" value={localData.certifications.title} onChange={(e) => handleNestedChange('certifications', 'title', e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Subtitle Description</label>
                  <input type="text" className="admin-input" value={localData.certifications.subtitle} onChange={(e) => handleNestedChange('certifications', 'subtitle', e.target.value)} />
                </div>
              </div>

              <h3 className="admin-subheading mt-6">Official Certificates List</h3>
              <div className="admin-certs-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {localData.certifications.list.map((cert, idx) => (
                  <div key={idx} className="admin-subcard">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h4 className="admin-subcard-title" style={{ marginBottom: 0 }}>Certificate {idx + 1}</h4>
                      <button 
                        onClick={() => removeCert(idx)} 
                        className="admin-btn-secondary"
                        style={{ padding: '0.5rem 0.75rem', border: '1px solid #ef4444', color: '#ef4444', height: 'fit-content' }}
                      >
                        Delete
                      </button>
                    </div>
                    <div className="admin-grid-3" style={{ gap: '0.75rem' }}>
                      <div className="admin-form-group">
                        <label className="admin-label">Certificate Title</label>
                        <input type="text" className="admin-input" value={cert.title} onChange={(e) => updateCert(idx, 'title', e.target.value)} />
                      </div>
                      <div className="admin-form-group">
                        <label className="admin-label">Icon (Emoji)</label>
                        <input type="text" className="admin-input" value={cert.icon} onChange={(e) => updateCert(idx, 'icon', e.target.value)} />
                      </div>
                      <div className="admin-form-group">
                        <label className="admin-label">PDF File Document Path / URL</label>
                        <input type="text" className="admin-input" value={cert.pdfUrl || ''} onChange={(e) => updateCert(idx, 'pdfUrl', e.target.value)} />
                      </div>
                    </div>
                    
                    <div className="admin-form-group">
                      <label className="admin-label">Brief Description (Shown on Card)</label>
                      <input type="text" className="admin-input" value={cert.shortDesc} onChange={(e) => updateCert(idx, 'shortDesc', e.target.value)} />
                    </div>
                    
                    <div className="admin-form-group" style={{ marginBottom: 0 }}>
                      <label className="admin-label">Detailed Description (Shown inside PDF Viewer Modal)</label>
                      <textarea className="admin-textarea" style={{ minHeight: '80px' }} value={cert.longDesc} onChange={(e) => updateCert(idx, 'longDesc', e.target.value)} />
                    </div>
                  </div>
                ))}
                
                <button 
                  onClick={addCert} 
                  className="admin-btn-secondary mt-4" 
                  style={{ width: '100%', borderStyle: 'dashed', color: 'var(--accent)' }}
                >
                  + Add New Certificate
                </button>
              </div>
            </div>
          )}

          {/* EU CLIENTS TAB */}
          {activeTab === 'clients' && localData.clients && (
            <div className="admin-card">
              <h2 className="admin-card-title">European Market Presence & Target Countries</h2>
              
              <div className="admin-grid-3">
                <div className="admin-form-group">
                  <label className="admin-label">Badge Text</label>
                  <input type="text" className="admin-input" value={localData.clients.badge || ''} onChange={(e) => handleNestedChange('clients', 'badge', e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Headline Count Text</label>
                  <input type="text" className="admin-input" value={localData.clients.title || ''} onChange={(e) => handleNestedChange('clients', 'title', e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Subtitle Description</label>
                  <input type="text" className="admin-input" value={localData.clients.subtitle || ''} onChange={(e) => handleNestedChange('clients', 'subtitle', e.target.value)} />
                </div>
              </div>

              <h3 className="admin-subheading mt-6">Target Countries / Flags ({localData.clients.countries.length} Markets)</h3>
              <div className="admin-countries-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                {localData.clients.countries.map((country, idx) => (
                  <div key={idx} className="admin-subcard" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                    <div className="admin-grid-2" style={{ flexGrow: 1, gap: '0.5rem' }}>
                      <div className="admin-form-group" style={{ marginBottom: 0 }}>
                        <label className="admin-label">Country Name</label>
                        <input type="text" className="admin-input" value={country.name} onChange={(e) => updateClientCountry(idx, 'name', e.target.value)} />
                      </div>
                      <div className="admin-form-group" style={{ marginBottom: 0 }}>
                        <label className="admin-label">Flag Code (ISO-2)</label>
                        <input type="text" className="admin-input" value={country.code} onChange={(e) => updateClientCountry(idx, 'code', e.target.value)} />
                      </div>
                    </div>
                    <button 
                      onClick={() => removeClientCountry(idx)} 
                      className="admin-btn-secondary" 
                      style={{ padding: '0.5rem 0.75rem', border: '1px solid #ef4444', color: '#ef4444', height: 'fit-content' }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={addClientCountry} className="admin-btn-secondary mt-4" style={{ width: '100%', borderStyle: 'dashed', color: 'var(--accent)' }}>
                + Add Target Country
              </button>
            </div>
          )}

          {/* SOURCING PROCESS TAB */}
          {activeTab === 'sourcing' && localData.sourcing && (
            <div className="admin-card">
              <h2 className="admin-card-title">Sourcing FAQs Configuration</h2>
              <p className="admin-helper-text" style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Define frequently asked questions and answers related to sourcing and anti-dumping duties.
              </p>

              <div className="admin-sourcing-steps" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {localData.sourcing.map((step, idx) => (
                  <div key={idx} className="admin-subcard">
                    <h4 className="admin-subcard-title" style={{ color: 'var(--accent)' }}>
                      FAQ Item {idx + 1}
                    </h4>
                    <div className="admin-form-group">
                      <label className="admin-label">Question (Câu hỏi)</label>
                      <input type="text" className="admin-input" value={step.title} onChange={(e) => updateSourcingStep(idx, 'title', e.target.value)} />
                    </div>
                    <div className="admin-form-group" style={{ marginBottom: 0 }}>
                      <label className="admin-label">Answer (Câu trả lời)</label>
                      <textarea className="admin-textarea" style={{ minHeight: '60px' }} value={step.desc} onChange={(e) => updateSourcingStep(idx, 'desc', e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* QUOTATION & CONTACT TAB */}
          {activeTab === 'contact' && localData.contact && (
            <div className="admin-card">
              <h2 className="admin-card-title">Quotation & Contact Section Config</h2>
              
              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Contact badge</label>
                  <input type="text" className="admin-input" value={localData.contact.badge || ''} onChange={(e) => handleNestedChange('contact', 'badge', e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Contact main title</label>
                  <input type="text" className="admin-input" value={localData.contact.title || ''} onChange={(e) => handleNestedChange('contact', 'title', e.target.value)} />
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Subtitle Intro text</label>
                <textarea className="admin-textarea" value={localData.contact.subtitle || ''} onChange={(e) => handleNestedChange('contact', 'subtitle', e.target.value)} />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Checklist of Sourcing Information Needed (One requirement per line)</label>
                <textarea 
                  className="admin-textarea" 
                  style={{ minHeight: '120px' }}
                  value={localData.contact.infoNeeded?.join('\n') || ''} 
                  onChange={(e) => {
                    const list = e.target.value.split('\n').filter(l => l.trim() !== '');
                    handleNestedChange('contact', 'infoNeeded', list);
                  }}
                />
              </div>

              <h3 className="admin-subheading mt-6">Contact details & Quick links</h3>
              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Email Address</label>
                  <input type="email" className="admin-input" value={localData.contact.email} onChange={(e) => handleNestedChange('contact', 'email', e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">WhatsApp Mobile Phone</label>
                  <input type="text" className="admin-input" value={localData.contact.phone} onChange={(e) => handleNestedChange('contact', 'phone', e.target.value)} />
                </div>
              </div>
              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">WhatsApp Link URL</label>
                  <input type="text" className="admin-input" value={localData.contact.whatsappLink || ''} onChange={(e) => handleNestedChange('contact', 'whatsappLink', e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">LinkedIn Link URL</label>
                  <input type="text" className="admin-input" value={localData.contact.linkedinLink || ''} onChange={(e) => handleNestedChange('contact', 'linkedinLink', e.target.value)} />
                </div>
              </div>
              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Zalo Link URL</label>
                  <input type="text" className="admin-input" value={localData.contact.zaloLink || ''} onChange={(e) => handleNestedChange('contact', 'zaloLink', e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Working Hours</label>
                  <input type="text" className="admin-input" value={localData.contact.workingHours} onChange={(e) => handleNestedChange('contact', 'workingHours', e.target.value)} />
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Corporate Office & Factory Location</label>
                <input type="text" className="admin-input" value={localData.contact.address} onChange={(e) => handleNestedChange('contact', 'address', e.target.value)} />
              </div>

              <h3 className="admin-subheading mt-6">SMTP E-mail Notification Config (When client submits RFQ)</h3>
              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Default Email Subject Line</label>
                  <input type="text" className="admin-input" value={localData.contact.emailSubject || ''} onChange={(e) => handleNestedChange('contact', 'emailSubject', e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Email template placeholder text</label>
                  <input type="text" className="admin-input" value={localData.contact.emailBody || ''} onChange={(e) => handleNestedChange('contact', 'emailBody', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* INQUIRIES TAB */}
          {activeTab === 'inquiries' && (
            <div className="admin-card">
              <h2 className="admin-card-title">Khách hàng liên hệ ({inquiries.length} submissions)</h2>
              
              {inquiriesLoading ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                  <div className="admin-spinner" style={{ margin: '0 auto 1rem auto' }}></div>
                  <p>Fetching contact inquiries from MongoDB...</p>
                </div>
              ) : inquiries.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b', border: '1px dashed rgba(255,255,255,0.06)', borderRadius: '12px' }}>
                  📥 Hộp thư rỗng. Chưa có khách hàng gửi liên hệ.
                </div>
              ) : (
                <div className="admin-inquiries-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {inquiries.map((inq, idx) => (
                    <div key={inq._id} className="admin-inquiry-card" style={{
                      background: 'rgba(15, 23, 42, 0.35)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}>
                      <div className="inquiry-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                          <h4 style={{ color: 'var(--white)', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{inq.name}</h4>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Submitted on: {new Date(inq.createdAt).toLocaleString()}</span>
                        </div>
                        <button 
                          onClick={() => handleDeleteInquiry(inq._id)} 
                          className="admin-btn-secondary" 
                          style={{ padding: '0.4rem 0.75rem', border: '1px solid #ef4444', color: '#ef4444', fontSize: '0.8rem' }}
                        >
                          Xóa liên hệ
                        </button>
                      </div>

                      <div className="inquiry-card-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '0.75rem',
                        fontSize: '0.85rem',
                        background: 'rgba(0,0,0,0.15)',
                        padding: '1rem',
                        borderRadius: '8px'
                      }}>
                        <div><strong>Email:</strong> <a href={`mailto:${inq.email}`} style={{ color: 'var(--accent)' }}>{inq.email}</a></div>
                        <div><strong>Phone:</strong> {inq.phone || 'N/A'}</div>
                        <div><strong>Company:</strong> {inq.company || 'N/A'}</div>
                        <div><strong>Subject:</strong> {inq.subject}</div>
                      </div>

                      <div className="inquiry-card-message" style={{
                        fontSize: '0.9rem',
                        color: '#cbd5e1',
                        background: 'rgba(0,0,0,0.1)',
                        padding: '1rem',
                        borderRadius: '8px',
                        whiteSpace: 'pre-wrap',
                        borderLeft: '3px solid var(--accent)'
                      }}>
                        {inq.message}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SYSTEM SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="admin-card">
              <h2 className="admin-card-title">System Settings</h2>
              <p className="admin-helper-text" style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '2rem' }}>
                Reset configuration defaults or adjust server settings.
              </p>

              <div className="admin-subcard" style={{ border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.03)' }}>
                <h3 className="admin-subcard-title" style={{ color: '#ef4444' }}>Danger Zone</h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
                  Clicking the button below will reset your portfolio database to original factory defaults. Your current custom text edits and products will be permanently overwritten.
                </p>
                <button onClick={handleReset} className="admin-btn-secondary" style={{ border: '1px solid #ef4444', color: '#ef4444' }}>
                  Reset Entire Database to Defaults
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
