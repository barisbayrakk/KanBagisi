import React from 'react';
import { Mail, MapPin, Droplet, User as UserIcon } from 'lucide-react';

const ProfileSummaryCard = ({ user }) => {
  if (!user) return null;

  return (
    <div className="card glass" style={{ background: '#ffffff', borderRadius: '10px', padding: '2rem', textAlign: 'center', border: '1px solid rgba(0,0,0,0.04)' }}>
      <div style={{ width: '80px', height: '80px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: '4px solid #ffe4e6' }}>
        <span style={{ fontSize: '2rem', fontWeight: '800', color: '#991b1b' }}>
          {user.fullName ? user.fullName.charAt(0).toUpperCase() : <UserIcon size={32} />}
        </span>
      </div>
      
      <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.25rem' }}>
        {user.fullName || 'İsimsiz Kullanıcı'}
      </h2>
      <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 1.5rem', fontWeight: '600' }}>
        {user.role === 'Admin' ? 'Yönetici' : user.role === 'Hospital' ? 'Hastane Yetkilisi' : 'Bağışçı'}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '12px' }}>
          <Droplet size={18} color="#991b1b" />
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', fontWeight: '700' }}>Kan Grubu</span>
            <span style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: '800' }}>{user.bloodType || 'Belirtilmedi'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '12px' }}>
          <MapPin size={18} color="#6366f1" />
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', fontWeight: '700' }}>Konum</span>
            <span style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: '800' }}>{user.district || 'Belirtilmedi'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '12px' }}>
          <Mail size={18} color={user.isEmailVerified ? "#10b981" : "#f59e0b"} />
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', fontWeight: '700' }}>E-posta Durumu</span>
            <span style={{ fontSize: '0.9rem', color: user.isEmailVerified ? '#10b981' : '#f59e0b', fontWeight: '800' }}>
              {user.isEmailVerified ? 'Doğrulandı' : 'Doğrulanmadı'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSummaryCard;
