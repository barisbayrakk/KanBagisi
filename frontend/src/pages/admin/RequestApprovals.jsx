import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FileCheck, FileX, AlertOctagon, Search, Droplet, MapPin, Activity, CheckCircle, XCircle, Key } from 'lucide-react';

const RequestApprovals = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Pending');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const apps = JSON.parse(localStorage.getItem('bloodApplications') || '[]');
      if (apps.length > 0) {
        const mappedApps = apps.map(a => ({
          ...a,
          id: a.id,
          hospitalName: a.alertHospital,
          bloodTypeName: a.alertBlood,
          status: a.status === 'Rejected' ? 'Rejected' : (a.isApproved ? 'Approved' : 'Pending')
        }));
        setApprovals(mappedApps);
      } else {
        setApprovals([]);
      }
    } catch (error) {
      toast.error('Onay verileri yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = (id, newStatus) => {
    const apps = JSON.parse(localStorage.getItem('bloodApplications') || '[]');
    const appIndex = apps.findIndex(a => a.id === id);
    if (appIndex !== -1) {
      apps[appIndex].isApproved = newStatus === 'Approved';
      apps[appIndex].status = newStatus;
      localStorage.setItem('bloodApplications', JSON.stringify(apps));
      fetchApprovals();
      toast.success(`Talep durumu güncellendi.`);
    }
  };

  const filteredApprovals = approvals.filter(a => a.status === activeTab && (
    a.hospitalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.bloodTypeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.applicantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.protocolNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  return (
    <div className="animate-in" style={{ paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>Talep Onay Merkezi</h1>
          <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>Hastanelerden gelen kan taleplerini yönetin ve kan bağışlarını doğrulayın.</p>
        </div>
      </div>

      {/* Kan Bağışı Doğrulama Paneli */}
      <div className="card glass" style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', padding: '2rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Key size={20} color="#10b981" /> Kan Bağışı Doğrulama
          </h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Bağışçının hastaneye geldiğinde ilettiği Protokol Numarası ve Doğrulama Kodu ile bağışı sistemde onaylayın.</p>
        </div>
        <form onSubmit={async (e) => {
          e.preventDefault();
          const protocol = e.target.protocol.value.trim().toUpperCase();
          const code = e.target.code.value.trim().toUpperCase();
          if (!protocol || !code) {
            toast.error('Lütfen Protokol Numarası ve Doğrulama Kodu girin.');
            return;
          }
          try {
            // Ön uç demosu için öncelikle yerel depolamayı kontrol edin
            const apps = JSON.parse(localStorage.getItem('bloodApplications') || '[]');
            const appIndex = apps.findIndex(a => 
              a.protocolNumber?.toUpperCase() === protocol && 
              a.verificationCode?.toUpperCase() === code
            );
            
            if (appIndex !== -1) {
              if (apps[appIndex].isApproved) {
                toast.error('Bu bağış zaten onaylanmış.');
                return;
              }
              apps[appIndex].isApproved = true;
              apps[appIndex].status = 'Approved';
              localStorage.setItem('bloodApplications', JSON.stringify(apps));

              // DEMO'DA OYUNLAŞTIRMA VE BİLDİRİMLERİ GÜNCELLEME
              const applicantTc = apps[appIndex].applicantTc;

              // Başvuru sahibi ise etkin kullanıcı oturumunu güncelle
              const activeUserStr = localStorage.getItem('user');
              if (activeUserStr) {
                try {
                  const activeUser = JSON.parse(activeUserStr);
                  if (activeUser && activeUser.tc === applicantTc) {
                    activeUser.lastDonationDate = new Date().toISOString();
                    activeUser.donationCount = (activeUser.donationCount || 0) + 1;
                    localStorage.setItem('user', JSON.stringify(activeUser));
                  }
                } catch (e) {
                  console.error(e);
                }
              }

              // Kullanıcı listesindeki başvuru sahibini güncelleyin
              const usersListStr = localStorage.getItem('usersList');
              if (usersListStr) {
                try {
                  const usersList = JSON.parse(usersListStr);
                  const updatedUsersList = usersList.map(u => {
                    if (u.tc === applicantTc) {
                      return {
                        ...u,
                        lastDonationDate: new Date().toISOString(),
                        donationCount: (u.donationCount || 0) + 1
                      };
                    }
                    return u;
                  });
                  localStorage.setItem('usersList', JSON.stringify(updatedUsersList));
                } catch (e) {
                  console.error(e);
                }
              }

              const localUser = JSON.parse(localStorage.getItem('kanyonetim_user') || 'null');
              if (localUser && localUser.tc === applicantTc) {
                localUser.lastDonationDate = new Date().toISOString();
                localUser.donationCount = (localUser.donationCount || 0) + 1;
                localStorage.setItem('kanyonetim_user', JSON.stringify(localUser));
              }

              // Rozet/pdf için sistem bildirimi ekleyin
              const notifications = JSON.parse(localStorage.getItem('user_notifications') || '[]');
              notifications.push({
                id: Date.now(),
                receiverTc: applicantTc,
                message: `Tebrikler! ${apps[appIndex].alertHospital} hastanesine yaptığınız kan bağışı başarıyla onaylandı. Yeni bir rozet kazanmış olabilirsiniz! Teşekkür belgenizi Bağış Geçmişi bölümünden indirebilirsiniz.`,
                createdAt: new Date().toISOString(),
                isRead: false,
                type: 'achievement'
              });
              localStorage.setItem('user_notifications', JSON.stringify(notifications));

              // Her ihtimale karşı arka ucu deneyin
              try { await axios.post('/DonationApplication/verify', { protocolNumber: protocol, verificationCode: code }); } catch(e) {}

              toast.success('Kan bağışı başarıyla doğrulandı!');
              e.target.reset();
              fetchApprovals();
            } else {
              // Her ihtimale karşı arka ucu deneyin
              await axios.post('/DonationApplication/verify', { protocolNumber: protocol, verificationCode: code });
              toast.success('Kan bağışı başarıyla doğrulandı!');
              e.target.reset();
              fetchApprovals();
            }
          } catch (error) {
            toast.error(error.response?.data?.Message || error.response?.data || 'Doğrulama başarısız. Lütfen bilgileri kontrol edin.');
          }
        }} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '250px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Protokol Numarası</label>
            <input name="protocol" type="text" placeholder="Örn: PRT-12345" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '1rem', fontWeight: '600', color: '#0f172a', textTransform: 'uppercase' }} />
          </div>
          <div style={{ flex: '1', minWidth: '250px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Doğrulama Kodu</label>
            <input name="code" type="text" placeholder="Örn: DONOR-1234" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '1rem', fontWeight: '600', color: '#0f172a', textTransform: 'uppercase' }} />
          </div>
          <button type="submit" style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.85rem 2rem', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s', height: '46px' }} onMouseOver={e => e.currentTarget.style.background = '#059669'} onMouseOut={e => e.currentTarget.style.background = '#10b981'}>
            <CheckCircle size={18} /> Kan Teslim Alındı / Onayla
          </button>
        </form>
      </div>

      <div className="card glass" style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 20px 50px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        
        {/* Sekmeler */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          {[
            { id: 'Pending', label: 'Bekleyen Başvurular', icon: Activity, color: '#f59e0b' },
            { id: 'Approved', label: 'Onaylananlar', icon: FileCheck, color: '#10b981' },
            { id: 'Rejected', label: 'Reddedilenler', icon: FileX, color: '#ef4444' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, padding: '1.25rem', border: 'none', background: activeTab === tab.id ? '#ffffff' : 'transparent',
                borderBottom: activeTab === tab.id ? `3px solid ${tab.color}` : '3px solid transparent',
                color: activeTab === tab.id ? tab.color : '#64748b', fontWeight: activeTab === tab.id ? '800' : '600',
                fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <tab.icon size={18} /> {tab.label}
              <span style={{ background: activeTab === tab.id ? `${tab.color}20` : '#e2e8f0', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem' }}>
                {approvals.filter(a => a.status === tab.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Filtreler */}
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ position: 'relative', width: '350px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Bağışçı, protokol veya hastane ara..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.9rem', color: '#0f172a', background: '#ffffff' }} 
            />
          </div>
        </div>

        {/* Liste */}
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Yükleniyor...</div>
          ) : filteredApprovals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
              <CheckCircle size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.2 }} />
              <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>Bu kategoride başvuru bulunmuyor.</p>
            </div>
          ) : filteredApprovals.map(a => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#ffffff', transition: 'all 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }} onMouseOver={e => e.currentTarget.style.borderColor = '#cbd5e1'} onMouseOut={e => e.currentTarget.style.borderColor = '#e2e8f0'}>
              
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: 'rgba(225,29,72,0.1)', color: '#991b1b', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                  <Droplet size={20} />
                  <span style={{ fontSize: '0.85rem' }}>{a.bloodTypeName}</span>
                </div>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={16} color="#94a3b8"/> {a.hospitalName}
                  </h3>
                  <div style={{ display: 'flex', gap: '1rem', color: '#64748b', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                    <span><strong>Bağışçı:</strong> {a.applicantName}</span>
                    <span><strong>Protokol:</strong> {a.protocolNumber}</span>
                    <span><strong>Doğrulama Kodu:</strong> {activeTab === 'Pending' ? '*** (Bağışçıdan İstenecek)' : a.verificationCode}</span>
                    <span><strong>Tarih:</strong> {a.date} {a.time}</span>
                  </div>
                </div>
              </div>

              {activeTab === 'Pending' && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {/* Onayla seçeneği güvenlik gereksinimi kaldırıldı. Sadece devam eden formdan kod girilerek onaylanabilir. */}
                  <button onClick={() => handleStatusUpdate(a.id, 'Rejected')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '12px', border: '1px solid #ef4444', background: '#ffffff', color: '#ef4444', fontWeight: '700', cursor: 'pointer', transition: 'transform 0.1s' }} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}>
                    <XCircle size={18} /> İptal / Reddet
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RequestApprovals;
