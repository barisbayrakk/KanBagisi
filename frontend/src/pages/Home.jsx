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
      height: 'calc(100vh - 80px)', 
      overflow: 'hidden', 
      display: 'flex', 
      flexDirection: 'column', 
      padding: '0.5rem 2rem 1.5rem 2rem', 
      gap: '1.5rem',
      backgroundColor: '#f8fafc',
      fontFamily: "'Inter', sans-serif"
    }}>
      
      {/* ROW 1: HERO SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2.5rem', flex: '0 0 45%', minHeight: 0 }}>
        
        {/* Left Column: Text & Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: '1rem' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 3.5vw, 4rem)', fontWeight: '900', lineHeight: '1.1', color: '#000000', margin: '0 0 1rem 0', letterSpacing: '-0.03em' }}>
            Hayat Kurtarmak <br />
            <span style={{ background: 'linear-gradient(90deg, #991b1b, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Sizin Elinizde
            </span>
          </h1>
          <p style={{ color: '#64748b', fontSize: 'clamp(0.9rem, 1vw, 1.1rem)', lineHeight: '1.6', margin: '0 0 1.5rem 0' }}>
            Acil kan ihtiyaçlarını anlık takip edin, size en yakın bağış noktasına ulaşarak binlerce kişiye umut olun.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/register" style={{ background: '#991b1b', color: 'white', padding: '0.8rem 1.2rem', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 8px 20px rgba(225,29,72,0.25)', fontSize: '0.9rem', whiteSpace: 'nowrap' }} className="hover-scale">
              <Droplet size={18} fill="white" /> Kan Bağışı Yap <ArrowRight size={18} />
            </Link>
            <Link to="/blood-requests" style={{ background: 'white', color: '#991b1b', padding: '0.8rem 1.2rem', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #ffe4e6', boxShadow: '0 4px 10px rgba(225,29,72,0.05)', fontSize: '0.9rem', whiteSpace: 'nowrap' }} className="hover-scale">
              <Activity size={18} /> Kan Talebi Oluştur <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Right Column: Abstract Illustration */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(248,250,252,0) 70%)' }}>
          {/* Abstract IV Bag / Heart Concept */}
          <div style={{ position: 'relative', width: '220px', height: '220px', zIndex: 10 }}>
            {/* The "Bag" */}
            <div style={{ position: 'absolute', width: '140px', height: '180px', background: 'linear-gradient(135deg, #fb7185, #991b1b)', borderRadius: '12px', top: '10px', left: '40px', boxShadow: '0 20px 40px rgba(225,29,72,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '15px' }}>
              <div style={{ width: '40px', height: '8px', background: 'rgba(255,255,255,0.5)', borderRadius: '4px' }}></div>
              <Heart size={64} fill="white" color="white" style={{ marginTop: '30px' }} className="pulse-animation" />
            </div>
            {/* The "Tube" */}
            <svg style={{ position: 'absolute', top: '180px', left: '100px', width: '200px', height: '100px', overflow: 'visible', zIndex: -1 }}>
              <path d="M 10 10 C 10 80, 100 0, 150 80" fill="none" stroke="#991b1b" strokeWidth="8" strokeLinecap="round" />
            </svg>
            {/* The "Arm/Receiver" abstract */}
            <div style={{ position: 'absolute', top: '230px', left: '220px', width: '120px', height: '40px', background: '#ffedd5', borderRadius: '8px', transform: 'rotate(-10deg)', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
               <div style={{ position: 'absolute', top: '10px', left: '20px', width: '30px', height: '20px', background: 'white', borderRadius: '4px' }}></div>
            </div>
          </div>
          
          {/* Floating elements */}
          <div style={{ position: 'absolute', top: '20%', right: '15%', background: 'white', padding: '10px 15px', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: '10px', animation: 'float 4s ease-in-out infinite' }}>
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#991b1b', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={12} color="white" fill="white" />
            </div>
            <div>
              <p style={{ fontSize: '0.7rem', color: '#991b1b', fontWeight: '700', margin: 0 }}>Acil İhtiyaç</p>
              <p style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: '900', margin: 0 }}>O Rh(-)</p>
              <p style={{ fontSize: '0.65rem', color: '#64748b', margin: 0 }}>Kan Grubu</p>
            </div>
          </div>
        </div>

      </div>

      {/* ROW 2: CARDS SECTION */}
      <div style={{ background: 'white', borderRadius: '10px', padding: '2rem 3rem', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9', flex: 1, minHeight: 0 }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: '0 0 1.5rem 0', textAlign: 'center' }}>Nasıl Yardımcı Olabilirsiniz?</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', flex: 1, alignItems: 'center' }}>
          {helpSteps.map((step, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0.5rem 1rem' }}>
              <div style={{ background: step.bg, width: '56px', height: '56px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                {React.cloneElement(step.icon, { size: 24 })}
              </div>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>{step.title}</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ROW 3: FOOTER FEATURES */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', borderRadius: '8px', padding: '1rem 2rem', flex: '0 0 auto', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
         {features.map((feat, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: feat.bg, width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {feat.icon}
              </div>
              <div>
                <h5 style={{ margin: '0 0 0.2rem 0', fontSize: '0.85rem', fontWeight: '800', color: '#0f172a' }}>{feat.title}</h5>
                <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b' }}>{feat.desc}</p>
              </div>
            </div>
          ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        /* Enforce exact fitting to viewport */
        body { overflow: hidden; }
        
        .pulse-animation { animation: pulseHeart 2s infinite; }
        @keyframes pulseHeart {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .hover-scale:hover { transform: scale(1.02); }
        
        /* Custom scrollbar for lists if they ever overflow */
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 4px;
        }
      `}} />
    </div>
  );
};

export default Home;
