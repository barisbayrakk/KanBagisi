import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Heart, 
  Activity, 
  MapPin, 
  User, 
  LogOut, 
  Bell, 
  Mail, 
  Search, 
  ChevronDown, 
  History, 
  ChevronRight, 
  PhoneCall, 
  AlertTriangle,
  X,
  Menu,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const UserLayout = ({ children, user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [activeRequestsCount, setActiveRequestsCount] = useState(0);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [myApplications, setMyApplications] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [myRequestsBadgeCount, setMyRequestsBadgeCount] = useState(0);
  const [supportBadgeCount, setSupportBadgeCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const checkNotifications = () => {
      try {
        const msgs = JSON.parse(localStorage.getItem('bloodMessages') || '[]');
        const apps = JSON.parse(localStorage.getItem('bloodApplications') || '[]');

        // 1. Okunması gereken basvurular (Bu kullanıcının actigi talepler ve isReadByRequester false olanlar)
        const unreadAppsCount = apps.filter(ap => ap.requesterTc === user.tc && ap.isReadByRequester === false).length;

        // 2. Okunmamış mesajlar (Kullanicinin sohbetler dahil olduğu)
        const myChatIds = [
          ...apps.filter(a => a.applicantTc === user.tc).map(a => `${a.alertId}_${a.applicantTc}`),
          ...apps.filter(a => a.requesterTc === user.tc).map(a => `${a.alertId}_${a.applicantTc}`)
        ];

        const unreadMsgsCount = msgs.filter(m =>
          myChatIds.includes(m.chatId) &&
          m.senderTc !== user.tc &&
          !(m.readBy || []).includes(user.tc)
        ).length;

        setMyRequestsBadgeCount(unreadAppsCount + unreadMsgsCount);
      } catch (e) {
        console.error("Error checking notifications badge:", e);
      }
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 3000);
    return () => clearInterval(interval);
  }, [user]);

  // Bağışçı bildirimleri için bekleme süresi sona erme denetleyicisi
  useEffect(() => {
    if (!user) return;

    const checkDonationEligibilityNotification = () => {
      try {
        const apps = JSON.parse(localStorage.getItem('bloodApplications') || '[]');
        const approvedApps = apps.filter(a => a.applicantTc === user.tc && a.status === 'Approved');
        
        const parseDate = (dStr) => {
          if (!dStr) return 0;
          const parts = dStr.split('.');
          if (parts.length === 3) return new Date(parts[2], parts[1]-1, parts[0]).getTime();
          return new Date(dStr).getTime();
        };

        approvedApps.sort((a, b) => parseDate(b.date) - parseDate(a.date));
        
        const dates = [
          approvedApps.length > 0 ? approvedApps[0].date : null,
          user.lastDonationDate
        ];

        try {
          const donations = JSON.parse(localStorage.getItem('donationList') || '[]');
          const userDonations = donations.filter(d => d.tc === user?.tc);
          if (userDonations.length > 0) {
            userDonations.sort((a, b) => b.id - a.id);
            dates.push(userDonations[0].date);
          }
        } catch (e) {
          console.error(e);
        }

        let maxMs = 0;
        let lastDonationDate = null;

        dates.forEach(d => {
          const ms = parseDate(d);
          if (ms > maxMs) {
            maxMs = ms;
            lastDonationDate = d;
          }
        });
        
        if (lastDonationDate && lastDonationDate !== 'Kayıt Bulunmuyor') {
          const waitDays = user.gender === 'Kadın' ? 120 : 90;
          
          let lastDonation;
          if (typeof lastDonationDate === 'string' && lastDonationDate.includes('.') && !lastDonationDate.includes('-') && lastDonationDate.split('.').length === 3) {
            const parts = lastDonationDate.split('.');
            lastDonation = new Date(parts[2], parts[1]-1, parts[0]);
          } else {
            lastDonation = new Date(lastDonationDate);
          }
          
          if (!isNaN(lastDonation.getTime())) {
            const nextEligible = new Date(lastDonation.getTime() + waitDays * 24 * 60 * 60 * 1000);
            const isEligible = nextEligible.getTime() <= Date.now();
            
            if (isEligible) {
              const notifId = `eligibility_${user.tc}_${lastDonationDate}`;
              const localNotifs = JSON.parse(localStorage.getItem('user_notifications') || '[]');
              
              const exists = localNotifs.some(n => n.id === notifId || (n.type === 'eligibility_alert' && n.receiverTc === user.tc));
              
              if (!exists) {
                const newNotif = {
                  id: notifId,
                  receiverTc: user.tc,
                  title: 'Tebrikler! 🎉',
                  message: 'Yeniden hayat kurtarmaya hazırsınız. Hemen yakınınızdaki taleplere göz atın veya randevu alın.',
                  createdAt: new Date().toISOString(),
                  isRead: false,
                  type: 'eligibility_alert'
                };
                
                localStorage.setItem('user_notifications', JSON.stringify([newNotif, ...localNotifs]));
                toast.success('Yeniden bağış yapmaya hazırsınız!', { duration: 6000, icon: '🎉' });
              }
            }
          }
        }
      } catch (e) {
        console.error("Error in checkDonationEligibilityNotification:", e);
      }
    };

    checkDonationEligibilityNotification();
    const interval = setInterval(checkDonationEligibilityNotification, 10000);
    return () => clearInterval(interval);
  }, [user]);

  // Rozetlere ilişkin istatistikleri getir
  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      try {
        const localAlerts = JSON.parse(localStorage.getItem('stockAlerts') || '[]');
        if (localAlerts.length > 0) {
          setActiveRequestsCount(localAlerts.length);
          return;
        }
        const statsRes = await axios.get('/Public/home-stats');
        setActiveRequestsCount(statsRes.data.activeRequestsCount || 0);
      } catch (error) {
        console.error('Error fetching home stats in Layout:', error);
      }
    };
    fetchStats();
    
    const handleStorageChange = () => fetchStats();
    window.addEventListener('storage', handleStorageChange);
    
    const interval = setInterval(fetchStats, 10000); // Poll faster for demo consistency
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user]);

  const fetchNotifications = async () => {
    try {
      // Mock sistem için localStorage desteği
      const localNotifs = JSON.parse(localStorage.getItem('user_notifications') || '[]');
      const userNotifs = localNotifs.filter(n => !n.receiverTc || n.receiverTc === user.tc);
      try {
        const res = await axios.get('/User/notifications');
        setNotifications([...res.data, ...userNotifs].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (backendError) {
        setNotifications(userNotifs.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 3000); // 3 saniyede bir guncellensin
    return () => clearInterval(interval);
  }, [user]);

  const handleMarkAsRead = async (id) => {
    try {
      try {
        await axios.post(`/User/notifications/${id}/read`);
      } catch (e) {}
      
      const localNotifs = JSON.parse(localStorage.getItem('user_notifications') || '[]');
      const updated = localNotifs.map(n => n.id === id ? { ...n, isRead: true } : n);
      localStorage.setItem('user_notifications', JSON.stringify(updated));
      
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      try {
        await axios.post('/User/notifications/read-all');
      } catch (e) {}
      
      const localNotifs = JSON.parse(localStorage.getItem('user_notifications') || '[]');
      const updated = localNotifs.map(n => (!n.receiverTc || n.receiverTc === user.tc) ? { ...n, isRead: true } : n);
      localStorage.setItem('user_notifications', JSON.stringify(updated));
      
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('Tüm bildirimler okundu olarak işaretlendi.');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const markAllAsReadSilent = async () => {
    try {
      try {
        await axios.post('/User/notifications/read-all');
      } catch (e) {}
      
      const localNotifs = JSON.parse(localStorage.getItem('user_notifications') || '[]');
      const updated = localNotifs.map(n => (!n.receiverTc || n.receiverTc === user.tc) ? { ...n, isRead: true } : n);
      localStorage.setItem('user_notifications', JSON.stringify(updated));
      
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking all notifications as read silently:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // History Modal için uygulamaları getir
  const fetchDonationHistory = async () => {
    setLoadingHistory(true);
    try {
      // Mock sistem için localStorage'dan okuma
      const apps = JSON.parse(localStorage.getItem('bloodApplications') || '[]');
      const userApps = apps.filter(a => a.applicantTc === user?.tc);
      
      // Arayüzün beklediği formata (DonationRequest nesnesine) çevirme
      const mappedApps = userApps.map(a => ({
        id: a.id,
        applicationDate: a.date,
        status: a.status === 'Approved' || a.isApproved ? 'Approved' : (a.status === 'Rejected' ? 'Rejected' : 'Pending'),
        donationRequest: {
          bloodType: { name: a.alertBlood || a.bloodTypeName },
          hospital: { name: a.alertHospital || a.hospitalName }
        }
      }));
      
      setMyApplications(mappedApps);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Bağış geçmişi yüklenirken hata oluştu.');
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (showHistoryModal) {
      fetchDonationHistory();
    }
  }, [showHistoryModal]);

  useEffect(() => {
    if (!user || user.role === 'Admin' || user.role === 'Yönetici') return;
    const checkSupportUpdates = async () => {
      try {
        const res = await axios.get('/Support/tickets');
        const tickets = res.data;
        const lastSeen = parseInt(localStorage.getItem('user_last_seen_support_ts') || '0', 10);
        
        if (location.pathname === '/support') {
          const maxTs = Math.max(...tickets.map(t => new Date(t.updatedAt).getTime()), 0);
          localStorage.setItem('user_last_seen_support_ts', maxTs.toString());
          setSupportBadgeCount(0);
        } else {
          // Eğer bilet üzerinden kaynaklanmayan bir güncelleme varsa (durum Açık değilse admin işlemi demektir)
          const hasNew = tickets.some(t => new Date(t.updatedAt).getTime() > lastSeen && t.status !== 'Open');
          setSupportBadgeCount(hasNew ? 1 : 0);
        }
      } catch (e) {}
    };
    
    checkSupportUpdates();
    const intervalId = setInterval(checkSupportUpdates, 30000);
    return () => clearInterval(intervalId);
  }, [user, location.pathname]);

  useEffect(() => {
    const handleOpenHistory = () => setShowHistoryModal(true);
    window.addEventListener('open-donation-history', handleOpenHistory);
    return () => window.removeEventListener('open-donation-history', handleOpenHistory);
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Güvenli çıkış yapıldı.');
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const menuItems = [
    { name: 'Ana Sayfa', path: '/dashboard', icon: <Heart size={20} /> },
    { 
      name: 'Kan Talepleri', 
      path: '/blood-requests', 
      icon: <Activity size={20} />, 
      badge: activeRequestsCount 
    },
    { name: 'Taleplerim', path: '/my-requests', icon: <Mail size={20} />, badge: myRequestsBadgeCount },
    { 
      name: 'Bağış Geçmişim', 
      onClick: () => setShowHistoryModal(true), 
      icon: <History size={20} /> 
    },
    { name: 'Profilim', path: '/profile', icon: <User size={20} /> },
    { name: 'Destek Talepleri', path: '/support', icon: <HelpCircle size={20} />, badge: supportBadgeCount },
    { name: 'Kan Uyum Rehberi', path: '/compatibility-guide', icon: <BookOpen size={20} /> }
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#f1f5f9', overflow: 'hidden', fontFamily: "'Outfit', sans-serif" }}>
      
      {/* MOBİL BAŞLIK */}
      <div style={{
        display: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        zIndex: 100,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1rem',
        '@media (maxWidth: 1024px)': {
          display: 'flex'
        }
      }} className="mobile-header-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0f172a' }}>
            <Menu size={24} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ backgroundColor: '#991b1b', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justify: 'center' }}>
              <Heart size={16} fill="white" color="white" style={{ display: 'block', margin: 'auto' }} />
            </div>
            <span style={{ fontWeight: '800', fontSize: '1.2rem', color: '#0f172a' }}>Hayat Ağı</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#ffe4e6', color: '#991b1b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '700' }}>
            {getInitials(user?.fullName)}
          </div>
        </div>
      </div>

      {/* SOL YAN ÇUBUĞU */}
      <div style={{
        width: '260px',
        backgroundColor: '#0f172a',
        borderRight: '1px solid #1e293b',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        flexShrink: 0,
        transition: 'all 0.3s ease',
        zIndex: 101,
        '@media (maxWidth: 1024px)': {
          position: 'fixed',
          left: mobileOpen ? '0' : '-260px',
          top: '0',
          bottom: '0',
        }
      }} className={`sidebar-container ${mobileOpen ? 'mobile-open' : ''}`}>
        
        {/* Kenar Çubuğu Başlığı Logosu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.5rem 1.5rem', borderBottom: '1px solid #1e293b' }}>
          <div style={{ backgroundColor: '#991b1b', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(225,29,72,0.2)' }}>
            <Heart size={18} fill="white" color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.1 }}>Hayat Ağı</h1>
            <span style={{ fontSize: '0.65rem', color: '#f43f5e', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kan Yönetimi</span>
          </div>
          {mobileOpen && (
            <button onClick={() => setMobileOpen(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
              <X size={20} />
            </button>
          )}
        </div>

        {/* Kenar Çubuğu Gezintisi */}
        <div style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', overflowY: 'auto' }} className="custom-scrollbar">
          {menuItems.map((item, idx) => {
            const isActive = item.path && location.pathname === item.path;
            const content = (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ color: isActive ? '#ffffff' : '#94a3b8', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }}>
                    {item.icon}
                  </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: isActive ? '700' : '500', color: isActive ? '#ffffff' : '#cbd5e1' }}>
                    {item.name}
                  </span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span style={{ 
                    backgroundColor: '#991b1b', 
                    color: 'white', 
                    fontSize: '0.7rem', 
                    fontWeight: '800', 
                    padding: '0.15rem 0.45rem', 
                    borderRadius: '8px',
                    boxShadow: '0 2px 5px rgba(225,29,72,0.2)' 
                  }}>
                    {item.badge}
                  </span>
                )}
              </>
            );

            const itemStyle = {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.8rem 1rem',
              borderRadius: '12px',
              textDecoration: 'none',
              cursor: 'pointer',
              backgroundColor: isActive ? '#991b1b' : 'transparent',
              transition: 'all 0.2s ease',
              border: 'none',
              textAlign: 'left',
              width: '100%',
              outline: 'none'
            };

            if (item.path) {
              return (
                <Link key={idx} to={item.path} style={itemStyle} className="sidebar-link" onClick={() => setMobileOpen(false)}>
                  {content}
                </Link>
              );
            } else {
              return (
                <button key={idx} onClick={() => { item.onClick(); setMobileOpen(false); }} style={itemStyle} className="sidebar-link">
                  {content}
                </button>
              );
            }
          })}
        </div>

        {/* Kenar Çubuğu Alt Bilgi Bannerları */}
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid #1e293b' }}>

          {/* Slogan Banner'ı */}
          <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '8px', padding: '1rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: '-15px', bottom: '-15px', opacity: 0.1, color: '#ffffff' }}>
              <Heart size={80} fill="white" />
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, fontWeight: '500' }}>Hayat Kurtarmak</p>
            <p style={{ fontSize: '0.85rem', color: '#ffffff', margin: '0.1rem 0 0 0', fontWeight: '800' }}>Sizin Elinizde</p>
          </div>
        </div>

      </div>

      {/* ANA İÇERİK ALANI */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        
        {/* ÜST BAŞLIK */}
        <header style={{
          height: '70px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 2rem',
          flexShrink: 0
        }} className="top-header-container">

          {/* Başlık Sağ Eylemleri */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            
            {/* Bildirimler */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => {
                  const nextState = !showNotificationsDropdown;
                  setShowNotificationsDropdown(nextState);
                  if (nextState) {
                    markAllAsReadSilent();
                  }
                }}
                style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', transition: 'color 0.2s', padding: '0.25rem', outline: 'none' }}
                onMouseOver={e => e.currentTarget.style.color = '#991b1b'}
                onMouseOut={e => e.currentTarget.style.color = '#64748b'}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span style={{ 
                    position: 'absolute', 
                    top: '-4px', 
                    right: '-4px', 
                    backgroundColor: '#991b1b', 
                    color: 'white', 
                    fontSize: '0.65rem', 
                    fontWeight: '800', 
                    borderRadius: '50%', 
                    width: '16px', 
                    height: '16px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(225,29,72,0.3)'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotificationsDropdown && (
                <>
                  <div 
                    onClick={() => setShowNotificationsDropdown(false)}
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 998 }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '35px',
                    right: '-10px',
                    width: '320px',
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    zIndex: 999,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    {/* Başlık */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a' }}>Bildirimler</span>
                      {unreadCount > 0 && (
                        <button 
                          onClick={handleMarkAllAsRead}
                          style={{ background: 'none', border: 'none', color: '#991b1b', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                        >
                          Tümünü Okundu İşaretle
                        </button>
                      )}
                    </div>

                    {/* Bildirim Listesi */}
                    <div style={{ maxHeight: '280px', overflowY: 'auto' }} className="custom-scrollbar">
                      {notifications.length > 0 ? (
                        notifications.map((n) => {
                          const isSpecial = n.type === 'Success' || n.type === 'eligibility_alert';
                          return (
                            <div 
                              key={n.id} 
                              onClick={() => {
                                if (!n.isRead) handleMarkAsRead(n.id);
                                if (n.type === 'Success') {
                                  navigate('/profile');
                                } else if (n.type === 'eligibility_alert') {
                                  navigate('/blood-requests');
                                }
                                setShowNotificationsDropdown(false);
                              }}
                              style={{ 
                                padding: '0.85rem 1rem', 
                                borderBottom: '1px solid #f1f5f9', 
                                cursor: 'pointer',
                                backgroundColor: n.isRead ? '#ffffff' : isSpecial ? '#f0fdf4' : '#f8fafc',
                                transition: 'background-color 0.2s',
                                display: 'flex',
                                gap: '0.75rem',
                                alignItems: 'flex-start'
                              }}
                              className="notification-item"
                            >
                              <div style={{ 
                                backgroundColor: isSpecial ? '#d1fae5' : '#eff6ff', 
                                color: isSpecial ? '#059669' : '#3b82f6', 
                                borderRadius: '50%', 
                                width: '28px', 
                                height: '28px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                flexShrink: 0,
                                marginTop: '2px'
                              }}>
                                <Heart size={14} fill={isSpecial ? '#059669' : '#3b82f6'} />
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: n.isRead ? '600' : '800', color: '#334155', lineHeight: 1.3 }}>
                                  {n.title}
                                </p>
                                <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.7rem', color: '#64748b', lineHeight: 1.3 }}>
                                  {n.message}
                                </p>
                                <span style={{ fontSize: '0.65rem', color: '#94a3b8', display: 'block', marginTop: '0.35rem' }}>
                                  {new Date(n.createdAt).toLocaleDateString('tr-TR')}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#64748b' }}>
                          <Bell size={32} style={{ color: '#cbd5e1', marginBottom: '0.5rem' }} />
                          <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: '600' }}>Yeni bildiriminiz bulunmuyor.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mesajlar */}
            <button 
              onClick={() => navigate('/my-requests')}
              style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', transition: 'color 0.2s', padding: '0.25rem' }}
              onMouseOver={e => e.currentTarget.style.color = '#991b1b'}
              onMouseOut={e => e.currentTarget.style.color = '#64748b'}
            >
              <Mail size={20} />
            </button>

            {/* Profil Açılır Tetikleyicisi */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}
              >
                {/* Baş Harfler Avatarı */}
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '12px', 
                  backgroundColor: '#fef2f2', 
                  color: '#991b1b', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: '800', 
                  fontSize: '0.95rem',
                  border: '1px solid #ffe4e6'
                }}>
                  {getInitials(user?.fullName)}
                </div>
                {/* Kullanıcı Bilgi Metni */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }} className="header-profile-info">
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a', lineHeight: 1.2 }}>{user?.fullName}</span>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '500' }}>{user?.role === 'Admin' ? 'Yönetici' : 'Bağışçı'}</span>
                </div>
                <ChevronDown size={14} style={{ color: '#64748b' }} />
              </button>

              {/* Profil Açılır Menüsü */}
              {showProfileDropdown && (
                <>
                  <div 
                    onClick={() => setShowProfileDropdown(false)}
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 998 }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '50px',
                    right: 0,
                    width: '180px',
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                    padding: '0.5rem',
                    zIndex: 999,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem'
                  }}>
                    <Link 
                      to="/profile" 
                      onClick={() => setShowProfileDropdown(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem', color: '#334155', textDecoration: 'none', transition: 'background-color 0.2s' }}
                      className="dropdown-item"
                    >
                      <User size={16} /> Profilim
                    </Link>
                    <button 
                      onClick={() => { setShowProfileDropdown(false); handleLogout(); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem', color: '#ef4444', border: 'none', background: 'none', width: '100%', cursor: 'pointer', textAlign: 'left', transition: 'background-color 0.2s' }}
                      className="dropdown-item logout"
                    >
                      <LogOut size={16} /> Çıkış Yap
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>

        </header>

        {/* SAYFA İÇERİĞİ KONTEYNER */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 2rem' }} className="custom-scrollbar main-layout-scroll">
          {children}
        </div>

      </div>

      {/* BAĞIŞ GEÇMİŞİ MODALI */}
      {showHistoryModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#ffffff', padding: '2rem', borderRadius: '10px',
            maxWidth: '600px', width: '90%', maxHeight: '80vh', overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid #e2e8f0',
            display: 'flex', flexDirection: 'column'
          }} className="animate-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <History size={24} style={{ color: '#991b1b' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Bağış Geçmişim</h3>
              </div>
              <button onClick={() => setShowHistoryModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }} className="custom-scrollbar">
              {loadingHistory ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Yükleniyor...</div>
              ) : myApplications.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {myApplications.map((app) => (
                    <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #f1f5f9', borderRadius: '8px', background: '#f8fafc' }}>
                      <div>
                        <p style={{ fontWeight: '800', margin: 0, color: '#0f172a', fontSize: '0.95rem' }}>
                          {app.donationRequest?.bloodType?.name || 'Kan Bağışı'}
                        </p>
                        <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '0.8rem', fontWeight: '500' }}>
                          {app.donationRequest?.hospital?.name || 'Hastane'}
                        </p>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginTop: '0.4rem' }}>
                          Başvuru: {app.applicationDate && (/\d{2}\.\d{2}\.\d{4}/.test(app.applicationDate) ? app.applicationDate : (!isNaN(new Date(app.applicationDate).getTime()) ? new Date(app.applicationDate).toLocaleDateString('tr-TR') : app.applicationDate))}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {app.status === 'Approved' && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); import('../utils/pdfGenerator').then(m => m.generateCertificate(user?.fullName, app.applicationDate && (/\d{2}\.\d{2}\.\d{4}/.test(app.applicationDate) ? app.applicationDate : (!isNaN(new Date(app.applicationDate).getTime()) ? new Date(app.applicationDate).toLocaleDateString('tr-TR') : app.applicationDate)), app.donationRequest?.bloodType?.name, app.donationRequest?.hospital?.name)); }}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#ffffff', border: '1px solid #e2e8f0', color: '#0f172a', padding: '0.25rem 0.6rem', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseOver={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#f8fafc'; }}
                            onMouseOut={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#ffffff'; }}
                            title="Teşekkür Belgesini İndir"
                          >
                            <span style={{ fontSize: '1rem' }}>📜</span> Belgeyi İndir
                          </button>
                        )}
                        <span style={{
                          backgroundColor: app.status === 'Approved' ? '#ecfdf5' : app.status === 'Pending' ? '#fef3c7' : '#fef2f2',
                          color: app.status === 'Approved' ? '#10b981' : app.status === 'Pending' ? '#d97706' : '#991b1b',
                          fontSize: '0.75rem',
                          fontWeight: '800',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '8px'
                        }}>
                          {app.status === 'Approved' ? 'Tamamlandı' : app.status === 'Pending' ? 'Bekliyor' : 'İptal'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                  <History size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
                  <p style={{ fontWeight: '600', fontSize: '0.9rem', margin: 0 }}>Henüz bir bağış kaydınız bulunmuyor.</p>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>Acil kan taleplerine başvurarak bağış yapabilirsiniz.</p>
                </div>
              )}
            </div>

            <button 
              onClick={() => { setShowHistoryModal(false); navigate('/blood-requests'); }}
              style={{ width: '100%', border: 'none', backgroundColor: '#991b1b', color: 'white', fontWeight: '800', padding: '0.875rem', borderRadius: '12px', marginTop: '1.5rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(225,29,72,0.2)' }}
            >
              Bağış Taleplerini Gör
            </button>
          </div>
        </div>
      )}



      {/* Küresel Gömülü CSS stilleri */}
      <style dangerouslySetInnerHTML={{__html: `
        .dropdown-item:hover {
          background-color: #f1f5f9;
        }
        .dropdown-item.logout:hover {
          background-color: #fef2f2;
        }
        .sidebar-link:hover {
          background-color: rgba(255, 255, 255, 0.05) !important;
          transform: translateX(4px);
        }
        .sidebar-link:hover span {
          color: #ffffff !important;
        }
        .sidebar-link {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        
        .main-layout-scroll::-webkit-scrollbar,
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .main-layout-scroll::-webkit-scrollbar-track,
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .main-layout-scroll::-webkit-scrollbar-thumb,
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .main-layout-scroll::-webkit-scrollbar-thumb:hover,
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        @media (max-width: 1024px) {
          .sidebar-container {
            position: fixed !important;
            left: -260px !important;
            top: 0 !important;
            bottom: 0 !important;
            height: 100vh !important;
            box-shadow: 20px 0 50px rgba(0,0,0,0.1);
          }
          .sidebar-container.mobile-open {
            left: 0 !important;
          }
          .top-header-container {
            margin-top: 60px !important;
            padding: 0 1rem !important;
          }
          .main-layout-scroll {
            padding: 1rem !important;
          }
          .header-profile-info {
            display: none !important;
          }
        }
      `}} />

    </div>
  );
};

export default UserLayout;
