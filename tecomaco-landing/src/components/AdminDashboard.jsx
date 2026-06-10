import { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import AdminLogin from './AdminLogin';

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

  // Helper lists CRUD managers
  const updateTimelineItem = (index, field, value) => {
    const newTimeline = [...localData.timeline];
    newTimeline[index][field] = value;
    setLocalData(prev => ({ ...prev, timeline: newTimeline }));
  };

  const addTimelineItem = () => {
    setLocalData(prev => ({
      ...prev,
      timeline: [...prev.timeline, { year: '2026', desc: 'New Milestone Description' }]
    }));
  };

  const removeTimelineItem = (index) => {
    const newTimeline = localData.timeline.filter((_, i) => i !== index);
    setLocalData(prev => ({ ...prev, timeline: newTimeline }));
  };

  // Products CRUD managers
  const updateProduct = (index, field, value) => {
    const newProducts = [...localData.products];
    newProducts[index][field] = value;
    setLocalData(prev => ({ ...prev, products: newProducts }));
  };

  const addProduct = () => {
    const newId = localData.products.length > 0 ? Math.max(...localData.products.map(p => p.id)) + 1 : 1;
    const newProduct = {
      id: newId,
      title: 'New Fastener Product',
      icon: '🔩',
      image: '/images/factory/factory-2.jpg',
      videoUrl: '',
      desc: 'Short description for product grid cards.',
      detail: 'Detailed specifications and background details shown inside modal.',
      applications: ['Automotive', 'Construction'],
      materials: ['Carbon steel'],
      surfaces: ['Zinc plated'],
      standards: ['DIN', 'ISO']
    };
    setLocalData(prev => ({ ...prev, products: [...prev.products, newProduct] }));
  };

  const removeProduct = (id) => {
    const newProducts = localData.products.filter(p => p.id !== id);
    setLocalData(prev => ({ ...prev, products: newProducts }));
  };

  // Certifications CRUD managers
  const updateCert = (index, field, value) => {
    const newCerts = [...localData.certifications.list];
    newCerts[index][field] = value;
    setLocalData(prev => ({
      ...prev,
      certifications: { ...prev.certifications, list: newCerts }
    }));
  };

  const addCert = () => {
    const newId = localData.certifications.list.length > 0 ? Math.max(...localData.certifications.list.map(c => c.id)) + 1 : 1;
    const newCert = {
      id: newId,
      icon: '🏆',
      title: 'ISO Standard Name',
      pdfUrl: '',
      shortDesc: 'A brief 2-sentence summary of what this certification represents.',
      longDesc: 'A longer description for the detail modal.'
    };
    setLocalData(prev => ({
      ...prev,
      certifications: {
        ...prev.certifications,
        list: [...prev.certifications.list, newCert]
      }
    }));
  };

  const removeCert = (id) => {
    const newCerts = localData.certifications.list.filter(c => c.id !== id);
    setLocalData(prev => ({
      ...prev,
      certifications: { ...prev.certifications, list: newCerts }
    }));
  };

  // Export JSON utility
  const exportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(localData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "portfolio-backup.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="admin-wrapper">
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

      {/* Database connection warning banner */}
      {error && (
        <div className="admin-alert admin-alert-warning">
          ⚠️ <strong>Offline Fallback Mode</strong>: {error}
        </div>
      )}

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

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <button onClick={() => setActiveTab('hero')} className={`admin-tab-btn ${activeTab === 'hero' ? 'active' : ''}`}>
            ✨ Hero & Statistics
          </button>
          <button onClick={() => setActiveTab('about')} className={`admin-tab-btn ${activeTab === 'about' ? 'active' : ''}`}>
            🏢 About Us & Features
          </button>
          <button onClick={() => setActiveTab('timeline')} className={`admin-tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}>
            📅 Milestone Timeline
          </button>
          <button onClick={() => setActiveTab('products')} className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}>
            🔩 Product Catalogue
          </button>
          <button onClick={() => setActiveTab('certs')} className={`admin-tab-btn ${activeTab === 'certs' ? 'active' : ''}`}>
            🏆 Certifications & Stats
          </button>
          <button onClick={() => setActiveTab('contact')} className={`admin-tab-btn ${activeTab === 'contact' ? 'active' : ''}`}>
            📞 Contact Information
          </button>
          <button onClick={() => setActiveTab('inquiries')} className={`admin-tab-btn ${activeTab === 'inquiries' ? 'active' : ''}`}>
            {"\uD83D\uDCEC "} Khách hàng liên hệ
          </button>
          <button onClick={() => setActiveTab('settings')} className={`admin-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}>
            ⚙️ System Settings
          </button>
        </aside>

        <main className="admin-content-area">
          {/* HERO TAB */}
          {activeTab === 'hero' && (
            <div className="admin-card">
              <h2 className="admin-card-title">Hero Section Config</h2>
              <div className="admin-form-group">
                <label className="admin-label">Top Banner Badge</label>
                <input type="text" className="admin-input" value={localData.hero.badge} onChange={(e) => handleNestedChange('hero', 'badge', e.target.value)} />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Main Heading Title</label>
                <input type="text" className="admin-input" value={localData.hero.title} onChange={(e) => handleNestedChange('hero', 'title', e.target.value)} />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Subtitle Description Text</label>
                <textarea className="admin-textarea" value={localData.hero.subtitle} onChange={(e) => handleNestedChange('hero', 'subtitle', e.target.value)} />
              </div>

              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Background Image Path/URL</label>
                  <input type="text" className="admin-input" value={localData.hero.bgImage || ''} onChange={(e) => handleNestedChange('hero', 'bgImage', e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Main Image Path/URL (Right Column)</label>
                  <input type="text" className="admin-input" value={localData.hero.image || ''} onChange={(e) => handleNestedChange('hero', 'image', e.target.value)} />
                </div>
              </div>

              <h3 className="admin-subheading mt-4">Floating Cards Overlay (Right Image Cards)</h3>
              <div className="admin-grid-2" style={{ marginBottom: '2rem' }}>
                <div className="admin-subcard">
                  <h4 className="admin-subcard-title">Floating Card 1</h4>
                  <div className="admin-grid-2" style={{ gap: '0.75rem' }}>
                    <div className="admin-form-group" style={{ marginBottom: 0 }}>
                      <label className="admin-label">Icon (Emoji)</label>
                      <input type="text" className="admin-input" value={localData.hero.card1?.icon || ''} onChange={(e) => {
                        const newCard = { ...(localData.hero.card1 || {}), icon: e.target.value };
                        handleNestedChange('hero', 'card1', newCard);
                      }} />
                    </div>
                    <div className="admin-form-group" style={{ marginBottom: 0 }}>
                      <label className="admin-label">Text</label>
                      <input type="text" className="admin-input" value={localData.hero.card1?.text || ''} onChange={(e) => {
                        const newCard = { ...(localData.hero.card1 || {}), text: e.target.value };
                        handleNestedChange('hero', 'card1', newCard);
                      }} />
                    </div>
                  </div>
                </div>

                <div className="admin-subcard">
                  <h4 className="admin-subcard-title">Floating Card 2</h4>
                  <div className="admin-grid-2" style={{ gap: '0.75rem' }}>
                    <div className="admin-form-group" style={{ marginBottom: 0 }}>
                      <label className="admin-label">Icon (Emoji)</label>
                      <input type="text" className="admin-input" value={localData.hero.card2?.icon || ''} onChange={(e) => {
                        const newCard = { ...(localData.hero.card2 || {}), icon: e.target.value };
                        handleNestedChange('hero', 'card2', newCard);
                      }} />
                    </div>
                    <div className="admin-form-group" style={{ marginBottom: 0 }}>
                      <label className="admin-label">Text</label>
                      <input type="text" className="admin-input" value={localData.hero.card2?.text || ''} onChange={(e) => {
                        const newCard = { ...(localData.hero.card2 || {}), text: e.target.value };
                        handleNestedChange('hero', 'card2', newCard);
                      }} />
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="admin-subheading mt-6">Counter Statistics (Hero Page bottom grid)</h3>
              <div className="admin-grid-4">
                {localData.hero.stats.map((stat, i) => (
                  <div key={i} className="admin-subcard">
                    <h4 className="admin-subcard-title">Stat Card {i+1}</h4>
                    <div className="admin-form-group">
                      <label className="admin-label">Number Value</label>
                      <input type="number" className="admin-input" value={stat.number} onChange={(e) => {
                        const newStats = [...localData.hero.stats];
                        newStats[i].number = parseInt(e.target.value) || 0;
                        handleNestedChange('hero', 'stats', newStats);
                      }} />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Suffix (e.g. +, %, T)</label>
                      <input type="text" className="admin-input" value={stat.suffix} onChange={(e) => {
                        const newStats = [...localData.hero.stats];
                        newStats[i].suffix = e.target.value;
                        handleNestedChange('hero', 'stats', newStats);
                      }} />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Label Description</label>
                      <input type="text" className="admin-input" value={stat.label} onChange={(e) => {
                        const newStats = [...localData.hero.stats];
                        newStats[i].label = e.target.value;
                        handleNestedChange('hero', 'stats', newStats);
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ABOUT TAB */}
          {activeTab === 'about' && (
            <div className="admin-card">
              <h2 className="admin-card-title">About Us Section Config</h2>
              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Section Badge</label>
                  <input type="text" className="admin-input" value={localData.about.badge} onChange={(e) => handleNestedChange('about', 'badge', e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Section Title</label>
                  <input type="text" className="admin-input" value={localData.about.title} onChange={(e) => handleNestedChange('about', 'title', e.target.value)} />
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Section Subtitle</label>
                <input type="text" className="admin-input" value={localData.about.subtitle} onChange={(e) => handleNestedChange('about', 'subtitle', e.target.value)} />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Content Main Heading</label>
                <input type="text" className="admin-input" value={localData.about.heading} onChange={(e) => handleNestedChange('about', 'heading', e.target.value)} />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">About Paragraphs (One paragraph per line)</label>
                <textarea 
                  className="admin-textarea" 
                  style={{ minHeight: '150px' }}
                  value={localData.about.paragraphs.join('\n\n')} 
                  onChange={(e) => {
                    const paras = e.target.value.split('\n\n').filter(p => p.trim() !== '');
                    handleNestedChange('about', 'paragraphs', paras);
                  }} 
                />
              </div>

              <h3 className="admin-subheading mt-6">Features Grid</h3>
              <div className="admin-grid-3">
                {localData.about.features.map((feat, i) => (
                  <div key={i} className="admin-subcard">
                    <div className="admin-form-group">
                      <label className="admin-label">Emoji Icon</label>
                      <input type="text" className="admin-input" value={feat.icon} onChange={(e) => {
                        const newFeats = [...localData.about.features];
                        newFeats[i].icon = e.target.value;
                        handleNestedChange('about', 'features', newFeats);
                      }} />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Feature Text</label>
                      <input type="text" className="admin-input" value={feat.text} onChange={(e) => {
                        const newFeats = [...localData.about.features];
                        newFeats[i].text = e.target.value;
                        handleNestedChange('about', 'features', newFeats);
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="admin-card-header-flex mt-8" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
                <h3 className="admin-subheading" style={{ marginBottom: 0, borderBottom: 'none' }}>About Swiper Gallery Images</h3>
                <button type="button" onClick={() => {
                  const newGallery = [...localData.about.gallery, { src: '/images/factory/factory-2.jpg', alt: 'Factory Image' }];
                  handleNestedChange('about', 'gallery', newGallery);
                }} className="admin-btn-secondary">+ Add Image</button>
              </div>

              <div className="admin-list">
                {localData.about.gallery.map((img, idx) => (
                  <div key={idx} className="admin-list-item">
                    <div className="admin-item-fields">
                      <div className="admin-form-group" style={{ flex: 1 }}>
                        <label className="admin-label">Image Path/URL</label>
                        <input type="text" className="admin-input" value={img.src} onChange={(e) => {
                          const newGallery = [...localData.about.gallery];
                          newGallery[idx].src = e.target.value;
                          handleNestedChange('about', 'gallery', newGallery);
                        }} />
                      </div>
                      <div className="admin-form-group" style={{ flex: 1 }}>
                        <label className="admin-label">Alt Description</label>
                        <input type="text" className="admin-input" value={img.alt} onChange={(e) => {
                          const newGallery = [...localData.about.gallery];
                          newGallery[idx].alt = e.target.value;
                          handleNestedChange('about', 'gallery', newGallery);
                        }} />
                      </div>
                    </div>
                    <button type="button" onClick={() => {
                      const newGallery = localData.about.gallery.filter((_, i) => i !== idx);
                      handleNestedChange('about', 'gallery', newGallery);
                    }} className="admin-btn-danger">Delete</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TIMELINE TAB */}
          {activeTab === 'timeline' && (
            <div className="admin-card">
              <div className="admin-card-header-flex">
                <h2 className="admin-card-title">Company Milestones & History</h2>
                <button onClick={addTimelineItem} className="admin-btn-secondary">+ Add Milestone</button>
              </div>
              <div className="admin-list">
                {localData.timeline.map((item, i) => (
                  <div key={i} className="admin-list-item">
                    <div className="admin-item-fields">
                      <div className="admin-form-group" style={{ maxWidth: '120px' }}>
                        <label className="admin-label">Year</label>
                        <input type="text" className="admin-input" value={item.year} onChange={(e) => updateTimelineItem(i, 'year', e.target.value)} />
                      </div>
                      <div className="admin-form-group" style={{ flex: 1 }}>
                        <label className="admin-label">Description Description</label>
                        <input type="text" className="admin-input" value={item.desc} onChange={(e) => updateTimelineItem(i, 'desc', e.target.value)} />
                      </div>
                    </div>
                    <button onClick={() => removeTimelineItem(i)} className="admin-btn-danger">Delete</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div className="admin-card">
              <div className="admin-card-header-flex">
                <h2 className="admin-card-title">Products Catalogue</h2>
                <button onClick={addProduct} className="admin-btn-secondary">+ Add Product</button>
              </div>
              <div className="admin-products-editor">
                {localData.products.map((prod, index) => (
                  <details key={prod.id} className="admin-product-details-summary">
                    <summary className="admin-summary-header">
                      <span className="summary-icon">{prod.icon}</span>
                      <strong className="summary-title">{prod.title}</strong>
                      <button type="button" onClick={() => removeProduct(prod.id)} className="summary-del-btn">Delete Product</button>
                    </summary>
                    <div className="summary-body">
                      <div className="admin-grid-3">
                        <div className="admin-form-group">
                          <label className="admin-label">Product Name Title</label>
                          <input type="text" className="admin-input" value={prod.title} onChange={(e) => updateProduct(index, 'title', e.target.value)} />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-label">Product Icon Emoji</label>
                          <input type="text" className="admin-input" value={prod.icon} onChange={(e) => updateProduct(index, 'icon', e.target.value)} />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-label">Production Video URL</label>
                          <input type="text" className="admin-input" value={prod.videoUrl || ''} onChange={(e) => updateProduct(index, 'videoUrl', e.target.value)} />
                        </div>
                      </div>
                      <div className="admin-grid-2">
                        <div className="admin-form-group">
                          <label className="admin-label">Product Image Path/URL</label>
                          <input type="text" className="admin-input" value={prod.image} onChange={(e) => updateProduct(index, 'image', e.target.value)} />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-label">Brief Card Description</label>
                          <input type="text" className="admin-input" value={prod.desc} onChange={(e) => updateProduct(index, 'desc', e.target.value)} />
                        </div>
                      </div>
                      <div className="admin-form-group">
                        <label className="admin-label">Detailed Description (inside Modal)</label>
                        <textarea className="admin-textarea" value={prod.detail} onChange={(e) => updateProduct(index, 'detail', e.target.value)} />
                      </div>

                      {/* Tag list arrays */}
                      <div className="admin-grid-2">
                        <div className="admin-form-group">
                          <label className="admin-label">Applications (Comma separated)</label>
                          <input type="text" className="admin-input" value={prod.applications.join(', ')} onChange={(e) => {
                            const arr = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
                            updateProduct(index, 'applications', arr);
                          }} />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-label">Materials (Comma separated)</label>
                          <input type="text" className="admin-input" value={prod.materials.join(', ')} onChange={(e) => {
                            const arr = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
                            updateProduct(index, 'materials', arr);
                          }} />
                        </div>
                      </div>
                      <div className="admin-grid-2">
                        <div className="admin-form-group">
                          <label className="admin-label">Surface Treatments (Comma separated)</label>
                          <input type="text" className="admin-input" value={prod.surfaces.join(', ')} onChange={(e) => {
                            const arr = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
                            updateProduct(index, 'surfaces', arr);
                          }} />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-label">Standards Compliance (Comma separated)</label>
                          <input type="text" className="admin-input" value={prod.standards.join(', ')} onChange={(e) => {
                            const arr = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
                            updateProduct(index, 'standards', arr);
                          }} />
                        </div>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* CERTIFICATIONS TAB */}
          {activeTab === 'certs' && (
            <div className="admin-card">
              <h2 className="admin-card-title">Certifications Header Info</h2>
              <div className="admin-grid-3">
                <div className="admin-form-group">
                  <label className="admin-label">Section Badge</label>
                  <input type="text" className="admin-input" value={localData.certifications.badge} onChange={(e) => {
                    setLocalData(prev => ({
                      ...prev,
                      certifications: { ...prev.certifications, badge: e.target.value }
                    }));
                  }} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Section Title</label>
                  <input type="text" className="admin-input" value={localData.certifications.title} onChange={(e) => {
                    setLocalData(prev => ({
                      ...prev,
                      certifications: { ...prev.certifications, title: e.target.value }
                    }));
                  }} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Section Subtitle</label>
                  <input type="text" className="admin-input" value={localData.certifications.subtitle} onChange={(e) => {
                    setLocalData(prev => ({
                      ...prev,
                      certifications: { ...prev.certifications, subtitle: e.target.value }
                    }));
                  }} />
                </div>
              </div>

              <div className="admin-card-header-flex mt-6">
                <h3 className="admin-subheading">Certificates List</h3>
                <button onClick={addCert} className="admin-btn-secondary">+ Add Certificate</button>
              </div>

              <div className="admin-cert-list">
                {localData.certifications.list.map((cert, index) => (
                  <div key={cert.id} className="admin-cert-card-item">
                    <div className="admin-grid-4">
                      <div className="admin-form-group">
                        <label className="admin-label">Cert Emoji Icon</label>
                        <input type="text" className="admin-input" value={cert.icon} onChange={(e) => updateCert(index, 'icon', e.target.value)} />
                      </div>
                      <div className="admin-form-group">
                        <label className="admin-label">Cert Title/Standard</label>
                        <input type="text" className="admin-input" value={cert.title} onChange={(e) => updateCert(index, 'title', e.target.value)} />
                      </div>
                      <div className="admin-form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="admin-label">PDF File Path/URL</label>
                        <input type="text" className="admin-input" value={cert.pdfUrl || ''} onChange={(e) => updateCert(index, 'pdfUrl', e.target.value)} />
                      </div>
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Short Summary (Grid card)</label>
                      <input type="text" className="admin-input" value={cert.shortDesc} onChange={(e) => updateCert(index, 'shortDesc', e.target.value)} />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Detailed Explanation (Modal overlay)</label>
                      <textarea className="admin-textarea" value={cert.longDesc} onChange={(e) => updateCert(index, 'longDesc', e.target.value)} />
                    </div>
                    <button type="button" onClick={() => removeCert(cert.id)} className="admin-btn-danger" style={{ alignSelf: 'flex-end', marginTop: '0.5rem' }}>
                      Delete Certificate
                    </button>
                  </div>
                ))}
              </div>

              <h3 className="admin-subheading mt-8">Certifications Page Stats Grid</h3>
              <div className="admin-grid-4">
                {localData.certifications.stats.map((stat, i) => (
                  <div key={i} className="admin-subcard">
                    <h4 className="admin-subcard-title">Stat Card {i+1}</h4>
                    <div className="admin-form-group">
                      <label className="admin-label">Number Value</label>
                      <input type="number" className="admin-input" value={stat.number} onChange={(e) => {
                        const newStats = [...localData.certifications.stats];
                        newStats[i].number = parseInt(e.target.value) || 0;
                        setLocalData(prev => ({
                          ...prev,
                          certifications: { ...prev.certifications, stats: newStats }
                        }));
                      }} />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Suffix (e.g. +, %)</label>
                      <input type="text" className="admin-input" value={stat.suffix} onChange={(e) => {
                        const newStats = [...localData.certifications.stats];
                        newStats[i].suffix = e.target.value;
                        setLocalData(prev => ({
                          ...prev,
                          certifications: { ...prev.certifications, stats: newStats }
                        }));
                      }} />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Label Description</label>
                      <input type="text" className="admin-input" value={stat.label} onChange={(e) => {
                        const newStats = [...localData.certifications.stats];
                        newStats[i].label = e.target.value;
                        setLocalData(prev => ({
                          ...prev,
                          certifications: { ...prev.certifications, stats: newStats }
                        }));
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONTACT TAB */}
          {activeTab === 'contact' && (
            <div className="admin-card">
              <h2 className="admin-card-title">Contact Form & Footers</h2>
              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Section Badge</label>
                  <input type="text" className="admin-input" value={localData.contact.badge} onChange={(e) => handleNestedChange('contact', 'badge', e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Section Title Banner</label>
                  <input type="text" className="admin-input" value={localData.contact.title} onChange={(e) => handleNestedChange('contact', 'title', e.target.value)} />
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Section Subtitle Text</label>
                <input type="text" className="admin-input" value={localData.contact.subtitle} onChange={(e) => handleNestedChange('contact', 'subtitle', e.target.value)} />
              </div>

              <h3 className="admin-subheading mt-6">Address & Phone details</h3>
              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Physical Address</label>
                  <input type="text" className="admin-input" value={localData.contact.address} onChange={(e) => handleNestedChange('contact', 'address', e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Contact Email Address</label>
                  <input type="email" className="admin-input" value={localData.contact.email} onChange={(e) => handleNestedChange('contact', 'email', e.target.value)} />
                </div>
              </div>
              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Contact Phone Number</label>
                  <input type="text" className="admin-input" value={localData.contact.phone} onChange={(e) => handleNestedChange('contact', 'phone', e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Working Hours Schedule</label>
                  <input type="text" className="admin-input" value={localData.contact.workingHours} onChange={(e) => handleNestedChange('contact', 'workingHours', e.target.value)} />
                </div>
              </div>

              <h3 className="admin-subheading mt-6">Quick Contact Links & Email Template</h3>
              <div className="admin-form-group">
                <label className="admin-label">Zalo Link/Phone (e.g., https://zalo.me/0987654321)</label>
                <input type="text" className="admin-input" value={localData.contact.zaloLink || ''} onChange={(e) => handleNestedChange('contact', 'zaloLink', e.target.value)} />
              </div>
              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Email Template: Subject Title</label>
                  <input type="text" className="admin-input" value={localData.contact.emailSubject || ''} onChange={(e) => handleNestedChange('contact', 'emailSubject', e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Email Template: Body Content</label>
                  <textarea className="admin-textarea" value={localData.contact.emailBody || ''} onChange={(e) => handleNestedChange('contact', 'emailBody', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="admin-card">
              <h2 className="admin-card-title">Portfolio Settings & Tools</h2>
              <p className="admin-card-desc" style={{ marginBottom: '2rem' }}>
                Use these tools to back up your current portfolio database or restore it to initial factory settings.
              </p>

              <div className="admin-settings-row">
                <div className="settings-desc">
                  <strong>Export Portfolio JSON Configuration</strong>
                  <p>Download a backup copy of your customized texts, statistics, products, and certifications to your computer.</p>
                </div>
                <button onClick={exportJson} className="admin-btn-secondary">Export JSON</button>
              </div>

              <div className="admin-settings-row">
                <div className="settings-desc">
                  <strong>Import Portfolio Configuration</strong>
                  <p>Upload a JSON configuration file to overwrite your current browser changes before saving.</p>
                </div>
                <input 
                  type="file" 
                  accept=".json" 
                  id="admin-import-file" 
                  style={{ display: 'none' }} 
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        try {
                          const parsed = JSON.parse(event.target.result);
                          // basic validation
                          if (parsed.hero && parsed.about && parsed.products) {
                            setLocalData(parsed);
                            setSaveStatus({ type: 'success', message: 'Config loaded in editor. Remember to click Save Changes to upload to MongoDB Atlas!' });
                          } else {
                            alert("Invalid configuration file format!");
                          }
                        } catch (err) {
                          alert("Error parsing JSON file: " + err.message);
                        }
                      };
                      reader.readAsText(file);
                    }
                  }}
                />
                <button onClick={() => document.getElementById('admin-import-file').click()} className="admin-btn-secondary">Import JSON</button>
              </div>

              <div className="admin-settings-row" style={{ borderBottom: 'none', marginTop: '2rem' }}>
                <div className="settings-desc">
                  <strong>Reset Database to Factory Defaults</strong>
                  <p style={{ color: 'var(--text-light)' }}>
                    Overwrite MongoDB Atlas content with default corporate DrillMaco dataset. All customized progress will be deleted.
                  </p>
                </div>
                <button onClick={handleReset} className="admin-btn-danger">Reset to Defaults</button>
              </div>
            </div>
          )}

          {/* INQUIRIES TAB */}
          {activeTab === 'inquiries' && (
            <div className="admin-card">
              <h2 className="admin-card-title">{"\uD83D\uDCEC "} Khách hàng liên hệ (Leads)</h2>
              <p className="admin-card-desc" style={{ marginBottom: '2rem' }}>
                Danh sách các tin nhắn gửi từ form liên hệ "Send Us an Inquiry" trên trang chủ.
              </p>

              {inquiriesLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                  <div className="admin-spinner"></div>
                </div>
              ) : inquiries.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#64748b' }}>
                  <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>{"\uD83D\uDCED"}</span>
                  <p>Chưa có liên hệ nào được gửi từ khách hàng.</p>
                </div>
              ) : (
                <div className="admin-inquiries-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {inquiries.map((inq) => (
                    <div key={inq._id} className="admin-subcard" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid rgba(255, 255, 255, 0.05)', background: 'rgba(15, 23, 42, 0.3)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.75rem' }}>
                        <div>
                          <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', color: '#f8fafc' }}>
                            {inq.name} <span style={{ fontSize: '0.85rem', fontWeight: 'normal', color: '#94a3b8' }}>({inq.company || 'Cá nhân'})</span>
                          </h4>
                          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#64748b', flexWrap: 'wrap' }}>
                            <span>{"\uD83D\uDCE7 "} <a href={`mailto:${inq.email}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>{inq.email}</a></span>
                            {inq.phone && <span>{"\uD83D\uDCDE "} <a href={`tel:${inq.phone}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>{inq.phone}</a></span>}
                            <span>{"\uD83D\uDCC5 "} {new Date(inq.createdAt).toLocaleString('vi-VN')}</span>
                          </div>
                        </div>
                        <button onClick={() => handleDeleteInquiry(inq._id)} className="admin-btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '6px' }}>
                          Xóa liên hệ
                        </button>
                      </div>
                      
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#cbd5e1', marginBottom: '0.5rem' }}>
                          Tiêu đề: {inq.subject}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#94a3b8', background: 'rgba(0, 0, 0, 0.2)', padding: '1rem', borderRadius: '8px', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                          {inq.message}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
