import React from 'react';
import { Lock, Key } from 'lucide-react';

const SecuritySettings = ({ user, handleCheckboxChange }) => {
  return (
    <div className="card glass" style={{ background: '#ffffff', borderRadius: '10px', padding: '2rem', marginBottom: '1.5rem', border: '1px solid rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
        <Lock size={24} color="#0f172a" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Hesap Güvenliği</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: '#e2e8f0', padding: '0.5rem', borderRadius: '12px' }}>
              <Key size={20} color="#475569" />
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>Şifre Değiştir</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Son değiştirme: Yakın zamanda güncellendi</p>
            </div>
          </div>
          <button type="button" onClick={() => alert('Şifre değiştirme işlemi e-posta doğrulama ile yapılabilir.')} style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '700', color: '#0f172a', cursor: 'pointer' }}>
            Güncelle
          </button>
        </div>

      </div>
    </div>
  );
};

export default SecuritySettings;
