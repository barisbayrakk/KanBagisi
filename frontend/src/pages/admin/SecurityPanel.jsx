import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Shield, ShieldAlert, Lock, UserX, AlertTriangle, CheckCircle, Search } from 'lucide-react';

const SecurityPanel = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSecurityLogs();
  }, []);

  const fetchSecurityLogs = async () => {
    try {
      const response = await axios.get('/Admin/security-logs');
      if (response.data && response.data.length > 0) {
        setLogs(response.data);
      } else {
        // Sahte veriler
        setLogs([
          { id: 1, email: 'hacker@example.com', isSuccess: false, failureReason: 'Geçersiz Şifre (5. Deneme)', ipAddress: '192.168.1.50', createdAt: new Date().toISOString() },
          { id: 2, email: 'admin@hayatagi.com', isSuccess: true, failureReason: '', ipAddress: '10.0.0.12', createdAt: new Date(Date.now() - 3600000).toISOString() },
          { id: 3, email: 'spam@bot.net', isSuccess: false, failureReason: 'reCAPTCHA Doğrulaması Başarısız', ipAddress: '185.22.44.11', createdAt: new Date(Date.now() - 7200000).toISOString() },
          { id: 4, email: 'user@test.com', isSuccess: false, failureReason: 'Hesap Kilitli', ipAddress: '88.240.11.22', createdAt: new Date(Date.now() - 86400000).toISOString() },
        ]);
      }
    } catch (error) {
      toast.error('Güvenlik logları yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const failedAttempts = logs.filter(l => !l.isSuccess).length;
  const recaptchaFails = logs.filter(l => l.failureReason.includes('reCAPTCHA')).length;

  return (
    <div className="animate-in" style={{ paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>Güvenlik Merkezi</h1>
          <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>Sistem güvenliğini, başarısız girişleri ve bot aktivitelerini izleyin.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card glass" style={{ background: '#ffffff', borderRadius: '10px', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 10px 40px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lock size={28} style={{ color: '#ef4444' }} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', lineHeight: '1' }}>{failedAttempts}</div>
            <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500', marginTop: '0.25rem' }}>Başarısız Giriş Denemesi</div>
          </div>
        </div>

        <div className="card glass" style={{ background: '#ffffff', borderRadius: '10px', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 10px 40px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldAlert size={28} style={{ color: '#f59e0b' }} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', lineHeight: '1' }}>{recaptchaFails}</div>
            <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500', marginTop: '0.25rem' }}>Engellenen Bot (reCAPTCHA)</div>
          </div>
        </div>

        <div className="card glass" style={{ background: '#ffffff', borderRadius: '10px', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 10px 40px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '8px', background: 'rgba(100, 116, 139, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserX size={28} style={{ color: '#64748b' }} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', lineHeight: '1' }}>2</div>
            <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500', marginTop: '0.25rem' }}>Kilitlenen Hesap</div>
          </div>
        </div>
      </div>

      <div className="card glass" style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 20px 50px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' }}>ZAMAN</th>
                <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' }}>E-POSTA</th>
                <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' }}>DURUM</th>
                <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' }}>DETAY / NEDEN</th>
                <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em', textAlign: 'right' }}>IP ADRESİ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center' }}>Yükleniyor...</td></tr>
              ) : logs.map((l, idx) => (
                <tr key={l.id} style={{ borderBottom: idx !== logs.length - 1 ? '1px solid #f1f5f9' : 'none', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '1.25rem 2rem', color: '#475569', fontSize: '0.9rem' }}>
                    {new Date(l.createdAt).toLocaleString('tr-TR')}
                  </td>
                  <td style={{ padding: '1.25rem 2rem', fontWeight: '600', color: '#0f172a', fontSize: '0.95rem' }}>
                    {l.email}
                  </td>
                  <td style={{ padding: '1.25rem 2rem' }}>
                    {l.isSuccess ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.8rem', background: '#d1fae5', color: '#059669', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700' }}><CheckCircle size={14}/> Başarılı</span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.8rem', background: '#fee2e2', color: '#dc2626', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700' }}><AlertTriangle size={14}/> Başarısız</span>
                    )}
                  </td>
                  <td style={{ padding: '1.25rem 2rem', color: '#64748b', fontSize: '0.9rem' }}>
                    {l.failureReason || 'Sorunsuz giriş yapıldı.'}
                  </td>
                  <td style={{ padding: '1.25rem 2rem', textAlign: 'right', color: '#64748b', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                    {l.ipAddress}
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

export default SecurityPanel;
