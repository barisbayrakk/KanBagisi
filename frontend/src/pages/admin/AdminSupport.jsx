import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle, 
  HelpCircle,
  User,
  Mail,
  Phone,
  AlertCircle,
  Filter,
  Check,
  FolderMinus
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AdminSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All'); // All, Open, Answered, Resolved, Closed
  const [searchTerm, setSearchTerm] = useState('');
  
  // Yanıt giriş durumu
  const [replyText, setReplyText] = useState('');
  
  const chatEndRef = useRef(null);

  // Tüm Biletleri Getir
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
      console.error("Error fetching tickets for admin:", err);
      toast.error("Tüm destek talepleri yüklenirken hata oluştu.");
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
      toast.success("Mesaj gönderildi ve kullanıcıya bildirim iletildi.");
      // Bilet verilerini yeniden yükle
      await fetchTickets(selectedTicket.id);
    } catch (err) {
      console.error(err);
      toast.error("Yanıt gönderilemedi.");
    } finally {
      setSending(false);
    }
  };

  // Durumu Güncelleme Eylemi
  const handleUpdateStatus = async (status) => {
    try {
      await axios.put(`/Support/tickets/${selectedTicket.id}/status`, {
        status
      });
      toast.success(`Talep durumu "${status}" olarak güncellendi.`);
      await fetchTickets(selectedTicket.id);
    } catch (err) {
      console.error(err);
      toast.error("Durum güncellenirken hata oluştu.");
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
        return { text: 'Açık / Yeni', bg: '#fff7ed', color: '#ea580c', border: '#ffedd5' };
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

  // Filtrelenmiş biletler
  const filteredTickets = tickets.filter(t => {
    const matchesStatus = filterStatus === 'All' || t.status === filterStatus;
    const matchesSearch = t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.id.toString() === searchTerm;
    return matchesStatus && matchesSearch;
  });

  // Yönetici yer tutucu paneli için toplu istatistikler
  const statsOpen = tickets.filter(t => t.status === 'Open').length;
  const statsAnswered = tickets.filter(t => t.status === 'Answered').length;
  const statsResolved = tickets.filter(t => t.status === 'Resolved').length;

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '4px solid #f1f5f9', borderTopColor: '#991b1b', animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>Destek yönetimi yükleniyor...</span>
        <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '350px 1fr', 
      gap: '1.5rem', 
      height: 'calc(100vh - 110px)', 
      animation: 'fadeInUp 0.5s ease-out' 
    }} className="support-grid">
      
      {/* SOL PANEL: TÜM BİLET LİSTESİ */}
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
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.5rem 0' }}>Destek Yönetimi</h2>
          <input 
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Konu, kullanıcı, e-posta ara..."
            style={{
              width: '100%',
              padding: '0.6rem 0.85rem',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              fontSize: '0.8rem',
              outline: 'none',
              marginBottom: '0.75rem',
              color: '#0f172a'
            }}
          />
          {/* Durum filtreleri */}
          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
            {['All', 'Open', 'Answered', 'Resolved', 'Closed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                style={{
                  padding: '0.3rem 0.65rem',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: filterStatus === status ? '#991b1b' : '#f1f5f9',
                  color: filterStatus === status ? 'white' : '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {status === 'All' ? 'Hepsi' : 
                 status === 'Open' ? 'Açık' : 
                 status === 'Answered' ? 'Yanıtlandı' : 
                 status === 'Resolved' ? 'Çözüldü' : 'Kapandı'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem' }} className="custom-scrollbar">
          {filteredTickets.length > 0 ? (
            filteredTickets.map((t) => {
              const isActive = selectedTicket?.id === t.id;
              const badge = getStatusBadge(t.status);
              return (
                <button 
                  key={t.id}
                  onClick={() => { setSelectedTicket(t); }}
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
                    gap: '0.4rem'
                  }}
                  className="ticket-list-item"
                >
                  <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '800' }}>#{t.id}</span>
                    <span style={{
                      fontSize: '0.6rem',
                      fontWeight: '800',
                      padding: '0.1rem 0.45rem',
                      borderRadius: '8px',
                      backgroundColor: badge.bg,
                      color: badge.color,
                      border: `1px solid ${badge.border}`
                    }}>{badge.text}</span>
                  </div>
                  <h3 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#334155', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                    {t.subject}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                    <span style={{ fontSize: '0.7rem', color: '#475569', fontWeight: '600' }}>{t.userName}</span>
                    <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{t.userEmail}</span>
                  </div>
                  <span style={{ fontSize: '0.6rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.2rem' }}>
                    <Clock size={9} /> Son Güncelleme: {formatDate(t.updatedAt)}
                  </span>
                </button>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
              <MessageSquare size={32} style={{ margin: '0 auto 0.75rem auto', opacity: 0.5 }} />
              <p style={{ fontSize: '0.75rem', fontWeight: '600', margin: 0 }}>Filtrelere uygun talep bulunamadı.</p>
            </div>
          )}
        </div>
      </div>

      {/* SAĞ PANEL: KONUŞMA VE EYLEMLER */}
      <div style={{ 
        backgroundColor: '#ffffff', 
        borderRadius: '10px', 
        border: '1px solid #e2e8f0', 
        padding: '1.5rem', 
        display: 'flex', 
        flexDirection: 'column',
        boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
        height: '100%',
        overflow: 'hidden'
      }}>
        {selectedTicket ? (
          /* KONUŞMA GÖRÜNÜMÜ */
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            {/* Başlık Ayrıntıları */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start', 
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
                <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: '0.2rem 0 0.5rem 0' }}>{selectedTicket.subject}</h2>
                {/* Kullanıcı bilgi çubuğu */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.75rem', color: '#64748b' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><User size={12} /> {selectedTicket.userName}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Mail size={12} /> {selectedTicket.userEmail}</span>
                </div>
              </div>

              {/* Durum Eylemleri */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {selectedTicket.status !== 'Resolved' && (
                  <button
                    onClick={() => handleUpdateStatus('Resolved')}
                    style={{
                      backgroundColor: '#ecfdf5',
                      color: '#10b981',
                      border: '1px solid #d1fae5',
                      padding: '0.45rem 0.75rem',
                      borderRadius: '10px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                    className="hover-scale"
                  >
                    <Check size={14} /> Çözüldü İşaretle
                  </button>
                )}
                {selectedTicket.status !== 'Closed' ? (
                  <button
                    onClick={() => handleUpdateStatus('Closed')}
                    style={{
                      backgroundColor: '#f1f5f9',
                      color: '#64748b',
                      border: '1px solid #e2e8f0',
                      padding: '0.45rem 0.75rem',
                      borderRadius: '10px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                    className="hover-scale"
                  >
                    <FolderMinus size={14} /> Talebi Kapat
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpdateStatus('Open')}
                    style={{
                      backgroundColor: '#fff7ed',
                      color: '#ea580c',
                      border: '1px solid #ffedd5',
                      padding: '0.45rem 0.75rem',
                      borderRadius: '10px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                    className="hover-scale"
                  >
                    Talebi Yeniden Aç
                  </button>
                )}
              </div>
            </div>

            {/* Konuşma Mesajları */}
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
                const isAdminReply = msg.senderRole === 'Admin' || msg.senderRole === 'Yönetici' || msg.senderRole === 'SubAdmin';
                return (
                  <div 
                    key={msg.id}
                    style={{ 
                      display: 'flex', 
                      justifyContent: isAdminReply ? 'flex-end' : 'flex-start',
                      alignItems: 'flex-start',
                      gap: '0.75rem' 
                    }}
                  >
                    {/* Soldaki Kullanıcı Avatarı */}
                    {!isAdminReply && (
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '10px', 
                        backgroundColor: '#fef2f2', 
                        color: '#991b1b', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '0.75rem', 
                        fontWeight: '800',
                        border: '1px solid #ffe4e6',
                        flexShrink: 0
                      }}>
                        {msg.senderName.substring(0,2).toUpperCase()}
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: isAdminReply ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                      <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: '600', marginBottom: '0.2rem' }}>
                        {isAdminReply ? `${msg.senderName} (Temsilci)` : msg.senderName} • {formatDate(msg.createdAt)}
                      </span>
                      <div style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        borderTopLeftRadius: !isAdminReply ? '4px' : '18px',
                        borderTopRightRadius: isAdminReply ? '4px' : '18px',
                        backgroundColor: isAdminReply ? '#1e293b' : '#f1f5f9',
                        color: isAdminReply ? '#ffffff' : '#334155',
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

            {/* Giriş alanı */}
            <form onSubmit={handleSendReply} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <input 
                type="text" 
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Kullanıcıya yanıt yazın (Yanıt gönderildiğinde e-posta bildirimi gidecektir)..."
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

          </div>
        ) : (
          /* YÖNETİCİ YER TUTUCU GÖRÜNÜMÜ */
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
              backgroundColor: '#eff6ff', 
              width: '64px', 
              height: '64px', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#2563eb',
              marginBottom: '1.5rem'
            }}>
              <HelpCircle size={32} />
            </div>
            
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Destek Yönetim Masası</h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '380px', margin: '0.5rem 0 2rem 0', lineHeight: 1.5 }}>
              Kullanıcılardan gelen destek taleplerini yanıtlayabilir, durumlarını yönetebilir ve sistemsel konularda rehberlik sağlayabilirsiniz.
            </p>

            {/* Hızlı istatistik tablosu */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', width: '100%', maxWidth: '400px' }}>
              <div style={{ backgroundColor: '#fff7ed', borderRadius: '8px', padding: '1rem', border: '1px solid #ffedd5' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ea580c', display: 'block' }}>{statsOpen}</span>
                <span style={{ fontSize: '0.7rem', color: '#c2410c', fontWeight: '700' }}>Yeni Talep</span>
              </div>
              <div style={{ backgroundColor: '#eff6ff', borderRadius: '8px', padding: '1rem', border: '1px solid #dbeafe' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#2563eb', display: 'block' }}>{statsAnswered}</span>
                <span style={{ fontSize: '0.7rem', color: '#1d4ed8', fontWeight: '700' }}>Yanıtlandı</span>
              </div>
              <div style={{ backgroundColor: '#ecfdf5', borderRadius: '8px', padding: '1rem', border: '1px solid #d1fae5' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#10b981', display: 'block' }}>{statsResolved}</span>
                <span style={{ fontSize: '0.7rem', color: '#065f46', fontWeight: '700' }}>Çözüldü</span>
              </div>
            </div>
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

export default AdminSupport;
