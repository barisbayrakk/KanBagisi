import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Activity, MapPin, Droplet, Users, Shield, Zap, Send, Bell, ArrowRight } from 'lucide-react';

const Home = () => {
  const helpSteps = [
    { title: 'Kan Bağışı Yapın', desc: 'Size en yakın merkeze giderek kan bağışı yapın.', icon: <Droplet size={18} color="#991b1b" />, bg: '#fef2f2' },
    { title: 'Talebi Paylaşın', desc: 'Acil kan taleplerini sevdiklerinizle paylaşın.', icon: <Send size={18} color="#3b82f6" />, bg: '#eff6ff' },
    { title: 'Bir Hayat Kurtarın', desc: 'Küçük bir adım, büyük bir fark yaratır.', icon: <Heart size={18} color="#10b981" />, bg: '#ecfdf5' },
  ];

  const features = [
    { title: 'Güvenli Platform', desc: 'Kişisel bilgileriniz güvende', icon: <Shield size={22} color="#991b1b" />, bg: '#fef2f2' },
    { title: 'Anlık Bildirim', desc: 'Taleplerden anında haberdar olun', icon: <Zap size={22} color="#f59e0b" />, bg: '#fef3c7' },
    { title: 'En Yakın Noktalar', desc: 'Size en yakın bağış noktalarını bulun', icon: <MapPin size={22} color="#8b5cf6" />, bg: '#f5f3ff' },
    { title: 'Topluluk Desteği', desc: 'Birlikte daha güçlüyüz', icon: <Users size={22} color="#3b82f6" />, bg: '#eff6ff' },
  ];

  return (
    <div className="home-container" style={{ 
      height: 'calc(100vh - 72px)', 
      overflow: 'hidden', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center',
      padding: '1.5rem 2rem', 
      gap: '1.25rem',
      backgroundColor: '#f8fafc',
      fontFamily: "'Inter', sans-serif"
    }}>
      
      {/* SATIR 1: KAHRAMAN BÖLÜMÜ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', flex: '0 0 210px', minHeight: 0, overflow: 'hidden' }}>
        
        {/* Sol Sütun: Metin ve Düğmeler */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: '0.5rem' }}>
          <h1 style={{ fontSize: 'clamp(1.9rem, 2.6vw, 2.7rem)', fontWeight: '900', lineHeight: '1.15', color: '#000000', margin: '0 0 0.4rem 0', letterSpacing: '-0.03em' }}>
            Hayat Kurtarmak <br />
            <span style={{ background: 'linear-gradient(90deg, #991b1b, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Sizin Elinizde
            </span>
          </h1>
          <p style={{ color: '#64748b', fontSize: 'clamp(0.8rem, 0.9vw, 0.95rem)', lineHeight: '1.45', margin: '0 0 0.75rem 0' }}>
            Acil kan ihtiyaçlarını anlık takip edin, size en yakın bağış noktasına ulaşarak binlerce kişiye umut olun.
          </p>
          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <Link to="/login" style={{ background: '#991b1b', color: 'white', padding: '0.55rem 1.1rem', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 12px rgba(225,29,72,0.18)', fontSize: '0.85rem', whiteSpace: 'nowrap' }} className="hover-scale">
              <Droplet size={15} fill="white" /> Kan Bağışı Yap veya Talep Oluştur <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Sağ Sütun: Soyut İllüstrasyon */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(248,250,252,0) 70%)', overflow: 'hidden' }}>
          {/* Soyut IV Çantası / Kalp Konsepti */}
          <div style={{ position: 'relative', width: '180px', height: '180px', zIndex: 10 }}>
            {/* "Çanta" */}
            <div style={{ position: 'absolute', width: '110px', height: '140px', background: 'linear-gradient(135deg, #fb7185, #991b1b)', borderRadius: '12px', top: '10px', left: '35px', boxShadow: '0 12px 25px rgba(225,29,72,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '10px' }}>
              <div style={{ width: '30px', height: '5px', background: 'rgba(255,255,255,0.5)', borderRadius: '2px' }}></div>
              <Heart size={48} fill="white" color="white" style={{ marginTop: '15px' }} className="pulse-animation" />
            </div>
            {/* "Tüp" */}
            <svg style={{ position: 'absolute', top: '140px', left: '80px', width: '160px', height: '80px', overflow: 'visible', zIndex: -1 }}>
              <path d="M 10 10 C 10 70, 90 0, 140 70" fill="none" stroke="#991b1b" strokeWidth="5" strokeLinecap="round" />
            </svg>
            {/* "Kol/Alıcı" özeti */}
            <div style={{ position: 'absolute', top: '180px', left: '170px', width: '90px', height: '30px', background: '#ffedd5', borderRadius: '8px', transform: 'rotate(-10deg)', boxShadow: '0 6px 12px rgba(0,0,0,0.05)' }}>
               <div style={{ position: 'absolute', top: '6px', left: '12px', width: '22px', height: '15px', background: 'white', borderRadius: '4px' }}></div>
            </div>
          </div>
          
          {/* Yüzen elemanlar */}
          <div style={{ position: 'absolute', top: '15%', right: '5%', background: 'white', padding: '6px 10px', borderRadius: '8px', boxShadow: '0 6px 15px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '8px', animation: 'float 4s ease-in-out infinite' }}>
            <div style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#991b1b', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={9} color="white" fill="white" />
            </div>
            <div>
              <p style={{ fontSize: '0.6rem', color: '#991b1b', fontWeight: '700', margin: 0 }}>Acil İhtiyaç</p>
              <p style={{ fontSize: '1rem', color: '#0f172a', fontWeight: '900', margin: 0 }}>O Rh(-)</p>
              <p style={{ fontSize: '0.55rem', color: '#64748b', margin: 0 }}>Kan Grubu</p>
            </div>
          </div>
        </div>

      </div>

      {/* SATIR 2: KARTLAR BÖLÜMÜ */}
      <div style={{ background: 'white', borderRadius: '10px', padding: '0.75rem 1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9', flex: '0 0 110px', boxSizing: 'border-box', minHeight: 0, overflow: 'hidden' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.35rem 0', textAlign: 'center' }}>Nasıl Yardımcı Olabilirsiniz?</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', alignItems: 'center' }}>
          {helpSteps.map((step, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 0.25rem' }}>
              <div style={{ background: step.bg, width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.25rem', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                {React.cloneElement(step.icon, { size: 16 })}
              </div>
              <h4 style={{ margin: '0 0 0.1rem 0', fontSize: '0.8rem', fontWeight: '800', color: '#0f172a' }}>{step.title}</h4>
              <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b', lineHeight: '1.2' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SATIR 3: ALT BİLGİ ÖZELLİKLERİ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', borderRadius: '10px', padding: '0.75rem 1.5rem', flex: '0 0 110px', boxSizing: 'border-box', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
         {features.map((feat, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: feat.bg, width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {React.cloneElement(feat.icon, { size: 18 })}
              </div>
              <div>
                <h5 style={{ margin: '0 0 0.15rem 0', fontSize: '0.8rem', fontWeight: '800', color: '#0f172a' }}>{feat.title}</h5>
                <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b' }}>{feat.desc}</p>
              </div>
            </div>
          ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        /* Görünüm alanına tam olarak sığdırmayı zorunlu kılın */
        body { overflow: hidden; }
        
        .pulse-animation { animation: pulseHeart 2s infinite; }
        @keyframes pulseHeart {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .hover-scale:hover { transform: scale(1.02); }
      `}} />
    </div>
  );
};

export default Home;
