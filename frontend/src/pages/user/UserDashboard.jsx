import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  XCircle,
  Calendar, 
  MapPin, 
  Activity, 
  Heart, 
  PlusCircle, 
  FileText, 
  Users, 
  Droplet, 
  ArrowRight, 
  Clock, 
  PhoneCall, 
  Plus, 
  History,
  Navigation,
  Send
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  LineChart, 
  Line 
} from 'recharts';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ISTANBUL_ILCELER = [
  'Adalar', 'Arnavutköy', 'Ataşehir', 'Avcılar', 'Bağcılar', 'Bahçelievler', 'Bakırköy', 
  'Başakşehir', 'Bayrampaşa', 'Beşiktaş', 'Beykoz', 'Beylikdüzü', 'Beyoğlu', 'Büyükçekmece', 
  'Çatalca', 'Çekmeköy', 'Esenler', 'Esenyurt', 'Eyüpsultan', 'Fatih', 'Gaziosmanpaşa', 
  'Güngören', 'Kadıköy', 'Kağıthane', 'Kartal', 'Küçükçekmece', 'Maltepe', 'Pendik', 
  'Sancaktepe', 'Sarıyer', 'Silivri', 'Sultanbeyli', 'Sultangazi', 'Şile', 'Şişli', 
  'Tuzla', 'Ümraniye', 'Üsküdar', 'Zeytinburnu'
];

const HASTANELER = {
  'Fatih': 'Fatih Devlet Hastanesi',
  'Şişli': 'Şişli Etfal Eğitim ve Araştırma Hastanesi',
  'Kadıköy': 'Kadıköy Acıbadem Hastanesi',
  'Beşiktaş': 'Beşiktaş Devlet Hastanesi',
  'Üsküdar': 'Üsküdar Devlet Hastanesi',
  'Bakırköy': 'Bakırköy Ruh Sağlığı Hastanesi',
  'Beyoğlu': 'Beyoğlu Devlet Hastanesi',
  'Ümraniye': 'Ümraniye Eğitim ve Araştırma Hastanesi',
  'Kartal': 'Kartal Eğitim ve Araştırma Hastanesi',
  'Pendik': 'Pendik Devlet Hastanesi',
  'Maltepe': 'Maltepe Devlet Hastanesi',
  'Ataşehir': 'Ataşehir Devlet Hastanesi',
  'Sarıyer': 'Sarıyer İsveç Hastanesi',
  'Kağıthane': 'Kağıthane Devlet Hastanesi',
  'Eyüpsultan': 'Eyüpsultan Devlet Hastanesi',
  'Bayrampaşa': 'Bayrampaşa Kızılay Hastanesi',
  'Gaziosmanpaşa': 'Gaziosmanpaşa Taksim Eğitim Hastanesi',
  'Sultanbeyli': 'Sultanbeyli Devlet Hastanesi',
  'Tuzla': 'Tuzla Devlet Hastanesi',
  'Silivri': 'Silivri Devlet Hastanesi',
};

const getHastane = (ilce) => HASTANELER[ilce] || `${ilce} İlçe Devlet Hastanesi`;

