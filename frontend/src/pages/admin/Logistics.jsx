import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Truck, MapPin, PackageOpen, CheckCircle, Clock, AlertTriangle, User } from 'lucide-react';

const Logistics = () => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogistics();
  }, []);

  const fetchLogistics = async () => {
    try {
      const response = await axios.get('/Admin/logistics');
      if (response.data && response.data.length > 0) {
        setTransfers(response.data);
      } else {
        // Sahte veriler
        setTransfers([
          { id: 1, senderHospital: 'Genel Stok (Kızılay)', receiverHospital: 'Şişli Etfal Hastanesi', bloodType: 'A+', amount: 5, courierName: 'Ahmet Yılmaz', status: 'InTransit', estimatedDelivery: new Date(Date.now() + 3600000).toISOString(), createdAt: new Date(Date.now() - 3600000).toISOString() },
          { id: 2, senderHospital: 'Genel Stok (Kızılay)', receiverHospital: 'Çam ve Sakura Şehir Hastanesi', bloodType: 'B-', amount: 2, courierName: 'Atanmadı', status: 'Pending', estimatedDelivery: null, createdAt: new Date(Date.now() - 1800000).toISOString() },
          { id: 3, senderHospital: 'Genel Stok (Kızılay)', receiverHospital: 'Üsküdar Devlet Hastanesi', bloodType: '0+', amount: 8, courierName: 'Mehmet Demir', status: 'Delivered', estimatedDelivery: new Date(Date.now() - 3600000).toISOString(), createdAt: new Date(Date.now() - 7200000).toISOString() }
        ]);
      }
    } catch (error) {
      toast.error('Lojistik verileri yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return <span style={{ padding: '0.4rem 1rem', background: '#fef3c7', color: '#d97706', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={14}/> Kurye Bekleniyor</span>;
      case 'InTransit': return <span style={{ padding: '0.4rem 1rem', background: '#dbeafe', color: '#2563eb', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Truck size={14}/> Yolda</span>;
      case 'Delivered': return <span style={{ padding: '0.4rem 1rem', background: '#d1fae5', color: '#059669', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckCircle size={14}/> Teslim Edildi</span>;
      default: return <span style={{ padding: '0.4rem 1rem', background: '#fee2e2', color: '#dc2626', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><AlertTriangle size={14}/> İptal</span>;
    }
  };

  return (
    <div className="animate-in" style={{ paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>Lojistik Yönetimi</h1>
          <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>Kan transferlerini, kurye atamalarını ve teslimat durumlarını takip edin.</p>
        </div>
      </div>

      <div className="card glass" style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 20px 50px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' }}>TRANSFER KODU</th>
                <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' }}>GÖNDEREN &rarr; HEDEF</th>
                <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' }}>KAN BİLGİSİ</th>
                <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' }}>KURYE</th>
                <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' }}>DURUM</th>
                <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em', textAlign: 'right' }}>TAHMİNİ TESLİMAT</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center' }}>Yükleniyor...</td></tr>
              ) : transfers.map((t, idx) => (
                <tr key={t.id} style={{ borderBottom: idx !== transfers.length - 1 ? '1px solid #f1f5f9' : 'none', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '1.25rem 2rem', fontWeight: '700', color: '#0f172a', fontSize: '0.9rem', fontFamily: 'monospace' }}>
                    TRN-{t.id.toString().padStart(5, '0')}
                  </td>
                  <td style={{ padding: '1.25rem 2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', color: '#0f172a' }}>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{t.senderHospital}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '600' }}>
                        <MapPin size={14} color="#94a3b8" /> {t.receiverHospital}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ background: '#fef2f2', color: '#dc2626', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: '800', fontSize: '0.8rem' }}>
                        {t.bloodType || '-'}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: '600' }}>
                        {t.amount || 0} Ünite
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: t.courierName === 'Atanmadı' ? '#94a3b8' : '#475569', fontStyle: t.courierName === 'Atanmadı' ? 'italic' : 'normal' }}>
                      <User size={16} color={t.courierName === 'Atanmadı' ? '#cbd5e1' : '#64748b'} /> {t.courierName}
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 2rem' }}>
                    {getStatusBadge(t.status)}
                  </td>
                  <td style={{ padding: '1.25rem 2rem', textAlign: 'right', color: '#475569', fontSize: '0.9rem' }}>
                    {t.estimatedDelivery ? new Date(t.estimatedDelivery).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Logistics;
