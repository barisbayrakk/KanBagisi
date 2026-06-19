import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import { Toaster, toast } from 'react-hot-toast'
import { Droplets, Droplet, Heart, LayoutDashboard, LogOut, User, Menu, X, PlusCircle, Activity, MapPin, Calendar, ArrowRight, Settings, Users, Shield, UserRound, Search, Mail, Phone, Filter, TrendingUp, TrendingDown, Truck, CheckCircle, AlertTriangle, RefreshCw, Bell, Trash2, Eye, EyeOff, XCircle } from 'lucide-react'
import axios from 'axios'
import AdminDashboardOverview from './pages/admin/AdminDashboardOverview';
import UserManagement from './pages/admin/UserManagement';
import AuditLogs from './pages/admin/AuditLogs';
import RequestApprovals from './pages/admin/RequestApprovals';
import Logistics from './pages/admin/Logistics';
import SecurityPanel from './pages/admin/SecurityPanel';
import LiveTracking from './pages/admin/LiveTracking';
import KanRotasi from './pages/admin/KanRotasi';
import ReCAPTCHA from "react-google-recaptcha"
import Profile from './pages/Profile';
import Home from './pages/Home';
import UserLayout from './components/UserLayout';
import UserDashboard from './pages/user/UserDashboard';
import Support from './pages/user/Support';
import CompatibilityGuide from './pages/user/CompatibilityGuide';
import AdminSupport from './pages/admin/AdminSupport';
import Chatbot from './components/common/Chatbot';

// API Temel URL'si
axios.defaults.baseURL = 'http://localhost:5090/api';

const getInitialStockData = () => {
  try {
    if (localStorage.getItem('stock_v3') !== 'true') {
      localStorage.removeItem('stockData');
      localStorage.setItem('stock_v3', 'true');
    }
    const data = localStorage.getItem('stockData');
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed && Object.keys(parsed).length > 0) {
        // Yalnızca tamamı sıfır değilse geri dön
        let total = 0;
        for (const dist in parsed) {
          for (const kg in parsed[dist]) {
            total += parsed[dist][kg];
          }
        }
        if (total > 0) return parsed;
      }
    }
  } catch (e) {}

  const seed = {
    'Adalar': { '0+': 2, '0-': 1, 'A+': 3, 'A-': 0, 'B+': 1, 'B-': 0, 'AB+': 1, 'AB-': 0 },
    'Arnavutköy': { '0+': 4, '0-': 2, 'A+': 3, 'A-': 1, 'B+': 5, 'B-': 0, 'AB+': 2, 'AB-': 0 },
    'Ataşehir': { '0+': 15, '0-': 6, 'A+': 22, 'A-': 5, 'B+': 12, 'B-': 3, 'AB+': 8, 'AB-': 2 },
    'Avcılar': { '0+': 8, '0-': 3, 'A+': 12, 'A-': 2, 'B+': 7, 'B-': 1, 'AB+': 4, 'AB-': 0 },
    'Bağcılar': { '0+': 25, '0-': 10, 'A+': 32, 'A-': 8, 'B+': 18, 'B-': 4, 'AB+': 11, 'AB-': 3 },
    'Bahçelievler': { '0+': 18, '0-': 7, 'A+': 24, 'A-': 6, 'B+': 14, 'B-': 3, 'AB+': 9, 'AB-': 2 },
    'Bakırköy': { '0+': 30, '0-': 12, 'A+': 40, 'A-': 10, 'B+': 25, 'B-': 5, 'AB+': 15, 'AB-': 4 },
    'Başakşehir': { '0+': 12, '0-': 4, 'A+': 18, 'A-': 3, 'B+': 10, 'B-': 2, 'AB+': 6, 'AB-': 1 },
    'Bayrampaşa': { '0+': 9, '0-': 2, 'A+': 14, 'A-': 3, 'B+': 8, 'B-': 1, 'AB+': 5, 'AB-': 0 },
    'Beşiktaş': { '0+': 45, '0-': 18, 'A+': 52, 'A-': 15, 'B+': 35, 'B-': 8, 'AB+': 22, 'AB-': 6 },
    'Beykoz': { '0+': 5, '0-': 2, 'A+': 8, 'A-': 1, 'B+': 4, 'B-': 0, 'AB+': 2, 'AB-': 0 },
    'Beylikdüzü': { '0+': 14, '0-': 5, 'A+': 19, 'A-': 4, 'B+': 11, 'B-': 2, 'AB+': 7, 'AB-': 1 },
    'Beyoğlu': { '0+': 22, '0-': 8, 'A+': 28, 'A-': 7, 'B+': 16, 'B-': 4, 'AB+': 10, 'AB-': 3 },
    'Büyükçekmece': { '0+': 6, '0-': 2, 'A+': 9, 'A-': 1, 'B+': 5, 'B-': 0, 'AB+': 3, 'AB-': 0 },
    'Çatalca': { '0+': 2, '0-': 0, 'A+': 4, 'A-': 0, 'B+': 2, 'B-': 0, 'AB+': 1, 'AB-': 0 },
    'Çekmeköy': { '0+': 7, '0-': 2, 'A+': 11, 'A-': 2, 'B+': 6, 'B-': 1, 'AB+': 3, 'AB-': 0 },
    'Esenler': { '0+': 13, '0-': 4, 'A+': 17, 'A-': 3, 'B+': 9, 'B-': 2, 'AB+': 5, 'AB-': 1 },
    'Esenyurt': { '0+': 20, '0-': 8, 'A+': 26, 'A-': 6, 'B+': 15, 'B-': 3, 'AB+': 9, 'AB-': 2 },
    'Eyüpsultan': { '0+': 11, '0-': 3, 'A+': 16, 'A-': 4, 'B+': 9, 'B-': 2, 'AB+': 6, 'AB-': 1 },
    'Fatih': { '0+': 40, '0-': 15, 'A+': 48, 'A-': 12, 'B+': 30, 'B-': 7, 'AB+': 18, 'AB-': 5 },
    'Gaziosmanpaşa': { '0+': 10, '0-': 3, 'A+': 15, 'A-': 3, 'B+': 8, 'B-': 2, 'AB+': 5, 'AB-': 1 },
    'Güngören': { '0+': 8, '0-': 2, 'A+': 13, 'A-': 2, 'B+': 7, 'B-': 1, 'AB+': 4, 'AB-': 0 },
    'Kadıköy': { '0+': 50, '0-': 20, 'A+': 60, 'A-': 18, 'B+': 40, 'B-': 10, 'AB+': 25, 'AB-': 8 },
    'Kağıthane': { '0+': 12, '0-': 4, 'A+': 17, 'A-': 4, 'B+': 10, 'B-': 2, 'AB+': 6, 'AB-': 1 },
    'Kartal': { '0+': 28, '0-': 11, 'A+': 35, 'A-': 9, 'B+': 22, 'B-': 5, 'AB+': 13, 'AB-': 4 },
    'Küçükçekmece': { '0+': 16, '0-': 6, 'A+': 22, 'A-': 5, 'B+': 13, 'B-': 3, 'AB+': 8, 'AB-': 2 },
    'Maltepe': { '0+': 24, '0-': 9, 'A+': 30, 'A-': 8, 'B+': 19, 'B-': 4, 'AB+': 11, 'AB-': 3 },
    'Pendik': { '0+': 32, '0-': 13, 'A+': 42, 'A-': 11, 'B+': 26, 'B-': 6, 'AB+': 16, 'AB-': 4 },
    'Sancaktepe': { '0+': 9, '0-': 3, 'A+': 13, 'A-': 2, 'B+': 8, 'B-': 1, 'AB+': 5, 'AB-': 0 },
    'Sarıyer': { '0+': 18, '0-': 7, 'A+': 23, 'A-': 6, 'B+': 14, 'B-': 3, 'AB+': 9, 'AB-': 2 },
    'Silivri': { '0+': 4, '0-': 1, 'A+': 6, 'A-': 1, 'B+': 3, 'B-': 0, 'AB+': 2, 'AB-': 0 },
    'Sultanbeyli': { '0+': 8, '0-': 2, 'A+': 11, 'A-': 2, 'B+': 6, 'B-': 1, 'AB+': 4, 'AB-': 0 },
    'Sultangazi': { '0+': 11, '0-': 4, 'A+': 15, 'A-': 3, 'B+': 9, 'B-': 2, 'AB+': 5, 'AB-': 1 },
    'Şile': { '0+': 1, '0-': 0, 'A+': 2, 'A-': 0, 'B+': 1, 'B-': 0, 'AB+': 0, 'AB-': 0 },
    'Şişli': { '0+': 42, '0-': 16, 'A+': 50, 'A-': 14, 'B+': 32, 'B-': 8, 'AB+': 20, 'AB-': 5 },
    'Tuzla': { '0+': 12, '0-': 4, 'A+': 16, 'A-': 4, 'B+': 10, 'B-': 2, 'AB+': 6, 'AB-': 1 },
    'Ümraniye': { '0+': 30, '0-': 12, 'A+': 38, 'A-': 10, 'B+': 24, 'B-': 5, 'AB+': 15, 'AB-': 4 },
    'Üsküdar': { '0+': 38, '0-': 15, 'A+': 46, 'A-': 12, 'B+': 29, 'B-': 7, 'AB+': 17, 'AB-': 4 },
    'Zeytinburnu': { '0+': 14, '0-': 5, 'A+': 19, 'A-': 4, 'B+': 11, 'B-': 2, 'AB+': 7, 'AB-': 1 }
  };

  try {
    localStorage.setItem('stockData', JSON.stringify(seed));
  } catch (e) {}
  return seed;
};

const getInitialStockAlerts = () => {
  try {
    if (localStorage.getItem('urgency_v7') !== 'true') {
      localStorage.removeItem('stockAlerts');
      sessionStorage.removeItem('filterUrgency');
      localStorage.setItem('urgency_v7', 'true');
    }
  } catch (e) {}

  try {
    const data = localStorage.getItem('stockAlerts');
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed && parsed.length > 0) {
        const updatedParsed = parsed.map((p, index) => ({
          ...p,
          id: p.id || (Date.now() + index),
          protocolNumber: p.protocolNumber || `PRT-${Math.floor(10000 + Math.random() * 90000)}`
        }));
        localStorage.setItem('stockAlerts', JSON.stringify(updatedParsed));
        return updatedParsed;
      }
    }
  } catch (e) {}

  const now = new Date();
  const seed = [
    // Vatandaş İstekleri (otomatik Oluşturuldu: yanlış)
    {
      id: Date.now() - 3600000 * 2, // 2 hours ago
      bloodType: "A+",
      urgency: "Kritik",
      ilce: "Fatih",
      hastane: "İstanbul Üniversitesi Tıp Fakültesi",
      date: now.toLocaleDateString('tr-TR'),
      time: "12:15",
      requester: "Mehmet Yılmaz",
      requesterTc: "12345678901",
      requestType: "Kendim için",
      autoGenerated: false
    },
    {
      id: Date.now() - 3600000 * 5, // 5 hours ago
      bloodType: "0-",
      urgency: "Acil",
      ilce: "Kadıköy",
      hastane: "Kadıköy Devlet Hastanesi",
      date: now.toLocaleDateString('tr-TR'),
      time: "09:30",
      requester: "Ayşe Kaya",
      requesterTc: "98765432109",
      requestType: "Yakınım için",
      autoGenerated: false
    },
    {
      id: Date.now() - 3600000 * 12,
      bloodType: "B+",
      urgency: "Normal",
      ilce: "Şişli",
      hastane: "Şişli Hamidiye Etfal Hastanesi",
      date: new Date(Date.now() - 86400000).toLocaleDateString('tr-TR'), // Yesterday
      time: "18:45",
      requester: "Mustafa Çelik",
      requesterTc: "45678912301",
      requestType: "Kendim için",
      autoGenerated: false,
      protocolNumber: "PRT-6003"
    },
    // YENİ EKLENEN HASTANE KAN TALEPLERİ
    {
      id: Date.now() - 3600000 * 1,
      bloodType: "A+",
      urgency: "Kritik",
      ilce: "Başakşehir",
      hastane: "Çam ve Sakura Şehir Hastanesi",
      date: now.toLocaleDateString('tr-TR'),
      time: "10:00",
      requester: "Hastane Yönetimi",
      requesterTc: "00000000001",
      requestType: "Hastane Talebi",
      autoGenerated: false,
      protocolNumber: "PRT-10001"
    },
    {
      id: Date.now() - 3600000 * 2,
      bloodType: "AB-",
      urgency: "Acil",
      ilce: "Bakırköy",
      hastane: "Dr. Sadi Konuk Eğitim Araştırma Hastanesi",
      date: now.toLocaleDateString('tr-TR'),
      time: "11:30",
      requester: "Hastane Yönetimi",
      requesterTc: "00000000002",
      requestType: "Hastane Talebi",
      autoGenerated: false,
      protocolNumber: "PRT-10002"
    },
    {
      id: Date.now() - 3600000 * 3,
      bloodType: "0+",
      urgency: "Normal",
      ilce: "Pendik",
      hastane: "Pendik Devlet Hastanesi",
      date: now.toLocaleDateString('tr-TR'),
      time: "14:15",
      requester: "Hastane Yönetimi",
      requesterTc: "00000000003",
      requestType: "Hastane Talebi",
      autoGenerated: false,
      protocolNumber: "PRT-10003"
    },
    {
      id: Date.now() - 3600000 * 4,
      bloodType: "B-",
      urgency: "Kritik",
      ilce: "Ümraniye",
      hastane: "Ümraniye Eğitim ve Araştırma Hastanesi",
      date: now.toLocaleDateString('tr-TR'),
      time: "16:45",
      requester: "Hastane Yönetimi",
      requesterTc: "00000000004",
      requestType: "Hastane Talebi",
      autoGenerated: false,
      protocolNumber: "PRT-10004"
    },
    {
      id: Date.now() - 3600000 * 24,
      bloodType: "AB-",
      urgency: "Kritik",
      ilce: "Bakırköy",
      hastane: "Bakırköy Dr. Sadi Konuk Hastanesi",
      date: new Date(Date.now() - 86400000).toLocaleDateString('tr-TR'),
      time: "14:20",
      requester: "Zeynep Yıldız",
      requesterTc: "78912345601",
      requestType: "Yakınım için",
      autoGenerated: false
    },
    {
      id: Date.now() - 3600000 * 30,
      bloodType: "0+",
      urgency: "Acil",
      ilce: "Üsküdar",
      hastane: "Haydarpaşa Numune Hastanesi",
      date: new Date(Date.now() - 86400000 * 2).toLocaleDateString('tr-TR'), // 2 days ago
      time: "10:10",
      requester: "Ali Demir",
      requesterTc: "32165498701",
      requestType: "Kendim için",
      autoGenerated: false
    },
    {
      id: Date.now() - 3600000 * 48,
      bloodType: "A-",
      urgency: "Normal",
      ilce: "Ümraniye",
      hastane: "Ümraniye Eğitim Araştırma Hastanesi",
      date: new Date(Date.now() - 86400000 * 2).toLocaleDateString('tr-TR'),
      time: "15:30",
      requester: "Elif Öztürk",
      requesterTc: "15935725801",
      requestType: "Yakınım için",
      autoGenerated: false
    },
    {
      id: Date.now() - 3600000 * 60,
      bloodType: "B-",
      urgency: "Kritik",
      ilce: "Kartal",
      hastane: "Kartal Dr. Lütfi Kırdar Hastanesi",
      date: new Date(Date.now() - 86400000 * 3).toLocaleDateString('tr-TR'),
      time: "11:00",
      requester: "Fatma Aydın",
      requesterTc: "75395185201",
      requestType: "Kendim için",
      autoGenerated: false
    },

    // Hastane Talepleri (otomatik Oluşturuldu: true)
    {
      id: Date.now() - 3600000 * 1, // 1 hour ago
      bloodType: "0-",
      urgency: "Kritik",
      ilce: "Fatih",
      hastane: "İstanbul Üniversitesi Tıp Fakültesi",
      date: now.toLocaleDateString('tr-TR'),
      time: "13:30",
      autoGenerated: true
    },
    {
      id: Date.now() - 3600000 * 3, // 3 hours ago
      bloodType: "A+",
      urgency: "Acil",
      ilce: "Şişli",
      hastane: "Şişli Hamidiye Etfal Hastanesi",
      date: now.toLocaleDateString('tr-TR'),
      time: "11:20",
      autoGenerated: true
    },
    {
      id: Date.now() - 3600000 * 8,
      bloodType: "B+",
      urgency: "Normal",
      ilce: "Üsküdar",
      hastane: "Haydarpaşa Numune Hastanesi",
      date: now.toLocaleDateString('tr-TR'),
      time: "06:15",
      autoGenerated: true
    },
    {
      id: Date.now() - 3600000 * 15,
      bloodType: "AB+",
      urgency: "Kritik",
      ilce: "Kartal",
      hastane: "Kartal Dr. Lütfi Kırdar Hastanesi",
      date: new Date(Date.now() - 86400000).toLocaleDateString('tr-TR'),
      time: "22:10",
      autoGenerated: true
    },
    {
      id: Date.now() - 3600000 * 20,
      bloodType: "0+",
      urgency: "Acil",
      ilce: "Bakırköy",
      hastane: "Bakırköy Dr. Sadi Konuk Hastanesi",
      date: new Date(Date.now() - 86400000).toLocaleDateString('tr-TR'),
      time: "17:40",
      autoGenerated: true
    },
    {
      id: Date.now() - 3600000 * 26,
      bloodType: "A-",
      urgency: "Normal",
      ilce: "Başakşehir",
      hastane: "Başakşehir Çam ve Sakura Hastanesi",
      date: new Date(Date.now() - 86400000).toLocaleDateString('tr-TR'),
      time: "12:50",
      autoGenerated: true
    },
    {
      id: Date.now() - 3600000 * 36,
      bloodType: "B-",
      urgency: "Kritik",
      ilce: "Kadıköy",
      hastane: "Kadıköy Devlet Hastanesi",
      date: new Date(Date.now() - 86400000 * 2).toLocaleDateString('tr-TR'),
      time: "07:30",
      autoGenerated: true
    },
    {
      id: Date.now() - 3600000 * 42,
      bloodType: "0-",
      urgency: "Acil",
      ilce: "Pendik",
      hastane: "Pendik Devlet Hastanesi",
      date: new Date(Date.now() - 86400000 * 2).toLocaleDateString('tr-TR'),
      time: "01:20",
      autoGenerated: true
    },
    {
      id: Date.now() - 3600000 * 50,
      bloodType: "AB-",
      urgency: "Normal",
      ilce: "Beyoğlu",
      hastane: "Beyoğlu Devlet Hastanesi",
      date: new Date(Date.now() - 86400000 * 2).toLocaleDateString('tr-TR'),
      time: "19:00",
      autoGenerated: true
    },
    {
      id: Date.now() - 3600000 * 72,
      bloodType: "A+",
      urgency: "Kritik",
      ilce: "Ümraniye",
      hastane: "Ümraniye Eğitim Araştırma Hastanesi",
      date: new Date(Date.now() - 86400000 * 3).toLocaleDateString('tr-TR'),
      time: "15:45",
      autoGenerated: true
    }
  ];

  const seedWithProtocol = seed.map(s => ({
    ...s,
    protocolNumber: `PRT-${Math.floor(10000 + Math.random() * 90000)}`
  }));

  try {
    localStorage.setItem('stockAlerts', JSON.stringify(seedWithProtocol));
  } catch (e) {}
  return seedWithProtocol;
};

