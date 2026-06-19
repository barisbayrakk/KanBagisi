import React, { useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';
import LiveMap from './LiveMap';
import { Bell, ShieldAlert, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

const LiveTracking = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'critical', message: 'Bakırköy Dr. Sadi Konuk hastanesinde ACİL 0- kana ihtiyaç var!', time: new Date() },
    { id: 2, type: 'success', message: 'TRN-00003 numaralı transfer Üsküdar Hastanesine ulaştı.', time: new Date(Date.now() - 360000) },
    { id: 3, type: 'warning', message: 'hacker@example.com üzerinden başarısız deneme!', time: new Date(Date.now() - 720000) }
  ]);

  useEffect(() => {
    // SignalR Bağlantısı
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5090/notificationHub")
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => {
        console.log('Connected to Notification Hub!');
        toast.success("Canlı bildirim sistemine bağlanıldı.");
      })
      .catch(err => console.error('SignalR Connection Error: ', err));

    connection.on("ReceiveNotification", (message) => {
      const newNotification = {
        id: Date.now(),
        type: message.includes('ACİL') ? 'critical' : message.includes('başarısız') ? 'warning' : 'info',
        message: message,
        time: new Date()
      };
      setNotifications(prev => [newNotification, ...prev]);
      toast(message, { icon: newNotification.type === 'critical' ? '🔴' : '🔔' });
    });

    return () => {
      connection.stop();
    };
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'critical': return <ShieldAlert size={18} color="#991b1b" />;
      case 'warning': return <Clock size={18} color="#f59e0b" />;
      case 'success': return <CheckCircle size={18} color="#10b981" />;
      default: return <Bell size={18} color="#3b82f6" />;
    }
  };

  const getBg = (type) => {
    switch (type) {
      case 'critical': return '#fee2e2';
      case 'warning': return '#fef3c7';
      case 'success': return '#d1fae5';
      default: return '#dbeafe';
    }
  };

  return (
    <div className="animate-in" style={{ paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>Canlı Takip Merkezi</h1>
          <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>Harita üzerinden İstanbul kan yoğunluğunu ve canlı sistem bildirimlerini izleyin.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '2rem' }}>
        
        {/* Sol Taraf: Broşür Haritası */}
        <div>
          <LiveMap />
        </div>

        {/* Sağ Taraf: Bildirim Merkezi */}
        <div className="card glass" style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 20px 50px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', height: '600px' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <Bell size={20} style={{ color: '#3b82f6' }} />
              <span className="ping-dot" style={{ position: 'absolute', top: '-2px', right: '-2px', width: '12px', height: '12px', background: '#ef4444', borderRadius: '50%', border: '2px solid white' }}></span>
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Sistem Bildirimleri</h3>
              <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0.2rem 0 0 0' }}>Canlı (SignalR)</p>
            </div>
          </div>
          
          <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {notifications.map(n => (
              <div key={n.id} style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: getBg(n.type), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {getIcon(n.type)}
                </div>
                <div>
                  <p style={{ margin: '0 0 0.4rem 0', fontSize: '0.9rem', color: '#0f172a', fontWeight: '600', lineHeight: '1.4' }}>
                    {n.message}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '500' }}>
                    {n.time.toLocaleTimeString('tr-TR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ padding: '1rem', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
            <button onClick={() => setNotifications([])} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>Tümünü Temizle</button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default LiveTracking;
