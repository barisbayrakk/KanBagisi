import React from 'react';
import { Activity, CheckCircle, XCircle } from 'lucide-react';

const DonationEligibilityForm = ({ user, handleCheckboxChange }) => {
  const isEligible = !user.hasChronicDisease && !user.usesMedication && !user.recentAlcoholUse && !user.recentSurgery;

  return (
    <div className="card glass" style={{ background: '#ffffff', borderRadius: '10px', padding: '2rem', marginBottom: '1.5rem', border: '1px solid rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Activity size={24} color="#991b1b" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Bağış Uygunluğu</h3>
        </div>
        
        {isEligible ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#ecfdf5', color: '#10b981', padding: '0.5rem 1rem', borderRadius: '99px', fontSize: '0.85rem', fontWeight: '700' }}>
            <CheckCircle size={16} /> Kan Bağışı Yapabilir
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#fef2f2', color: '#991b1b', padding: '0.5rem 1rem', borderRadius: '99px', fontSize: '0.85rem', fontWeight: '700' }}>
            <XCircle size={16} /> Doktor Onayı Gerekli
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.95rem', color: '#334155' }}>
          <input type="checkbox" name="hasChronicDisease" checked={user.hasChronicDisease || false} onChange={handleCheckboxChange} style={{ width: '18px', height: '18px', accentColor: '#991b1b' }} />
          Kronik bir rahatsızlığım var (Şeker, Kalp, Tansiyon vb.)
        </label>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.95rem', color: '#334155' }}>
          <input type="checkbox" name="usesMedication" checked={user.usesMedication || false} onChange={handleCheckboxChange} style={{ width: '18px', height: '18px', accentColor: '#991b1b' }} />
          Düzenli olarak kullandığım bir ilaç var
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.95rem', color: '#334155' }}>
          <input type="checkbox" name="recentAlcoholUse" checked={user.recentAlcoholUse || false} onChange={handleCheckboxChange} style={{ width: '18px', height: '18px', accentColor: '#991b1b' }} />
          Son 24 saat içerisinde alkol tükettim
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.95rem', color: '#334155' }}>
          <input type="checkbox" name="recentSurgery" checked={user.recentSurgery || false} onChange={handleCheckboxChange} style={{ width: '18px', height: '18px', accentColor: '#991b1b' }} />
          Son 1 ay içerisinde ameliyat oldum veya tıbbi müdahale geçirdim
        </label>
      </div>
    </div>
  );
};

export default DonationEligibilityForm;