const UserDashboard = ({ user }) => {
  const navigate = useNavigate();
  const localUsers = JSON.parse(localStorage.getItem('usersList') || '[]');
  const localUserEntry = localUsers.find(u => u.tc === user?.tc);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [nearbyRequests, setNearbyRequests] = useState([]);
  const [activities, setActivities] = useState([]);
  const [homeStats, setHomeStats] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState([]);

  // Hızlı kan talebi oluşturmak için Form Durumu
  const [formData, setFormData] = useState({
    type: 'Kendim için',
    district: user?.district || 'Fatih',
    hospital: '',
    bloodType: user?.bloodType || 'A+',
    urgency: 'Acil',
    note: ''
  });

  useEffect(() => {
    setFormData(prev => ({ ...prev, hospital: getHastane(prev.district) }));
  }, [formData.district]);

  // Kontrol Paneli Verilerini Yükle
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [
        profileRes, 
        eligibilityRes, 
        nearbyRes, 
        activitiesRes, 
        statsRes,
        monthlyRes
      ] = await Promise.all([
        axios.get('/User/profile').catch(() => ({ data: user })),
        axios.get('/Donor/eligibility').catch(() => null),
        axios.get('/Donor/nearby-requests').catch(() => null),
        axios.get('/User/activities').catch(() => null),
        axios.get('/Public/home-stats').catch(() => null),
        axios.get('/Donor/monthly-stats').catch(() => null)
      ]);

      if (profileRes) setProfileData(profileRes.data);
      if (eligibilityRes) setEligibility(eligibilityRes.data);
      if (nearbyRes) setNearbyRequests(nearbyRes.data || []);
      if (activitiesRes) setActivities(activitiesRes.data || []);
      if (statsRes) setHomeStats(statsRes.data);

      let baseStats = [];
      const turkishMonths = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

      if (monthlyRes && monthlyRes.data && monthlyRes.data.length > 0) {
        baseStats = monthlyRes.data.map(item => ({
          name: item.name,
          monthIndex: turkishMonths.indexOf(item.name),
          Bağış: item.bagis || 0,
          Talep: item.talep || 0
        }));
      } else {
        // Geri dönüş: Bugünün tarihine göre son 6 ayı dinamik olarak oluştur
        const today = new Date();
        for (let i = 5; i >= 0; i--) {
          const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
          baseStats.push({
            name: turkishMonths[d.getMonth()],
            monthIndex: d.getMonth(),
            year: d.getFullYear(),
            Bağış: 0,
            Talep: 3 // Mock demand to make the chart look nice when API is empty
          });
        }
      }

      // Oturum açmış kullanıcı için yerel depolama onaylı bağışları okuyun ve artırın
      const userTc = user?.tc || JSON.parse(localStorage.getItem('kanyonetim_user') || '{}').tc || JSON.parse(localStorage.getItem('user') || '{}').tc;
      if (userTc) {
        try {
          const apps = JSON.parse(localStorage.getItem('bloodApplications') || '[]');
          const userApprovedApps = apps.filter(a => a.applicantTc === userTc && (a.status === 'Approved' || a.isApproved));
          
          userApprovedApps.forEach(app => {
            const dateStr = app.date; // e.g. "18.06.2026"
            if (!dateStr) return;
            let monthIdx = -1;
            if (dateStr.includes('.')) {
              const parts = dateStr.split('.');
              if (parts.length === 3) {
                monthIdx = parseInt(parts[1], 10) - 1;
              }
            } else {
              const d = new Date(dateStr);
              if (!isNaN(d.getTime())) {
                monthIdx = d.getMonth();
              }
            }

            if (monthIdx !== -1) {
              const target = baseStats.find(s => s.monthIndex === monthIdx);
              if (target) {
                target.Bağış += 1;
              }
            }
          });
        } catch (e) {
          console.error('Error parsing local blood applications:', e);
        }
      }

      setMonthlyStats(baseStats.map(s => ({
        name: s.name,
        Bağış: s.Bağış,
        Talep: s.Talep
      })));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const [dynamicStats, setDynamicStats] = useState({ count: 0, lastDate: null });

  useEffect(() => {
    if (user) {
      const apps = JSON.parse(localStorage.getItem('bloodApplications') || '[]');
      const approvedApps = apps.filter(a => a.applicantTc === user.tc && a.status === 'Approved');
      
      const parseDate = (dStr) => {
        if (!dStr) return 0;
        const parts = dStr.split('.');
        if (parts.length === 3) return new Date(parts[2], parts[1]-1, parts[0]).getTime();
        return new Date(dStr).getTime();
      };

      approvedApps.sort((a, b) => parseDate(b.date) - parseDate(a.date));
      
      setDynamicStats({
        count: approvedApps.length,
        lastDate: approvedApps.length > 0 ? approvedApps[0].date : null
      });
    }
  }, [user]);

  const parseDateToMs = (dStr) => {
    if (!dStr || dStr === 'Kayıt Bulunmuyor') return 0;
    if (typeof dStr === 'string' && dStr.includes('.') && !dStr.includes('-') && dStr.split('.').length === 3) {
      const parts = dStr.split('.');
      return new Date(parts[2], parts[1]-1, parts[0]).getTime();
    }
    const t = new Date(dStr).getTime();
    return isNaN(t) ? 0 : t;
  };

  const getLatestDonation = () => {
    const dates = [
      dynamicStats.lastDate,
      localUserEntry?.lastDonationDate,
      profileData?.lastDonationDate,
      profileData?.LastDonationDate,
      user?.lastDonationDate,
      user?.LastDonationDate
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
    let lastDateToUse = null;

    dates.forEach(d => {
      const ms = parseDateToMs(d);
      if (ms > maxMs) {
        maxMs = ms;
        lastDateToUse = d;
      }
    });

    if (!lastDateToUse) {
      const nextEligibleStr = eligibility?.nextEligibleDate || eligibility?.NextEligibleDate;
      if (nextEligibleStr) {
        const nextDate = new Date(nextEligibleStr);
        if (!isNaN(nextDate.getTime())) {
          const gender = profileData?.gender || user?.gender || localUserEntry?.gender;
          const waitDays = gender === 'Kadın' ? 120 : 90;
          const calculatedLastDonation = new Date(nextDate.getTime() - waitDays * 24 * 60 * 60 * 1000);
          return calculatedLastDonation.toISOString();
        }
      }
    }

    return lastDateToUse;
  };

  const latestDonationDate = getLatestDonation();
  const hasDonated = latestDonationDate && latestDonationDate !== 'Kayıt Bulunmuyor';

  const getResolvedEligibility = () => {
    if (latestDonationDate && latestDonationDate !== 'Kayıt Bulunmuyor') {
      const waitDays = (profileData?.gender || user?.gender || localUserEntry?.gender) === 'Kadın' ? 120 : 90;
      
      let lastDonation;
      if (typeof latestDonationDate === 'string' && latestDonationDate.includes('.') && !latestDonationDate.includes('-') && latestDonationDate.split('.').length === 3) {
        const parts = latestDonationDate.split('.');
        lastDonation = new Date(parts[2], parts[1]-1, parts[0]);
      } else {
        lastDonation = new Date(latestDonationDate);
      }
      
      if (!isNaN(lastDonation.getTime())) {
        const nextEligible = new Date(lastDonation.getTime() + waitDays * 24 * 60 * 60 * 1000);
        const isEligible = nextEligible.getTime() <= Date.now();
        
        return {
          isEligible,
          nextEligibleDate: nextEligible.toISOString(),
          waitDays
        };
      }
    }

    return eligibility;
  };

  const resolvedEligibility = getResolvedEligibility();



  // Form Gönderme İşleyicisi
  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    const newAlert = {
      id: Date.now(),
      bloodType: formData.bloodType,
      urgency: formData.urgency,
      ilce: formData.district,
      hastane: formData.hospital,
      date: new Date().toLocaleDateString('tr-TR'),
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      requester: profileData?.fullName || user?.fullName,
      requesterTc: user?.tc,
      requestType: formData.type,
      autoGenerated: false
    };

    try {
      // Sekmeler arasında anında uyarı senkronizasyonu için yerel olarak localstorage'a kaydedin
      const existing = JSON.parse(localStorage.getItem('stockAlerts') || '[]');
      localStorage.setItem('stockAlerts', JSON.stringify([newAlert, ...existing].slice(0, 50)));

      // Uyumlu bağışçılara bildirim gönder
      const BLOOD_COMPATIBILITY = {
        '0-': ['0-', '0+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
        '0+': ['0+', 'A+', 'B+', 'AB+'],
        'A-': ['A-', 'A+', 'AB-', 'AB+'],
        'A+': ['A+', 'AB+'],
        'B-': ['B-', 'B+', 'AB-', 'AB+'],
        'B+': ['B+', 'AB+'],
        'AB-': ['AB-', 'AB+'],
        'AB+': ['AB+']
      };

      const normalizeBT = (bt) => bt ? bt.replace(' Rh(+)', '+').replace(' Rh(-)', '-').replace(' Rh', '') : '';

      const isUserEligible = (userObj) => {
        const apps = JSON.parse(localStorage.getItem('bloodApplications') || '[]');
        const approvedApps = apps.filter(a => a.applicantTc === userObj.tc && a.status === 'Approved');
        
        const parseDate = (dStr) => {
          if (!dStr || dStr === 'Kayıt Bulunmuyor') return 0;
          const parts = dStr.split('.');
          if (parts.length === 3) return new Date(parts[2], parts[1]-1, parts[0]).getTime();
          return new Date(dStr).getTime();
        };

        let maxMs = parseDate(userObj.lastDonationDate);
        if (approvedApps.length > 0) {
          approvedApps.forEach(a => {
            const ms = parseDate(a.date);
            if (ms > maxMs) maxMs = ms;
          });
        }
        try {
          const donations = JSON.parse(localStorage.getItem('donationList') || '[]');
          const userDonations = donations.filter(d => d.tc === userObj.tc);
          userDonations.forEach(d => {
            const ms = parseDate(d.date);
            if (ms > maxMs) maxMs = ms;
          });
        } catch (e) {}

        if (maxMs === 0 || isNaN(maxMs)) return true;
        const waitDays = userObj.gender === 'Kadın' ? 120 : 90;
        return (maxMs + waitDays * 24 * 60 * 60 * 1000) <= Date.now();
      };

      const usersList = JSON.parse(localStorage.getItem('usersList') || '[]');
      const notifications = JSON.parse(localStorage.getItem('user_notifications') || '[]');
      let notificationCount = 0;
      
      usersList.forEach(u => {
        // Talep edenin kendisini hariç tutun
        const uBt = normalizeBT(u.bloodType);
        const aBt = normalizeBT(formData.bloodType);
        if (u.tc !== user?.tc && (u.role === 'Donor' || u.role === 'Kullanıcı') && uBt && BLOOD_COMPATIBILITY[uBt] && BLOOD_COMPATIBILITY[uBt].includes(aBt)) {
          if (isUserEligible(u)) {
            notifications.push({
              id: Date.now() + Math.random(),
              receiverTc: u.tc,
              message: `${formData.hospital} hastanesinde sizin kan verebileceğiniz acil bir hasta bulunuyor. Kan grubunuz (${u.bloodType}) bu talep için uygundur!`,
              createdAt: new Date().toISOString(),
              isRead: false,
              type: 'urgent_request'
            });
            notificationCount++;
          }
        }
      });
      
      if (notificationCount > 0) {
        localStorage.setItem('user_notifications', JSON.stringify(notifications));
        toast.success(`Kan talebiniz oluşturuldu ve ${notificationCount} uygun bağışçıya bildirim gönderildi!`);
      } else {
        toast.success('Kan talebiniz oluşturuldu ve platforma iletildi!');
      }

      // Listeleri yeniden yükle
      loadDashboardData();
    } catch (e) {
      toast.error('Talep oluşturulurken bir hata oluştu.');
    }
  };

  // Halka Grafiği Veri Biçimlendirmesi
  const getPieData = () => {
    try {
      const alerts = JSON.parse(localStorage.getItem('stockAlerts') || '[]');
      if (alerts.length > 0) {
        const counts = {};
        alerts.forEach(a => {
          const bt = a.bloodType ? a.bloodType.replace(' Rh(+)', '+').replace(' Rh(-)', '-').replace(' Rh', '') : 'A+';
          counts[bt] = (counts[bt] || 0) + 1;
        });
        
        return Object.keys(counts).map(name => ({
          name: name.replace('+', ' Rh(+)').replace('-', ' Rh(-)'),
          value: counts[name],
          color: name.includes('0') || name.includes('O') || name.includes('O') ? '#991b1b' : name.includes('A') ? '#8b5cf6' : name.includes('B') ? '#f59e0b' : '#3b82f6'
        })).sort((a, b) => b.value - a.value);
      }
    } catch (e) {
      console.error('Error parsing stockAlerts for pie chart:', e);
    }

    return homeStats?.bloodGroupStats?.map(bgs => ({
      name: bgs.name,
      value: bgs.value,
      color: bgs.name.includes('0') || bgs.name.includes('O') ? '#991b1b' : bgs.name.includes('A') ? '#8b5cf6' : bgs.name.includes('B') ? '#f59e0b' : '#3b82f6'
    })) || [
      { name: 'O Rh(-)', value: 5, color: '#991b1b' },
      { name: 'A Rh(+)', value: 3, color: '#8b5cf6' },
      { name: 'B Rh(+)', value: 2, color: '#f59e0b' },
      { name: 'AB Rh(+)', value: 1, color: '#10b981' },
      { name: 'Diğer', value: 1, color: '#3b82f6' }
    ];
  };

  const pieData = getPieData();
  const totalNeed = pieData.reduce((acc, curr) => acc + curr.value, 0);

  // Mini Grafik Sahte Veri Kümeleri
  const sparklineData1 = [{ v: 5 }, { v: 8 }, { v: 6 }, { v: 12 }, { v: 9 }, { v: 14 }, { v: 12 }];
  const sparklineData2 = [{ v: 2 }, { v: 4 }, { v: 3 }, { v: 7 }, { v: 5 }, { v: 9 }, { v: 7 }];
  const sparklineData3 = [{ v: 3 }, { v: 3 }, { v: 4 }, { v: 4 }, { v: 4 }, { v: 4 }, { v: 4 }];
  const sparklineData4 = [{ v: 1100 }, { v: 1150 }, { v: 1180 }, { v: 1200 }, { v: 1210 }, { v: 1240 }, { v: 1248 }];

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '4px solid #f1f5f9', borderTopColor: '#991b1b', animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>Panel yükleniyor...</span>
        <style dangerouslySetInnerHTML={{__html: `@keyframes spin { to { transform: rotate(360deg); } }`}} />
      </div>
    );
  }

  // Tarih yardımcısını biçimlendir
  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === 'Kayıt Bulunmuyor') return 'Kayıt Bulunmuyor';
    let date;
    if (typeof dateStr === 'string' && dateStr.includes('.') && !dateStr.includes('-') && dateStr.split('.').length === 3) {
      const parts = dateStr.split('.');
      date = new Date(parts[2], parts[1]-1, parts[0]);
    } else {
      date = new Date(dateStr);
    }
    if (isNaN(date.getTime())) return 'Kayıt Bulunmuyor';
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Göreceli Zaman Yardımcısı
  const getRelativeTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Az önce';
    if (diffMins < 60) return `${diffMins} dakika önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    return `${diffDays} gün önce`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', animation: 'fadeInUp 0.6s ease-out' }}>
      
      {/* SATIR 1: HOŞGELDİNİZ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Hoş Geldiniz ve Uygunluk Kartı */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          borderTop: '4px solid #ef4444',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
          position: 'relative',
          overflow: 'hidden'
        }} className="welcome-card-grid">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.025em' }}>
                Merhaba, {(profileData?.fullName || user?.fullName || '').split(' ')[0]} 👋
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0.35rem 0 0 0', fontWeight: '500' }}>
                Bir hayat kurtarmak için harika bir gün! ❤️
              </p>
            </div>
            
            {/* Canlı Aktif İstekler Rozeti */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              backgroundColor: '#fef2f2', 
              border: '1px solid #fee2e2', 
              borderRadius: '20px', 
              padding: '0.4rem 0.85rem',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.04)'
            }}>
              <span style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                backgroundColor: '#ef4444', 
                display: 'inline-block',
                animation: 'pulse-dot 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }} />
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#991b1b' }}>
                Bugün {totalNeed} Aktif Kan Talebi Var
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.5rem', flexWrap: 'wrap' }} className="welcome-card-badges">
            {/* Uygunluk Rozeti */}
            {resolvedEligibility ? (
              resolvedEligibility.isEligible ? (
                <div style={{
                  flex: '1 1 280px',
                  background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  border: '1px solid #bbf7d0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.03)',
                  position: 'relative'
                }}>
                  <div style={{ 
                    color: '#15803d', 
                    fontSize: '0.85rem', 
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <CheckCircle size={18} fill="#22c55e" color="white" /> {hasDonated ? 'Yeniden Bağış İçin Uygun' : 'Bağış İçin Uygun'}
                  </div>
                  <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#166534', lineHeight: 1.4 }}>
                    {hasDonated ? 'Tebrikler! Yeniden hayat kurtarmaya hazırsınız.' : 'Tebrikler! Hayat kurtarmaya hazırsınız.'}
                  </span>
                  <button 
                    onClick={() => toast.success(hasDonated ? 'Tebrikler, yeniden bağış yapmaya hazırsınız!' : 'Tebrikler, bağış yapmaya hazırsınız!', { icon: '❤️' })}
                    style={{ 
                      alignSelf: 'flex-start',
                      background: 'rgba(34, 197, 94, 0.08)', 
                      border: '1px solid rgba(34, 197, 94, 0.2)', 
                      color: '#15803d', 
                      fontSize: '0.75rem', 
                      fontWeight: '800', 
                      cursor: 'pointer', 
                      borderRadius: '20px',
                      padding: '0.25rem 0.75rem',
                      marginTop: '0.25rem',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(34, 197, 94, 0.15)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(34, 197, 94, 0.08)'}
                  >
                    Detayları Gör
                  </button>
                </div>
              ) : (
                <div style={{
                  flex: '1 1 280px',
                  background: 'linear-gradient(135deg, #fffbeb 0%, #fffaf0 100%)',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  border: '1px solid #fed7aa',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.6rem',
                  boxShadow: '0 4px 15px rgba(245, 158, 11, 0.02)'
                }}>
                  <div style={{ 
                    color: '#d97706', 
                    fontSize: '0.85rem', 
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <Clock size={18} fill="#f59e0b" color="white" /> Yeniden Bağış İçin Bekleme Süresi
                  </div>

                  <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#7c2d12', lineHeight: 1.3 }}>
                    Güvenliğiniz için bekleme sürecindesiniz.
                  </span>
                  
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.6rem', 
                    margin: '0.1rem 0', 
                    padding: '0.6rem 0.9rem', 
                    backgroundColor: '#ffffff', 
                    borderRadius: '10px', 
                    border: '1px solid #ffedd5',
                    boxShadow: '0 2px 6px rgba(124, 45, 18, 0.02)'
                  }}>
                    <Calendar size={16} color="#ea580c" />
                    <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#9a3412' }}>
                      <strong style={{ color: '#ea580c', fontWeight: '800' }}>{new Date(resolvedEligibility.nextEligibleDate).toLocaleDateString('tr-TR')}</strong> tarihinde tekrar kan verebilirsiniz.
                    </span>
                  </div>

                  <button 
                    onClick={() => {
                      const nextDateObj = new Date(resolvedEligibility.nextEligibleDate);
                      const formatted = nextDateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
                      toast(`Son bağışınız üzerinden güvenli bağış aralığı geçmemiştir. Erkekler için 90 gün (3 ay), Kadınlar için 120 gün (4 ay) bekleme süresi uygulanır. Bir sonraki bağış yapabileceğiniz tarih: ${formatted}`, { icon: 'ℹ️' });
                    }}
                    style={{ 
                      alignSelf: 'flex-start',
                      background: 'rgba(234, 88, 12, 0.06)', 
                      border: '1px solid rgba(234, 88, 12, 0.15)', 
                      color: '#c2410c', 
                      fontSize: '0.75rem', 
                      fontWeight: '800', 
                      cursor: 'pointer', 
                      borderRadius: '20px',
                      padding: '0.25rem 0.75rem',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(234, 88, 12, 0.12)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(234, 88, 12, 0.06)'}
                  >
                    Detayları Göster
                  </button>
                </div>
              )
            ) : (
              <div style={{ flex: 1, padding: '1rem', fontSize: '0.85rem', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Durum hesaplanıyor...
              </div>
            )}

            {/* Kan Grubu Kutusu */}
            <div style={{
              width: '125px',
              background: 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)',
              border: '1px solid rgba(153, 27, 27, 0.15)',
              borderRadius: '14px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              boxShadow: '0 8px 20px rgba(239, 68, 68, 0.15)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Yüzen filigran arka plan damlacığı */}
              <Droplet 
                size={70} 
                style={{ 
                  position: 'absolute', 
                  right: '-15px', 
                  bottom: '-15px', 
                  color: 'rgba(255, 255, 255, 0.08)', 
                  fill: 'rgba(255, 255, 255, 0.05)',
                  transform: 'rotate(-15deg)'
                }} 
              />
              <span style={{ 
                fontSize: '1.45rem', 
                fontWeight: '900', 
                color: '#ffffff', 
                letterSpacing: '-0.5px',
                zIndex: 1,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                {user?.bloodType ? user.bloodType.replace('+', ' Rh(+)').replace('-', ' Rh(-)') : 'B Rh(+)'}
              </span>
              <span style={{ 
                fontSize: '0.65rem', 
                color: 'rgba(255, 255, 255, 0.85)', 
                fontWeight: '800', 
                marginTop: '0.35rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                zIndex: 1
              }}>
                Kan Grubunuz
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }} className="welcome-card-footer">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', backgroundColor: '#f8fafc', padding: '0.6rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <History size={18} style={{ color: '#64748b' }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Son bağışınız</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a', marginTop: '0.05rem' }}>
                    {formatDate(latestDonationDate)}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => { const btn = document.querySelector('.sidebar-link[href="/my-requests"]'); if (btn) btn.click(); }}
                style={{ 
                  backgroundColor: '#ffffff',
                  border: '1px solid #fca5a5',
                  borderRadius: '12px',
                  color: '#dc2626', 
                  padding: '0.65rem 1.25rem',
                  fontSize: '0.8rem', 
                  fontWeight: '800', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.45rem',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 2px 4px rgba(220, 38, 38, 0.02)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fef2f2';
                  e.currentTarget.style.borderColor = '#ef4444';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 10px rgba(220, 38, 38, 0.08)';
                  const arrow = e.currentTarget.querySelector('svg');
                  if (arrow) arrow.style.transform = 'translateX(3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = '#fca5a5';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(220, 38, 38, 0.02)';
                  const arrow = e.currentTarget.querySelector('svg');
                  if (arrow) arrow.style.transform = 'translateX(0)';
                }}
              >
                Bağış Geçmişim <ArrowRight size={15} style={{ transition: 'transform 0.2s ease' }} />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* SIRA 1.5: OYUNLAŞTIRMA (ROZETLER) */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.2rem' }}>🏆</span> Gönüllülük Skoru & Rozetlerim
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {(() => {
            const count = dynamicStats.count || profileData?.donationCount || user?.donationCount || 0;
            const badges = [];
            badges.push({ name: 'Kahraman Başlangıcı', icon: '🌟', color: '#10b981', desc: 'İlk adım (1+ bağış)', earned: count >= 1 });
            badges.push({ name: 'Düzenli Donör', icon: '🛡️', color: '#3b82f6', desc: 'Sürekli destek (3+ bağış)', earned: count >= 3 });
            badges.push({ name: 'Hayat Kurtaran', icon: '🦸‍♂️', color: '#8b5cf6', desc: 'Büyük özveri (5+ bağış)', earned: count >= 5 });
            badges.push({ name: 'Efsanevi Bağışçı', icon: '👑', color: '#f59e0b', desc: 'Gerçek bir kahraman (10+ bağış)', earned: count >= 10 });

            return badges.map((badge, idx) => (
              <div key={idx} style={{ 
                backgroundColor: badge.earned ? `${badge.color}15` : '#f8fafc', 
                border: `1px solid ${badge.earned ? badge.color : '#e2e8f0'}`, 
                borderRadius: '8px', 
                padding: '1rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem',
                opacity: badge.earned ? 1 : 0.5,
                transition: 'all 0.2s',
                boxShadow: badge.earned ? `0 4px 10px ${badge.color}10` : 'none'
              }}>
                <div style={{ fontSize: '2rem', filter: badge.earned ? 'none' : 'grayscale(100%)' }}>
                  {badge.icon}
                </div>
                <div>
                  <div style={{ fontWeight: '800', color: badge.earned ? badge.color : '#64748b', fontSize: '0.95rem' }}>{badge.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>{badge.desc}</div>
                </div>
              </div>
            ));
          })()}
        </div>
        <div style={{ marginTop: '1.25rem', fontSize: '0.85rem', color: '#64748b', fontWeight: '500', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>Toplam Onaylanan Bağış Sayınız: <strong style={{ color: '#0f172a', fontSize: '1.1rem' }}>{dynamicStats.count || profileData?.donationCount || user?.donationCount || 0}</strong></div>
          <div style={{ fontSize: '0.75rem', backgroundColor: '#e2e8f0', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>Her bağış yeni bir rozet puanıdır!</div>
        </div>
      </div>

      {/* SIRA 2: FORMLAR, YAKIN İSTEKLER VE AKTİVİTELER */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.5fr 1fr', gap: '1.5rem' }} className="dashboard-grid-row2">
        
        {/* Kan Talep Kartı Oluştur */}
        <div style={{
          backgroundColor: '#0f172a',
          borderRadius: '10px',
          border: '1px solid #1e293b',
          padding: '1.5rem',
          boxShadow: '0 10px 30px rgba(15,23,42,0.2)',
          display: 'flex',
          flexDirection: 'column'
        }} className="request-form-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <PlusCircle size={20} style={{ color: '#ef4444' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>Acil Kan Talebi Oluştur</h3>
          </div>

          <form onSubmit={handleRequestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.35rem' }}>Kan Grubu</label>
                <select 
                  id="quick-request-blood-type"
                  value={formData.bloodType} 
                  onChange={e => setFormData({ ...formData, bloodType: e.target.value })}
                  style={{ padding: '0.65rem 0.85rem', borderRadius: '10px', fontSize: '0.85rem', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', outline: 'none', width: '100%', cursor: 'pointer' }}
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', '0+', '0-'].map(kg => (
                    <option key={kg} value={kg} style={{ background: '#1e293b', color: '#ffffff' }}>{kg}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.35rem' }}>İlçe</label>
                <select 
                  value={formData.district} 
                  onChange={e => setFormData({ ...formData, district: e.target.value })}
                  style={{ padding: '0.65rem 0.85rem', borderRadius: '10px', fontSize: '0.85rem', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', outline: 'none', width: '100%', cursor: 'pointer' }}
                >
                  {ISTANBUL_ILCELER.map(ilce => (
                    <option key={ilce} value={ilce} style={{ background: '#1e293b', color: '#ffffff' }}>{ilce}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.35rem' }}>Hastane</label>
              <input 
                type="text" 
                value={formData.hospital} 
                onChange={e => setFormData({ ...formData, hospital: e.target.value })}
                style={{ padding: '0.65rem 0.85rem', borderRadius: '10px', fontSize: '0.85rem', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', outline: 'none', width: '100%' }}
                placeholder="Hastane adı girin..."
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.35rem' }}>Not (isteğe bağlı)</label>
              <textarea 
                value={formData.note}
                onChange={e => setFormData({ ...formData, note: e.target.value })}
                style={{ 
                  width: '100%', 
                  borderRadius: '10px', 
                  border: '1px solid #334155', 
                  padding: '0.65rem 0.85rem', 
                  fontSize: '0.85rem', 
                  minHeight: '70px',
                  maxHeight: '100px',
                  resize: 'vertical',
                  outline: 'none',
                  color: '#ffffff',
                  background: '#1e293b',
                  fontFamily: 'inherit'
                }}
                placeholder="İrtibat telefonu, talep nedeni vb. ekleyebilirsiniz..."
              />
            </div>

            <button 
              type="submit" 
              style={{ 
                marginTop: 'auto', 
                backgroundColor: '#991b1b', 
                color: 'white', 
                border: 'none', 
                padding: '0.75rem', 
                borderRadius: '12px', 
                fontWeight: '800', 
                fontSize: '0.85rem', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(225,29,72,0.15)'
              }}
            >
              <Send size={16} /> Talep Oluştur
            </button>

          </form>
        </div>

        {/* Yakındaki İstekler Listesi Kartı */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
          display: 'flex',
          flexDirection: 'column'
        }} className="nearby-requests-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Droplet size={20} style={{ color: '#991b1b' }} fill="#991b1b" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Yakınımdaki Acil Talepler</h3>
            </div>
            <Link to="/blood-requests" style={{ fontSize: '0.75rem', fontWeight: '700', color: '#991b1b', textDecoration: 'none' }}>
              Tümünü Gör
            </Link>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }} className="custom-scrollbar nearby-reqs-scroll">
            {nearbyRequests.length > 0 ? (
              nearbyRequests.map((req) => (
                <div key={req.id} style={{ display: 'flex', alignItems: 'center', padding: '0.75rem 1rem', border: '1px solid #f1f5f9', borderRadius: '8px', backgroundColor: '#ffffff', transition: 'border-color 0.2s' }} className="request-list-item">
                  <div style={{ 
                    backgroundColor: req.urgencyLevel === 'Kritik' ? '#fef2f2' : (req.urgencyLevel === 'Acil' ? '#fff7ed' : '#f1f5f9'), 
                    width: '44px', 
                    height: '44px', 
                    borderRadius: '12px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Droplet size={14} 
                      fill={req.urgencyLevel === 'Kritik' ? '#991b1b' : (req.urgencyLevel === 'Acil' ? '#c2410c' : '#475569')} 
                      color={req.urgencyLevel === 'Kritik' ? '#991b1b' : (req.urgencyLevel === 'Acil' ? '#c2410c' : '#475569')} 
                    />
                    <span style={{ 
                      fontSize: '0.52rem', 
                      fontWeight: '800', 
                      color: req.urgencyLevel === 'Kritik' ? '#991b1b' : (req.urgencyLevel === 'Acil' ? '#c2410c' : '#475569'), 
                      marginTop: '2px' 
                    }}>
                      {req.urgencyLevel}
                    </span>
                  </div>

                  <div style={{ marginLeft: '1rem', flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '800', color: '#0f172a' }}>
                      {req.bloodTypeName || 'O Rh(-)'}
                    </p>
                    <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {req.hospitalName || 'Kadıköy Acıbadem Hastanesi'}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right', marginLeft: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#991b1b' }}>
                      {req.distanceKm ? `${req.distanceKm.toFixed(1)} km` : '2.4 km'}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.6rem', color: '#94a3b8', marginTop: '2px' }}>
                      Mesafe
                    </span>
                  </div>
                </div>
              ))
            ) : (
              // Geri dönüş varsayılan listesi
              [
                { blood: 'O Rh(-)', hospital: 'Kadıköy Acıbadem Hastanesi', dist: '2.1 km', urgency: 'Acil' },
                { blood: 'B+', hospital: 'Çekmeköy Devlet Hastanesi', dist: '3.4 km', urgency: 'Acil' },
                { blood: 'A+', hospital: 'Kartal Eğitim Araştırma Hastanesi', dist: '4.8 km', urgency: 'Normal' },
                { blood: 'AB+', hospital: 'Ümraniye Eğitim Araştırma Hastanesi', dist: '5.2 km', urgency: 'Kritik' }
              ].map((fallback, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', padding: '0.75rem 1rem', border: '1px solid #f1f5f9', borderRadius: '8px', backgroundColor: '#ffffff' }} className="request-list-item">
                  <div style={{ 
                    backgroundColor: fallback.urgency === 'Kritik' ? '#fef2f2' : (fallback.urgency === 'Acil' ? '#fff7ed' : '#f1f5f9'), 
                    width: '44px', 
                    height: '44px', 
                    borderRadius: '12px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Droplet size={14} 
                      fill={fallback.urgency === 'Kritik' ? '#991b1b' : (fallback.urgency === 'Acil' ? '#c2410c' : '#475569')} 
                      color={fallback.urgency === 'Kritik' ? '#991b1b' : (fallback.urgency === 'Acil' ? '#c2410c' : '#475569')} 
                    />
                    <span style={{ 
                      fontSize: '0.52rem', 
                      fontWeight: '800', 
                      color: fallback.urgency === 'Kritik' ? '#991b1b' : (fallback.urgency === 'Acil' ? '#c2410c' : '#475569'), 
                      marginTop: '2px' 
                    }}>
                      {fallback.urgency}
                    </span>
                  </div>

                  <div style={{ marginLeft: '1rem', flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '800', color: '#0f172a' }}>
                      {fallback.blood}
                    </p>
                    <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {fallback.hospital}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right', marginLeft: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#991b1b' }}>
                      {fallback.dist}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.6rem', color: '#94a3b8', marginTop: '2px' }}>
                      Mesafe
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Son Etkinlikler Zaman Çizelgesi Kartı */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
          display: 'flex',
          flexDirection: 'column'
        }} className="activities-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={20} style={{ color: '#991b1b' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Son Aktiviteler</h3>
            </div>
            <button 
              onClick={() => { const btn = document.querySelector('.sidebar-link[href="/profile"]'); if (btn) btn.click(); }}
              style={{ background: 'none', border: 'none', fontSize: '0.75rem', fontWeight: '700', color: '#991b1b', cursor: 'pointer', textDecoration: 'none' }}
            >
              Tümünü Gör
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '0.5rem' }} className="custom-scrollbar activities-scroll">
            {activities.length > 0 ? (
              activities.map((act, idx) => (
                <div key={act.id} style={{ display: 'flex', gap: '0.85rem', position: 'relative' }}>
                  {/* Zaman çizelgesi çubuk çizgisi */}
                  {idx !== activities.length - 1 && (
                    <div style={{ position: 'absolute', top: '22px', left: '9px', bottom: '-22px', width: '2px', backgroundColor: '#f1f5f9' }} />
                  )}
                  {/* Madde İşareti Düğümü */}
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '50%', 
                    backgroundColor: '#fef2f2', 
                    border: '2px solid #991b1b', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0,
                    zIndex: 2
                  }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#991b1b' }} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#334155', fontWeight: '600', lineHeight: 1.3 }}>
                      {act.description || 'Profil bilgileri güncellendi'}
                    </p>
                    <span style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.2rem', display: 'block' }}>
                      {getRelativeTime(act.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', color: '#94a3b8', textAlign: 'center', height: '100%' }}>
                <Clock size={32} style={{ marginBottom: '0.75rem', strokeWidth: 1.5, color: '#cbd5e1' }} />
                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>Henüz bir aktivite bulunmuyor.</p>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.7rem', color: '#94a3b8', maxWidth: '200px', lineHeight: 1.4 }}>Profilinizi güncellediğinizde veya bağış yaptığınızda burada görünecektir.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* SATIR 3: GRAFİKLER VE HIZLI EYLEMLER */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 1fr', gap: '1.5rem', alignItems: 'stretch' }} className="dashboard-grid-row3">
        
        {/* Çörek Dağıtım Tablosu */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
          display: 'flex',
          flexDirection: 'column'
        }} className="distribution-chart-card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: '0 0 1rem 0' }}>Kan Talep Dağılımı</h3>
          
          <div style={{ display: 'flex', flex: 1, alignItems: 'center' }} className="distribution-chart-inner">
            {/* Çizelge */}
            <div style={{ width: '50%', height: '150px', position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius="65%" outerRadius="90%" paddingAngle={4} dataKey="value" stroke="none">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} Ünite`, 'Talep']} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>Toplam</span>
                <span style={{ fontSize: '1.35rem', color: '#0f172a', fontWeight: '900' }}>{totalNeed}</span>
              </div>
            </div>
            {/* Efsane */}
            <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '0.45rem', paddingLeft: '1rem' }} className="distribution-legend">
              {pieData.map((item, i) => {
                const percentage = totalNeed > 0 ? Math.round((item.value / totalNeed) * 100) : 0;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
                      <span style={{ fontSize: '0.75rem', color: '#334155', fontWeight: '700' }}>{item.name}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '800' }}>%{percentage}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem', marginTop: '0.5rem' }}>
            <Link to="/blood-requests" style={{ fontSize: '0.8rem', fontWeight: '700', color: '#991b1b', textDecoration: 'none' }}>
              Detaylı İstatistikler →
            </Link>
          </div>
        </div>

        {/* Çubuk Grafiği Bağış ve Talep */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
          display: 'flex',
          flexDirection: 'column'
        }} className="monthly-chart-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Aylık Bağış İstatistiğiniz</h3>
            {/* Grafik Açıklaması */}
            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', fontWeight: '600' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#991b1b' }}>
                <div style={{ width: '10px', height: '10px', backgroundColor: '#991b1b', borderRadius: '3px' }} />
                Bağış
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#94a3b8' }}>
                <div style={{ width: '10px', height: '10px', backgroundColor: '#cbd5e1', borderRadius: '3px' }} />
                Talep
              </div>
            </div>
          </div>

          <div style={{ flex: 1, minHeight: '140px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyStats} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: '600' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: '600' }} />
                <Tooltip />
                <Bar dataKey="Bağış" fill="#991b1b" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="Talep" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem', marginTop: '0.5rem' }}>
            <button 
              onClick={() => toast.success('İstatistikleriniz günceldir.')}
              style={{ background: 'none', border: 'none', fontSize: '0.8rem', fontWeight: '700', color: '#991b1b', cursor: 'pointer' }}
            >
              İstatistikleri Gör →
            </button>
          </div>
        </div>

        {/* Hızlı Eylemler Tablosu */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
          display: 'flex',
          flexDirection: 'column'
        }} className="quick-actions-card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: '0 0 1rem 0' }}>Hızlı İşlemler</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', flex: 1 }} className="quick-actions-grid">
            
            {/* Hızlı 1: İstek oluşturun */}
            <button 
              onClick={() => {
                const select = document.getElementById('quick-request-blood-type');
                if (select) {
                  select.focus();
                  select.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  toast.success('Talep oluşturma alanına yönlendirildiniz.');
                }
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem', border: 'none', borderRadius: '8px', backgroundColor: '#fef2f2', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' }}
              className="quick-action-btn action-red"
            >
              <div style={{ color: '#991b1b', backgroundColor: '#ffffff', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={18} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#9f1239' }}>Kan Talebi Oluştur</span>
            </button>

            {/* Hızlı 2: En Yakın Merkezler */}
            <button 
              onClick={() => navigate('/blood-requests')}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem', border: 'none', borderRadius: '8px', backgroundColor: '#eff6ff', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' }}
              className="quick-action-btn action-blue"
            >
              <div style={{ color: '#3b82f6', backgroundColor: '#ffffff', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={18} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#1d4ed8' }}>Yakın Merkezleri Gör</span>
            </button>

            {/* Hızlı 3: Bağış Geçmişi */}
            <button 
              onClick={() => {
                window.dispatchEvent(new Event('open-donation-history'));
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem', border: 'none', borderRadius: '8px', backgroundColor: '#ecfdf5', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' }}
              className="quick-action-btn action-green"
            >
              <div style={{ color: '#10b981', backgroundColor: '#ffffff', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <History size={18} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#047857' }}>Bağış Geçmişim</span>
            </button>

            {/* Hızlı 4: Acil Durumda İrtibat Kişileri */}
            <button 
              onClick={() => {
                toast(
                  <div>
                    <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Acil Kan Destek Hattı</strong>
                    Kızılay İletişim: 168<br />
                    Ambulans: 112
                  </div>,
                  { duration: 5000 }
                );
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem', border: 'none', borderRadius: '8px', backgroundColor: '#fffbeb', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' }}
              className="quick-action-btn action-yellow"
            >
              <div style={{ color: '#d97706', backgroundColor: '#ffffff', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PhoneCall size={18} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#b45309' }}>Acil Rehber</span>
            </button>

          </div>
        </div>

      </div>

      {/* HAREKETLİ EYLEM DÜĞMESİ */}
      <button 
        onClick={() => {
          const select = document.getElementById('quick-request-blood-type');
          if (select) {
            select.focus();
            select.scrollIntoView({ behavior: 'smooth', block: 'center' });
            toast.success('Talep formuna yönlendirildiniz.');
          }
        }}
        style={{
          position: 'fixed',
          bottom: '2.5rem',
          right: '2.5rem',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#991b1b',
          color: 'white',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(225,29,72,0.3)',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 99
        }}
        className="floating-action-fab"
      >
        <Plus size={28} />
      </button>

      {/* Genel Kontrol Paneli Kullanıcı Arayüzü Stilleri */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.15); }
        }

        .quick-action-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.04);
        }
        .quick-action-btn:active {
          transform: translateY(-2px);
        }
        
        .request-list-item:hover {
          border-color: rgba(225,29,72,0.2) !important;
          background-color: #fcfcfc !important;
        }

        .floating-action-fab:hover {
          transform: scale(1.1) rotate(90deg);
          background-color: #7f1d1d;
          box-shadow: 0 12px 30px rgba(225,29,72,0.4);
        }

        @media (max-width: 1400px) {
          .dashboard-grid-row1 {
            grid-template-columns: 1fr 1fr !important;
          }
          .welcome-card-grid {
            grid-column: span 2 !important;
          }
          .dashboard-grid-row2 {
            grid-template-columns: 1fr 1fr !important;
          }
          .activities-card {
            grid-column: span 2 !important;
          }
          .dashboard-grid-row3 {
            grid-template-columns: 1fr 1fr !important;
          }
          .quick-actions-card {
            grid-column: span 2 !important;
          }
        }

        @media (max-width: 768px) {
          .dashboard-grid-row1,
          .dashboard-grid-row2,
          .dashboard-grid-row3 {
            grid-template-columns: 1fr !important;
          }
          .welcome-card-grid,
          .activities-card,
          .quick-actions-card {
            grid-column: span 1 !important;
          }
          .distribution-chart-inner {
            flex-direction: column !important;
            gap: 1.5rem !important;
          }
          .distribution-legend {
            width: 100% !important;
            padding-left: 0 !important;
          }
        }
      `}} />

    </div>
  );
};

export default UserDashboard;
