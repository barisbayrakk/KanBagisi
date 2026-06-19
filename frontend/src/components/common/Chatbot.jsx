import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Bot } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Merhaba! Ben Hayat Ağı Asistanı. Kan bağışı ve platform kullanımı hakkında merak ettiğiniz konuyu aşağıdaki butonlardan seçerek öğrenebilirsiniz.',
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const chatEndRef = useRef(null);

  // Otomatik kaydırma
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasUnread(false);
    }
  };

  // Önceden Tanımlanmış Soru-Cevap Menüsü Seçenekleri
  const SUGGESTIONS = [
    { label: '🩸 Nasıl Bağış Yapılır?', query: 'nasil' },
    { label: '📋 Bağış Koşulları Neler?', query: 'kosul' },
    { label: '❌ Kimler Bağış Yapamaz?', query: 'kimler' },
    { label: '⏳ Geçici Bağış Engelleri?', query: 'gecici' },
    { label: '🚨 Kan Talebi Oluşturma?', query: 'talep' },
    { label: '🏥 Bağış Noktaları Nerede?', query: 'nerede' },
    { label: '💳 Bağış Ücretli midir?', query: 'ucret' },
    { label: 'ℹ️ Platform Nasıl Çalışır?', query: 'platform' },
    { label: '📞 İletişim & Destek?', query: 'iletisim' },
    { label: '🔄 Sohbeti Sıfırla', query: 'reset' }
  ];

  const getBotResponse = (query) => {
    switch (query) {
      case 'nasil':
        return 'Kan bağışı süreci çok güvenli ve basittir:\n\n1. Kayıt ve Form: Bağış noktasına gittiğinizde bilgilendirme formunu doldurursunuz.\n2. Ön Değerlendirme: Hemoglobin seviyeniz, tansiyonunuz ve ateşiniz ölçülür.\n3. Doktor Muayenesi: Doktorumuz bağışa uygunluğunuzu onaylar.\n4. Bağış: Kan alma işlemi konforlu bir koltukta yaklaşık 10-15 dakika sürer.\n5. İkram: İşlem sonrası 10-15 dakika dinlenirken size soda, bisküvi gibi ikramlar sunulur.';
      
      case 'kosul':
        return 'Temel kan bağışı uygunluk kriterleri şunlardır:\n\n- Yaş: 18 - 65 yaş aralığında olmak,\n- Kilo: En az 50 kg olmak,\n- Genel Sağlık: Kendini sağlıklı hissetmek ve son 24 saat içinde alkol almamış olmak,\n- Nabız & Tansiyon: Değerlerin hekim muayenesinde normal sınırlarda çıkması.';
      
      case 'kimler':
        return 'Kalıcı olarak kan bağışı yapamayacak durumlar şunlardır:\n\n- Hepatit B ve C geçmişi olanlar,\n- HIV pozitif bireyler,\n- İnsülin kullanan diyabet hastaları,\n- Ciddi kalp, böbrek veya koroner arter hastalığı olanlar,\n- Kanser tedavisi görmüş veya görmekte olanlar.';
      
      case 'gecici':
        return 'Belirli bir süre sonra ortadan kalkan geçici bağış engelleri:\n\n- Dövme, Piercing, Akupunktur: Son 1 yıl içinde yapılmışsa bağış yapılamaz.\n- Antibiyotik Kullanımı: Tedavinin bitiminden sonra en az 7 gün geçmelidir.\n- Diş Tedavisi: Dolgu ve temizlikten 1 gün, diş çekimi veya cerrahi işlemlerden 7 gün sonra bağış yapılabilir.\n- Aşılar: Aşının türüne göre 1 gün ile 4 hafta arası beklenmelidir.';
      
      case 'talep':
        return 'Acil kan ihtiyacınız olduğunda:\n\n1. Hesabınıza giriş yapın.\n2. Sol menüdeki "Taleplerim" veya "Ana Sayfa" üzerindeki "Acil Kan Talebi Oluştur" formunu doldurun.\n3. Kan grubu, ilçe, hastane ve aciliyet durumunu seçip onaylayın.\n4. Talebiniz sistemdeki uygun tüm bağışçılara ve çevre hastanelere anında bildirim olarak iletilir.';
      
      case 'nerede':
        return 'İstanbul genelinde anlaşmalı Kızılay Kan Merkezlerinde ve devlet hastanelerinde bağış yapabilirsiniz.\n\nBaşlıca noktalar:\n📍 Fatih Kızılay Kan Bağış Merkezi\n📍 Kadıköy Kızılay Şubesi\n📍 Üsküdar Kan Alım Noktası\n📍 Şişli Etfal Hastanesi Bağış İstasyonu\n📍 Bakırköy Kızılay Kan Merkezi';
      
      case 'ucret':
        return 'Hayat Ağı platformunda kan bağışları tamamen gönüllülük esasına dayanır. Kan bağışı veya acil transfer süreçlerinde kesinlikle hiçbir ücret talep edilmez. Kan ticareti yapmak yasal olarak suçtur ve kesinlikle yasaktır.';
      
      case 'platform':
        return 'Hayat Ağı; hastaneler, bağış merkezleri ve gönüllü bağışçılar arasında koordinasyon sağlayan dijital bir kan yönetim ekosistemidir.\n\nSistem, ilçelerdeki anlık stok durumunu analiz eder, kritik stok seviyelerinde otomatik alarmlar verir ve acil durumlarda bağışçıları akıllı eşleştirme ile yönlendirerek transfer sürelerini en aza indirir.';
      
      case 'iletisim':
        return 'Destek ekibimize ulaşmak için:\n\n- Sol menüdeki "Destek Talepleri" sayfasını açarak yeni bir destek talebi oluşturabilirsiniz.\n- Doğrudan support@hayatagi.org adresine e-posta gönderebilirsiniz.\n- Acil durum koordinasyonu için platform yöneticileriyle anlık mesajlaşma başlatabilirsiniz.';
      
      default:
        return 'Lütfen bilgi almak istediğiniz konuyu aşağıdaki buton menüsünden seçin.';
    }
  };

  const handleSendMessage = (query, labelText) => {
    if (isTyping) return;

    // Kullanıcı Mesajı Ekle (düğmeye tıklama sorgusu)
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: labelText,
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);

    // Sıfırlama işlemini hemen gerçekleştirin
    if (query === 'reset') {
      setIsTyping(true);
      setTimeout(() => {
        setMessages([
          {
            id: Date.now() + 1,
            sender: 'bot',
            text: 'Sohbet geçmişi sıfırlandı. Merak ettiğiniz diğer konular için aşağıdaki butonları kullanabilirsiniz.',
            time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setIsTyping(false);
      }, 500);
      return;
    }

    // Yazma animasyonuyla Bot Yanıtını Tetikleyin
    setIsTyping(true);
    setTimeout(() => {
      const responseText = getBotResponse(query);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: responseText,
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600 + Math.random() * 400); // realistic typing delay
  };

  return (
    <>
      {/* HAREKETLİ EYLEM DÜĞMESİ */}
      <button
        onClick={toggleChat}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#991b1b',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 8px 24px rgba(153, 27, 27, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isOpen ? 'rotate(90deg) scale(0.95)' : 'scale(1)',
          outline: 'none'
        }}
        title="Hayat Ağı Asistanı - Soru Sorun"
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={26} />
            {hasUnread && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '12px',
                height: '12px',
                backgroundColor: '#ef4444',
                border: '2px solid #ffffff',
                borderRadius: '50%',
                animation: 'pulse 2s infinite'
              }} />
            )}
          </div>
        )}
      </button>

      {/* SOHBET PENCERESİ */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '6.5rem',
            right: '2rem',
            width: '380px',
            height: '660px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 12px 40px rgba(15, 23, 42, 0.15)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 9999,
            overflow: 'hidden',
            fontFamily: "'Inter', sans-serif",
            animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards'
          }}
        >
          {/* Başlık */}
          <div
            style={{
              padding: '1.25rem',
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #1e293b'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f43f5e'
              }}>
                <Bot size={22} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  Hayat Ağı Asistanı
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.15rem' }}>
                  <span style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%' }} />
                  <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: '600' }}>Çevrimiçi</span>
                </div>
              </div>
            </div>
            <button
              onClick={toggleChat}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'none' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Mesajlar Alanı */}
          <div
            style={{
              flex: 1,
              padding: '1.25rem',
              overflowY: 'auto',
              backgroundColor: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
            className="chatbot-scrollbar"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-end',
                  gap: '0.5rem'
                }}
              >
                {msg.sender === 'bot' && (
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#475569',
                    fontSize: '0.7rem'
                  }}>
                    <Bot size={12} />
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '75%', gap: '0.15rem' }}>
                  <div
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: msg.sender === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                      backgroundColor: msg.sender === 'user' ? '#991b1b' : '#ffffff',
                      color: msg.sender === 'user' ? '#ffffff' : '#0f172a',
                      fontSize: '0.825rem',
                      lineHeight: '1.4',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                      border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                      whiteSpace: 'pre-line'
                    }}
                  >
                    {msg.text}
                  </div>
                  <span style={{
                    fontSize: '0.625rem',
                    color: '#94a3b8',
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    marginRight: '0.2rem',
                    marginLeft: '0.2rem'
                  }}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', gap: '0.5rem' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#475569'
                }}>
                  <Bot size={12} />
                </div>
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '12px 12px 12px 0',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    gap: '4px',
                    alignItems: 'center',
                    height: '32px'
                  }}
                >
                  <span className="dot-typing" style={{ width: '6px', height: '6px', backgroundColor: '#94a3b8', borderRadius: '50%', display: 'inline-block' }} />
                  <span className="dot-typing" style={{ width: '6px', height: '6px', backgroundColor: '#94a3b8', borderRadius: '50%', display: 'inline-block', animationDelay: '0.2s' }} />
                  <span className="dot-typing" style={{ width: '6px', height: '6px', backgroundColor: '#94a3b8', borderRadius: '50%', display: 'inline-block', animationDelay: '0.4s' }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* İnteraktif Yapılandırılmış Seçenekler Menüsü */}
          <div
            style={{
              padding: '1.25rem 1rem',
              backgroundColor: '#ffffff',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              flexShrink: 0
            }}
          >
            <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              Bilgi Almak İstediğiniz Konuyu Seçin:
            </div>
            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '0.5rem', 
                maxHeight: '155px', 
                overflowY: 'auto',
                paddingRight: '2px'
              }} 
              className="chatbot-menu-scrollbar"
            >
              {SUGGESTIONS.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(sug.query, sug.label)}
                  disabled={isTyping}
                  style={{
                    padding: '0.55rem 0.75rem',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '0.725rem',
                    fontWeight: '700',
                    color: '#1e293b',
                    textAlign: 'left',
                    cursor: isTyping ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                    outline: 'none',
                    opacity: isTyping ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => { 
                    if (!isTyping) {
                      e.currentTarget.style.borderColor = '#991b1b'; 
                      e.currentTarget.style.background = '#fef2f2'; 
                      e.currentTarget.style.color = '#991b1b';
                    }
                  }}
                  onMouseLeave={(e) => { 
                    if (!isTyping) {
                      e.currentTarget.style.borderColor = '#e2e8f0'; 
                      e.currentTarget.style.background = '#f8fafc'; 
                      e.currentTarget.style.color = '#1e293b';
                    }
                  }}
                >
                  {sug.label}
                </button>
              ))}
            </div>
          </div>

          {/* Satır İçi Stiller */}
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes pulse {
              0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
              70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
              100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
            }
            .chatbot-scrollbar::-webkit-scrollbar {
              width: 5px;
            }
            .chatbot-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .chatbot-scrollbar::-webkit-scrollbar-thumb {
              background: #cbd5e1;
              border-radius: 4px;
            }
            .chatbot-menu-scrollbar::-webkit-scrollbar {
              width: 4px;
            }
            .chatbot-menu-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .chatbot-menu-scrollbar::-webkit-scrollbar-thumb {
              background: #cbd5e1;
              border-radius: 4px;
            }
            .dot-typing {
              animation: blink 1.4s infinite both;
            }
            @keyframes blink {
              0% { opacity: .2; }
              20% { opacity: 1; }
              100% { opacity: .2; }
            }
          `}} />
        </div>
      )}
    </>
  );
};

export default Chatbot;