// Kimlik Doğrulama Jetonu için Axios Interceptor
axios.interceptors.request.use((config) => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch (e) {}
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 401'i işlemek için Axios Response Interceptor Yetkisiz
axios.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    // 401 Yetkisiz mesajı alırsak jeton geçersizdir veya süresi dolmuştur
    if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  }
  return Promise.reject(error);
});

// Ana Uygulama
const initialUsers = [
  {
    id: 2,
    name: 'Çetin Gürsoy',
    email: 'eren.34_2001@hotmail.com',
    phone: '05362246272',
    tc: '11111111111',
    bloodType: '0+',
    district: 'Şişli',
    gender: 'Erkek',
    role: 'Yönetici'
  }
];

const App = () => {
  const [usersList, setUsersList] = useState(() => {
    try {
      const saved = localStorage.getItem('usersList')
      return saved ? JSON.parse(saved) : initialUsers
    } catch { return initialUsers }
  })
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })

  const navigate = useNavigate()
  const location = useLocation()
  const [hasNewSupport, setHasNewSupport] = useState(false)

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
      if (user.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
      }
      
      // Yerel bildirim hedeflemeyi senkronize tutmak için kimliği doğrulanmış tüm kullanıcılar için kullanıcı listesini getir
      axios.get('/Admin/users')
        .then(res => {
          const mappedUsers = res.data.map(u => ({
            id: u.id,
            name: u.fullName,
            email: u.email,
            tc: u.tc,
            phone: u.phone,
            gender: u.gender || '',
            role: u.role === 'Admin' || u.role === 'Yönetici' ? 'Yönetici' : u.role === 'SubAdmin' ? 'SubAdmin' : 'Kullanıcı',
            bloodType: u.bloodTypeName,
            district: u.districtName,
            lastDonationDate: u.lastDonationDate || null
          }));
          setUsersList(mappedUsers);
        })
        .catch(err => console.error("Error fetching users:", err));
        
    } else {
      localStorage.removeItem('user')
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [user])

  useEffect(() => {
    localStorage.setItem('usersList', JSON.stringify(usersList))
  }, [usersList])

  useEffect(() => {
    // Alt Yöneticileri geçici olarak tohumlama
    axios.get('/Auth/force-seed-subadmin').catch(() => {});

    if (user && (user.role === 'Admin' || user.role === 'Yönetici' || user.role === 'SubAdmin')) {
      const fetchSupportStatus = async () => {
        try {
          const res = await axios.get('/Support/tickets');
          const tickets = res.data;
          
          const lastSeenTs = parseInt(localStorage.getItem('admin_last_seen_support_ts') || '0', 10);
          
          if (location.pathname === '/support') {
             setHasNewSupport(false);
             const maxTs = Math.max(...tickets.map(t => new Date(t.updatedAt).getTime()), 0);
             localStorage.setItem('admin_last_seen_support_ts', maxTs.toString());
          } else {
             // Yönetici için: Durum "Açık" olan ve son yaşadıklarından daha yeni güncellenmiş bir bilet varsa uyarı ver
             const hasNew = tickets.some(t => t.status === 'Open' && new Date(t.updatedAt).getTime() > lastSeenTs);
             if (hasNew) {
               setHasNewSupport(true);
             }
          }
        } catch (err) {
          console.error("Error fetching support tickets for admin navbar:", err);
        }
      };

      fetchSupportStatus();
      const intervalId = setInterval(fetchSupportStatus, 30000);
      return () => clearInterval(intervalId);
    }
  }, [user, location.pathname]);

  const showSidebar = user && user.role !== 'Admin' && user.role !== 'Yönetici' && user.role !== 'SubAdmin' && 
    (location.pathname === '/dashboard' || location.pathname === '/profile' || location.pathname === '/blood-requests' || location.pathname === '/my-requests' || location.pathname === '/support' || location.pathname === '/compatibility-guide');

  return (
    <div className="min-h-screen flex flex-col" style={showSidebar ? { height: '100vh', overflow: 'hidden' } : {}}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#f1f5f9',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
          }
        }}
      />

      {!showSidebar && (
        <nav className="glass sticky top-0 z-50">
          <div className="container" style={{ height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Sol: Logo ve İsim */}
            <Link to={user?.role === 'SubAdmin' ? "/dashboard" : "/"} className="flex items-center no-underline hover:opacity-90 transition-opacity" style={{ gap: '0.875rem', textDecoration: 'none' }}>
              <div className="bg-red-600 w-11 h-11 rounded-2xl flex items-center justify-center shadow-md">
                <Heart size={22} className="text-white fill-white" />
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>Hayat Ağı</span>
            </Link>

            {/* Sağ: Menü ve Profil Alanı */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>

              {/* Menü Linkleri */}
              {user && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  {user.role === 'Admin' || user.role === 'Yönetici' ? (
                    <>
                      <Link to="/" style={{ textDecoration: 'none', fontWeight: '600', color: location.pathname === '/' ? '#991b1b' : '#64748b', fontSize: '0.85rem', transition: 'color 0.2s' }}>Ana Sayfa</Link>
                      <Link to="/logistics" style={{ textDecoration: 'none', fontWeight: '600', color: location.pathname === '/logistics' ? '#991b1b' : '#64748b', fontSize: '0.85rem', transition: 'color 0.2s' }}>Lojistik</Link>
                      <Link to="/dashboard" style={{ textDecoration: 'none', fontWeight: '600', color: location.pathname === '/dashboard' ? '#991b1b' : '#64748b', fontSize: '0.85rem', transition: 'color 0.2s' }}>Yönetim Paneli</Link>
                      <Link 
                        to="/support" 
                        onClick={() => setHasNewSupport(false)}
                        style={{ position: 'relative', textDecoration: 'none', fontWeight: '600', color: location.pathname === '/support' ? '#991b1b' : '#64748b', fontSize: '0.85rem', transition: 'color 0.2s' }}
                      >
                        Destek Talepleri
                        {hasNewSupport && location.pathname !== '/support' && (
                          <span style={{ position: 'absolute', top: '-4px', right: '-10px', width: '8px', height: '8px', backgroundColor: '#e11d48', borderRadius: '50%', boxShadow: '0 0 0 2px #ffffff' }}></span>
                        )}
                      </Link>
                    </>
                  ) : user.role === 'SubAdmin' ? (
                    <>
                      <Link to="/" style={{ textDecoration: 'none', fontWeight: '600', color: location.pathname === '/' ? '#991b1b' : '#64748b', fontSize: '0.85rem', transition: 'color 0.2s' }}>Yeni Form</Link>
                      <Link to="/dashboard" style={{ textDecoration: 'none', fontWeight: '600', color: location.pathname === '/dashboard' ? '#991b1b' : '#64748b', fontSize: '0.85rem', transition: 'color 0.2s' }}>Yönetim Paneli</Link>
                      <Link 
                        to="/support" 
                        onClick={() => setHasNewSupport(false)}
                        style={{ position: 'relative', textDecoration: 'none', fontWeight: '600', color: location.pathname === '/support' ? '#991b1b' : '#64748b', fontSize: '0.85rem', transition: 'color 0.2s' }}
                      >
                        Destek Talepleri
                        {hasNewSupport && location.pathname !== '/support' && (
                          <span style={{ position: 'absolute', top: '-4px', right: '-10px', width: '8px', height: '8px', backgroundColor: '#e11d48', borderRadius: '50%', boxShadow: '0 0 0 2px #ffffff' }}></span>
                        )}
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/dashboard" style={{ textDecoration: 'none', fontWeight: '600', color: location.pathname === '/dashboard' || location.pathname === '/' ? '#991b1b' : '#64748b', fontSize: '0.85rem', transition: 'color 0.2s' }}>Ana Sayfa</Link>
                      <NavBloodRequestsLink pathname={location.pathname} />
                      <NavMyRequestsLink pathname={location.pathname} user={user} />
                    </>
                  )}
                  <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none', fontWeight: '600', color: location.pathname === '/profile' ? '#991b1b' : '#64748b', fontSize: '0.85rem', transition: 'color 0.2s' }}>
                    <User size={16} /> Profilim
                  </Link>
                </div>
              )}

              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '1px solid #e2e8f0', paddingLeft: '2rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', lineHeight: '1.2' }}>{user.fullName}</span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '500' }}>{user.role === 'Admin' || user.role === 'Yönetici' ? 'Yönetici' : user.role === 'SubAdmin' ? 'Yardımcı Admin' : 'Bağışçı'}</span>
                  </div>
                  <button
                    onClick={() => { setUser(null); navigate('/'); toast.success('Güvenli çıkış yapıldı'); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', transition: 'color 0.2s', padding: '0.25rem' }}
                    onMouseOver={e => e.currentTarget.style.color = '#ef4444'}
                    onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}
                    title="Çıkış Yap"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Link to="/login" style={{ textDecoration: 'none', color: '#0f172a', fontWeight: '600', fontSize: '0.85rem', marginRight: '1rem' }}>Giriş Yap</Link>
                  <Link to="/register" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.85rem' }}>Hemen Katıl</Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      )}

      {showSidebar ? (
        <UserLayout user={user} setUser={setUser}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard user={user} usersList={usersList} setUsersList={setUsersList} />} />
            <Route path="/profile" element={<Profile user={user} setUser={setUser} usersList={usersList} setUsersList={setUsersList} />} />
            <Route path="/blood-requests" element={user ? <KanTalepleri user={user} /> : <Home />} />
            <Route path="/my-requests" element={user ? <MyRequests user={user} /> : <Home />} />
            <Route path="/support" element={user ? <Support /> : <Home />} />
            <Route path="/compatibility-guide" element={user ? <CompatibilityGuide /> : <Home />} />
          </Routes>
        </UserLayout>
      ) : (
        <main className="flex-grow container" style={{ padding: location.pathname === '/' ? '0' : '3rem 0' }}>
          <Routes>
            <Route path="/" element={(user?.role === 'Admin' || user?.role === 'Yönetici' || user?.role === 'SubAdmin') ? <AdminDashboard user={user} usersList={usersList} setUsersList={setUsersList} /> : <Home />} />
            <Route path="/login" element={<Login setUser={setUser} usersList={usersList} />} />
            <Route path="/register" element={<Register setUser={setUser} usersList={usersList} setUsersList={setUsersList} />} />
            <Route path="/dashboard" element={<Dashboard user={user} usersList={usersList} setUsersList={setUsersList} />} />
            <Route path="/profile" element={<Profile user={user} setUser={setUser} usersList={usersList} setUsersList={setUsersList} />} />
            <Route path="/logistics" element={user?.role === 'Admin' ? <LogisticsDashboard /> : <Home />} />
            <Route path="/blood-requests" element={user ? <KanTalepleri user={user} /> : <Home />} />
            <Route path="/my-requests" element={user ? <MyRequests user={user} /> : <Home />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/support" element={(user?.role === 'Admin' || user?.role === 'Yönetici' || user?.role === 'SubAdmin') ? <AdminSupport /> : <Home />} />
            <Route path="/compatibility-guide" element={user ? <CompatibilityGuide /> : <Home />} />
          </Routes>
        </main>
      )}

      {!showSidebar && location.pathname !== '/' && (
        <footer className="glass" style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0, padding: '3rem 0', marginTop: 'auto' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2 opacity-70">
                <Heart size={20} className="text-red-500 fill-red-500" />
                <span className="font-bold text-lg text-slate-900">Hayat Ağı</span>
              </div>
            </div>
            <p style={{ color: '#475569', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Topluma umut olun, bir hayat kurtarın. Modern kan yönetim platformu.
            </p>
            <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
              &copy; {new Date().getFullYear()} Hayat Ağı Yönetim Sistemi. Tüm hakları saklıdır.
            </div>
          </div>
        </footer>
      )}
      <Chatbot />
    </div>
  )
}

// Navbar için bildirimler rozetli Kan Talepleri linki (sadece bağışçılar görür)
const NavBloodRequestsLink = ({ pathname }) => {
  const alerts = (() => {
    return getInitialStockAlerts();
  })();
  const count = alerts.length;
  const isActive = pathname === '/blood-requests';

  return (
    <Link
      to="/blood-requests"
      style={{
        textDecoration: 'none',
        fontWeight: '600',
        color: isActive ? '#991b1b' : '#64748b',
        fontSize: '0.85rem',
        transition: 'color 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        position: 'relative'
      }}
    >
      <Bell size={16} />
      Kan Talepleri
      {count > 0 && (
        <span style={{
          position: 'absolute',
          top: '-8px',
          right: '-12px',
          background: '#991b1b',
          color: 'white',
          borderRadius: '999px',
          fontSize: '0.65rem',
          fontWeight: '800',
          minWidth: '18px',
          height: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 4px',
          boxShadow: '0 2px 6px rgba(225,29,72,0.4)',
          animation: 'pulse 2s infinite'
        }}>
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
};

// Taleplerim için bildirim rozetli link
const NavMyRequestsLink = ({ pathname, user }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const isActive = pathname === '/my-requests';

  useEffect(() => {
    const checkUnread = () => {
      const msgs = JSON.parse(localStorage.getItem('bloodMessages') || '[]');
      const apps = JSON.parse(localStorage.getItem('bloodApplications') || '[]');

      // Kullanıcının dahil olduğu sohbetleri bul
      const myChatIds = [
        ...apps.filter(a => a.applicantTc === user.tc).map(a => `${a.alertId}_${a.applicantTc}`),
        ...apps.filter(a => a.requesterTc === user.tc).map(a => `${a.alertId}_${a.applicantTc}`)
      ];

      const count = msgs.filter(m =>
        myChatIds.includes(m.chatId) &&
        m.senderTc !== user.tc &&
        !(m.readBy || []).includes(user.tc)
      ).length;

      setUnreadCount(count);
    };

    checkUnread();
    const interval = setInterval(checkUnread, 3000);
    return () => clearInterval(interval);
  }, [user.tc]);

  return (
    <Link
      to="/my-requests"
      style={{
        textDecoration: 'none',
        fontWeight: '600',
        color: isActive ? '#991b1b' : '#64748b',
        fontSize: '0.85rem',
        transition: 'color 0.2s',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem'
      }}
    >
      <Mail size={16} />
      Taleplerim
      {unreadCount > 0 && (
        <span style={{
          position: 'absolute',
          top: '-8px',
          right: '-12px',
          background: '#991b1b',
          color: 'white',
          borderRadius: '999px',
          fontSize: '0.65rem',
          fontWeight: '800',
          minWidth: '18px',
          height: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 4px',
          boxShadow: '0 2px 6px rgba(225,29,72,0.4)'
        }}>
          {unreadCount}
        </span>
      )}
    </Link>
  );
};


// Kan Bağışı Yönetimi Modülleri

// Yardımcı Fonksiyonlar

const maskName = (name) => {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0];
  return [parts[0], ...parts.slice(1).map(p => p[0] + '*'.repeat(p.length - 1))].join(' ');
};

const maskPhone = (phone) => {
  if (!phone) return '';
  return phone.substring(0, 4) + '***' + phone.substring(phone.length - 4);
};

// Taleplerim Sayfası
const MyRequests = ({ user }) => {
  const [activeTab, setActiveTab] = useState('created'); // 'created', 'applied' or 'completed'
  const [myAlerts, setMyAlerts] = useState([]);
  const [myCompletedAlerts, setMyCompletedAlerts] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [myDirectDonations, setMyDirectDonations] = useState([]);
  const [allApps, setAllApps] = useState([]);
  const [activeChat, setActiveChat] = useState(null); // { chatId, otherPartyName }
  const [hasUnreadCreated, setHasUnreadCreated] = useState(false);
  const [hasUnreadApplied, setHasUnreadApplied] = useState(false);
  const [allMessages, setAllMessages] = useState([]);

  useEffect(() => {
    let backendDons = [];

    const fetchBackendDonations = async () => {
      try {
        const res = await axios.get('/User/activities');
        const logs = res.data || [];
        backendDons = logs
          .filter(l => l.actionType === 'DirectDonation')
          .map(l => {
            let details = { Hastane: 'Bilinmeyen Hastane', Ilce: 'Bilinmeyen', BloodType: 'Bilinmiyor' };
            try {
              details = JSON.parse(l.description);
            } catch(e) {}
            const dt = new Date(l.createdAt);
            return {
              id: l.id,
              tc: user.tc,
              bloodType: details.BloodType || 'Bilinmiyor',
              ilce: details.Ilce || 'Bilinmeyen',
              hastane: details.Hastane || 'Bilinmeyen Hastane',
              date: dt.toLocaleDateString('tr-TR'),
              time: dt.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
            };
          });
      } catch (e) {
        console.error("Error fetching direct donations", e);
      }
    };

    fetchBackendDonations();

    const checkMsgs = () => {
      const alerts = JSON.parse(localStorage.getItem('stockAlerts') || '[]');
      const apps = JSON.parse(localStorage.getItem('bloodApplications') || '[]');
      const msgs = JSON.parse(localStorage.getItem('bloodMessages') || '[]');
      const donations = JSON.parse(localStorage.getItem('donationList') || '[]');

      const created = alerts.filter(a => a.requesterTc === user.tc);
      const applied = apps.filter(ap => ap.applicantTc === user.tc);
      const directDonations = donations.filter(d => d.tc === user.tc);

      const approvedAlertIds = new Set(apps.filter(ap => ap.isApproved === true).map(ap => ap.alertId));
      const activeCreated = created.filter(a => !approvedAlertIds.has(a.id));
      const completedCreated = created.filter(a => approvedAlertIds.has(a.id));

      setMyAlerts(activeCreated);
      setMyCompletedAlerts(completedCreated);
      setMyApplications(applied);
      
      const localOnly = directDonations.filter(p => !backendDons.some(b => b.date === p.date && b.hastane === p.hastane));
      setMyDirectDonations([...backendDons, ...localOnly]);
      
      setAllApps(apps);
      setAllMessages(msgs);

      // Bildirim kontrolü
      const createdChatIds = apps.filter(a => a.requesterTc === user.tc).map(a => `${a.alertId}_${a.applicantTc}`);
      const appliedChatIds = applied.map(a => `${a.alertId}_${a.applicantTc}`);

      setHasUnreadCreated(msgs.some(m => createdChatIds.includes(m.chatId) && m.senderTc !== user.tc && !(m.readBy || []).includes(user.tc)));
      setHasUnreadApplied(msgs.some(m => appliedChatIds.includes(m.chatId) && m.senderTc !== user.tc && !(m.readBy || []).includes(user.tc)));
    };

    checkMsgs();
    const interval = setInterval(checkMsgs, 3000);
    return () => clearInterval(interval);
  }, [user.tc, activeChat]); // activeChat değiştiğinde de (okundu bilgisi için) tetiklensin

  useEffect(() => {
    if (activeTab === 'created') {
      const apps = JSON.parse(localStorage.getItem('bloodApplications') || '[]');
      let updated = false;
      const updatedApps = apps.map(ap => {
        if (ap.requesterTc === user.tc && ap.isReadByRequester === false) {
          ap.isReadByRequester = true;
          updated = true;
        }
        return ap;
      });
      if (updated) {
        localStorage.setItem('bloodApplications', JSON.stringify(updatedApps));
        setAllApps(updatedApps);
      }
    }
    if (activeTab === 'applied') {
      const msgs = JSON.parse(localStorage.getItem('bloodMessages') || '[]');
      let updated = false;
      const updatedMsgs = msgs.map(m => {
        if (
          m.senderTc !== user.tc &&
          !(m.readBy || []).includes(user.tc) &&
          (m.text.includes('Protokol Numarası') || m.text.includes('Doğrulama Kodu') || m.text.includes('başvurunuz için'))
        ) {
          updated = true;
          return { ...m, readBy: [...(m.readBy || []), user.tc] };
        }
        return m;
      });
      if (updated) {
        localStorage.setItem('bloodMessages', JSON.stringify(updatedMsgs));
        setAllMessages(updatedMsgs);
      }
    }
  }, [activeTab, myAlerts, myCompletedAlerts, user.tc]);

  const getApplicantsForAlert = (alertId) => {
    return allApps.filter(ap => ap.alertId === alertId);
  };

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {activeChat && (
        <ChatWindow
          user={user}
          chatId={activeChat.chatId}
          otherName={activeChat.otherName}
          onClose={() => setActiveChat(null)}
        />
      )}

      <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '12px', padding: '2.5rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'relative' }}>
          <h1 style={{ fontSize: '1.9rem', fontWeight: '900', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Activity size={32} style={{ color: '#991b1b' }} />
            Taleplerim ve Başvurularım
          </h1>
          <p style={{ margin: '0.5rem 0 0 0', opacity: 0.8, fontSize: '0.95rem' }}>Oluşturduğunuz kan taleplerini ve yaptığınız başvuruları buradan yönetin.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={() => setActiveTab('created')} style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: 'none', background: activeTab === 'created' ? '#991b1b' : '#ffffff', color: activeTab === 'created' ? '#ffffff' : '#64748b', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', position: 'relative' }}>
          Oluşturduğum Talepler ({myAlerts.length})
          {hasUnreadCreated && <span style={{ position: 'absolute', top: '10px', right: '15px', width: '10px', height: '10px', background: '#fbbf24', borderRadius: '50%', boxShadow: '0 0 10px rgba(251,191,36,0.5)' }} />}
        </button>
        <button onClick={() => setActiveTab('applied')} style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: 'none', background: activeTab === 'applied' ? '#991b1b' : '#ffffff', color: activeTab === 'applied' ? '#ffffff' : '#64748b', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', position: 'relative' }}>
          Yaptığım Başvurular ({myApplications.length})
          {hasUnreadApplied && <span style={{ position: 'absolute', top: '10px', right: '15px', width: '10px', height: '10px', background: '#fbbf24', borderRadius: '50%', boxShadow: '0 0 10px rgba(251,191,36,0.5)' }} />}
        </button>
        <button onClick={() => setActiveTab('completed')} style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: 'none', background: activeTab === 'completed' ? '#991b1b' : '#ffffff', color: activeTab === 'completed' ? '#ffffff' : '#64748b', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', position: 'relative' }}>
          Tamamlanan Transferler ({myCompletedAlerts.length + myDirectDonations.length})
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {activeTab === 'created' ? (
          myAlerts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>Henüz aktif bir talep oluşturmadınız.</div>
          ) : (
            myAlerts.map(alert => (
              <div key={alert.id} style={{ background: '#ffffff', borderRadius: '10px', padding: '2rem', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                      <span style={{ background: '#fef2f2', color: '#991b1b', padding: '0.25rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800' }}>{alert.bloodType}</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>{alert.date} {alert.time}</span>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>{alert.hastane}</h3>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.85rem' }}>{alert.ilce} - {alert.requestType}</p>
                  </div>
                  <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '700' }}>{getApplicantsForAlert(alert.id).length} Başvuru</div>
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#475569', marginBottom: '1rem' }}>Gelen Başvurular</h4>
                  {getApplicantsForAlert(alert.id).length === 0 ? (
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>Henüz başvuru gelmedi.</p>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                      {getApplicantsForAlert(alert.id).map(app => (
                        <div key={app.id} style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: '800', color: '#0f172a', marginBottom: '0.25rem', fontSize: '1rem' }}>{maskName(app.applicantName)}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>Kan Grubu: <span style={{ color: '#991b1b', fontWeight: '700' }}>{app.applicantBlood}</span></div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.8rem', fontWeight: '600' }}>
                              <Phone size={12} /> {maskPhone(app.applicantPhone)}
                            </div>
                          </div>
                          <button
                            onClick={() => setActiveChat({ chatId: `${app.alertId}_${app.applicantTc}`, otherName: app.applicantName })}
                            style={{ background: '#991b1b', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', position: 'relative' }}
                          >
                            <Mail size={14} /> Mesajlaş
                            {allMessages.some(m => m.chatId === `${app.alertId}_${app.applicantTc}` && m.senderTc !== user.tc && !(m.readBy || []).includes(user.tc)) && (
                              <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '10px', height: '10px', background: '#fbbf24', borderRadius: '50%', border: '2px solid white', boxShadow: '0 0 5px rgba(251,191,36,0.5)' }} />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )
        ) : activeTab === 'applied' ? (
          myApplications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>Henüz bir talebe başvuruda bulunmadınız.</div>
          ) : (
            myApplications.map(app => (
              <div key={app.id} style={{ background: '#ffffff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      {app.isApproved ? (
                         <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><CheckCircle size={14}/> KAN VERİLDİ / ONAYLANDI</span>
                      ) : app.status === 'Rejected' ? (
                         <span style={{ background: '#fef2f2', color: '#ef4444', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><XCircle size={14}/> BAŞVURU REDDEDİLDİ / İPTAL</span>
                      ) : (
                         <span style={{ background: '#fffbeb', color: '#d97706', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><AlertTriangle size={14}/> ⏳ Hastaneye gidip kan vermeniz bekleniyor</span>
                      )}
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>{app.date}</span>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>{app.alertHospital}</h3>
                    <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>{app.alertDistrict} - <strong style={{color: '#991b1b'}}>{app.alertBlood}</strong> İhtiyacı</p>
                    {app.requesterName && <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#475569' }}>Talep Sahibi: <strong>{maskName(app.requesterName)}</strong></p>}
                  </div>
                  
                  {app.requesterName && (
                    <div style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => setActiveChat({ chatId: `${app.alertId}_${app.applicantTc}`, otherName: app.requesterName })}
                        style={{ background: '#f8fafc', color: '#0f172a', border: '1px solid #e2e8f0', padding: '0.6rem 1rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.2s', position: 'relative' }}
                      >
                        <Mail size={16} /> Mesaj Gönder
                        {allMessages.some(m => m.chatId === `${app.alertId}_${app.applicantTc}` && m.senderTc !== user.tc && !(m.readBy || []).includes(user.tc)) && (
                          <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '10px', height: '10px', background: '#ef4444', borderRadius: '50%', border: '2px solid white', boxShadow: '0 0 5px rgba(239,68,68,0.5)' }} />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {!app.isApproved && app.status !== 'Rejected' && (
                  <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '1.5rem', border: '1px dashed #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Protokol Numarası</p>
                      <p style={{ margin: '0.2rem 0 0 0', fontSize: '1.25rem', fontWeight: '900', color: '#0f172a', letterSpacing: '1px' }}>{app.protocolNumber || 'PRT-X'}</p>
                    </div>
                    <div style={{ height: '40px', width: '1px', background: '#cbd5e1' }} className="hidden md:block"></div>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Doğrulama Kodu</p>
                      <p style={{ margin: '0.2rem 0 0 0', fontSize: '1.25rem', fontWeight: '900', color: '#991b1b', letterSpacing: '1px' }}>{app.verificationCode || 'DONOR-X'}</p>
                    </div>
                    <div style={{ height: '40px', width: '1px', background: '#cbd5e1' }} className="hidden md:block"></div>
                    <div style={{ flex: '1', minWidth: '200px' }}>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Lütfen hastaneye gittiğinizde görevliye protokol numarasını ve doğrulama kodunu iletin. Hastane onayı sonrası kan bağışınız sisteme işlenecektir.</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )
        ) : (
          (myCompletedAlerts.length === 0 && myDirectDonations.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '4rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>Tamamlanan transferiniz bulunmamaktadır.</div>
          ) : (
            <>
            {myCompletedAlerts.map(alert => (
              <div key={alert.id} style={{ background: '#ffffff', borderRadius: '10px', padding: '2rem', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', opacity: 0.9 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                      <span style={{ background: '#fef2f2', color: '#991b1b', padding: '0.25rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800' }}>{alert.bloodType}</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>{alert.date} {alert.time}</span>
                      <span style={{ background: '#ecfdf5', color: '#059669', padding: '0.25rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.2rem' }}><CheckCircle size={14}/> Onaylandı / Tamamlandı</span>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>{alert.hastane}</h3>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.85rem' }}>{alert.ilce} - {alert.requestType}</p>
                  </div>
                  <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '700' }}>{getApplicantsForAlert(alert.id).length} Başvuru</div>
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#475569', marginBottom: '1rem' }}>Tamamlanan Bağışçılar</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                    {getApplicantsForAlert(alert.id).map(app => (
                      <div key={app.id} style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: '800', color: '#0f172a', marginBottom: '0.25rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            {maskName(app.applicantName)} 
                            {app.isApproved && <span style={{ background: '#d1fae5', color: '#065f46', fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: '800' }}>BAĞIŞÇI</span>}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>Kan Grubu: <span style={{ color: '#991b1b', fontWeight: '700' }}>{app.applicantBlood}</span></div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.8rem', fontWeight: '600' }}>
                            <CheckCircle size={14} /> Kan Teslim Edildi
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveChat({ chatId: `${app.alertId}_${app.applicantTc}`, otherName: app.applicantName })}
                          style={{ background: '#f1f5f9', color: '#0f172a', border: '1px solid #e2e8f0', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', position: 'relative' }}
                        >
                          <Mail size={14} /> Mesajlaş
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {myDirectDonations.map(don => (
              <div key={don.id} style={{ background: '#ffffff', borderRadius: '10px', padding: '2rem', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', opacity: 0.9 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                      <span style={{ background: '#fef2f2', color: '#991b1b', padding: '0.25rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800' }}>{don.bloodType}</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>{don.date} {don.time}</span>
                      <span style={{ background: '#ecfdf5', color: '#059669', padding: '0.25rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.2rem' }}><CheckCircle size={14}/> KAN VERİLDİ</span>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>{don.hastane}</h3>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.85rem' }}>{don.ilce} - Doğrudan Bağış</p>
                  </div>
                </div>
              </div>
            ))}
            </>
          )
        )}
      </div>
    </div>
  );
};

const ChatWindow = ({ user, chatId, otherName, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    const loadMessages = () => {
      const allMsgs = JSON.parse(localStorage.getItem('bloodMessages') || '[]');
      const chatMsgs = allMsgs.filter(m => m.chatId === chatId);
      setMessages(chatMsgs);

      // Okundu olarak işaretle
      const updatedAll = allMsgs.map(m => {
        if (m.chatId === chatId && m.senderTc !== user.tc && !(m.readBy || []).includes(user.tc)) {
          return { ...m, readBy: [...(m.readBy || []), user.tc] };
        }
        return m;
      });
      localStorage.setItem('bloodMessages', JSON.stringify(updatedAll));

      // Okunmamış mesajlarını okundu işaretleriyle
      const localNotifs = JSON.parse(localStorage.getItem('user_notifications') || '[]');
      let notifsUpdated = false;
      const updatedNotifs = localNotifs.map(n => {
        if (n.chatId === chatId && n.receiverTc === user.tc && !n.isRead) {
          notifsUpdated = true;
          return { ...n, isRead: true };
        }
        return n;
      });
      if (notifsUpdated) {
        localStorage.setItem('user_notifications', JSON.stringify(updatedNotifs));
      }
    };
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [chatId, user.tc]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: Date.now(),
      chatId,
      senderTc: user.tc,
      senderName: user.fullName,
      text: inputText,
      readBy: [user.tc],
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };

    const allMsgs = JSON.parse(localStorage.getItem('bloodMessages') || '[]');
    localStorage.setItem('bloodMessages', JSON.stringify([...allMsgs, newMsg]));

    // Alıcıyı bildirmeyi gönder
    const apps = JSON.parse(localStorage.getItem('bloodApplications') || '[]');
    const [alertId, applicantTc] = chatId.split('_');
    const app = apps.find(a => a.alertId === Number(alertId) && a.applicantTc === applicantTc);
    if (app) {
      const receiverTc = user.tc === app.applicantTc ? app.requesterTc : app.applicantTc;
      const notifications = JSON.parse(localStorage.getItem('user_notifications') || '[]');
      notifications.push({
        id: Date.now(),
        receiverTc: receiverTc,
        message: `${user.fullName} size yeni bir mesaj gönderdi: "${inputText.length > 25 ? inputText.slice(0, 25) + '...' : inputText}"`,
        createdAt: new Date().toISOString(),
        isRead: false,
        type: 'message',
        chatId: chatId
      });
      localStorage.setItem('user_notifications', JSON.stringify(notifications));
    }

    setMessages(prev => [...prev, newMsg]);
    setInputText('');
  };

  const clearChat = () => {
    if (window.confirm('Sohbet geçmişini silmek istediğinize emin misiniz?')) {
      const allMsgs = JSON.parse(localStorage.getItem('bloodMessages') || '[]');
      const filtered = allMsgs.filter(m => m.chatId !== chatId);
      localStorage.setItem('bloodMessages', JSON.stringify(filtered));
      setMessages([]);
      toast.success('Sohbet geçmişi temizlendi.');
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', width: '360px', height: '500px', background: 'white', borderRadius: '10px', boxShadow: '0 10px 50px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', zIndex: 1000, border: '1px solid #f1f5f9' }}>
      <div style={{ padding: '1.25rem', background: '#0f172a', borderRadius: '24px 24px 0 0', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: '800' }}>{maskName(otherName)}</div>
            <div style={{ fontSize: '0.65rem', opacity: 0.7 }}>Kan Bağışı Yardımlaşma</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button onClick={clearChat} title="Sohbeti Temizle" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '0.5rem' }}><Trash2 size={16} /></button>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0.5rem' }}><X size={20} /></button>
        </div>
      </div>

      <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#f8fafc' }}>
        {messages.map(m => (
          <div key={m.id} style={{
            alignSelf: m.senderTc === user.tc ? 'flex-end' : 'flex-start',
            maxWidth: '80%',
            padding: '0.75rem 1rem',
            borderRadius: m.senderTc === user.tc ? '16px 16px 0 16px' : '16px 16px 16px 0',
            background: m.senderTc === user.tc ? '#991b1b' : 'white',
            color: m.senderTc === user.tc ? 'white' : '#0f172a',
            fontSize: '0.85rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            position: 'relative'
          }}>
            {m.text}
            <div style={{ fontSize: '0.6rem', opacity: 0.6, marginTop: '0.25rem', textAlign: 'right' }}>{m.time}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '0.4rem' }}>
        <input
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Mesajınızı yazın..."
          style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.85rem' }}
        />
        <button type="submit" style={{ background: '#991b1b', color: 'white', border: 'none', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ArrowRight size={18} />
        </button>
      </form>
    </div>
  );
};

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

// Kan Talepleri tam sayfası
const KanTalepleri = ({ user, isAdminView = false }) => {
  const [alerts, setAlerts] = useState(() => {
    return getInitialStockAlerts();
  });
  const [filterUrgency, setFilterUrgency] = useState(() => sessionStorage.getItem('filterUrgency') || 'Tümü');
  const [filterBlood, setFilterBlood] = useState(() => sessionStorage.getItem('filterBlood') || 'Tümü');
  const [filterSource, setFilterSource] = useState(() => sessionStorage.getItem('filterSource') || 'Tümü');
  const [filterDistrict, setFilterDistrict] = useState(() => sessionStorage.getItem('filterDistrict') || 'Tümü');
  const [filterDistance, setFilterDistance] = useState(() => sessionStorage.getItem('filterDistance') || 'Tümü');
  const [filterTime, setFilterTime] = useState(() => sessionStorage.getItem('filterTime') || 'Tümü');
  const [search, setSearch] = useState(() => sessionStorage.getItem('filterSearch') || '');

  useEffect(() => {
    sessionStorage.setItem('filterUrgency', filterUrgency);
  }, [filterUrgency]);

  useEffect(() => {
    sessionStorage.setItem('filterBlood', filterBlood);
  }, [filterBlood]);

  useEffect(() => {
    sessionStorage.setItem('filterSource', filterSource);
  }, [filterSource]);

  useEffect(() => {
    sessionStorage.setItem('filterDistrict', filterDistrict);
  }, [filterDistrict]);

  useEffect(() => {
    sessionStorage.setItem('filterDistance', filterDistance);
  }, [filterDistance]);

  useEffect(() => {
    sessionStorage.setItem('filterTime', filterTime);
  }, [filterTime]);

  useEffect(() => {
    sessionStorage.setItem('filterSearch', search);
  }, [search]);

  const handleApply = async (alert) => {
    if (alert.requesterTc === user.tc) {
      toast.error('Kendi talebinize başvuru yapamazsınız.');
      return;
    }

    const canDonate = user?.bloodType ? (BLOOD_COMPATIBILITY[user.bloodType] || []).includes(alert.bloodType) : true;
    if (!canDonate) {
      toast.error(`Kan grubunuz (${user?.bloodType}) bu talep (${alert.bloodType}) için uygun değildir.`);
      return;
    }

    // Bağış bekleme süresinin etkin olup olmadığını kontrol edin
    const parseDateToMs = (dStr) => {
      if (!dStr || dStr === 'Kayıt Bulunmuyor') return 0;
      if (typeof dStr === 'string' && dStr.includes('.') && !dStr.includes('-') && dStr.split('.').length === 3) {
        const parts = dStr.split('.');
        return new Date(parts[2], parts[1]-1, parts[0]).getTime();
      }
      const t = new Date(dStr).getTime();
      return isNaN(t) ? 0 : t;
    };

    const dates = [];
    const localUsers = JSON.parse(localStorage.getItem('usersList') || '[]');
    const currentUserData = localUsers.find(u => u.tc === user.tc) || user;
    if (currentUserData?.lastDonationDate) dates.push(currentUserData.lastDonationDate);
    if (user?.lastDonationDate) dates.push(user.lastDonationDate);
    
    try {
      const apps = JSON.parse(localStorage.getItem('bloodApplications') || '[]');
      const approvedApps = apps.filter(a => a.applicantTc === user.tc && a.status === 'Approved');
      approvedApps.forEach(a => dates.push(a.date));
    } catch (e) {}

    try {
      const donations = JSON.parse(localStorage.getItem('donationList') || '[]');
      const userDonations = donations.filter(d => d.tc === user?.tc);
      userDonations.forEach(d => dates.push(d.date));
    } catch (e) {}

    let maxMs = 0;
    let lastDateToUse = null;
    dates.forEach(d => {
      const ms = parseDateToMs(d);
      if (ms > maxMs) {
        maxMs = ms;
        lastDateToUse = d;
      }
    });

    if (lastDateToUse && lastDateToUse !== 'Kayıt Bulunmuyor') {
      let lastDonation;
      if (typeof lastDateToUse === 'string' && lastDateToUse.includes('.') && !lastDateToUse.includes('-') && lastDateToUse.split('.').length === 3) {
        const parts = lastDateToUse.split('.');
        lastDonation = new Date(parts[2], parts[1]-1, parts[0]);
      } else {
        lastDonation = new Date(lastDateToUse);
      }
      if (!isNaN(lastDonation.getTime())) {
        const daysToAdd = currentUserData.gender === 'Kadın' ? 120 : 90;
        const nextDate = new Date(lastDonation.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
        if (nextDate > new Date()) {
          const formattedNextDate = nextDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
          toast.error(`Kan bağışı bekleme süreniz henüz dolmamıştır. Güvenliğiniz için bir sonraki bağışınızı en erken ${formattedNextDate} tarihinde yapabilirsiniz.`);
          return;
        }
      }
    }

    const apps = JSON.parse(localStorage.getItem('bloodApplications') || '[]');
    const alreadyApplied = apps.some(a => a.alertId === alert.id && a.applicantTc === user.tc);

    if (alreadyApplied) {
      toast.error('Bu talebe zaten başvuru yaptınız.');
      return;
    }

    let dbAppId = null;
    let verificationCode = `DONOR-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      // Alert.id büyük bir zaman damgasıysa, ön uç alarm.id'yi veritabanı istek kimliği 1-25 ile eşleyin
      const dbRequestId = alert.id > 1000000 ? (Math.abs(Number(alert.id)) % 25) + 1 : alert.id;
      const response = await axios.post(`/DonationApplication?requestId=${dbRequestId}`);
      if (response.data) {
        dbAppId = response.data.id;
        if (response.data.verificationCode) {
          verificationCode = response.data.verificationCode;
        }
      }
    } catch (e) {
      console.error('Error posting to DonationApplication API:', e);
    }

    const newApp = {
      id: dbAppId || Date.now(),
      alertId: alert.id,
      protocolNumber: alert.protocolNumber,
      verificationCode: verificationCode,
      alertHospital: alert.hastane,
      alertDistrict: alert.ilce,
      alertBlood: alert.bloodType,
      requesterTc: alert.requesterTc,
      requesterName: alert.requester,
      applicantTc: user.tc,
      applicantName: user.fullName,
      applicantPhone: user.phone,
      applicantBlood: user.bloodType,
      status: 'Bekliyor',
      isApproved: false,
      isReadByRequester: false,
      date: new Date().toLocaleDateString('tr-TR'),
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };

    localStorage.setItem('bloodApplications', JSON.stringify([...apps, newApp]));

    // Başvuran bağışçıya otomatik olarak protokol ve ödeme kodu mesajı gönder
    const welcomeMsg = {
      id: Date.now() + 1,
      chatId: `${alert.id}_${user.tc}`,
      senderTc: alert.requesterTc,
      senderName: alert.requester,
      text: `Merhaba, kan bağışı başvurunuz için çok teşekkür ederim.\n\nHastane işlemleri için gereken bilgiler:\n\nProtokol Numarası:\n${alert.protocolNumber || 'PRT-X'}\n\nDoğrulama Kodu:\n${verificationCode}\n\nLütfen hastaneye gittiğinizde görevliye bu bilgileri iletiniz.`,
      readBy: [alert.requesterTc, user.tc],
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };
    const allMsgs = JSON.parse(localStorage.getItem('bloodMessages') || '[]');
    localStorage.setItem('bloodMessages', JSON.stringify([...allMsgs, welcomeMsg]));

    // Talep sahibine bildirim gönder (Sadece bireysel taleplerde)
    if (alert.requesterTc) {
      const notifications = JSON.parse(localStorage.getItem('user_notifications') || '[]');
      notifications.push({
        id: Date.now(),
        receiverTc: alert.requesterTc,
        message: `"${alert.hastane}" talebinize ${user.fullName} tarafından kan bağışı başvurusu yapıldı.`,
        createdAt: new Date().toISOString(),
        isRead: false,
        type: 'info'
      });
      localStorage.setItem('user_notifications', JSON.stringify(notifications));
    }

    toast.success(`${alert.hastane} için başvurunuz alındı! Hastaneye gitmeniz bekleniyor.`);
  };

  const KAN_GRUPLARI_ALL = ['0+', '0-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

  const normalizeDate = (dateVal) => {
    if (!dateVal) return '';
    if (dateVal instanceof Date) {
      return `${String(dateVal.getDate()).padStart(2, '0')}.${String(dateVal.getMonth() + 1).padStart(2, '0')}.${dateVal.getFullYear()}`;
    }
    let s = String(dateVal).replace(/\//g, '.');
    if (s.includes('-')) {
      const parts = s.split('T')[0].split('-');
      if (parts.length === 3) {
        return `${parts[2]}.${parts[1]}.${parts[0]}`;
      }
    }
    return s;
  };

  const filtered = alerts.filter(a => {
    let matchUrgency = false;
    if (filterUrgency === 'Tümü') {
      matchUrgency = true;
    } else {
      let itemUrgency = (a.urgency || '').trim();
      if (itemUrgency === 'Yüksek (Acil)') itemUrgency = 'Kritik';
      if (itemUrgency === 'Orta') itemUrgency = 'Acil';
      if (itemUrgency === 'Düşük') itemUrgency = 'Normal';
      
      matchUrgency = itemUrgency.toLowerCase() === filterUrgency.trim().toLowerCase();
    }
      
    const matchBlood = filterBlood === 'Tümü' || a.bloodType === filterBlood;
    const matchSearch = search === '' ||
      a.hastane?.toLowerCase().includes(search.toLowerCase()) ||
      a.ilce?.toLowerCase().includes(search.toLowerCase());

    const isHospital = a.autoGenerated === true || a.requestType === 'Hastane Talebi' || a.requester === 'Hastane Yönetimi';
    const canDonate = user?.bloodType ? (BLOOD_COMPATIBILITY[user.bloodType] || []).includes(a.bloodType) : true;

    const matchSource = filterSource === 'Tümü' ||
      (filterSource === 'Hastane' ? isHospital :
        filterSource === 'Vatandaş' ? !isHospital : canDonate);

    const matchDistrict = filterDistrict === 'Tümü' || a.ilce === filterDistrict;

    let matchDistance = true;
    if (filterDistance !== 'Tümü' && user?.district) {
      const dist = getDistance(user.district, a.ilce);
      if (filterDistance === '20+') {
        matchDistance = dist !== null && dist > 20;
      } else {
        const threshold = parseInt(filterDistance);
        matchDistance = dist !== null && dist <= threshold;
      }
    }

    let matchTime = true;
    if (filterTime !== 'Tümü') {
      const now = Date.now();
      const ageMs = now - a.id;
      if (filterTime === '1s') matchTime = ageMs <= 3600000;
      else if (filterTime === 'Bugün') matchTime = normalizeDate(a.date) === normalizeDate(new Date());
      else if (filterTime === 'Eski') matchTime = normalizeDate(a.date) !== normalizeDate(new Date());
    }

    return matchUrgency && matchBlood && matchSearch && matchSource && matchDistrict && matchDistance && matchTime;
  });
  const categories = [
    { id: 'Tümü', label: 'Tüm Talepler', icon: <Bell size={18} /> },
    { id: 'Hastane', label: 'Acil Hastane Kan Talepleri', icon: <Activity size={18} /> },
    { id: 'Vatandaş', label: 'Acil Vatandaş Kan Talebi', icon: <User size={18} /> }
  ];
  
  if (!isAdminView) {
    categories.push({ id: 'Uygun', label: 'Kan Verebileceğim Talepler', icon: <Heart size={18} /> });
  }

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Başlık */}
      <div style={{
        background: 'linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%)',
        borderRadius: '12px',
        padding: '2.5rem',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '30%', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.18)', borderRadius: '14px', padding: '0.75rem' }}>
              <Bell size={26} />
            </div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: '900', margin: 0, letterSpacing: '-0.02em' }}>Kan Talepleri</h1>
          </div>
          <p style={{ margin: 0, opacity: 0.85, fontSize: '0.95rem' }}>
            Tüm aktif acil kan talebi bildirimlerini buradan takip edebilirsiniz.
          </p>
          <div style={{ marginTop: '1.25rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '0.6rem 1.2rem', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertTriangle size={14} /> {alerts.length} Aktif Talep
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '0.6rem 1.2rem', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Activity size={14} /> Gerçek Zamanlı
            </div>
          </div>
        </div>
      </div>

      {/* Kategori Filtreleri */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilterSource(cat.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.85rem 1.75rem',
              borderRadius: '8px',
              border: 'none',
              background: filterSource === cat.id ? '#991b1b' : '#ffffff',
              color: filterSource === cat.id ? '#ffffff' : '#64748b',
              fontWeight: '700',
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: filterSource === cat.id ? '0 8px 20px rgba(225,29,72,0.2)' : '0 4px 12px rgba(0,0,0,0.03)',
              transition: 'all 0.2s'
            }}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>

      {/* Filtre Araçları */}
      <div style={{
        background: '#ffffff',
        borderRadius: '8px',
        padding: '1.25rem 1.5rem',
        border: '1px solid #f1f5f9',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        {/* Arama */}
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Hastane veya ilçe ara..."
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem 0.65rem 2.4rem',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '0.88rem',
              outline: 'none',
              background: '#f8fafc',
              color: '#0f172a',
              fontWeight: '500',
              boxSizing: 'border-box'
            }}
          />
        </div>
        {/* Aciliyet Filtresi */}
        <select
          value={filterUrgency}
          onChange={e => setFilterUrgency(e.target.value)}
          style={{ padding: '0.65rem 1rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc', fontSize: '0.88rem', fontWeight: '600', color: '#0f172a', outline: 'none', cursor: 'pointer' }}
        >
          <option value="Tümü">Tüm Aciliyetler</option>
          <option value="Kritik">Kritik</option>
          <option value="Acil">Acil</option>
          <option value="Normal">Normal</option>
        </select>
        {/* Kan Grubu Filtresi */}
        <select
          value={filterBlood}
          onChange={e => setFilterBlood(e.target.value)}
          style={{ padding: '0.65rem 1rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc', fontSize: '0.88rem', fontWeight: '600', color: '#0f172a', outline: 'none', cursor: 'pointer' }}
        >
          <option value="Tümü">Tüm Kan Grupları</option>
          {KAN_GRUPLARI_ALL.map(kg => <option key={kg} value={kg}>{kg}</option>)}
        </select>
        {/* İlçe Filtresi */}
        <select
          value={filterDistrict}
          onChange={e => setFilterDistrict(e.target.value)}
          style={{ padding: '0.65rem 1rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc', fontSize: '0.88rem', fontWeight: '600', color: '#0f172a', outline: 'none', cursor: 'pointer' }}
        >
          <option value="Tümü">Tüm İlçeler</option>
          {ISTANBUL_ILCELER.map(ilce => <option key={ilce} value={ilce}>{ilce}</option>)}
        </select>
        {/* Mesafe Filtresi */}
        <select
          value={filterDistance}
          onChange={e => setFilterDistance(e.target.value)}
          style={{ padding: '0.65rem 1rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc', fontSize: '0.88rem', fontWeight: '600', color: '#0f172a', outline: 'none', cursor: 'pointer' }}
        >
          <option value="Tümü">Tüm Mesafeler</option>
          <option value="5km">Bana En Yakın (5km)</option>
          <option value="10km">Yakın Çevre (10km)</option>
          <option value="20km">Orta Mesafe (20km)</option>
          <option value="20+">Uzak Bölgeler (20km+)</option>
        </select>
        {/* Zaman Filtresi */}
        <select
          value={filterTime}
          onChange={e => setFilterTime(e.target.value)}
          style={{ padding: '0.65rem 1rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc', fontSize: '0.88rem', fontWeight: '600', color: '#0f172a', outline: 'none', cursor: 'pointer' }}
        >
          <option value="Tümü">Tüm Zamanlar</option>
          <option value="1s">Son 1 Saat</option>
          <option value="Bugün">Bugün Açılanlar</option>
          <option value="Eski">Daha Eski Talepler</option>
        </select>

        {/* Sonuç sayısı */}
        <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '600', whiteSpace: 'nowrap' }}>
          {filtered.length} sonuç
        </div>
      </div>

      {/* Talepler Listesi */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <div style={{ width: '72px', height: '72px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <Bell size={32} style={{ color: '#991b1b' }} />
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
            {alerts.length === 0 ? 'Şu an için aktif kan talebi bulunmuyor' : 'Filtreye uyan sonuç bulunamadı'}
          </div>
          <div style={{ fontSize: '0.88rem', color: '#64748b' }}>
            {alerts.length === 0 ? 'Yöneticiler acil talep oluşturduğunda burada bildirim alacaksınız.' : 'Farklı filtreler deneyebilirsiniz.'}
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filtered.map((alert, index) => (
            <div
              key={`${alert.id}-${index}`}
              className="card relative overflow-hidden"
              style={{
                background: '#ffffff',
                padding: '2rem',
                borderRadius: '10px',
                boxShadow: '0 6px 30px rgba(0,0,0,0.04)',
                border: '1px solid rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 30px rgba(0,0,0,0.04)'; }}
            >
              {/* Sol kenar desteği */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '5px', height: '100%', background: 'linear-gradient(to bottom, #f43f5e, #991b1b)', borderRadius: '24px 0 0 24px' }} />

              {/* Üst: Aciliyet + Tarih */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', paddingLeft: '0.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: '800',
                    background: (alert.autoGenerated === true || alert.requestType === 'Hastane Talebi' || alert.requester === 'Hastane Yönetimi') ? '#fef2f2' : '#eff6ff',
                    color: (alert.autoGenerated === true || alert.requestType === 'Hastane Talebi' || alert.requester === 'Hastane Yönetimi') ? '#991b1b' : '#2563eb',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '8px',
                    textTransform: 'uppercase',
                    width: 'fit-content'
                  }}>
                    {(alert.autoGenerated === true || alert.requestType === 'Hastane Talebi' || alert.requester === 'Hastane Yönetimi') ? '🏥 Hastane' : '👤 Vatandaş'}
                  </span>
                  {(() => {
                    let displayUrgency = (alert.urgency || '').trim();
                    if (displayUrgency === 'Yüksek (Acil)') displayUrgency = 'Kritik';
                    if (displayUrgency === 'Orta') displayUrgency = 'Acil';
                    if (displayUrgency === 'Düşük') displayUrgency = 'Normal';

                    return (
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: '800',
                        background: displayUrgency === 'Kritik' ? '#fef2f2' : (displayUrgency === 'Acil' ? '#fff7ed' : '#f1f5f9'),
                        color: displayUrgency === 'Kritik' ? '#991b1b' : (displayUrgency === 'Acil' ? '#c2410c' : '#475569'),
                        padding: '0.35rem 0.75rem',
                        borderRadius: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        width: 'fit-content'
                      }}>
                        {displayUrgency === 'Kritik' ? '🚨 KRİTİK' : (displayUrgency === 'Acil' ? '⚡ ACİL' : '📋 NORMAL')}
                      </span>
                    );
                  })()}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#94a3b8', fontWeight: '600' }}>
                  <Activity size={13} />
                  <span>{alert.date} {alert.time}</span>
                </div>
              </div>

              {/* Hastane */}
              <h4 style={{ fontWeight: '800', fontSize: '1.2rem', marginBottom: '0.6rem', color: '#0f172a', lineHeight: '1.3', paddingLeft: '0.5rem' }}>
                {alert.hastane}
              </h4>

              {/* İlçe + Mesafe */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingLeft: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.88rem', fontWeight: '500' }}>
                  <MapPin size={14} style={{ color: '#991b1b' }} />
                  <span>{alert.ilce} İlçesi</span>
                </div>
                {user?.district && (
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#2563eb', background: '#eff6ff', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                    {getDistance(user.district, alert.ilce)} km mesafe
                  </div>
                )}
              </div>

              {/* Alt: Kan grubu + Başvuru */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid #f1f5f9', marginTop: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ background: '#fef2f2', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#991b1b', fontWeight: '900', fontSize: '1.05rem', border: '1px solid #fecdd3' }}>
                    {alert.bloodType}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Kan Grubu</span>
                    <span style={{ color: '#0f172a', fontWeight: '700', fontSize: '0.88rem' }}>İhtiyaç Var</span>
                  </div>
                </div>
                {!isAdminView && (
                  <button
                    style={{ background: 'linear-gradient(135deg, #991b1b, #7f1d1d)', color: 'white', border: 'none', padding: '0.65rem 1.1rem', fontSize: '0.82rem', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(225,29,72,0.25)', transition: 'opacity 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.opacity = '0.88'}
                    onMouseOut={e => e.currentTarget.style.opacity = '1'}
                    onClick={() => handleApply(alert)}
                  >
                    Başvur
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Login = ({ setUser, usersList }) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState(null)

  const handle = async (e) => {
    e.preventDefault()

    if (!recaptchaToken) {
      toast.error('Lütfen robot olmadığınızı doğrulayın.');
      return;
    }

    try {
      const response = await axios.post('/Auth/login', {
        email,
        password: pass
      });

      const data = response.data;

      const loggedUser = {
        fullName: data.fullName,
        email: data.email,
        tc: data.tc,
        phone: data.phone,
        gender: data.gender,
        bloodType: data.bloodType,
        district: data.district,
        role: data.role,
        userId: data.userId,
        token: data.token
      };

      // Axios varsayılan başlığını ayarlayın
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      setUser(loggedUser);
      toast.success(data.role === 'Admin' ? 'Yönetici girişi başarılı!' : 'Hoş geldiniz! Sayfanıza yönlendiriliyorsunuz.');
      navigate('/dashboard')
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error('E-posta veya şifre hatalı. Lütfen tekrar deneyin.');
      } else {
        toast.error('Giriş yapılırken bir hata oluştu.');
      }
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post('/Auth/google-login', { token: credentialResponse.credential });
      const data = res.data;
      const loggedUser = {
        fullName: data.fullName,
        email: data.email,
        tc: data.tc || '',
        phone: data.phone || '',
        gender: data.gender || '',
        bloodType: data.bloodType || '',
        district: data.district || '',
        role: data.role,
        userId: data.userId,
        token: data.token
      };
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(loggedUser);
      toast.success(data.role === 'Admin' ? 'Yönetici girişi başarılı!' : 'Google ile başarıyla giriş yaptınız!');
      navigate('/dashboard')
    } catch(err) {
      toast.error('Google ile giriş yapılırken bir hata oluştu.');
    }
  }

  return (
    <div className="animate-in" style={{ maxWidth: '440px', margin: '2rem auto' }}>
      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 10px 30px rgba(15,23,42,0.3)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '2rem', fontWeight: '800', color: '#ffffff' }}>Giriş Yap</h2>
        <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '2.5rem', fontSize: '0.85rem' }}>Hesabınıza erişmek için bilgilerinizi girin</p>

        <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>E-Posta Adresi</label>
            <input type="email" placeholder="ornek@eposta.com" value={email} onChange={e => setEmail(e.target.value)} required style={{ background: '#1e293b', border: '1px solid #334155', color: '#ffffff', outline: 'none', borderRadius: '8px', padding: '0.75rem 1rem', width: '100%' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>Şifre</label>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} required style={{ background: '#1e293b', border: '1px solid #334155', color: '#ffffff', outline: 'none', borderRadius: '8px', padding: '0.75rem 1rem', width: '100%', paddingRight: '2.5rem' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, display: 'flex', alignItems: 'center' }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'center' }}>
            <ReCAPTCHA
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              onChange={(token) => setRecaptchaToken(token)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', padding: '1rem', borderRadius: '12px', background: '#991b1b', color: 'white', fontWeight: '700' }}>Giriş Yap</button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem', color: '#94a3b8' }}>
          Hesabınız yok mu? <Link to="/register" style={{ color: '#ef4444', fontWeight: '600', textDecoration: 'none' }}>Kaydolun</Link>
        </div>
      </div>
    </div>
  )
}

const Register = ({ setUser, usersList, setUsersList }) => {
  const navigate = useNavigate()
  const [recaptchaToken, setRecaptchaToken] = useState(null)
  const [showKvkk, setShowKvkk] = useState(false)
  const [kvkkRead, setKvkkRead] = useState(false)

  const handle = async (e) => {
    e.preventDefault()

    if (!recaptchaToken) {
      toast.error('Lütfen robot olmadığınızı doğrulayın.');
      return;
    }

    const formData = new FormData(e.target);

    // KVKK Kontrolü
    if (!formData.get('kvkk')) {
      toast.error('Kayıt olmak için KVKK metnini onaylamanız gerekmektedir.');
      return;
    }

    const password = formData.get('password');
    const passwordConfirm = formData.get('passwordConfirm');

    if (password !== passwordConfirm) {
      toast.error('Şifreler eşleşmiyor. Lütfen kontrol edip tekrar deneyin.');
      return;
    }

    // Şifre Karmaşıklığı Regex: en az bir büyük harf, bir küçük harf, bir noktalama işareti/özel, en az 8 uzunluk
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error('Şifreniz en az 8 karakter uzunluğunda olmalı, en az bir büyük harf, bir küçük harf ve bir noktalama işareti/özel karakter içermelidir.');
      return;
    }

    const bloodTypeMap = { "A+": 1, "A-": 2, "B+": 3, "B-": 4, "AB+": 5, "AB-": 6, "0+": 7, "0-": 8 };
    const districtMap = { "Adalar": 1, "Arnavutköy": 2, "Ataşehir": 3, "Avcılar": 4, "Bağcılar": 5, "Bahçelievler": 6, "Bakırköy": 7, "Başakşehir": 8, "Bayrampaşa": 9, "Beşiktaş": 10, "Beykoz": 11, "Beylikdüzü": 12, "Beyoğlu": 13, "Büyükçekmece": 14, "Çatalca": 15, "Çekmeköy": 16, "Esenler": 17, "Esenyurt": 18, "Eyüpsultan": 19, "Fatih": 20, "Gaziosmanpaşa": 21, "Güngören": 22, "Kadıköy": 23, "Kağıthane": 24, "Kartal": 25, "Küçükçekmece": 26, "Maltepe": 27, "Pendik": 28, "Sancaktepe": 29, "Sarıyer": 30, "Silivri": 31, "Sultanbeyli": 32, "Sultangazi": 33, "Şile": 34, "Şişli": 35, "Tuzla": 36, "Ümraniye": 37, "Üsküdar": 38, "Zeytinburnu": 39 };

    const role = formData.get('title') || 'Donor';

    const registerData = {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      password: formData.get('password'),
      tc: formData.get('tcKimlik'),
      phone: formData.get('phone'),
      gender: formData.get('gender'),
      bloodTypeId: bloodTypeMap[formData.get('bloodType')] || 1,
      districtId: districtMap[formData.get('district')] || 1
    };

    try {
      const response = await axios.post('/Auth/register', registerData);
      
      const data = response.data;

      if (data.requiresEmailVerification) {
        toast.success('Kayıt başarılı! Lütfen e-postanıza gelen 6 haneli kodu girin.');
        navigate('/verify-email', { state: { email: registerData.email } });
        return;
      }

      const loggedUser = {
        fullName: data.fullName,
        email: data.email,
        tc: data.tc,
        phone: data.phone,
        gender: data.gender,
        bloodType: formData.get('bloodType'), // Response'ta boş string olabilir, formdan alalım
        district: formData.get('district'),
        role: data.role,
        userId: data.userId,
        token: data.token
      };

      // Axios varsayılan başlığını ayarlayın
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      setUser(loggedUser);
      toast.success('Kaydınız başarıyla tamamlandı!');
      navigate('/dashboard')

    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data || 'Kayıt başarısız, bilgilerinizi kontrol edin.');
      } else {
        toast.error('Kayıt olurken bir hata oluştu.');
      }
    }
  }

  return (
    <div className="animate-in" style={{ maxWidth: '560px', margin: '1.25rem auto' }}>
      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 10px 30px rgba(15,23,42,0.3)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.25rem', fontSize: '1.5rem', fontWeight: '800', color: '#ffffff' }}>Yeni Kayıt</h2>
        <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '1.2rem', fontSize: '0.8rem' }}>Kan bağışçısı topluluğuna eksiksiz katılın</p>

        <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>Ad Soyad</label>
              <input type="text" name="fullName" placeholder="Adınız ve Soyadınız" required onInput={(e) => e.target.value = e.target.value.replace(/[0-9]/g, '')} style={{ background: '#1e293b', border: '1px solid #334155', color: '#ffffff', outline: 'none', padding: '0.6rem 0.75rem', borderRadius: '8px', width: '100%', fontSize: '0.85rem' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>T.C. Kimlik Numarası</label>
              <input type="text" name="tcKimlik" placeholder="11 Haneli TC Kimlik" required minLength={11} maxLength={11} onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')} style={{ background: '#1e293b', border: '1px solid #334155', color: '#ffffff', outline: 'none', padding: '0.6rem 0.75rem', borderRadius: '8px', width: '100%', fontSize: '0.85rem' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>Telefon Numarası</label>
              <input type="text" name="phone" placeholder="05XX XXX XX XX" required maxLength={11} onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')} style={{ background: '#1e293b', border: '1px solid #334155', color: '#ffffff', outline: 'none', padding: '0.6rem 0.75rem', borderRadius: '8px', width: '100%', fontSize: '0.85rem' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>Cinsiyet</label>
              <select name="gender" required style={{ background: '#1e293b', border: '1px solid #334155', color: '#ffffff', outline: 'none', padding: '0.6rem 0.75rem', borderRadius: '8px', width: '100%', cursor: 'pointer', fontSize: '0.85rem' }}>
                <option value="" disabled style={{ background: '#1e293b', color: '#ffffff' }}>Seçiniz</option>
                <option style={{ background: '#1e293b', color: '#ffffff' }}>Erkek</option>
                <option style={{ background: '#1e293b', color: '#ffffff' }}>Kadın</option>
                <option style={{ background: '#1e293b', color: '#ffffff' }}>Belirtmek İstemiyorum</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>Kan Grubu</label>
              <select name="bloodType" required style={{ background: '#1e293b', border: '1px solid #334155', color: '#ffffff', outline: 'none', padding: '0.6rem 0.75rem', borderRadius: '8px', width: '100%', cursor: 'pointer', fontSize: '0.85rem' }}>
                <option value="" disabled style={{ background: '#1e293b', color: '#ffffff' }}>Seçiniz</option>
                <option style={{ background: '#1e293b', color: '#ffffff' }}>0+</option><option style={{ background: '#1e293b', color: '#ffffff' }}>0-</option><option style={{ background: '#1e293b', color: '#ffffff' }}>A+</option><option style={{ background: '#1e293b', color: '#ffffff' }}>A-</option>
                <option style={{ background: '#1e293b', color: '#ffffff' }}>B+</option><option style={{ background: '#1e293b', color: '#ffffff' }}>B-</option><option style={{ background: '#1e293b', color: '#ffffff' }}>AB+</option><option style={{ background: '#1e293b', color: '#ffffff' }}>AB-</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>Görev / Unvan</label>
              <input type="text" name="title" placeholder="Örn: Kullanıcı, Hemşire, Doktor" defaultValue="Kullanıcı" style={{ background: '#1e293b', border: '1px solid #334155', color: '#ffffff', outline: 'none', padding: '0.6rem 0.75rem', borderRadius: '8px', width: '100%', fontSize: '0.85rem' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>E-posta Adresi</label>
              <input type="email" name="email" placeholder="ornek@eposta.com" required style={{ background: '#1e293b', border: '1px solid #334155', color: '#ffffff', outline: 'none', padding: '0.6rem 0.75rem', borderRadius: '8px', width: '100%', fontSize: '0.85rem' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>Şifre</label>
              <input type="password" name="password" placeholder="••••••••" required style={{ background: '#1e293b', border: '1px solid #334155', color: '#ffffff', outline: 'none', padding: '0.6rem 0.75rem', borderRadius: '8px', width: '100%', fontSize: '0.85rem' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>Şifre Tekrar</label>
              <input type="password" name="passwordConfirm" placeholder="••••••••" required style={{ background: '#1e293b', border: '1px solid #334155', color: '#ffffff', outline: 'none', padding: '0.6rem 0.75rem', borderRadius: '8px', width: '100%', fontSize: '0.85rem' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>İlçe</label>
            <select name="district" required style={{ background: '#1e293b', border: '1px solid #334155', color: '#ffffff', outline: 'none', padding: '0.6rem 0.75rem', borderRadius: '8px', width: '100%', cursor: 'pointer', fontSize: '0.85rem' }}>
              <option value="" disabled style={{ background: '#1e293b', color: '#ffffff' }}>Seçiniz</option>
              {['Adalar', 'Arnavutköy', 'Ataşehir', 'Avcılar', 'Bağcılar', 'Bahçelievler', 'Bakırköy', 'Başakşehir', 'Bayrampaşa', 'Beşiktaş', 'Beykoz', 'Beylikdüzü', 'Beyoğlu', 'Büyükçekmece', 'Çatalca', 'Çekmeköy', 'Esenler', 'Esenyurt', 'Eyüpsultan', 'Fatih', 'Gaziosmanpaşa', 'Güngören', 'Kadıköy', 'Kağıthane', 'Kartal', 'Küçükçekmece', 'Maltepe', 'Pendik', 'Sancaktepe', 'Sarıyer', 'Silivri', 'Sultanbeyli', 'Sultangazi', 'Şile', 'Şişli', 'Tuzla', 'Ümraniye', 'Üsküdar', 'Zeytinburnu'].map(ilce => (
                <option key={ilce} value={ilce} style={{ background: '#1e293b', color: '#ffffff' }}>{ilce}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.1rem' }}>
            <input 
              type="checkbox" 
              name="kvkk" 
              id="kvkk" 
              style={{ width: '1rem', height: '1rem', accentColor: '#991b1b', background: '#1e293b', border: '1px solid #334155' }} 
              onClick={(e) => {
                if (!kvkkRead) {
                  e.preventDefault();
                  toast.error('Lütfen önce yanındaki bağlantıya tıklayarak KVKK Aydınlatma Metnini okuyun.');
                }
              }}
            />
            <label htmlFor="kvkk" style={{ fontSize: '0.8rem', color: '#94a3b8', cursor: 'pointer' }}>
              <a href="#" onClick={(e) => { e.preventDefault(); setShowKvkk(true); }} style={{ color: '#ef4444', textDecoration: 'none', fontWeight: '600' }}>KVKK Aydınlatma Metnini</a> okudum, kişisel verilerimin işlenmesini onaylıyorum.
            </label>
          </div>

          <div style={{ marginTop: '0.1rem', display: 'flex', justifyContent: 'center' }}>
            <ReCAPTCHA
              sitekey="6Lf7OvwsAAAAANynKid02T41fXq7HV5IU_gpzsV8"
              onChange={(token) => setRecaptchaToken(token)}
            />
          </div>

          <div style={{ marginTop: '0.1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '700', background: '#991b1b', color: 'white' }}>Kaydı Tamamla</button>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.1rem', fontSize: '0.8rem', color: '#94a3b8' }}>
          Zaten üye misiniz? <Link to="/login" style={{ color: '#ef4444', fontWeight: '600', textDecoration: 'none' }}>Giriş Yapın</Link>
        </div>
      </div>

      {/* KVKK Modeli */}
      {showKvkk && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#fff', padding: '2rem', borderRadius: '8px',
            maxWidth: '500px', width: '90%', maxHeight: '80vh', overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>KVKK Aydınlatma Metni</h3>
              <button onClick={() => setShowKvkk(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.6', marginBottom: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
              <p>Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verilerinizin işlenmesine ilişkin usul ve esasları belirlemek amacıyla hazırlanmıştır.</p>
              <br />
              <h4 style={{ fontWeight: '600', color: '#1e293b' }}>1. Veri Sorumlusunun Kimliği</h4>
              <p>Hayat Ağı Kan Yönetim Sistemi olarak kişisel verilerinizi veri sorumlusu sıfatıyla işlemekteyiz.</p>
              <br />
              <h4 style={{ fontWeight: '600', color: '#1e293b' }}>2. İşlenen Kişisel Verileriniz ve İşlenme Amaçları</h4>
              <p>Toplanan kişisel verileriniz (Ad, Soyad, TC Kimlik No, İletişim bilgileri, Kan grubu vb.), sadece kan bağışı süreçlerini güvenli ve sağlıklı bir şekilde yönetmek, acil kan ihtiyaçlarında size hızlıca ulaşabilmek ve yasal bildirim yükümlülüklerimizi yerine getirmek amacıyla işlenmektedir.</p>
              <br />
              <h4 style={{ fontWeight: '600', color: '#1e293b' }}>3. Kişisel Verilerinizin Aktarımı</h4>
              <p>Verileriniz, yüksek güvenlikli sunucularda saklanmakta olup, kanuni zorunluluklar ve yetkili kamu kurumlarının yasal talepleri haricinde hiçbir şekilde üçüncü kişi veya kurumlarla paylaşılmamaktadır.</p>
            </div>
            <button 
              onClick={() => {
                setKvkkRead(true);
                setShowKvkk(false);
                const kvkkCheckbox = document.getElementById('kvkk');
                if (kvkkCheckbox) kvkkCheckbox.checked = true;
              }}
              className="btn btn-primary" 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', fontWeight: '600' }}
            >
              Okudum, Onaylıyorum
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [code, setCode] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/Auth/verify-email', { email, code });
      toast.success('E-posta başarıyla doğrulandı! Şimdi giriş yapabilirsiniz.');
      navigate('/login');
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data);
      } else {
        toast.error('Doğrulama sırasında bir hata oluştu.');
      }
    }
  };

  return (
    <div className="animate-in" style={{ maxWidth: '440px', margin: '4rem auto' }}>
      <div className="card glass p-10">
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '1.8rem', fontWeight: '800', color: '#0f172a' }}>Mail Doğrulama</h2>
        <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2rem', fontSize: '0.85rem' }}>Lütfen e-posta adresinize gönderilen 6 haneli doğrulama kodunu girin.</p>

        <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: '500', color: '#475569', display: 'block', marginBottom: '0.75rem' }}>E-Posta Adresi</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: '500', color: '#475569', display: 'block', marginBottom: '0.75rem' }}>Doğrulama Kodu</label>
            <input type="text" placeholder="Örn: 123456" maxLength="6" value={code} onChange={e => setCode(e.target.value)} required style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' }} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', padding: '1rem' }}>Doğrula ve Devam Et</button>
        </form>
      </div>
    </div>
  );
};


const Dashboard = ({ user, usersList, setUsersList }) => {
  const [alerts, setAlerts] = useState(() => {
    return getInitialStockAlerts();
  });
  const [activeAdminTab, setActiveAdminTab] = useState('overview');

  const currentUserData = usersList.find(u => u.email === user?.email) || user;

  let nextDateText = 'Hemen yapabilirsiniz';
  let nextDateColor = '#16a34a'; // Green by default
  let nextDateBg = 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)';
  if (currentUserData?.lastDonationDate && currentUserData.lastDonationDate !== 'Kayıt Bulunmuyor') {
    let lastDate;
    if (typeof currentUserData.lastDonationDate === 'string' && currentUserData.lastDonationDate.includes('.') && !currentUserData.lastDonationDate.includes('-') && currentUserData.lastDonationDate.split('.').length === 3) {
      const parts = currentUserData.lastDonationDate.split('.');
      lastDate = new Date(parts[2], parts[1]-1, parts[0]);
    } else {
      lastDate = new Date(currentUserData.lastDonationDate);
    }
    if (!isNaN(lastDate.getTime())) {
      const daysToAdd = currentUserData.gender === 'Kadın' ? 120 : 90;
      const nextDate = new Date(lastDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

      if (nextDate > new Date()) {
        nextDateText = nextDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
        nextDateColor = '#991b1b'; // Red if waiting
        nextDateBg = 'linear-gradient(135deg, #fef2f2 0%, #ffe4e6 100%)';
      }
    }
  }

  const donationCount = (() => {
    try {
      const list = JSON.parse(localStorage.getItem('donationList') || '[]');
      return list.filter(d => d.tc === currentUserData?.tc).length;
    } catch { return 0; }
  })();

  const lastDonationDetails = (() => {
    try {
      const list = JSON.parse(localStorage.getItem('donationList') || '[]');
      const userDonations = list.filter(d => d.tc === currentUserData?.tc);
      if (userDonations.length > 0) {
        return userDonations[0];
      }
      return null;
    } catch { return null; }
  })();

  if (!user) return (
    <div className="animate-in" style={{ textAlign: 'center', padding: '10rem 0' }}>
      <div className="glass p-8 inline-block rounded-3xl">
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Panele erişmek için lütfen giriş yapın veya kayıt olun.</p>
        <div className="flex gap-4 justify-center mt-6">
          <Link to="/login" className="btn btn-primary">Giriş Yap</Link>
          <Link to="/register" className="btn btn-secondary">Kaydol</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="animate-in">
      {user.role === 'Admin' || user.role === 'Yönetici' || user.role === 'SubAdmin' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Yönetici Gezinme Sekmeleri */}
          <div style={{ display: 'flex', gap: '0.4rem', background: '#ffffff', padding: '0.75rem', borderRadius: '10px', flexWrap: 'wrap', justifyContent: 'center', border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 10px 40px rgba(0,0,0,0.02)', overflowX: 'auto' }}>

              <button 
                onClick={() => setActiveAdminTab('overview')} 
                style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', background: activeAdminTab === 'overview' ? '#991b1b' : 'transparent', color: activeAdminTab === 'overview' ? '#ffffff' : '#475569', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}>
                <LayoutDashboard size={18} /> Sistem Özeti
              </button>
            <button 
              onClick={() => setActiveAdminTab('users')} 
              style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', background: activeAdminTab === 'users' ? '#991b1b' : 'transparent', color: activeAdminTab === 'users' ? '#ffffff' : '#475569', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}>
              <Users size={18} /> Kullanıcı Yönetimi
            </button>
            {(user.role === 'Admin' || user.role === 'Yönetici') && (
              <button 
                onClick={() => setActiveAdminTab('logs')} 
                style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', background: activeAdminTab === 'logs' ? '#991b1b' : 'transparent', color: activeAdminTab === 'logs' ? '#ffffff' : '#475569', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}>
                <Activity size={18} /> Sistem Logları
              </button>
            )}
            <button 
              onClick={() => setActiveAdminTab('approvals')} 
              style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', background: activeAdminTab === 'approvals' ? '#991b1b' : 'transparent', color: activeAdminTab === 'approvals' ? '#ffffff' : '#475569', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}>
              <CheckCircle size={18} /> Onay Merkezi
            </button>
            <button 
              onClick={() => setActiveAdminTab('kanrotasi')} 
              style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', background: activeAdminTab === 'kanrotasi' ? '#991b1b' : 'transparent', color: activeAdminTab === 'kanrotasi' ? '#ffffff' : '#475569', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}>
              <Droplet size={18} /> Kan Rotası
            </button>
            <button 
              onClick={() => setActiveAdminTab('requests')} 
              style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', background: activeAdminTab === 'requests' ? '#991b1b' : 'transparent', color: activeAdminTab === 'requests' ? '#ffffff' : '#475569', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}>
              <Bell size={18} /> Kan Talepleri
            </button>
            {(user.role === 'Admin' || user.role === 'Yönetici') && (
              <>
                <button 
                  onClick={() => setActiveAdminTab('logistics')} 
                  style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', background: activeAdminTab === 'logistics' ? '#991b1b' : 'transparent', color: activeAdminTab === 'logistics' ? '#ffffff' : '#475569', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}>
                  <Truck size={18} /> Lojistik
                </button>
              </>
            )}
          </div>

          {/* Etkin Sekmeyi Oluştur */}
          <div className="animate-in">
            {activeAdminTab === 'overview' && <AdminDashboardOverview />}
            {activeAdminTab === 'users' && <UserManagement user={user} usersList={usersList} setUsersList={setUsersList} />}
            {activeAdminTab === 'logs' && <AuditLogs />}
            {activeAdminTab === 'approvals' && <RequestApprovals />}
            {activeAdminTab === 'kanrotasi' && <KanRotasi />}
            {activeAdminTab === 'requests' && <KanTalepleri user={user} isAdminView={true} />}
            {activeAdminTab === 'logistics' && <Logistics />}
          </div>

        </div>
      ) : (
        <UserDashboard user={user} />
      )}
    </div>
  )
}

const ISTANBUL_ILCELER = ['Adalar', 'Arnavutköy', 'Ataşehir', 'Avcılar', 'Bağcılar', 'Bahçelievler', 'Bakırköy', 'Başakşehir', 'Bayrampaşa', 'Beşiktaş', 'Beykoz', 'Beylikdüzü', 'Beyoğlu', 'Büyükçekmece', 'Çatalca', 'Çekmeköy', 'Esenler', 'Esenyurt', 'Eyüpsultan', 'Fatih', 'Gaziosmanpaşa', 'Güngören', 'Kadıköy', 'Kağıthane', 'Kartal', 'Küçükçekmece', 'Maltepe', 'Pendik', 'Sancaktepe', 'Sarıyer', 'Silivri', 'Sultanbeyli', 'Sultangazi', 'Şile', 'Şişli', 'Tuzla', 'Ümraniye', 'Üsküdar', 'Zeytinburnu'];

const KAN_GRUPLARI = ['0+', '0-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

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

const BloodRequestCreate = ({ user }) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAlert = {
      id: Date.now(),
      bloodType: formData.bloodType,
      urgency: formData.urgency,
      ilce: formData.district,
      hastane: formData.hospital,
      date: new Date().toLocaleDateString('tr-TR'),
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      requester: user?.fullName,
      requesterTc: user?.tc,
      requestType: formData.type,
      autoGenerated: false
    };

    try {
      const existing = JSON.parse(localStorage.getItem('stockAlerts') || '[]');
      localStorage.setItem('stockAlerts', JSON.stringify([newAlert, ...existing].slice(0, 50)));
      toast.success('Kan talebiniz oluşturuldu ve diğer bağışçılara iletildi!');
    } catch (e) {
      toast.error('Talep oluşturulurken bir hata oluştu.');
    }
  };

  return (
    <div className="glass" style={{ background: '#ffffff', borderRadius: '12px', padding: '2.5rem', marginBottom: '3rem', border: '1px solid #f1f5f9', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'rgba(153, 27, 27, 0.08)', padding: '0.75rem', borderRadius: '8px', color: '#991b1b' }}>
          <PlusCircle size={24} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Acil Kan Talebi Oluştur</h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>İhtiyaç anında diğer bağışçılardan yardım isteyin</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#475569', marginBottom: '0.5rem' }}>Kimin İçin?</label>
          <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: '600', outline: 'none' }}>
            <option>Kendim için</option>
            <option>Yakınım için</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#475569', marginBottom: '0.5rem' }}>İlçe</label>
          <select value={formData.district} onChange={e => setFormData({ ...formData, district: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: '600', outline: 'none' }}>
            {ISTANBUL_ILCELER.map(i => <option key={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#475569', marginBottom: '0.5rem' }}>Hastane</label>
          <input value={formData.hospital} onChange={e => setFormData({ ...formData, hospital: e.target.value })} placeholder="Hastane adı..." style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: '600', outline: 'none' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#475569', marginBottom: '0.5rem' }}>Kan Grubu</label>
          <select value={formData.bloodType} onChange={e => setFormData({ ...formData, bloodType: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: '600', outline: 'none' }}>
            {KAN_GRUPLARI.map(k => <option key={k}>{k}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#475569', marginBottom: '0.5rem' }}>Aciliyet</label>
          <select value={formData.urgency} onChange={e => setFormData({ ...formData, urgency: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: '600', outline: 'none' }}>
            <option value="Normal">Normal</option>
            <option value="Acil">Acil</option>
            <option value="Kritik">Kritik</option>
          </select>
        </div>
        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button onClick={handleSubmit} className="btn btn-primary" style={{ padding: '0.9rem 2.5rem', borderRadius: '14px', fontSize: '0.95rem', fontWeight: '800' }}>
            Talep Oluştur
          </button>
        </div>
      </div>
    </div>
  );
};

const StockHeatmap = ({ stockData, onDistrictSelect }) => {
  const districtStats = ISTANBUL_ILCELER.map(ilce => {
    const total = KAN_GRUPLARI.reduce((sum, kg) => sum + (stockData[ilce]?.[kg] ?? 0), 0);
    const bgList = KAN_GRUPLARI.map(kg => ({ kg, count: stockData[ilce]?.[kg] ?? 0 }));
    bgList.sort((a, b) => a.count - b.count);
    const bottom3 = bgList.slice(0, 3).map(b => b.kg).join(', ');
    let status = 'Normal';
    let bg = '#bbf7d0';
    let textColor = '#15803d';
    let sizeClass = 'small';
    let border = '1px solid #86efac';

    if (total < 10) {
      status = 'Kritik';
      bg = '#ef4444';
      textColor = 'white';
      sizeClass = 'large';
      border = '1px solid #dc2626';
    } else if (total < 30) {
      status = 'Orta';
      bg = '#fca5a5';
      textColor = '#7f1d1d';
      sizeClass = 'medium';
      border = '1px solid #f87171';
    }

    return { ilce, total, status, bg, textColor, sizeClass, border, bottom3 };
  });

  // Sırala: Önce kritik (daha düşük toplam), sonra Orta, sonra Normal
  districtStats.sort((a, b) => a.total - b.total);

  return (
    <div className="glass" style={{ background: '#ffffff', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
            <MapPin size={24} style={{ color: '#991b1b' }} />
            İstanbul Kan İhtiyaç Isı Haritası
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>İlçelere göre aktif talep ve düşük stok yoğunluğu</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#bbf7d0', border: '1px solid #86efac' }}></div> Normal
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#fca5a5', border: '1px solid #f87171' }}></div> Orta
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#ef4444', border: '1px solid #dc2626' }}></div> Kritik
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignContent: 'flex-start' }}>
        {districtStats.map(d => (
          <div key={d.ilce} style={{
            flexGrow: d.sizeClass === 'large' ? 4 : d.sizeClass === 'medium' ? 2 : 1,
            height: d.sizeClass === 'large' ? '100px' : d.sizeClass === 'medium' ? '70px' : '45px',
            minWidth: d.sizeClass === 'large' ? '140px' : d.sizeClass === 'medium' ? '90px' : '65px',
            background: d.bg,
            color: d.textColor,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            border: d.border,
            transition: 'transform 0.2s, filter 0.2s',
            cursor: 'pointer'
          }}
            onClick={() => onDistrictSelect && onDistrictSelect(d.ilce)}
            onMouseOver={e => e.currentTarget.style.filter = 'brightness(0.95)'}
            onMouseOut={e => e.currentTarget.style.filter = 'none'}
            title={`${d.ilce} - Toplam Stok: ${d.total} Ünite (En Az: ${d.bottom3})`}
          >
            <div style={{ fontWeight: '800', fontSize: d.sizeClass === 'large' ? '1rem' : '0.85rem', textAlign: 'center', padding: '0 0.5rem' }}>{d.ilce}</div>
            {d.sizeClass === 'large' && <div style={{ fontSize: '0.75rem', opacity: 0.9, marginTop: '0.2rem', fontWeight: '600' }}>{d.total} Ünite</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

const BloodStockFilter = ({ stockData }) => {
  const [selectedBlood, setSelectedBlood] = useState('Tümü');

  const list = ISTANBUL_ILCELER.map(ilce => {
    let count = 0;
    if (selectedBlood === 'Tümü') {
      count = KAN_GRUPLARI.reduce((sum, kg) => sum + (stockData[ilce]?.[kg] || 0), 0);
    } else {
      count = stockData[ilce]?.[selectedBlood] || 0;
    }
    return { ilce, count };
  });

  list.sort((a, b) => b.count - a.count);

  const topDistricts = list.filter(d => d.count > 0).slice(0, 6);
  const bottomDistricts = [...list].sort((a, b) => a.count - b.count).slice(0, 6);

  return (
    <div className="glass" style={{ background: '#ffffff', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
            <Filter size={20} style={{ color: '#2563eb' }} />
            Kan Grubu Bazlı Filtre
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>En çok ve en az bulunan ilçeler</p>
        </div>
        <select value={selectedBlood} onChange={(e) => setSelectedBlood(e.target.value)} style={{ padding: '0.6rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: '700', cursor: 'pointer', outline: 'none', color: '#0f172a' }}>
          <option value="Tümü">Tüm Kan Grupları</option>
          {KAN_GRUPLARI.map(kg => <option key={kg} value={kg}>{kg} Kan Grubu</option>)}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: '#f0fdf4', borderRadius: '8px', padding: '1.25rem', border: '1px solid #bbf7d0' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#16a34a', textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <TrendingUp size={16} /> En Fazla Stok
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {topDistricts.length > 0 ? topDistricts.map((d, i) => (
              <div key={d.ilce} style={{ display: 'flex', justifyContent: 'space-between', background: '#ffffff', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #dcfce7' }}>
                <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.85rem' }}>{i + 1}. {d.ilce}</span>
                <span style={{ fontWeight: '800', color: '#16a34a', fontSize: '0.85rem' }}>{d.count} Ünite</span>
              </div>
            )) : <div style={{ fontSize: '0.85rem', color: '#16a34a', fontStyle: 'italic' }}>Kayıtlı stok yok</div>}
          </div>
        </div>

        <div style={{ background: '#fef2f2', borderRadius: '8px', padding: '1.25rem', border: '1px solid #fecdd3' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#991b1b', textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <TrendingDown size={16} /> En Az Stok (Acil)
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {bottomDistricts.map((d, i) => (
              <div key={d.ilce} style={{ display: 'flex', justifyContent: 'space-between', background: '#ffffff', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #ffe4e6' }}>
                <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.85rem' }}>{i + 1}. {d.ilce}</span>
                <span style={{ fontWeight: '800', color: '#991b1b', fontSize: '0.85rem' }}>{d.count} Ünite</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// İstanbul ilçesinin yaklaşık GPS koordinatları
const ILCE_KOORDINATLARI = {
  'Adalar': [40.8762, 29.0879],
  'Arnavutköy': [41.1844, 28.7390],
  'Ataşehir': [40.9879, 29.1246],
  'Avcılar': [40.9797, 28.7218],
  'Bağcılar': [41.0398, 28.8558],
  'Bahçelievler': [40.9993, 28.8595],
  'Bakırköy': [40.9797, 28.8708],
  'Başakşehir': [41.0910, 28.8020],
  'Bayrampaşa': [41.0460, 28.9170],
  'Beyğoglu': [41.0338, 28.9770],
  'Beykoz': [41.1342, 29.0977],
  'Beylikdüzü': [40.9870, 28.6418],
  'Beşiktaş': [41.0432, 29.0078],
  'Büyükçekmece': [41.0199, 28.5862],
  'Çatalca': [41.1434, 28.4609],
  'Çekmeköy': [41.0390, 29.1817],
  'Esenler': [41.0441, 28.8781],
  'Esenyurt': [41.0360, 28.6750],
  'Eyüpsultan': [41.0669, 28.9342],
  'Fatih': [41.0167, 28.9397],
  'Güngören': [41.0213, 28.8710],
  'Gaziosmanpaşa': [41.0671, 28.9149],
  'Küçükçekmece': [41.0017, 28.7760],
  'Kağıthane': [41.0818, 28.9748],
  'Kadıköy': [40.9826, 29.0797],
  'Kartal': [40.9093, 29.1858],
  'Maltepe': [40.9342, 29.1314],
  'Pendik': [40.8798, 29.2317],
  'Sarıyer': [41.1680, 29.0556],
  'Sancaktepe': [41.0004, 29.2290],
  'Silivri': [41.0738, 28.2476],
  'Sultanbeyli': [40.9627, 29.2651],
  'Sultangazi': [41.1054, 28.8762],
  'Tuzla': [40.8167, 29.2996],
  'Üsküdar': [41.0233, 29.0152],
  'Ümraniye': [41.0228, 29.1183],
  'Zeytinburnu': [40.9952, 28.9006],
  'Şile': [41.1756, 29.6132],
  'Şişli': [41.0603, 28.9877],
};

const getDistance = (ilce1, ilce2) => {
  const R = 6371; // Earth radius km
  const c1 = ILCE_KOORDINATLARI[ilce1];
  const c2 = ILCE_KOORDINATLARI[ilce2];
  if (!c1 || !c2) return null;
  const dLat = (c2[0] - c1[0]) * Math.PI / 180;
  const dLon = (c2[1] - c1[1]) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(c1[0] * Math.PI / 180) * Math.cos(c2[0] * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return parseFloat((R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1));
};

const LogisticsDashboard = () => {
  const SURPLUS_THRESHOLD = 30;
  const CRITICAL_THRESHOLD = 5;
  const TRANSFER_AMOUNT = 5;

  const [stockData, setStockData] = useState(() => {
    return getInitialStockData();
  });
  const [completedTransfers, setCompletedTransfers] = useState(() => {
    try { return JSON.parse(localStorage.getItem('completedTransfers') || '[]'); } catch { return []; }
  });
  const [dismissedSuggestions, setDismissedSuggestions] = useState([]);

  // Transfer önerileri oluşturun: her kan grubu için fazlalık->mesafeyle zenginleştirilmiş kritik çiftleri bulun
  const suggestions = [];
  KAN_GRUPLARI.forEach(kg => {
    const surplusIlceler = ISTANBUL_ILCELER.filter(ilce => (stockData[ilce]?.[kg] || 0) >= SURPLUS_THRESHOLD);
    const criticalIlceler = ISTANBUL_ILCELER.filter(ilce => (stockData[ilce]?.[kg] || 0) < CRITICAL_THRESHOLD);
    criticalIlceler.forEach(receiver => {
      surplusIlceler.forEach(sender => {
        const suggestionId = `${sender}-${receiver}-${kg}`;
        if (!dismissedSuggestions.includes(suggestionId)) {
          const dist = getDistance(sender, receiver);
          suggestions.push({
            id: suggestionId,
            kg,
            sender,
            senderStock: stockData[sender]?.[kg] || 0,
            receiver,
            receiverStock: stockData[receiver]?.[kg] || 0,
            amount: TRANSFER_AMOUNT,
            distance: dist,
          });
        }
      });
    });
  });
  // Mesafeye göre sırala (önce en yakın)
  suggestions.sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999));

  const handleApprove = async (s) => {
    try {
      await axios.post('/Admin/stock-transfers', {
        sender: s.sender,
        receiver: s.receiver,
        kg: s.kg,
        amount: s.amount,
        distance: s.distance || 0
      });

      // Verileri yenile
      const [stocksRes, transfersRes] = await Promise.all([
        axios.get('/Admin/stocks'),
        axios.get('/Admin/stock-transfers')
      ]);
      setStockData(stocksRes.data);
      setCompletedTransfers(transfersRes.data);

      setDismissedSuggestions(prev => [...prev, s.id]);
      toast.success(`✅ Transfer onaylandı! ${s.sender} → ${s.receiver}: ${s.amount} Ünite ${s.kg}`, { duration: 4000 });
    } catch (err) {
      console.error(err);
      toast.error('Transfer işlemi başarısız oldu.');
    }
  };

  const handleDismiss = (id) => {
    setDismissedSuggestions(prev => [...prev, id]);
    toast(`Öneri reddedildi.`, { icon: '🚫', duration: 2000 });
  };

  const handleRefresh = async () => {
    try {
      const res = await axios.get('/Admin/stocks');
      setStockData(res.data);
      setDismissedSuggestions([]);
      toast.success('Stok verileri yenilendi!');
    } catch (err) {
      console.error(err);
      toast.error('Stok verileri alınamadı.');
    }
  };

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Başlık */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)', borderRadius: '10px', padding: '2.5rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: '-60px', right: '80px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', position: 'relative' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '0.6rem' }}>
                <Truck size={24} />
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: '900', margin: 0 }}>Lojistik Merkezi</h1>
            </div>
            <p style={{ margin: 0, opacity: 0.8, fontSize: '0.85rem' }}>Hastaneler arası kan transferi planlama ve onay sistemi</p>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', opacity: 0.85 }}>
                <AlertTriangle size={14} /> Kritik Eşik: &lt;{CRITICAL_THRESHOLD} Ünite
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', opacity: 0.85 }}>
                <TrendingUp size={14} /> Fazla Stok Eşiği: &gt;{SURPLUS_THRESHOLD} Ünite
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', opacity: 0.85 }}>
                <Truck size={14} /> Standart Transfer: {TRANSFER_AMOUNT} Ünite
              </div>
            </div>
          </div>
          <button onClick={handleRefresh} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '12px', color: 'white', padding: '0.75rem 1.25rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', transition: 'background 0.2s' }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}>
            <RefreshCw size={16} /> Yenile
          </button>
        </div>
      </div>

      {/* İstatistik satırı */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        <div style={{ background: '#fef2f2', borderRadius: '8px', padding: '1.25rem', border: '1px solid #fecdd3', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: '900', color: '#991b1b' }}>{suggestions.length}</div>
          <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#7f1d1d', marginTop: '0.25rem' }}>Bekleyen Öneri</div>
        </div>
        <div style={{ background: '#f0fdf4', borderRadius: '8px', padding: '1.25rem', border: '1px solid #bbf7d0', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: '900', color: '#16a34a' }}>{completedTransfers.length}</div>
          <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#15803d', marginTop: '0.25rem' }}>Tamamlanan Transfer</div>
        </div>
        <div style={{ background: '#eff6ff', borderRadius: '8px', padding: '1.25rem', border: '1px solid #bfdbfe', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: '900', color: '#1d4ed8' }}>{[...new Set(suggestions.map(s => s.kg))].length}</div>
          <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#1e40af', marginTop: '0.25rem' }}>Etkilenen Kan Grubu</div>
        </div>
      </div>

      {/* Aktarım önerileri */}
      <div style={{ background: '#ffffff', borderRadius: '10px', padding: '1.75rem', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <AlertTriangle size={20} style={{ color: '#f59e0b' }} /> Otomatik Transfer Önerileri
        </h2>

        {suggestions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div style={{ width: '64px', height: '64px', background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <CheckCircle size={32} style={{ color: '#16a34a' }} />
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>Şu an için acil transfer ihtiyacı yok</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Tüm ilçeler yeterli stok seviyesinde. Stoklar değiştikçe öneriler otomatik oluşacak.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {suggestions.map(s => (
              <div key={s.id} style={{ background: 'linear-gradient(to right, #fffbeb, #fff7ed)', borderRadius: '8px', padding: '1.25rem 1.5rem', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                {/* Kan Grubu Rozeti */}
                <div style={{ background: '#991b1b', color: 'white', borderRadius: '12px', padding: '0.75rem 1rem', fontWeight: '900', fontSize: '1.2rem', minWidth: '60px', textAlign: 'center', flexShrink: 0 }}>
                  {s.kg}
                </div>

                {/* Transfer Detayı */}
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#0f172a', marginBottom: '0.4rem' }}>
                    {getHastane(s.sender)} → {getHastane(s.receiver)}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                    <span style={{ fontSize: '0.8rem', background: '#dcfce7', color: '#16a34a', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: '700' }}>
                      {s.sender}: {s.senderStock} Ünite
                    </span>
                    <span style={{ fontSize: '0.8rem', background: '#ffe4e6', color: '#991b1b', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: '700' }}>
                      {s.receiver}: {s.receiverStock} Ünite
                    </span>
                    <span style={{ fontSize: '0.8rem', background: '#dbeafe', color: '#1d4ed8', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: '700' }}>
                      Transfer: {s.amount} Ünite
                    </span>
                    {s.distance !== null && (
                      <span style={{ fontSize: '0.8rem', background: '#fdf4ff', color: '#9333ea', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        {s.distance} km uzakta
                      </span>
                    )}
                  </div>
                </div>

                {/* Aksiyonlar */}
                <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                  <button onClick={() => handleDismiss(s.id)} style={{ background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.6rem 1rem', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer', color: '#64748b', transition: 'all 0.2s' }}
                    onMouseOver={e => { e.currentTarget.style.background = '#f1f5f9'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}>
                    Reddet
                  </button>
                  <button onClick={() => handleApprove(s)} style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', border: 'none', borderRadius: '10px', padding: '0.6rem 1.25rem', fontWeight: '800', fontSize: '0.82rem', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 12px rgba(22,163,74,0.3)', transition: 'all 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
                    onMouseOut={e => e.currentTarget.style.opacity = '1'}>
                    <CheckCircle size={14} /> Transferi Onayla
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tamamlanan Transferler Günlüğü */}
      {completedTransfers.length > 0 && (
        <div style={{ background: '#ffffff', borderRadius: '10px', padding: '1.75rem', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle size={20} style={{ color: '#16a34a' }} /> Tamamlanan Transferler
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {completedTransfers.map((t, i) => (
              <div key={t.id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', borderRadius: '12px', padding: '0.85rem 1.25rem', border: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ background: '#991b1b', color: 'white', borderRadius: '8px', padding: '0.2rem 0.6rem', fontWeight: '900', fontSize: '0.85rem' }}>{t.kg}</span>
                  <span style={{ fontWeight: '700', fontSize: '0.88rem', color: '#0f172a' }}>{t.sender} → {t.receiver}</span>
                  <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: '700' }}>{t.amount} Ünite aktarıldı</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>{t.date} {t.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const AdminDashboard = ({ user, usersList, setUsersList }) => {

  const [selectedIlce, setSelectedIlce] = useState('Fatih');

  // localStorage'dan başlat
  const [donationList, setDonationList] = useState(() => {
    try { return JSON.parse(localStorage.getItem('donationList') || '[]'); } catch { return []; }
  });
  const [stockData, setStockData] = useState({});

  useEffect(() => {
    axios.get('/Admin/stocks').then(res => setStockData(res.data)).catch(console.error);
  }, []);

  const [donorName, setDonorName] = useState('');
  const [donorTc, setDonorTc] = useState('');
  const [donorBlood, setDonorBlood] = useState('A+');

  const [alertBlood, setAlertBlood] = useState('0+');
  const [alertUrgency, setAlertUrgency] = useState('Acil');
  const [alertIlce, setAlertIlce] = useState('Fatih');

  const triggerAutoAlert = (ilce, kg, count) => {
    const existingStr = localStorage.getItem('stockAlerts') || '[]';
    let existing = JSON.parse(existingStr);

    if (count <= 1) {
      const alreadyHasAlert = existing.some(a => a.ilce === ilce && a.bloodType === kg && a.autoGenerated);
      if (!alreadyHasAlert) {
        const newAlert = {
          id: Date.now() + Math.random(),
          bloodType: kg,
          urgency: 'Kritik',
          ilce: ilce,
          hastane: getHastane(ilce),
          date: new Date().toLocaleDateString('tr-TR'),
          time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
          autoGenerated: true
        };
        const updated = [newAlert, ...existing].slice(0, 15);
        localStorage.setItem('stockAlerts', JSON.stringify(updated));
        toast.error(`⚠️ OTOMATİK ALARM: ${ilce} için ${kg} stoku kritik seviyede (${count} Ünite). Acil talep oluşturuldu!`, { duration: 5000 });
      }
    } else {
      const initialLength = existing.length;
      existing = existing.filter(a => !(a.ilce === ilce && a.bloodType === kg && a.autoGenerated));
      if (existing.length !== initialLength) {
        localStorage.setItem('stockAlerts', JSON.stringify(existing));
        toast.success(`✅ ${ilce} - ${kg} stoku güvenli seviyeye ulaştı. Otomatik alarm kaldırıldı.`, { duration: 3000 });
      }
    }
  };

  const getStock = (ilce, kg) => {
    const val = stockData[ilce]?.[kg];
    return val !== undefined ? val : 0;
  };

  const updateBackendStock = async (ilce, kg, units) => {
    try {
      await axios.post('/Admin/stocks/update', { district: ilce, bloodType: kg, units: units });
    } catch (err) {
      console.error(err);
      toast.error('Stok güncellenirken hata oluştu.');
    }
  };

  const setExactStock = (ilce, kg, val) => {
    setStockData(prev => {
      const ilceData = { ...(prev[ilce] || {}) };
      ilceData[kg] = val;
      return { ...prev, [ilce]: ilceData };
    });
    const numVal = val === '' ? 0 : parseInt(val, 10);
    if (!isNaN(numVal)) {
      updateBackendStock(ilce, kg, numVal);
      setTimeout(() => triggerAutoAlert(ilce, kg, numVal), 0);
    }
  };

  const adjustStock = (ilce, kg, delta) => {
    setStockData(prev => {
      const ilceData = { ...(prev[ilce] || {}) };
      const current = ilceData[kg] !== undefined && ilceData[kg] !== '' ? parseInt(ilceData[kg], 10) : 0;
      const newVal = Math.max(0, current + delta);
      ilceData[kg] = newVal;

      updateBackendStock(ilce, kg, newVal);
      setTimeout(() => triggerAutoAlert(ilce, kg, newVal), 0);

      return { ...prev, [ilce]: ilceData };
    });
  };

  const saveStock = async () => {
    // Önce localStorage'a kaydedin (yerel önbellek)
    localStorage.setItem('stockData', JSON.stringify(stockData));

    // Veri tabanına (pgAdmin/PostgreSQL) gönder
    try {
      // Backend'in beklediği format: { "İlçeAdı": { "A+": 10, "B+": 5, ... }, ... }
      // StockData zaten bu formatta, doğrudan iletebiliriz
      const payload = {};
      Object.keys(stockData).forEach(ilce => {
        payload[ilce] = {};
        KAN_GRUPLARI.forEach(kg => {
          const val = stockData[ilce]?.[kg];
          payload[ilce][kg] = val === '' || val === undefined ? 0 : parseInt(val, 10);
        });
      });

      await axios.put('/Admin/stocks', payload);
      toast.success('✅ Stok bilgileri veri tabanına (pgAdmin) başarıyla kaydedildi!');
    } catch (err) {
      console.error('Stok veri tabanına kaydedilemedi:', err);
      if (err?.response?.status === 401) {
        toast.error('⚠️ Yetkisiz erişim: Admin yetkisi gereklidir. Yerel kayıt yapıldı.');
      } else {
        toast.error('⚠️ Veri tabanına kaydedilemedi, sadece yerel kayıt yapıldı. Backend çalışıyor mu?');
      }
    }
  };

  const handleAddDonation = async (e) => {
    e.preventDefault();
    if (!donorName.trim() || !donorTc.trim()) return;

    // Ön uç bekleme süresini kontrol edin (handleApply ile aynı mantık)
    const parseDateToMs = (dStr) => {
      if (!dStr || dStr === 'Kayıt Bulunmuyor') return 0;
      if (typeof dStr === 'string' && dStr.includes('.') && !dStr.includes('-') && dStr.split('.').length === 3) {
        const parts = dStr.split('.');
        return new Date(parts[2], parts[1]-1, parts[0]).getTime();
      }
      const t = new Date(dStr).getTime();
      return isNaN(t) ? 0 : t;
    };

    const dates = [];
    const localUsers = JSON.parse(localStorage.getItem('usersList') || '[]');
    const currentUserData = localUsers.find(u => u.tc === donorTc);
    if (currentUserData?.lastDonationDate) dates.push(currentUserData.lastDonationDate);
    
    try {
      const apps = JSON.parse(localStorage.getItem('bloodApplications') || '[]');
      const approvedApps = apps.filter(a => a.applicantTc === donorTc && (a.status === 'Approved' || a.isApproved));
      approvedApps.forEach(a => dates.push(a.date));
    } catch (e) {}

    try {
      const donations = JSON.parse(localStorage.getItem('donationList') || '[]');
      const userDonations = donations.filter(d => d.tc === donorTc);
      userDonations.forEach(d => dates.push(d.date));
    } catch (e) {}

    let maxMs = 0;
    let lastDateToUse = null;
    dates.forEach(d => {
      const ms = parseDateToMs(d);
      if (ms > maxMs) {
        maxMs = ms;
        lastDateToUse = d;
      }
    });

    if (lastDateToUse && lastDateToUse !== 'Kayıt Bulunmuyor') {
      let lastDonation;
      if (typeof lastDateToUse === 'string' && lastDateToUse.includes('.') && !lastDateToUse.includes('-') && lastDateToUse.split('.').length === 3) {
        const parts = lastDateToUse.split('.');
        lastDonation = new Date(parts[2], parts[1]-1, parts[0]);
      } else {
        lastDonation = new Date(lastDateToUse);
      }
      if (!isNaN(lastDonation.getTime())) {
        const isFemale = currentUserData?.gender === 'Kadın';
        const daysToAdd = isFemale ? 120 : 90;
        const nextDate = new Date(lastDonation.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
        if (nextDate > new Date()) {
          const formattedNextDate = nextDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
          toast.error(`Bu bağışçının yasal bekleme süresi henüz dolmamıştır! Bir sonraki bağış tarihi: ${formattedNextDate}`);
          return;
        }
      }
    }

    const matchedUser = usersList.find(u => u.tc === donorTc);
    const finalName = matchedUser ? (matchedUser.name || matchedUser.fullName || donorName) : donorName;
    const finalBlood = matchedUser ? (matchedUser.bloodType || donorBlood) : donorBlood;

    let newLastDonationDate = new Date().toISOString();

    try {
      const response = await axios.post('/Admin/add-donation', {
        tc: donorTc,
        name: finalName,
        bloodType: finalBlood,
        ilce: selectedIlce,
        hastane: getHastane(selectedIlce)
      });
      if (response.data && response.data.lastDonationDate) {
        newLastDonationDate = response.data.lastDonationDate;
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        // Arka uçtan bekleme süresi hatası
        toast.error(typeof err.response.data === 'string' ? err.response.data : 'Bu bağışçının yasal bekleme süresi henüz dolmamıştır!');
        return;
      } else if (err.response && err.response.status === 404) {
        // Kullanıcı DB'de bulunamadı, yerel kaydetme işlemine devam edin
        console.warn('Bağışçı veritabanında bulunamadı, sadece yerel kayıt yapılıyor.');
      } else {
        toast.error('Bağış kaydedilirken sunucu hatası oluştu.');
        return;
      }
    }

    const newEntry = {
      id: Date.now(),
      name: finalName,
      tc: donorTc,
      bloodType: finalBlood,
      ilce: selectedIlce,
      hastane: getHastane(selectedIlce),
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('tr-TR')
    };
    const newList = [newEntry, ...donationList];
    setDonationList(newList);
    localStorage.setItem('donationList', JSON.stringify(newList));

    // Kullanıcılar listesindeki son bağış tarihini güncelleyin
    if (usersList && setUsersList) {
      setUsersList(prev => prev.map(u => u.tc === donorTc ? {
        ...u,
        lastDonationDate: newLastDonationDate
      } : u));
    }

    // Şu anda oturum açmış olan kullanıcı bu T.C. ile eşleşiyorsa, onun oturumunu da güncelleyin
    const loggedInUserStr = localStorage.getItem('user');
    if (loggedInUserStr) {
      try {
        const loggedInUser = JSON.parse(loggedInUserStr);
        if (loggedInUser && loggedInUser.tc === donorTc) {
          loggedInUser.lastDonationDate = newLastDonationDate;
          localStorage.setItem('user', JSON.stringify(loggedInUser));
          if (setUser && user && user.tc === donorTc) {
            setUser(loggedInUser);
          }
        }
      } catch (err) {
        console.error("Error updating logged in user session:", err);
      }
    }

    // finalBlood kullanarak stokları artırın ve hemen kaydedin
    setStockData(prev => {
      const ilceData = { ...(prev[selectedIlce] || {}) };
      ilceData[finalBlood] = Math.max(0, (ilceData[finalBlood] ?? 0) + 1);
      const next = { ...prev, [selectedIlce]: ilceData };
      localStorage.setItem('stockData', JSON.stringify(next));
      return next;
    });

    setDonorName('');
    setDonorTc('');
    setDonorBlood('A+');
    
    if (matchedUser) {
      toast.success(`Bağış kaydı T.C. ile eşleşti (${finalName} - ${finalBlood}) ve kaydedildi!`);
    } else {
      toast.success('Bağış kaydı stoğa eklendi ve kaydedildi!');
    }
  };

  const handleStockAlert = (e) => {
    e.preventDefault();
    const newAlert = {
      id: Date.now(),
      bloodType: alertBlood,
      urgency: alertUrgency,
      ilce: alertIlce,
      hastane: getHastane(alertIlce),
      date: new Date().toLocaleDateString('tr-TR'),
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      autoGenerated: true
    };
    const existing = JSON.parse(localStorage.getItem('stockAlerts') || '[]');
    localStorage.setItem('stockAlerts', JSON.stringify([newAlert, ...existing].slice(0, 10)));

    // Uyumlu bağışçılara bildirim gönder
    try {
      const usersList = JSON.parse(localStorage.getItem('usersList') || '[]');
      const notifications = JSON.parse(localStorage.getItem('user_notifications') || '[]');
      let notificationCount = 0;
      
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

      usersList.forEach(u => {
        const uBt = normalizeBT(u.bloodType);
        const aBt = normalizeBT(alertBlood);
        if ((u.role === 'Donor' || u.role === 'Kullanıcı') && uBt && BLOOD_COMPATIBILITY[uBt] && BLOOD_COMPATIBILITY[uBt].includes(aBt)) {
          if (isUserEligible(u)) {
            notifications.push({
              id: Date.now() + Math.random(),
              receiverTc: u.tc,
              message: `${getHastane(alertIlce)} hastanesinde sizin kan verebileceğiniz acil bir hasta bulunuyor. Kan grubunuz (${u.bloodType}) bu talep için uygundur!`,
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
        toast.success(`${alertIlce} için acil kan ihtiyacı bildirimi yayınlandı ve ${notificationCount} uygun bağışçıya bildirim gönderildi!`);
      } else {
        toast.success(`${alertIlce} için acil kan ihtiyacı bildirimi yayınlandı!`);
      }
    } catch (e) {
      toast.success(`${alertIlce} için acil kan ihtiyacı bildirimi yayınlandı!`);
    }
  };

  const labelStyle = { fontSize: '0.8rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.4rem' };
  const inputStyle = { background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.75rem 1rem', borderRadius: '10px', width: '100%', fontSize: '0.85rem', outline: 'none', color: '#0f172a' };
  const darkLabelStyle = { fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem' };
  const darkInputStyle = { background: '#1e293b', border: '1px solid #334155', padding: '0.75rem 1rem', borderRadius: '10px', width: '100%', fontSize: '0.85rem', outline: 'none', color: '#ffffff' };

  if (user?.role === 'SubAdmin') {
    return (
      <div className="admin-dashboard animate-in" style={{ paddingBottom: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 200px)' }}>
        
        {/* Modern Form Konteyner */}
        <div style={{ width: '100%', maxWidth: '600px', background: '#ffffff', borderRadius: '20px', padding: '2.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)' }}>
          
          {/* Başlık ve Hastane Seçimi */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: '#eff6ff', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={24} style={{ color: '#2563eb' }} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>{getHastane(selectedIlce)}</h2>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>{selectedIlce} Bölgesi</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <select value={selectedIlce} onChange={e => setSelectedIlce(e.target.value)} style={{ ...inputStyle, minWidth: '140px', background: '#f8fafc', fontWeight: '600', cursor: 'pointer', padding: '0.5rem 0.8rem', borderRadius: '8px' }}>
                {ISTANBUL_ILCELER.map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', margin: 0 }}>
            <UserRound size={18} style={{ color: '#2563eb' }} />
            Yeni Bağışçı Kaydı
          </h3>

          <form onSubmit={handleAddDonation} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={labelStyle}>Bağışçı Adı Soyadı</label>
              <input value={donorName} onChange={e => setDonorName(e.target.value)} placeholder="Örn: Ahmet Yılmaz" required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>T.C. Kimlik Numarası</label>
              <input value={donorTc} onChange={e => setDonorTc(e.target.value)} placeholder="11 haneli kimlik no" maxLength={11} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Kan Grubu</label>
              <select value={donorBlood} onChange={e => setDonorBlood(e.target.value)} style={{ ...inputStyle, cursor: 'pointer', fontWeight: '700' }}>
                {KAN_GRUPLARI.map(kg => <option key={kg}>{kg}</option>)}
              </select>
            </div>
            <button type="submit" style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', border: 'none', borderRadius: '12px', padding: '1rem', fontSize: '0.95rem', fontWeight: '800', cursor: 'pointer', boxShadow: '0 10px 20px rgba(37,99,235,0.2)', transition: 'all 0.2s', marginTop: '1rem' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
              Bağışı Kaydet ve Stoğa Ekle
            </button>
          </form>
        </div>

        {/* Stok Azaldı Bildirimi */}
        <div style={{ width: '100%', maxWidth: '600px', background: '#fef2f2', borderRadius: '20px', padding: '2.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.06)', border: '1px solid #ffe4e6' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#7f1d1d', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', margin: 0 }}>
            <Activity size={20} style={{ color: '#7f1d1d' }} />
            Stok Azaldı Bildirimi
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#9f1239', marginBottom: '1.5rem', lineHeight: '1.4' }}>Acil kan ihtiyacını diğer hastanelere ve platforma duyurun.</p>

          <form onSubmit={handleStockAlert} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={{ ...labelStyle, color: '#9f1239' }}>Kan Grubu</label>
              <select value={alertBlood} onChange={e => setAlertBlood(e.target.value)} style={{ ...inputStyle, background: '#ffffff', border: '1px solid #fecdd3', cursor: 'pointer', fontWeight: '700' }}>
                {KAN_GRUPLARI.map(kg => <option key={kg}>{kg}</option>)}
              </select>
            </div>
            <div>
              <label style={{ ...labelStyle, color: '#9f1239' }}>İlçe / Hastane</label>
              <select value={alertIlce} onChange={e => setAlertIlce(e.target.value)} style={{ ...inputStyle, background: '#ffffff', border: '1px solid #fecdd3', cursor: 'pointer', fontWeight: '700' }}>
                {ISTANBUL_ILCELER.map(ilce => <option key={ilce} value={ilce}>{ilce} - {getHastane(ilce)}</option>)}
              </select>
            </div>
            <div>
              <label style={{ ...labelStyle, color: '#9f1239' }}>Aciliyet</label>
              <select value={alertUrgency} onChange={e => setAlertUrgency(e.target.value)} style={{ ...inputStyle, background: '#ffffff', border: '1px solid #fecdd3', cursor: 'pointer', fontWeight: '700' }}>
                <option value="Kritik">Kritik</option>
                <option value="Acil">Acil</option>
                <option value="Normal">Normal</option>
              </select>
            </div>
            <button type="submit" style={{ background: '#991b1b', color: 'white', border: 'none', borderRadius: '12px', padding: '1rem', fontSize: '0.95rem', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 14px rgba(225,29,72,0.2)', transition: 'all 0.2s', marginTop: '0.5rem' }}>
              Talebi Yayınla
            </button>
          </form>
        </div>

      </div>
    );
  }

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '4rem' }}>

      {/* ── ÜST BAŞLIK: Hastane Seçimi ── */}
      <div style={{ background: '#ffffff', borderRadius: '10px', padding: '1.5rem 2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: '#991b1b', width: '56px', height: '56px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={28} style={{ color: 'white' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>{getHastane(selectedIlce)}</h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>{selectedIlce} Bölge Stok Yönetimi</p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>İLÇE DEĞİŞTİR</div>
          <select value={selectedIlce} onChange={e => setSelectedIlce(e.target.value)} style={{ ...inputStyle, minWidth: '200px', background: '#f8fafc', fontWeight: '600', cursor: 'pointer', padding: '0.6rem 1rem' }}>
            {ISTANBUL_ILCELER.map(i => <option key={i}>{i}</option>)}
          </select>
        </div>
      </div>

      {/* ── 1. GÜNCEL KAN STOKLARI (Tam Genişlik) ── */}
      <div style={{ background: '#ffffff', borderRadius: '10px', padding: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem', margin: 0 }}>
          <Droplets size={20} style={{ color: '#991b1b' }} />
          Güncel Kan Stokları
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
          {KAN_GRUPLARI.map(kg => {
            const count = getStock(selectedIlce, kg);
            const numCount = count === '' ? 0 : Number(count);

            let bgColor = '#f8fafc';
            let borderColor = '#e2e8f0';
            let textColor = '#0f172a';
            let labelColor = '#475569';
            let statusText = 'Orta';
            let statusBg = '#f1f5f9';
            let statusColor = '#64748b';

            if (numCount <= 5) {
              bgColor = '#fef2f2';
              borderColor = '#fecdd3';
              textColor = '#991b1b';
              labelColor = '#7f1d1d';
              statusText = 'Kritik (Acil)';
              statusBg = '#ffe4e6';
              statusColor = '#991b1b';
            } else if (numCount > 5 && numCount <= 15) {
              bgColor = '#fffbeb';
              borderColor = '#fde68a';
              textColor = '#d97706';
              labelColor = '#b45309';
              statusText = 'Orta';
              statusBg = '#fef3c7';
              statusColor = '#d97706';
            } else {
              bgColor = '#f0fdf4';
              borderColor = '#bbf7d0';
              textColor = '#16a34a';
              labelColor = '#15803d';
              statusText = 'Yeterli';
              statusBg = '#dcfce7';
              statusColor = '#16a34a';
            }

            return (
              <div key={kg} style={{ background: bgColor, borderRadius: '8px', padding: '1.25rem 1rem', textAlign: 'center', border: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', transition: 'all 0.3s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: '0.2rem' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: labelColor }}>{kg}</div>
                  <div style={{ fontSize: '0.65rem', fontWeight: '700', padding: '0.2rem 0.5rem', borderRadius: '8px', background: statusBg, color: statusColor, textTransform: 'uppercase' }}>{statusText}</div>
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  value={count}
                  onFocus={() => { if (numCount === 0) setExactStock(selectedIlce, kg, ''); }}
                  onBlur={() => { if (count === '') setExactStock(selectedIlce, kg, 0); }}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val === '') {
                      setExactStock(selectedIlce, kg, '');
                    } else {
                      setExactStock(selectedIlce, kg, parseInt(val, 10));
                    }
                  }}
                  style={{ width: '100%', textAlign: 'center', fontSize: '2.25rem', fontWeight: '900', color: textColor, lineHeight: '1', background: 'transparent', border: 'none', outline: 'none', padding: 0, margin: '0.5rem 0' }}
                />
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: 'auto', width: '100%' }}>
                  <button
                    onClick={() => adjustStock(selectedIlce, kg, -1)}
                    disabled={numCount === 0}
                    style={{ flex: 1, height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#ffffff', color: numCount === 0 ? '#cbd5e1' : '#64748b', fontSize: '1.2rem', fontWeight: '600', cursor: numCount === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: '1' }}
                  >−</button>
                  <button
                    onClick={() => adjustStock(selectedIlce, kg, 1)}
                    style={{ flex: 1, height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#ffffff', color: '#64748b', fontSize: '1.2rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: '1' }}
                  >+</button>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button
            onClick={saveStock}
            style={{ background: '#991b1b', color: 'white', border: 'none', borderRadius: '12px', padding: '0.75rem 2rem', fontSize: '0.85rem', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 14px rgba(225,29,72,0.2)' }}
          >
            Değişiklikleri Kaydet
          </button>
        </div>
      </div>

      {/* ── 2. ALT KİSİM (Isı Haritası ve Formlar) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>

        {/* SOL KOLON: Isı Haritası ve Filtre */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <StockHeatmap
            stockData={stockData}
            onDistrictSelect={(ilce) => {
              setSelectedIlce(ilce);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
          <BloodStockFilter stockData={stockData} />
        </div>

        {/* SAĞ KOLON: Formlar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Yeni Form - Kan Bağışı */}
          <div style={{ background: '#ffffff', borderRadius: '10px', padding: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem', margin: 0 }}>
              <UserRound size={20} style={{ color: '#2563eb' }} />
              Yeni Form - Kan Bağışı
            </h3>
            <form onSubmit={handleAddDonation} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={labelStyle}>Bağışçı Adı Soyadı</label>
                <input value={donorName} onChange={e => setDonorName(e.target.value)} placeholder="Örn: Ahmet Yılmaz" required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>T.C. Kimlik Numarası</label>
                <input value={donorTc} onChange={e => setDonorTc(e.target.value)} placeholder="11 haneli kimlik no" maxLength={11} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Kan Grubu</label>
                <select value={donorBlood} onChange={e => setDonorBlood(e.target.value)} style={{ ...inputStyle, cursor: 'pointer', fontWeight: '700' }}>
                  {KAN_GRUPLARI.map(kg => <option key={kg}>{kg}</option>)}
                </select>
              </div>
              <button type="submit" style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: '12px', padding: '1rem', fontSize: '0.95rem', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,0.2)', transition: 'all 0.2s', marginTop: '0.5rem' }}>
                Bağışı Kaydet ve Stoğa Ekle
              </button>
            </form>
          </div>

          {/* Stok Azaldı Bildirimi */}
          <div style={{ background: '#fef2f2', borderRadius: '10px', padding: '2rem', border: '1px solid #ffe4e6' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#7f1d1d', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', margin: 0 }}>
              <Activity size={20} style={{ color: '#7f1d1d' }} />
              Stok Azaldı Bildirimi
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#9f1239', marginBottom: '1.5rem', lineHeight: '1.4' }}>Acil kan ihtiyacını diğer hastanelere ve platforma duyurun.</p>

            <form onSubmit={handleStockAlert} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ ...labelStyle, color: '#9f1239' }}>Kan Grubu</label>
                <select value={alertBlood} onChange={e => setAlertBlood(e.target.value)} style={{ ...inputStyle, background: '#ffffff', border: '1px solid #fecdd3', cursor: 'pointer', fontWeight: '700' }}>
                  {KAN_GRUPLARI.map(kg => <option key={kg}>{kg}</option>)}
                </select>
              </div>
              <div>
                <label style={{ ...labelStyle, color: '#9f1239' }}>İlçe / Hastane</label>
                <select value={alertIlce} onChange={e => setAlertIlce(e.target.value)} style={{ ...inputStyle, background: '#ffffff', border: '1px solid #fecdd3', cursor: 'pointer', fontWeight: '700' }}>
                  {ISTANBUL_ILCELER.map(ilce => <option key={ilce} value={ilce}>{ilce} - {getHastane(ilce)}</option>)}
                </select>
              </div>
              <div>
                <label style={{ ...labelStyle, color: '#9f1239' }}>Aciliyet</label>
                <select value={alertUrgency} onChange={e => setAlertUrgency(e.target.value)} style={{ ...inputStyle, background: '#ffffff', border: '1px solid #fecdd3', cursor: 'pointer', fontWeight: '700' }}>
                  <option value="Kritik">Kritik</option>
                  <option value="Acil">Acil</option>
                  <option value="Normal">Normal</option>
                </select>
              </div>
              <button type="submit" style={{ background: '#991b1b', color: 'white', border: 'none', borderRadius: '12px', padding: '1rem', fontSize: '0.95rem', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 14px rgba(225,29,72,0.2)', transition: 'all 0.2s', marginTop: '0.5rem' }}>
                Talebi Yayınla
              </button>
            </form>
          </div>

        </div>
      </div>

    </div>
  )
}

export default App
