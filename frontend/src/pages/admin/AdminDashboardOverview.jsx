import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, Activity, Droplet, CheckCircle, 
  Clock, Hospital, TrendingUp, AlertTriangle 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { toast } from 'react-hot-toast';

const StatCard = ({ title, value, icon: Icon, trend, color, gradient }) => (
  <div className="card glass relative overflow-hidden" style={{ position: 'relative', overflow: 'hidden', background: '#ffffff', border: '1px solid rgba(0,0,0,0.03)', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
    <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: gradient, opacity: '0.1', borderRadius: '50%' }}></div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
        <Icon size={24} />
      </div>
      {trend && (
        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: trend > 0 ? '#10b981' : '#f43f5e', background: trend > 0 ? '#d1fae5' : '#ffe4e6', padding: '0.25rem 0.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <TrendingUp size={14} style={{ transform: trend < 0 ? 'scaleY(-1)' : 'none' }} />
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <div>
      <h3 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.25rem 0', lineHeight: '1' }}>{value}</h3>
      <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0, fontWeight: '500' }}>{title}</p>
    </div>
  </div>
);

const AdminDashboardOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/Admin/stats');
        setStats(response.data);
      } catch (error) {
        toast.error('İstatistikler yüklenemedi.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="animate-in" style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#991b1b', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6'];

  return (
    <div className="animate-in" style={{ paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>Sistem Özeti</h1>
        <p style={{ color: '#64748b', fontSize: '1rem' }}>Gerçek zamanlı platform istatistikleri ve genel durum.</p>
      </div>

      {/* En İyi İstatistik Kartları */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <StatCard title="Toplam Kullanıcı" value={stats.totalUsers} icon={Users} color="#3b82f6" gradient="radial-gradient(circle, #3b82f6 0%, transparent 70%)" trend={12} />
        <StatCard title="Aktif Kan Talebi" value={stats.activeRequests} icon={Activity} color="#991b1b" gradient="radial-gradient(circle, #991b1b 0%, transparent 70%)" trend={5} />
        <StatCard title="Bugünkü Başvuru" value={stats.todayApplications} icon={Droplet} color="#8b5cf6" gradient="radial-gradient(circle, #8b5cf6 0%, transparent 70%)" trend={-2} />
        <StatCard title="Kritik Kan Grubu" value={stats.criticalBloodTypeCount} icon={AlertTriangle} color="#f59e0b" gradient="radial-gradient(circle, #f59e0b 0%, transparent 70%)" trend={8} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <StatCard title="Tamamlanan Bağış" value={stats.totalDonationsCompleted} icon={CheckCircle} color="#10b981" gradient="radial-gradient(circle, #10b981 0%, transparent 70%)" />
        <StatCard title="Bekleyen Onay" value={stats.pendingApprovals} icon={Clock} color="#f97316" gradient="radial-gradient(circle, #f97316 0%, transparent 70%)" />
        <StatCard title="Aktif Hastane" value={stats.totalHospitals} icon={Hospital} color="#06b6d4" gradient="radial-gradient(circle, #06b6d4 0%, transparent 70%)" />
        <StatCard title="Günlük Trafik" value={stats.dailySystemTraffic} icon={Activity} color="#64748b" gradient="radial-gradient(circle, #64748b 0%, transparent 70%)" />
      </div>

      {/* Grafik Alanı */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Kan Grubu Dağılımı */}
        <div className="card glass" style={{ background: '#ffffff', borderRadius: '10px', padding: '2rem', border: '1px solid rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem' }}>Kan Grubu Dağılımı</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.bloodTypeDistribution} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value">
                  {stats.bloodTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Günlük Uygulama Trendi */}
        <div className="card glass" style={{ background: '#ffffff', borderRadius: '10px', padding: '2rem', border: '1px solid rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem' }}>Haftalık Başvuru Trendi</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.dailyApplications} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#991b1b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#991b1b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="applications" name="Başvuru" stroke="#991b1b" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bölge Talebi */}
        <div className="card glass" style={{ background: '#ffffff', borderRadius: '10px', padding: '2rem', border: '1px solid rgba(0,0,0,0.03)', gridColumn: '1 / -1' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem' }}>Bölgelere Göre Talep Yoğunluğu (Top 5)</h3>
          <div style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.districtDemand} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="demand" name="Talep Sayısı" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboardOverview;
