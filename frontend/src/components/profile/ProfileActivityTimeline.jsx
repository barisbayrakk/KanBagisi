import React from 'react';
import { History } from 'lucide-react';

const ProfileActivityTimeline = ({ activities }) => {
  if (!activities || activities.length === 0) return null;

  return (
    <div className="card glass" style={{ background: '#ffffff', borderRadius: '10px', padding: '2rem', marginBottom: '1.5rem', border: '1px solid rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
        <History size={24} color="#64748b" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Aktivite Geçmişi</h3>
      </div>

      <div style={{ position: 'relative', paddingLeft: '1rem', borderLeft: '2px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {activities.map((activity, index) => (
          <div key={activity.id || index} style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '-1.35rem', top: '0.25rem', width: '12px', height: '12px', borderRadius: '50%', background: '#cbd5e1', border: '2px solid #ffffff' }}></div>
            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700', color: '#334155' }}>{activity.description}</p>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
              {new Date(activity.createdAt).toLocaleString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileActivityTimeline;
