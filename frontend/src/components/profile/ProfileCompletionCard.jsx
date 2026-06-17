import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

const ProfileCompletionCard = ({ completionRate }) => {
  const isComplete = completionRate === 100;
  
  return (
    <div className="card glass" style={{ background: '#ffffff', borderRadius: '10px', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Profil Tamamlama</h3>
        <span style={{ fontSize: '1.5rem', fontWeight: '800', color: isComplete ? '#10b981' : '#991b1b' }}>
          %{completionRate}
        </span>
      </div>
      
      <div style={{ width: '100%', background: '#f1f5f9', borderRadius: '99px', height: '12px', overflow: 'hidden', marginBottom: '1rem' }}>
        <div style={{ 
          height: '100%', 
          background: isComplete ? '#10b981' : 'linear-gradient(90deg, #f43f5e, #991b1b)', 
          width: `${completionRate}%`,
          transition: 'width 0.5s ease'
        }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: isComplete ? '#10b981' : '#64748b' }}>
          {isComplete ? <CheckCircle size={16} /> : <AlertCircle size={16} color="#991b1b" />}
          {isComplete ? 'Profiliniz eksiksiz olarak tamamlandı.' : 'Bazı temel bilgileriniz eksik. Tamamlayarak bağış uygunluğunuzu artırın.'}
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionCard;
