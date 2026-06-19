import React, { useState, useEffect } from 'react';
import { MapPin, Droplet, Clock, Calendar, ArrowRight } from 'lucide-react';

const KanRotasi = () => {
  const [completedDonations, setCompletedDonations] = useState([]);

  useEffect(() => {
    // 1. Onaylanmış Uygulamaları Getirin
    const apps = JSON.parse(localStorage.getItem('bloodApplications') || '[]');
    const approvedApps = apps.filter(a => a.isApproved === true).map(a => ({
      id: `app_${a.id}`,
      type: 'request_approval',
      donorName: a.applicantName,
      receiverName: a.requesterName || a.alertHospital,
      hospital: a.alertHospital,
      date: a.date,
      time: a.time,
      bloodType: a.alertBlood,
      protocol: a.protocolNumber || 'N/A'
    }));

    // 2. Doğrudan Bağış Alın
    const directDons = JSON.parse(localStorage.getItem('donationList') || '[]');
    const mappedDirectDons = directDons.map(d => ({
      id: `dir_${d.id}`,
      type: 'direct_donation',
      donorName: d.name,
      receiverName: 'Genel Stok',
      hospital: d.hastane,
      date: d.date,
      time: d.time,
      bloodType: d.bloodType,
      protocol: 'Doğrudan Bağış'
    }));

    // 3. Tarihe/Saate göre Birleştir ve Sırala (Önce en yeni)
    const combined = [...approvedApps, ...mappedDirectDons];
    
    // GG.AA.YYYY tarih biçimini ve SS:DD saatini varsayarak basit sıralama
    combined.sort((a, b) => {
      try {
        const [dayA, monthA, yearA] = a.date.split('.');
        const timeA = a.time || '00:00';
        const dateObjA = new Date(`${yearA}-${monthA}-${dayA}T${timeA}:00`);

        const [dayB, monthB, yearB] = b.date.split('.');
        const timeB = b.time || '00:00';
        const dateObjB = new Date(`${yearB}-${monthB}-${dayB}T${timeB}:00`);

        return dateObjB - dateObjA;
      } catch {
        return 0; // Fallback if parsing fails
      }
    });

    setCompletedDonations(combined);
  }, []);

  return (
    <div className="animate-in" style={{ paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>Kan Rotası</h1>
          <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>Sistemdeki tüm onaylanmış kan bağışlarının uçtan uca yolculuğunu takip edin.</p>
        </div>
      </div>

      <div className="card glass" style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 20px 50px rgba(0,0,0,0.04)', padding: '2rem' }}>
        
        {completedDonations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
            <Droplet size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.2 }} />
            <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>Henüz tamamlanan bir kan bağışı bulunmuyor.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {completedDonations.map((item, index) => (
              <div key={item.id || index} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '1.5rem', 
                border: '1px solid #e2e8f0', 
                borderRadius: '12px', 
                background: item.type === 'direct_donation' ? '#f8fafc' : '#ffffff', 
                transition: 'all 0.2s', 
                boxShadow: '0 4px 6px rgba(0,0,0,0.02)' 
              }}>
                
                {/* Sol Taraf: Donör -> Alıcı Akışı */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
                  
                  {/* Kan Grubu Rozeti */}
                  <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'rgba(225,29,72,0.1)', color: '#991b1b', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: '800', flexShrink: 0 }}>
                    <Droplet size={20} />
                    <span style={{ fontSize: '0.85rem' }}>{item.bloodType}</span>
                  </div>

                  {/* Akış Rotası */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                    <div style={{ flex: 1, textAlign: 'right' }}>
                      <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Kan Veren (Bağışçı)</p>
                      <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>{item.donorName}</p>
                    </div>
                    
                    <div style={{ color: '#cbd5e1', padding: '0 0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <ArrowRight size={24} color="#10b981" />
                      <span style={{ fontSize: '0.65rem', fontWeight: '700', color: '#10b981', marginTop: '0.2rem' }}>TRANSFER EDİLDİ</span>
                    </div>

                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Kanı Alan (Alıcı/Stok)</p>
                      <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: item.type === 'direct_donation' ? '#6366f1' : '#0f172a' }}>{item.receiverName}</p>
                    </div>
                  </div>
                </div>

                {/* Sağ Taraf: Hastane ve Tarih Bilgileri */}
                <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '1.5rem', marginLeft: '1.5rem', width: '280px', flexShrink: 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.9rem', fontWeight: '600' }}>
                      <MapPin size={16} color="#94a3b8" />
                      {item.hospital}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem' }}>
                      <Calendar size={14} /> {item.date}
                      <Clock size={14} style={{ marginLeft: '0.5rem' }} /> {item.time}
                    </div>
                    {item.protocol && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                        <strong>Protokol:</strong> {item.protocol}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default KanRotasi;
