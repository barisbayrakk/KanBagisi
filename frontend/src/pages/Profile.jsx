import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Save, Loader } from 'lucide-react';

import ProfileCompletionCard from '../components/profile/ProfileCompletionCard';
import ProfileSummaryCard from '../components/profile/ProfileSummaryCard';
import PersonalInfoForm from '../components/profile/PersonalInfoForm';
import DonationEligibilityForm from '../components/profile/DonationEligibilityForm';
import EmergencyContactForm from '../components/profile/EmergencyContactForm';
import PrivacySettings from '../components/profile/PrivacySettings';
import SecuritySettings from '../components/profile/SecuritySettings';
import ProfileActivityTimeline from '../components/profile/ProfileActivityTimeline';

const Profile = ({ user: globalUser, setUser: setGlobalUser }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [activities, setActivities] = useState([]);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (globalUser) {
      fetchProfileData();
      fetchActivities();
    }
  }, [globalUser]);

  const fetchProfileData = async () => {
    try {
      const res = await axios.get('/User/profile');
      setUserProfile(res.data);
    } catch (error) {
      toast.error('Profil bilgileri yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await axios.get('/User/activities');
      setActivities(res.data);
    } catch (error) {
      console.error('Aktiviteler yüklenemedi.', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setUserProfile(prev => ({ ...prev, [name]: checked }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Profili güncellemek için API çağrısı
      const payload = {
        fullName: userProfile.fullName,
        tc: userProfile.tc,
        phone: userProfile.phone,
        gender: userProfile.gender,
        bloodTypeId: Number(userProfile.bloodTypeId) || 0,
        districtId: Number(userProfile.districtId) || 0,
        dateOfBirth: userProfile.dateOfBirth || null,
        weight: Number(userProfile.weight) || null,
        title: userProfile.title,
        hasChronicDisease: userProfile.hasChronicDisease,
        usesMedication: userProfile.usesMedication,
        recentAlcoholUse: userProfile.recentAlcoholUse,
        recentSurgery: userProfile.recentSurgery,
        emergencyContactName: userProfile.emergencyContactName,
        emergencyContactRelation: userProfile.emergencyContactRelation,
        emergencyContactPhone: userProfile.emergencyContactPhone,
        city: userProfile.city,
        neighborhood: userProfile.neighborhood,
        nearestHospital: userProfile.nearestHospital,
        profileVisibility: userProfile.profileVisibility,
        allowPhoneShare: userProfile.allowPhoneShare,
        emailNotifications: userProfile.emailNotifications,
        smsNotifications: userProfile.smsNotifications,
        locationBasedNotifications: userProfile.locationBasedNotifications,
        twoFactorEnabled: userProfile.twoFactorEnabled
      };

      const res = await axios.put('/User/profile', payload);
      
      const ISTANBUL_ILCELER = [
        'Adalar', 'Arnavutköy', 'Ataşehir', 'Avcılar', 'Bağcılar', 'Bahçelievler', 'Bakırköy', 'Başakşehir',
        'Bayrampaşa', 'Beşiktaş', 'Beykoz', 'Beylikdüzü', 'Beyoğlu', 'Büyükçekmece', 'Çatalca', 'Çekmeköy',
        'Esenler', 'Esenyurt', 'Eyüpsultan', 'Fatih', 'Gaziosmanpaşa', 'Güngören', 'Kadıköy', 'Kağıthane',
        'Kartal', 'Küçükçekmece', 'Maltepe', 'Pendik', 'Sancaktepe', 'Sarıyer', 'Silivri', 'Sultanbeyli',
        'Sultangazi', 'Şile', 'Şişli', 'Tuzla', 'Ümraniye', 'Üsküdar', 'Zeytinburnu'
      ];
      const KAN_GRUPLARI = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', '0+', '0-'];

      // Kullanıcı arayüzünün senkronize kalması için genel kullanıcı durumunu biraz güncelleyin
      const updatedGlobalUser = { 
        ...globalUser, 
        ...payload, 
        bloodType: KAN_GRUPLARI[payload.bloodTypeId - 1] || globalUser.bloodType,
        district: ISTANBUL_ILCELER[payload.districtId - 1] || globalUser.district,
        profileCompletionRate: res.data.completionRate 
      };
      setGlobalUser(updatedGlobalUser);
      localStorage.setItem('user', JSON.stringify(updatedGlobalUser));

      toast.success(res.data.message || 'Profil başarıyla güncellendi.');
      setIsDirty(false);
      
      // Profili ve etkinlikleri yenile
      fetchProfileData();
      fetchActivities();
    } catch (error) {
      toast.error(error.response?.data || 'Profil güncellenirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  if (!globalUser) return (
    <div className="animate-in" style={{ textAlign: 'center', padding: '10rem 0' }}>
      <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Devam etmek için giriş yapmalısınız.</p>
      <Link to="/login" className="btn btn-primary" style={{ marginTop: '1rem' }}>Giriş Yap</Link>
    </div>
  );

  if (loading || !userProfile) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
      <Loader className="spin" size={32} color="#991b1b" />
    </div>
  );

  return (
    <div className="animate-in" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
      
      {/* Üst Alan: Tamamlama Kartı */}
      <ProfileCompletionCard completionRate={userProfile.profileCompletionRate} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', '@media (min-width: 1024px)': { gridTemplateColumns: '300px 1fr' } }} className="profile-grid">
        
        {/* Sol Sütun: Özet ve Hızlı Bilgi */}
        <div>
          <ProfileSummaryCard user={userProfile} />
          
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button 
              onClick={handleSave} 
              disabled={!isDirty || saving}
              style={{ 
                width: '100%', 
                background: isDirty ? '#991b1b' : '#cbd5e1', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                padding: '1rem', 
                fontSize: '1rem', 
                fontWeight: '800', 
                cursor: isDirty && !saving ? 'pointer' : 'not-allowed', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.5rem',
                boxShadow: isDirty ? '0 10px 25px rgba(225,29,72,0.25)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              {saving ? <Loader className="spin" size={20} /> : <Save size={20} />}
              {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
            {isDirty && <p style={{ fontSize: '0.8rem', color: '#eab308', textAlign: 'center', margin: 0 }}>Kaydedilmemiş değişiklikleriniz var.</p>}
          </div>
        </div>

        {/* Sağ Sütun: Formlar */}
        <div>
          <PersonalInfoForm user={userProfile} handleInputChange={handleInputChange} />
          <DonationEligibilityForm user={userProfile} handleCheckboxChange={handleCheckboxChange} />
          <EmergencyContactForm user={userProfile} handleInputChange={handleInputChange} />
          <PrivacySettings user={userProfile} handleCheckboxChange={handleCheckboxChange} handleInputChange={handleInputChange} />
          <SecuritySettings user={userProfile} handleCheckboxChange={handleCheckboxChange} />
          <ProfileActivityTimeline activities={activities} />
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 1024px) {
          .profile-grid { grid-template-columns: 320px 1fr !important; }
        }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
};

export default Profile;
