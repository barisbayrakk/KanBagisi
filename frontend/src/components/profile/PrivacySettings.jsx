import React from 'react';
import { Shield, Bell } from 'lucide-react';

const PrivacySettings = ({ user, handleCheckboxChange, handleInputChange }) => {
  return (
    <div className="card glass" style={{ background: '#ffffff', borderRadius: '10px', padding: '2rem', marginBottom: '1.5rem', border: '1px solid rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
        
        {/* Gizlilik Ayarları */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
            <Shield size={24} color="#6366f1" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Gizlilik Ayarları</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '0.5rem' }}>Profil Görünürlüğü</label>
              <select name="profileVisibility" value={user.profileVisibility || 'Public'} onChange={handleInputChange} style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '0.75rem 1rem', borderRadius: '12px', width: '100%', fontSize: '0.95rem' }}>
                <option value="Public">Herkese Açık</option>
                <option value="HospitalOnly">Sadece Hastane Yetkilileri</option>
                <option value="Private">Gizli</option>
              </select>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.95rem', color: '#334155', marginTop: '0.5rem' }}>
              <input type="checkbox" name="allowPhoneShare" checked={user.allowPhoneShare !== false} onChange={handleCheckboxChange} style={{ width: '18px', height: '18px', accentColor: '#6366f1' }} />
              Uygun talepler için telefon numaramı hastanelerle paylaş
            </label>
          </div>
        </div>

        {/* Bildirim Tercihleri */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
            <Bell size={24} color="#eab308" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Bildirim Tercihleri</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.95rem', color: '#334155' }}>
              <input type="checkbox" name="emailNotifications" checked={user.emailNotifications !== false} onChange={handleCheckboxChange} style={{ width: '18px', height: '18px', accentColor: '#eab308' }} />
              E-posta ile bilgilendirilmek istiyorum
            </label>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.95rem', color: '#334155' }}>
              <input type="checkbox" name="smsNotifications" checked={user.smsNotifications !== false} onChange={handleCheckboxChange} style={{ width: '18px', height: '18px', accentColor: '#eab308' }} />
              SMS ile bilgilendirilmek istiyorum
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.95rem', color: '#334155' }}>
              <input type="checkbox" name="locationBasedNotifications" checked={user.locationBasedNotifications !== false} onChange={handleCheckboxChange} style={{ width: '18px', height: '18px', accentColor: '#eab308' }} />
              Konumuma göre yakınımdaki acil talepleri bildir
            </label>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrivacySettings;
