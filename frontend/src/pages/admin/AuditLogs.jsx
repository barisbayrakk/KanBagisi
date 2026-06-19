import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ShieldAlert, Search, Activity, Trash2, Edit, UserPlus, LogIn, AlertTriangle, Shield } from 'lucide-react';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get('/Admin/audit-logs');
      setLogs(response.data);
    } catch (error) {
      toast.error('Log kayıtları yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (actionType) => {
    switch (actionType?.toLowerCase()) {
      case 'create': return <UserPlus size={16} color="#10b981" />;
      case 'update': return <Edit size={16} color="#3b82f6" />;
      case 'delete': return <Trash2 size={16} color="#ef4444" />;
      case 'login': return <LogIn size={16} color="#8b5cf6" />;
      case 'security': return <Shield size={16} color="#f59e0b" />;
      default: return <Activity size={16} color="#64748b" />;
    }
  };

  const getActionBadge = (actionType) => {
    switch (actionType?.toLowerCase()) {
      case 'create': return <span style={{ padding: '0.25rem 0.75rem', background: '#d1fae5', color: '#10b981', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700' }}>Oluşturma</span>;
      case 'update': return <span style={{ padding: '0.25rem 0.75rem', background: '#dbeafe', color: '#3b82f6', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700' }}>Güncelleme</span>;
      case 'delete': return <span style={{ padding: '0.25rem 0.75rem', background: '#fee2e2', color: '#ef4444', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700' }}>Silme</span>;
      case 'login': return <span style={{ padding: '0.25rem 0.75rem', background: '#f3e8ff', color: '#8b5cf6', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700' }}>Giriş</span>;
      default: return <span style={{ padding: '0.25rem 0.75rem', background: '#f1f5f9', color: '#64748b', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700' }}>{actionType}</span>;
    }
  };

  const filteredLogs = logs.filter(log => 
    log.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.entityName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in" style={{ paddingBottom: '4rem' }}>
      
      {/* Başlık */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>Sistem Logları (Audit)</h1>
          <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>Sistemdeki tüm kritik işlem ve değişiklik kayıtları.</p>
        </div>
      </div>

      <div className="card glass" style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 20px 50px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        
        {/* Filtreler */}
        <div style={{ padding: '2rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '350px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Kullanıcı, işlem veya açıklama ara..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.9rem', color: '#0f172a', background: '#f8fafc', transition: 'all 0.2s' }} 
              onFocus={e => { e.target.style.background = '#ffffff'; e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 4px rgba(59,130,246,0.1)'; }}
              onBlur={e => { e.target.style.background = '#f8fafc'; e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>
            <AlertTriangle size={18} color="#f59e0b" /> Son 100 kayıt listeleniyor.
          </div>
        </div>

        {/* Masa */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' }}>İŞLEM ZAMANI</th>
                <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' }}>KULLANICI</th>
                <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' }}>İŞLEM TİPİ</th>
                <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' }}>AÇIKLAMA</th>
                <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em', textAlign: 'right' }}>IP ADRESİ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ padding: '4rem 2rem', textAlign: 'center', color: '#94a3b8' }}>
                    <div style={{ width: '30px', height: '30px', border: '3px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }}></div>
                    <p style={{ fontSize: '1rem', fontWeight: '600' }}>Kayıtlar yükleniyor...</p>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '4rem 2rem', textAlign: 'center', color: '#94a3b8' }}>
                    <ShieldAlert size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.2 }} />
                    <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>Log kaydı bulunamadı.</p>
                  </td>
                </tr>
              ) : filteredLogs.map((log, idx) => (
                <tr key={log.id} style={{ borderBottom: idx !== filteredLogs.length - 1 ? '1px solid #f1f5f9' : 'none', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '1.25rem 2rem', color: '#475569', fontSize: '0.9rem', fontWeight: '500' }}>
                    {new Date(log.createdAt).toLocaleString('tr-TR')}
                  </td>
                  <td style={{ padding: '1.25rem 2rem', fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>
                    {log.userName}
                  </td>
                  <td style={{ padding: '1.25rem 2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {getActionIcon(log.actionType)}
                      {getActionBadge(log.actionType)}
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 2rem', color: '#475569', fontSize: '0.9rem' }}>
                    <strong>{log.entityName}</strong>: {log.description}
                  </td>
                  <td style={{ padding: '1.25rem 2rem', color: '#94a3b8', fontSize: '0.85rem', textAlign: 'right', fontFamily: 'monospace' }}>
                    {log.ipAddress || 'Bilinmiyor'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
