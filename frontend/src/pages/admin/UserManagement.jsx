import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Users, Search, Shield, UserRound, Mail, Phone, MapPin, User, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

const UserManagement = ({ user, usersList, setUsersList }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bloodTypeFilter, setBloodTypeFilter] = useState('Tüm Kan Grupları');
  const [roleFilter, setRoleFilter] = useState('Tüm Roller');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [editModal, setEditModal] = useState(null);
  const [detailModal, setDetailModal] = useState(null);

  const displayUsers = useMemo(() => {
    if (user?.role === 'SubAdmin') {
      return usersList.filter(u => u.role !== 'Admin' && u.role !== 'Yönetici');
    }
    return usersList;
  }, [usersList, user]);

  const totalUsers = displayUsers.length;
  const adminCount = displayUsers.filter(u => u.role === 'Yönetici').length;
  const donorCount = displayUsers.filter(u => u.role !== 'Yönetici').length;

  const filteredUsers = useMemo(() => {
    return displayUsers.filter(u => {
      const matchesSearch = 
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.tc?.includes(searchTerm) ||
        u.phone?.includes(searchTerm);
      
      const matchesBlood = bloodTypeFilter === 'Tüm Kan Grupları' || u.bloodType === bloodTypeFilter;
      const matchesRole = roleFilter === 'Tüm Roller' || u.role === roleFilter;

      return matchesSearch && matchesBlood && matchesRole;
    });
  }, [displayUsers, searchTerm, bloodTypeFilter, roleFilter]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = async (id) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz? (Soft Delete)')) {
      try {
        await axios.delete(`/Admin/users/${id}`);
        setUsersList(prev => prev.filter(u => u.id !== id));
        toast.success('Kullanıcı başarıyla silindi.');
      } catch (error) {
        toast.error('Kullanıcı silinirken bir hata oluştu.');
      }
    }
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    setUsersList(prev => prev.map(u => u.id === editModal.id ? {
      ...u,
      name: fd.get('name'),
      email: fd.get('email'),
      phone: fd.get('phone'),
      tc: fd.get('tc'),
      bloodType: fd.get('bloodType'),
      gender: fd.get('gender'),
      district: fd.get('district'),
      role: fd.get('role')
    } : u));
    toast.success('Kullanıcı bilgileri başarıyla güncellendi.');
    setEditModal(null);
  };

  return (
    <div className="animate-in" style={{ padding: '0 0 4rem 0' }}>
      {/* En İyi İstatistik Kartları */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card glass" style={{ background: '#ffffff', borderRadius: '10px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={28} style={{ color: '#3b82f6' }} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', lineHeight: '1' }}>{totalUsers}</div>
            <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500', marginTop: '0.25rem' }}>Toplam Kullanıcı</div>
          </div>
        </div>

        <div className="card glass" style={{ background: '#ffffff', borderRadius: '10px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={28} style={{ color: '#ef4444' }} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', lineHeight: '1' }}>{adminCount}</div>
            <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500', marginTop: '0.25rem' }}>Yönetici Personel</div>
          </div>
        </div>

        <div className="card glass" style={{ background: '#ffffff', borderRadius: '10px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '8px', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserRound size={28} style={{ color: '#22c55e' }} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', lineHeight: '1' }}>{donorCount}</div>
            <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500', marginTop: '0.25rem' }}>Aktif Bağışçı</div>
          </div>
        </div>
      </div>

      {/* Ana Masa Kartı */}
      <div className="card glass" style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 20px 50px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        
        {/* Başlık ve Filtreler */}
        <div style={{ padding: '2rem', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(225,29,72,0.2)' }}>
                <Users size={24} style={{ color: '#ffffff' }} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Kullanıcı Yönetimi</h2>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>Sistemdeki tüm kullanıcıları yönetin ve filtreleyin.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', width: '280px' }}>
                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="text" 
                  placeholder="İsim, email, TC ile ara..." 
                  value={searchTerm}
                  onChange={e => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                  style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.9rem', color: '#0f172a', background: '#f8fafc', transition: 'all 0.2s' }} 
                  onFocus={e => { e.target.style.background = '#ffffff'; e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 4px rgba(59,130,246,0.1)'; }}
                  onBlur={e => { e.target.style.background = '#f8fafc'; e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              <select value={bloodTypeFilter} onChange={e => {setBloodTypeFilter(e.target.value); setCurrentPage(1);}} style={{ padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.9rem', color: '#0f172a', background: '#f8fafc', cursor: 'pointer' }}>
                <option>Tüm Kan Grupları</option>
                <option>0+</option><option>0-</option><option>A+</option><option>A-</option>
                <option>B+</option><option>B-</option><option>AB+</option><option>AB-</option>
              </select>
              <select value={roleFilter} onChange={e => {setRoleFilter(e.target.value); setCurrentPage(1);}} style={{ padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.9rem', color: '#0f172a', background: '#f8fafc', cursor: 'pointer' }}>
                <option value="Tüm Roller">Tüm Roller</option>
                <option value="Kullanıcı">Kullanıcı</option>
                <option value="Yönetici">Yönetici</option>
                <option value="SubAdmin">Yr. Admin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Masa Alanı */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' }}>KULLANICI</th>
                <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' }}>İLETİŞİM</th>
                <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' }}>KAN GRUBU</th>
                <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' }}>LOKASYON</th>
                <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' }}>ROL</th>
                <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em', textAlign: 'right' }}>İŞLEMLER</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '4rem 2rem', textAlign: 'center', color: '#94a3b8' }}>
                    <Search size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.2 }} />
                    <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>Kullanıcı bulunamadı.</p>
                    <p style={{ fontSize: '0.9rem' }}>Farklı filtreler deneyin.</p>
                  </td>
                </tr>
              ) : paginatedUsers.map((u, idx) => (
                <tr key={u.id} style={{ borderBottom: idx !== paginatedUsers.length - 1 ? '1px solid #f1f5f9' : 'none', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'transparent'} onClick={() => setDetailModal(u)}>
                  
                  {/* Kullanıcı */}
                  <td style={{ padding: '1.25rem 2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: u.role === 'Yönetici' ? '#fee2e2' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: '700', color: u.role === 'Yönetici' ? '#ef4444' : '#475569' }}>
                        {u.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>{u.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><CheckCircle size={12} color="#10b981"/> Doğrulanmış</div>
                      </div>
                    </div>
                  </td>

                  {/* İletişim */}
                  <td style={{ padding: '1.25rem 2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem' }}><Mail size={14} /> {u.email}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem' }}><Phone size={14} /> {u.phone || '-'}</div>
                    </div>
                  </td>

                  {/* Kan Grubu */}
                  <td style={{ padding: '1.25rem 2rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0.4rem 0.8rem', background: 'rgba(153, 27, 27, 0.08)', color: '#991b1b', borderRadius: '8px', fontWeight: '800', fontSize: '0.9rem' }}>
                      {u.bloodType || '-'}
                    </span>
                  </td>

                  {/* ilçe */}
                  <td style={{ padding: '1.25rem 2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569', fontSize: '0.9rem' }}>
                      <MapPin size={14} style={{ color: '#94a3b8' }} /> {u.district || '-'}
                    </div>
                  </td>

                  {/* Rol */}
                  <td style={{ padding: '1.25rem 2rem' }}>
                    {u.role === 'Admin' || u.role === 'Yönetici' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700' }}>
                        <Shield size={14} /> Yönetici
                      </span>
                    ) : u.role === 'SubAdmin' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 1rem', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700' }}>
                        <Shield size={14} /> Yr. Admin
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 1rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700' }}>
                        <User size={14} /> Kullanıcı
                      </span>
                    )}
                  </td>

                  {/* İşlemler */}
                  <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }} onClick={e => e.stopPropagation()}>
                      <button onClick={() => setEditModal(u)} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }} title="Düzenle" onMouseOver={e => { e.currentTarget.style.background = '#3b82f6'; e.currentTarget.style.color = '#fff'; }} onMouseOut={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.1)'; e.currentTarget.style.color = '#3b82f6'; }}>
                        <Edit size={16} />
                      </button>
                      {u.role !== 'Yönetici' && (
                        <button onClick={() => handleDelete(u.id)} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }} title="Sil" onMouseOver={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; }} onMouseOut={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; }}>
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sayfalandırma */}
        {totalPages > 1 && (
          <div style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9' }}>
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Toplam <strong>{filteredUsers.length}</strong> kayıttan <strong>{(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredUsers.length)}</strong> arası gösteriliyor.
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: currentPage === 1 ? '#f8fafc' : '#ffffff', color: currentPage === 1 ? '#cbd5e1' : '#475569', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontWeight: '600' }}
              >
                Önceki
              </button>
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 0.5rem', fontWeight: '700', color: '#0f172a' }}>
                {currentPage} / {totalPages}
              </div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: currentPage === totalPages ? '#f8fafc' : '#ffffff', color: currentPage === totalPages ? '#cbd5e1' : '#475569', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontWeight: '600' }}
              >
                Sonraki
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Düzenleme Modalı */}
      {editModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', animation: 'fadeIn 0.2s ease-out' }} onClick={() => setEditModal(null)}>
          <div style={{ background: '#ffffff', borderRadius: '10px', padding: '2.5rem', width: '100%', maxWidth: '600px', boxShadow: '0 25px 60px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}><Edit size={20}/></div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Kullanıcı Düzenle</h3>
              </div>
              <button onClick={() => setEditModal(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '12px', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', transition: 'all 0.2s' }} onMouseOver={e => {e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'}} onMouseOut={e => {e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#64748b'}}><XCircle size={20} /></button>
            </div>
            <form onSubmit={handleEditSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.5rem' }}>Ad Soyad</label>
                  <input name="name" defaultValue={editModal.name} required style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.875rem 1rem', borderRadius: '12px', width: '100%', outline: 'none', transition: 'all 0.2s' }} onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 4px rgba(59,130,246,0.1)'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.5rem' }}>T.C. Kimlik No</label>
                  <input name="tc" defaultValue={editModal.tc} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.875rem 1rem', borderRadius: '12px', width: '100%', outline: 'none', transition: 'all 0.2s' }} onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 4px rgba(59,130,246,0.1)'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.5rem' }}>E-posta</label>
                  <input name="email" type="email" defaultValue={editModal.email} required style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.875rem 1rem', borderRadius: '12px', width: '100%', outline: 'none', transition: 'all 0.2s' }} onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 4px rgba(59,130,246,0.1)'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.5rem' }}>Telefon</label>
                  <input name="phone" defaultValue={editModal.phone} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.875rem 1rem', borderRadius: '12px', width: '100%', outline: 'none', transition: 'all 0.2s' }} onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 4px rgba(59,130,246,0.1)'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.5rem' }}>Kan Grubu</label>
                  <select name="bloodType" defaultValue={editModal.bloodType} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.875rem 1rem', borderRadius: '12px', width: '100%', outline: 'none' }}>
                    {['0+', '0-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.5rem' }}>Cinsiyet</label>
                  <select name="gender" defaultValue={editModal.gender} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.875rem 1rem', borderRadius: '12px', width: '100%', outline: 'none' }}>
                    <option>Erkek</option><option>Kadın</option><option>Belirtmek İstemiyorum</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.5rem' }}>İlçe</label>
                  <select name="district" defaultValue={editModal.district} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.875rem 1rem', borderRadius: '12px', width: '100%', outline: 'none' }}>
                    {['Adalar', 'Arnavutköy', 'Ataşehir', 'Avcılar', 'Bağcılar', 'Bahçelievler', 'Bakırköy', 'Başakşehir', 'Bayrampaşa', 'Beşiktaş', 'Beykoz', 'Beylikdüzü', 'Beyoğlu', 'Büyükçekmece', 'Çatalca', 'Çekmeköy', 'Esenler', 'Esenyurt', 'Eyüpsultan', 'Fatih', 'Gaziosmanpaşa', 'Güngören', 'Kadıköy', 'Kağıthane', 'Kartal', 'Küçükçekmece', 'Maltepe', 'Pendik', 'Sancaktepe', 'Sarıyer', 'Silivri', 'Sultanbeyli', 'Sultangazi', 'Şile', 'Şişli', 'Tuzla', 'Ümraniye', 'Üsküdar', 'Zeytinburnu'].map(i => <option key={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.5rem' }}>Rol</label>
                  <select name="role" defaultValue={editModal.role} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.875rem 1rem', borderRadius: '12px', width: '100%', outline: 'none' }}>
                    <option>Kullanıcı</option><option>Yönetici</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                <button type="button" onClick={() => setEditModal(null)} style={{ padding: '0.875rem 1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#ffffff', color: '#475569', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = '#ffffff'}>İptal Et</button>
                <button type="submit" style={{ padding: '0.875rem 2rem', borderRadius: '12px', border: 'none', background: '#0284c7', color: 'white', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(2,132,199,0.3)' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>Değişiklikleri Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detay Modalı */}
      {detailModal && !editModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', animation: 'fadeIn 0.2s ease-out' }} onClick={() => setDetailModal(null)}>
          <div style={{ background: '#ffffff', borderRadius: '10px', padding: '3rem', width: '100%', maxWidth: '500px', boxShadow: '0 25px 60px rgba(0,0,0,0.2)', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setDetailModal(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#f1f5f9', border: 'none', borderRadius: '12px', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', transition: 'all 0.2s' }} onMouseOver={e => {e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'}} onMouseOut={e => {e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#64748b'}}><XCircle size={20} /></button>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '10px', background: detailModal.role === 'Yönetici' ? '#fee2e2' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: '800', color: detailModal.role === 'Yönetici' ? '#ef4444' : '#475569', marginBottom: '1rem', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
                {detailModal.name?.charAt(0) || 'U'}
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.5rem 0' }}>{detailModal.name}</h3>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 1rem', background: detailModal.role === 'Yönetici' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)', color: detailModal.role === 'Yönetici' ? '#ef4444' : '#3b82f6', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700' }}>
                {detailModal.role === 'Yönetici' ? <Shield size={14} /> : <User size={14} />} {detailModal.role}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>E-posta</span>
                <span style={{ color: '#0f172a', fontSize: '0.95rem', fontWeight: '500' }}>{detailModal.email}</span>
              </div>
              <div style={{ height: '1px', background: '#e2e8f0' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>Telefon</span>
                <span style={{ color: '#0f172a', fontSize: '0.95rem', fontWeight: '500' }}>{detailModal.phone || '-'}</span>
              </div>
              <div style={{ height: '1px', background: '#e2e8f0' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>Kan Grubu</span>
                <span style={{ color: '#991b1b', fontSize: '1rem', fontWeight: '800' }}>{detailModal.bloodType || '-'}</span>
              </div>
              <div style={{ height: '1px', background: '#e2e8f0' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>TC Kimlik No</span>
                <span style={{ color: '#0f172a', fontSize: '0.95rem', fontWeight: '500' }}>{detailModal.tc || '-'}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button onClick={() => {setDetailModal(null); setEditModal(detailModal);}} style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: 'none', background: '#0284c7', color: 'white', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(2,132,199,0.3)' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <Edit size={18} /> Düzenle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
