import React from 'react';
import { User } from 'lucide-react';

const KAN_GRUPLARI = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', '0+', '0-'];
const ISTANBUL_ILCELER = [
  'Adalar', 'Arnavutköy', 'Ataşehir', 'Avcılar', 'Bağcılar', 'Bahçelievler', 'Bakırköy', 'Başakşehir',
  'Bayrampaşa', 'Beşiktaş', 'Beykoz', 'Beylikdüzü', 'Beyoğlu', 'Büyükçekmece', 'Çatalca', 'Çekmeköy',
  'Esenler', 'Esenyurt', 'Eyüpsultan', 'Fatih', 'Gaziosmanpaşa', 'Güngören', 'Kadıköy', 'Kağıthane',
  'Kartal', 'Küçükçekmece', 'Maltepe', 'Pendik', 'Sancaktepe', 'Sarıyer', 'Silivri', 'Sultanbeyli',
  'Sultangazi', 'Şile', 'Şişli', 'Tuzla', 'Ümraniye', 'Üsküdar', 'Zeytinburnu'
];

const PersonalInfoForm = ({ user, handleInputChange }) => {
  const inputStyle = { background: '#ffffff', border: '1px solid #e2e8f0', padding: '0.875rem 1rem', borderRadius: '12px', width: '100%', fontSize: '0.95rem' };
  const labelStyle = { fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '0.5rem' };

  return (
    <div className="card glass" style={{ background: '#ffffff', borderRadius: '10px', padding: '2rem', marginBottom: '1.5rem', border: '1px solid rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
        <User size={24} color="#991b1b" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Kişisel Bilgiler</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div>
          <label style={labelStyle}>Ad Soyad <span style={{color: '#991b1b'}}>*</span></label>
          <input type="text" name="fullName" value={user.fullName || ''} onChange={handleInputChange} required style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>T.C. Kimlik Numarası <span style={{color: '#991b1b'}}>*</span></label>
          <input type="text" name="tc" value={user.tc || ''} onChange={handleInputChange} maxLength="11" required style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Telefon Numarası <span style={{color: '#991b1b'}}>*</span></label>
          <input type="text" name="phone" value={user.phone || ''} onChange={handleInputChange} placeholder="05XX XXX XX XX" required style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Cinsiyet</label>
          <select name="gender" value={user.gender || ''} onChange={handleInputChange} style={inputStyle}>
            <option value="">Seçiniz</option>
            <option value="Erkek">Erkek</option>
            <option value="Kadın">Kadın</option>
            <option value="Belirtmek İstemiyorum">Belirtmek İstemiyorum</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Kan Grubu <span style={{color: '#991b1b'}}>*</span></label>
          <select 
            name="bloodTypeId" 
            value={user.bloodTypeId || ''} 
            onChange={handleInputChange} 
            required 
            style={{ ...inputStyle, cursor: user.role === 'Admin' ? 'pointer' : 'not-allowed', backgroundColor: user.role === 'Admin' ? '#ffffff' : '#f1f5f9' }}
            disabled={user.role !== 'Admin'}
          >
            <option value="">Seçiniz</option>
            {/* Önceki mantığa dayalı olarak kan grupları için sahte kimliklerin kullanılması (1-8) */}
            {KAN_GRUPLARI.map((kg, index) => <option key={kg} value={index + 1}>{kg}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>İlçe <span style={{color: '#991b1b'}}>*</span></label>
          <select name="districtId" value={user.districtId || ''} onChange={handleInputChange} required style={inputStyle}>
            <option value="">Seçiniz</option>
            {/* Bölgeler için sahte kimliklerin kullanılması (1-39) */}
            {ISTANBUL_ILCELER.map((ilce, index) => <option key={ilce} value={index + 1}>{ilce}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Doğum Tarihi</label>
          <input type="date" name="dateOfBirth" value={user.dateOfBirth ? user.dateOfBirth.split('T')[0] : ''} onChange={handleInputChange} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Kilo (kg)</label>
          <input type="number" name="weight" value={user.weight || ''} onChange={handleInputChange} placeholder="Örn: 75" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Görev / Unvan</label>
          <input type="text" name="title" value={user.title || ''} onChange={handleInputChange} placeholder="Örn: Öğretmen, Mühendis" style={inputStyle} />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
