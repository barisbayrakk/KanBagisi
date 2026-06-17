import React from 'react';
import { PhoneCall } from 'lucide-react';

const EmergencyContactForm = ({ user, handleInputChange }) => {
  const inputStyle = { background: '#ffffff', border: '1px solid #e2e8f0', padding: '0.875rem 1rem', borderRadius: '12px', width: '100%', fontSize: '0.95rem' };
  const labelStyle = { fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '0.5rem' };

  return (
    <div className="card glass" style={{ background: '#ffffff', borderRadius: '10px', padding: '2rem', marginBottom: '1.5rem', border: '1px solid rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
        <PhoneCall size={24} color="#991b1b" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Acil Durum Kişisi</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div>
          <label style={labelStyle}>Yakınınızın Adı Soyadı</label>
          <input type="text" name="emergencyContactName" value={user.emergencyContactName || ''} onChange={handleInputChange} placeholder="Örn: Ali Yılmaz" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Yakınlık Derecesi</label>
          <input type="text" name="emergencyContactRelation" value={user.emergencyContactRelation || ''} onChange={handleInputChange} placeholder="Örn: Eşi, Babası" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Telefon Numarası</label>
          <input type="text" name="emergencyContactPhone" value={user.emergencyContactPhone || ''} onChange={handleInputChange} placeholder="05XX XXX XX XX" style={inputStyle} />
        </div>
      </div>
    </div>
  );
};

export default EmergencyContactForm;
