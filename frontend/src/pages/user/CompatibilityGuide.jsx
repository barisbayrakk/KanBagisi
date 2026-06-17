import React, { useState } from 'react';
import { Heart, Info, Check, HelpCircle } from 'lucide-react';

const COMPATIBILITY_DATA = {
  'A+': {
    give: ['A+', 'AB+'],
    receive: ['A+', 'A-', '0+', '0-'],
    note: 'A+ kan grubu, Türkiye\'de en yaygın bulunan kan gruplarından biridir. A+ ve AB+ hastaları için hayat kurtarabilir.'
  },
  'A-': {
    give: ['A+', 'A-', 'AB+', 'AB-'],
    receive: ['A-', '0-'],
    note: 'A- kan grubu, negatif kan ihtiyacı duyan A ve AB grubu hastalar için kritik önem taşır.'
  },
  'B+': {
    give: ['B+', 'AB+'],
    receive: ['B+', 'B-', '0+', '0-'],
    note: 'B+ kan grubu, B ve AB pozitif grubu hastalarla tam uyumludur.'
  },
  'B-': {
    give: ['B+', 'B-', 'AB+', 'AB-'],
    receive: ['B-', '0-'],
    note: 'B- kan grubu, nadir bulunan negatif kan gruplarından biridir.'
  },
  'AB+': {
    give: ['AB+'],
    receive: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', '0+', '0-'],
    note: 'AB+ grubu "Genel Alıcı" olarak bilinir. İhtiyaç durumunda tüm kan gruplarından kan alabilir, ancak sadece kendi grubuna kan verebilir.'
  },
  'AB-': {
    give: ['AB+', 'AB-'],
    receive: ['AB-', 'A-', 'B-', '0-'],
    note: 'AB- kan grubu, nüfusun en az kısmında bulunan en nadir kan grubudur.'
  },
  '0+': {
    give: ['0+', 'A+', 'B+', 'AB+'],
    receive: ['0+', '0-'],
    note: '0+ kan grubu, en sık ihtiyaç duyulan ve acil durumlarda diğer tüm pozitif gruplara verilebilen çok değerli bir gruptur.'
  },
  '0-': {
    give: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', '0+', '0-'],
    receive: ['0-'],
    note: '0- grubu "Genel Verici" olarak adlandırılır. Acil durumlarda kan grubu bilinmeyen tüm hastalara güvenle verilebildiği için acil servislerin can damarıdır.'
  }
};

const BLOOD_TYPES_ORDER = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', '0+', '0-'];

const CompatibilityGuide = () => {
  const [selectedGroup, setSelectedGroup] = useState('0-');

  const selectedData = COMPATIBILITY_DATA[selectedGroup];

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* Üst Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%)',
        borderRadius: '12px',
        padding: '2.5rem',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '30%', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.18)', borderRadius: '14px', padding: '0.75rem' }}>
              <Heart size={26} fill="white" />
            </div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: '900', margin: 0, letterSpacing: '-0.02em' }}>Kan Uyum Rehberi</h1>
          </div>
          <p style={{ margin: 0, opacity: 0.85, fontSize: '0.95rem', maxWidth: '750px', lineHeight: '1.6' }}>
            Hangi kan grubunun kimlerle uyumlu olduğunu interaktif rehberimizden öğrenebilirsiniz. Kan bağışı ve acil transfer süreçlerinde doğru eşleştirme hayati önem taşır.
          </p>
        </div>
      </div>

      {/* İnteraktif Bölüm */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Sol Kart: Kan Grubu Seçici */}
        <div className="card glass" style={{ background: '#ffffff', borderRadius: '10px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Info size={18} style={{ color: '#991b1b' }} />
            Kan Grubu Seçiniz
          </h3>
          <p style={{ fontSize: '0.825rem', color: '#64748b', margin: 0 }}>
            Uyum detaylarını ve detaylı açıklamayı görmek için bir kan grubuna tıklayın:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginTop: '0.5rem' }}>
            {BLOOD_TYPES_ORDER.map(bg => {
              const isSelected = selectedGroup === bg;
              return (
                <button
                  key={bg}
                  onClick={() => setSelectedGroup(bg)}
                  style={{
                    height: '56px',
                    borderRadius: '10px',
                    border: isSelected ? '2px solid #991b1b' : '1px solid #e2e8f0',
                    background: isSelected ? '#fef2f2' : '#ffffff',
                    color: isSelected ? '#991b1b' : '#334155',
                    fontWeight: '900',
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: isSelected ? '0 4px 12px rgba(153,27,27,0.12)' : 'none'
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#cbd5e1';
                      e.currentTarget.style.background = '#f8fafc';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.background = '#ffffff';
                    }
                  }}
                >
                  {bg}
                </button>
              );
            })}
          </div>
          
          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            borderRadius: '10px', 
            backgroundColor: '#f8fafc', 
            borderLeft: '4px solid #991b1b',
            fontSize: '0.85rem',
            color: '#475569',
            lineHeight: '1.5'
          }}>
            <strong>{selectedGroup} Grubu Hakkında:</strong>
            <br />
            {selectedData.note}
          </div>
        </div>

        {/* Sağ Kart: Alıcı/Verici Sonuçları */}
        <div className="card glass" style={{ background: '#ffffff', borderRadius: '10px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
            {selectedGroup} Kan Grubu Uyumluluğu
          </h3>
          
          {/* Kimlere Kan Verebilir */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#b91c1c', fontWeight: '800', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
              <span style={{ fontSize: '1.1rem' }}>🩸</span> Kimlere Kan Verebilir? (Alıcılar)
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {BLOOD_TYPES_ORDER.map(bg => {
                const canGive = selectedData.give.includes(bg);
                return (
                  <div
                    key={bg}
                    style={{
                      padding: '0.6rem 1.1rem',
                      borderRadius: '8px',
                      fontWeight: '800',
                      fontSize: '0.88rem',
                      border: '1px solid',
                      borderColor: canGive ? '#fca5a5' : '#e2e8f0',
                      background: canGive ? '#fef2f2' : '#ffffff',
                      color: canGive ? '#991b1b' : '#cbd5e1',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    {canGive && <Check size={14} style={{ color: '#991b1b' }} />}
                    {bg}
                  </div>
                );
              })}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '0.25rem 0' }} />

          {/* Kimlerden Kan Alabilir */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0369a1', fontWeight: '800', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
              <span style={{ fontSize: '1.1rem' }}>💖</span> Kimlerden Kan Alabilir? (Vericiler)
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {BLOOD_TYPES_ORDER.map(bg => {
                const canReceive = selectedData.receive.includes(bg);
                return (
                  <div
                    key={bg}
                    style={{
                      padding: '0.6rem 1.1rem',
                      borderRadius: '8px',
                      fontWeight: '800',
                      fontSize: '0.88rem',
                      border: '1px solid',
                      borderColor: canReceive ? '#bae6fd' : '#e2e8f0',
                      background: canReceive ? '#f0f9ff' : '#ffffff',
                      color: canReceive ? '#0369a1' : '#cbd5e1',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    {canReceive && <Check size={14} style={{ color: '#0369a1' }} />}
                    {bg}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CompatibilityGuide;
