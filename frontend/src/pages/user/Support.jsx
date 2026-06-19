import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Send, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ChevronRight, 
  HelpCircle,
  FileText,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  // Form durumları
  const [subject, setSubject] = useState('');
  const [messageText, setMessageText] = useState('');
  const [replyText, setReplyText] = useState('');
  
  const chatEndRef = useRef(null);

  // Bilet Al
  const fetchTickets = async (selectId = null) => {
    try {
      const res = await axios.get('/Support/tickets');
      setTickets(res.data);
      if (selectId) {
        const found = res.data.find(t => t.id === selectId);
        if (found) setSelectedTicket(found);
      } else if (selectedTicket) {
        const found = res.data.find(t => t.id === selectedTicket.id);
        if (found) setSelectedTicket(found);
      }
    } catch (err) {
      console.error("Error fetching tickets:", err);
      toast.error("Talepleriniz yüklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Sohbeti otomatik olarak aşağıya kaydır
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedTicket?.messages]);

  // Bilet Oluşturmayı Yönetin
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !messageText.trim()) {
      toast.error("Lütfen tüm alanları doldurun.");
      return;
    }

    setSending(true);
    try {
      const res = await axios.post('/Support/tickets', {
        subject,
        messageText
      });
      toast.success("Destek talebiniz oluşturuldu ve e-posta bildirimi gönderildi.");
      setSubject('');
      setMessageText('');
      setIsCreating(false);
      // Yeni bileti getir ve seç
      await fetchTickets(res.data.id);
    } catch (err) {
      console.error(err);
      toast.error("Talep oluşturulurken hata oluştu.");
    } finally {
      setSending(false);
    }
  };

  // Yanıt Gönderimini İşle
  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setSending(true);
    try {
      const res = await axios.post(`/Support/tickets/${selectedTicket.id}/messages`, {
        messageText: replyText
      });
      setReplyText('');
      // Bilet verilerini yeniden yükle
      await fetchTickets(selectedTicket.id);
    } catch (err) {
      console.error(err);
      toast.error("Mesaj gönderilemedi.");
    } finally {
      setSending(false);
    }
  };

  // Tarih yardımcısını biçimlendir
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
  };

  // Durum rozeti ayarlarını alın
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Open':
        return { text: 'Açık', bg: '#fff7ed', color: '#ea580c', border: '#ffedd5' };
      case 'Answered':
        return { text: 'Yanıtlandı', bg: '#eff6ff', color: '#2563eb', border: '#dbeafe' };
      case 'Resolved':
        return { text: 'Çözüldü', bg: '#ecfdf5', color: '#10b981', border: '#d1fae5' };
      case 'Closed':
        return { text: 'Kapandı', bg: '#f1f5f9', color: '#64748b', border: '#e2e8f0' };
      default:
        return { text: status, bg: '#f8fafc', color: '#0f172a', border: '#e2e8f0' };
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '4px solid #f1f5f9', borderTopColor: '#991b1b', animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>Destek paneli yükleniyor...</span>
        <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '320px 1fr', 
      gap: '1.5rem', 
      height: 'calc(100vh - 110px)', 
      animation: 'fadeInUp 0.5s ease-out' 
    }} className="support-grid">
      
      {/* SOL PANEL: BİLET LİSTESİ */}
      <div style={{ 
        backgroundColor: '#ffffff', 
        borderRadius: '10px', 
        border: '1px solid #e2e8f0', 
        padding: '1.25rem', 
        display: 'flex', 
        flexDirection: 'column',
        boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
        height: '100%',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Destek Taleplerim</h2>
          <button 
            onClick={() => { setIsCreating(true); setSelectedTicket(null); }}
            style={{ 
              backgroundColor: '#991b1b', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              padding: '0.4rem', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 3px 8px rgba(225,29,72,0.15)'
            }}
            className="hover-scale"
          >
            <Plus size={18} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem' }} className="custom-scrollbar">
          {tickets.length > 0 ? (
            tickets.map((t) => {
              const isActive = selectedTicket?.id === t.id;
              const badge = getStatusBadge(t.status);
              return (
                <button 
                  key={t.id}
                  onClick={() => { setSelectedTicket(t); setIsCreating(false); }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '0.85rem 1rem',
                    border: '1px solid',
                    borderColor: isActive ? 'rgba(225,29,72,0.2)' : '#f1f5f9',
                    borderRadius: '8px',
                    backgroundColor: isActive ? '#fef2f2' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'left',
                    width: '100%',
                    gap: '0.5rem'
                  }}
                  className="ticket-list-item"
                >
                  <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '700' }}>#{t.id}</span>
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: '800',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '8px',
                      backgroundColor: badge.bg,
                      color: badge.color,
                      border: `1px solid ${badge.border}`
                    }}>{badge.text}</span>
                  </div>
                  <h3 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#334155', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                    {t.subject}
                  </h3>
                  <span style={{ fontSize: '0.65rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={10} /> {formatDate(t.updatedAt)}
                  </span>
                </button>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
              <MessageSquare size={32} style={{ margin: '0 auto 0.75rem auto', opacity: 0.5 }} />
              <p style={{ fontSize: '0.75rem', fontWeight: '600', margin: 0 }}>Henüz bir talebiniz yok.</p>
              <p style={{ fontSize: '0.65rem', marginTop: '0.2rem' }}>Yeni bir tane oluşturmak için "+" butonuna basabilirsiniz.</p>
            </div>
          )}
        </div>
      </div>

      {/* SAĞ PANEL: İÇERİK (FORM VEYA SOHBET) */}
      <div style={{ 
        backgroundColor: isCreating ? '#0f172a' : '#ffffff', 
        borderRadius: '10px', 
        border: isCreating ? '1px solid #1e293b' : '1px solid #e2e8f0', 
        padding: '1.5rem', 
        display: 'flex', 
        flexDirection: 'column',
        boxShadow: isCreating ? '0 10px 30px rgba(15,23,42,0.2)' : '0 4px 12px rgba(0,0,0,0.01)',
        height: '100%',
        overflow: 'hidden'
      }}>
        {isCreating ? (
          /* BİLET FORMU OLUŞTURUN */
          <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>Yeni Destek Talebi</h2>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0.25rem 0 0 0' }}>Yaşadığınız sorunu detaylıca iletin, ekibimiz size hızlıca dönüş yapsın.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Talep Konusu</label>
              <input 
                type="text" 
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Örn: Bağış iptali hakkında, Şifre sıfırlama sorunu..."
                style={{ 
                  padding: '0.75rem 1rem', 
                  borderRadius: '12px', 
                  border: '1px solid #334155', 
                  fontSize: '0.85rem', 
                  outline: 'none',
                  color: '#ffffff',
                  background: '#1e293b'
                }}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Açıklama / Mesajınız</label>
              <textarea 
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                placeholder="Lütfen sorununuzu, eğer varsa ilgili hastane, talep veya hata bilgilerini detaylıca yazın..."
                style={{ 
                  padding: '0.75rem 1rem', 
                  borderRadius: '12px', 
                  border: '1px solid #334155', 
                  fontSize: '0.85rem', 
                  outline: 'none',
                  color: '#ffffff',
                  background: '#1e293b',
                  fontFamily: 'inherit',
                  resize: 'none',
                  height: '100%',
                  minHeight: '150px'
                }}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
              <button 
                type="button" 
                onClick={() => setIsCreating(false)}
                style={{ 
                  flex: 1, 
                  backgroundColor: '#1e293b', 
                  color: '#cbd5e1', 
                  border: '1px solid #334155', 
                  padding: '0.75rem', 
                  borderRadius: '12px', 
                  fontWeight: '700', 
                  fontSize: '0.85rem', 
                  cursor: 'pointer' 
                }}
              >
                İptal Et
              </button>
              <button 
                type="submit" 
                disabled={sending}
                style={{ 
                  flex: 2, 
                  backgroundColor: '#991b1b', 
                  color: 'white', 
                  border: 'none', 
                  padding: '0.75rem', 
                  borderRadius: '12px', 
                  fontWeight: '800', 
                  fontSize: '0.85rem', 
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(225,29,72,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {sending ? 'Gönderiliyor...' : 'Talep Oluştur'}
              </button>
            </div>
          </form>
        ) : selectedTicket ? (
          /* SOHBET KONUŞMA GÖRÜNÜMÜ */
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            {/* Sohbet Başlığı */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              borderBottom: '1px solid #f1f5f9', 
              paddingBottom: '1rem', 
              marginBottom: '1rem' 
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '800' }}>TALEP #{selectedTicket.id}</span>
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: '800',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '8px',
                    backgroundColor: getStatusBadge(selectedTicket.status).bg,
                    color: getStatusBadge(selectedTicket.status).color,
                    border: `1px solid ${getStatusBadge(selectedTicket.status).border}`
                  }}>{getStatusBadge(selectedTicket.status).text}</span>
                </div>
                <h2 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: '0.2rem 0 0 0' }}>{selectedTicket.subject}</h2>
              </div>
            </div>

            {/* Mesaj Geçmişi Kabarcık Alanı */}
            <div style={{ 
              flex: 1, 
              overflowY: 'auto', 
              paddingRight: '0.5rem', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1rem',
              marginBottom: '1.25rem' 
            }} className="custom-scrollbar">
              
              {selectedTicket.messages?.map((msg) => {
                const isAdmin = msg.senderRole === 'Admin' || msg.senderRole === 'Yönetici' || msg.senderRole === 'SubAdmin';
                return (
                  <div 
                    key={msg.id}
                    style={{ 
                      display: 'flex', 
                      justifyContent: isAdmin ? 'flex-start' : 'flex-end',
                      alignItems: 'flex-start',
                      gap: '0.75rem' 
                    }}
                  >
                    {/* Soldaki Yönetici Avatarı */}
                    {isAdmin && (
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '10px', 
                        backgroundColor: '#eff6ff', 
                        color: '#2563eb', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '0.75rem', 
                        fontWeight: '800',
                        border: '1px solid #dbeafe',
                        flexShrink: 0
                      }}>
                        AD
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: isAdmin ? 'flex-start' : 'flex-end', maxWidth: '70%' }}>
                      <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: '600', marginBottom: '0.2rem' }}>
                        {isAdmin ? 'Hayat Ağı Destek Ekibi' : 'Siz'} • {formatDate(msg.createdAt)}
                      </span>
                      <div style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        borderTopLeftRadius: isAdmin ? '4px' : '18px',
                        borderTopRightRadius: !isAdmin ? '4px' : '18px',
                        backgroundColor: isAdmin ? '#f1f5f9' : '#991b1b',
                        color: isAdmin ? '#334155' : '#ffffff',
                        fontSize: '0.85rem',
                        lineHeight: 1.4,
                        whiteSpace: 'pre-wrap',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.01)'
                      }}>
                        {msg.messageText}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Sohbet Giriş Alanı */}
            {selectedTicket.status === 'Closed' ? (
              <div style={{ 
                backgroundColor: '#f1f5f9', 
                borderRadius: '12px', 
                padding: '0.85rem 1rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                border: '1px solid #e2e8f0' 
              }}>
                <AlertCircle size={18} style={{ color: '#64748b' }} />
                <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: '600' }}>Bu destek talebi kapatılmıştır. Yeni bir konu için yeni talep oluşturabilirsiniz.</span>
              </div>
            ) : (
              <form onSubmit={handleSendReply} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <input 
                  type="text" 
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Mesajınızı buraya yazın..."
                  style={{ 
                    flex: 1, 
                    padding: '0.75rem 1rem', 
                    borderRadius: '12px', 
                    border: '1px solid #e2e8f0', 
                    fontSize: '0.85rem', 
                    outline: 'none',
                    color: '#0f172a',
                    backgroundColor: '#f8fafc'
                  }}
                  disabled={sending}
                  required
                />
                <button 
                  type="submit" 
                  disabled={sending}
                  style={{ 
                    backgroundColor: '#991b1b', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '12px', 
                    width: '40px', 
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(225,29,72,0.2)',
                    flexShrink: 0
                  }}
                  className="hover-scale"
                >
                  <Send size={18} />
                </button>
              </form>
            )}

          </div>
        ) : (
          /* GİRİŞ MERKEZ GÖRÜNÜMÜ */
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%', 
            textAlign: 'center',
            padding: '2rem'
          }}>
            <div style={{ 
              backgroundColor: '#fef2f2', 
              width: '64px', 
              height: '64px', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#991b1b',
              marginBottom: '1.5rem'
            }}>
              <HelpCircle size={32} />
            </div>
            
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Hayat Ağı Yardım & Destek</h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '380px', margin: '0.5rem 0 1.5rem 0', lineHeight: 1.5 }}>
              Sistem kullanımı, kan bağışı kriterleri, onay süreçleri veya hesap işlemleriniz hakkında yardıma mı ihtiyacınız var? Bir talep oluşturun, size e-posta yoluyla ve panelimizden dönüş yapalım.
            </p>

            <button 
              onClick={() => setIsCreating(true)}
              style={{
                backgroundColor: '#991b1b',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '0.75rem 1.5rem',
                fontWeight: '800',
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(225,29,72,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              className="hover-scale"
            >
              <Plus size={16} /> Yeni Destek Talebi Aç
            </button>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .ticket-list-item:hover {
          background-color: #fafafa !important;
          border-color: rgba(225,29,72,0.1) !important;
        }
      ` }} />

    </div>
  );
};

export default Support;
