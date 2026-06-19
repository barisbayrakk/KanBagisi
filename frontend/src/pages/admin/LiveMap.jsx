import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Map as MapIcon } from 'lucide-react';

// Tepki broşüründe varsayılan işaretleyici simgesi düzeltildi
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// İstanbul'daki hastaneler ve kan ihtiyacına ilişkin sahte veriler
const hospitalLocations = [
  { id: 1, name: 'Şişli Etfal Hastanesi', position: [41.056, 28.985], needLevel: 'High', bloodTypes: ['A+', '0-'], units: 5 },
  { id: 2, name: 'Çam ve Sakura Şehir Hastanesi', position: [41.116, 28.784], needLevel: 'Medium', bloodTypes: ['B-', 'AB+'], units: 2 },
  { id: 3, name: 'Üsküdar Devlet Hastanesi', position: [41.026, 29.020], needLevel: 'Low', bloodTypes: ['0+'], units: 1 },
  { id: 4, name: 'Bakırköy Dr. Sadi Konuk', position: [40.985, 28.875], needLevel: 'Critical', bloodTypes: ['A-', '0-', 'B+'], units: 8 },
  { id: 5, name: 'Kartal Lütfi Kırdar', position: [40.915, 29.175], needLevel: 'High', bloodTypes: ['A+', 'AB-'], units: 4 },
];

const getMarkerColor = (level) => {
  switch (level) {
    case 'Critical': return '#991b1b'; // Rose 600
    case 'High': return '#f59e0b'; // Amber 500
    case 'Medium': return '#3b82f6'; // Blue 500
    case 'Low': return '#10b981'; // Emerald 500
    default: return '#64748b';
  }
};

const getRadius = (level) => {
  switch (level) {
    case 'Critical': return 2500;
    case 'High': return 1500;
    case 'Medium': return 1000;
    case 'Low': return 500;
    default: return 500;
  }
};

const LiveMap = () => {
  const position = [41.0082, 28.9784]; // Istanbul center

  return (
    <div className="card glass" style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 20px 50px rgba(0,0,0,0.04)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(16,185,129,0.2)' }}>
            <MapIcon size={20} style={{ color: '#ffffff' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Canlı Kan İhtiyaç Haritası</h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>İstanbul geneli anlık yoğunluk durumu.</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', fontWeight: '600' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#475569' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#991b1b' }}></span> Kritik</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#475569' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }}></span> Yüksek</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#475569' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6' }}></span> Orta</span>
        </div>
      </div>
      
      <div style={{ height: '500px', width: '100%', position: 'relative', zIndex: 0 }}>
        <MapContainer center={position} zoom={10} style={{ height: '100%', width: '100%', zIndex: 0 }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          
          {hospitalLocations.map(hospital => (
            <React.Fragment key={hospital.id}>
              <Circle 
                center={hospital.position}
                pathOptions={{ fillColor: getMarkerColor(hospital.needLevel), color: getMarkerColor(hospital.needLevel), fillOpacity: 0.2, weight: 1 }}
                radius={getRadius(hospital.needLevel)}
              />
              <Marker position={hospital.position}>
                <Popup>
                  <div style={{ minWidth: '180px' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: '800', color: '#0f172a', fontSize: '1rem' }}>{hospital.name}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ padding: '0.2rem 0.6rem', background: 'rgba(225,29,72,0.1)', color: '#991b1b', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700' }}>
                        {hospital.units} Ünite
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>{hospital.needLevel} Aciliyet</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#475569', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <strong>İhtiyaç:</strong> 
                      {hospital.bloodTypes.map(b => (
                        <span key={b} style={{ background: '#f1f5f9', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: '700' }}>{b}</span>
                      ))}
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default LiveMap;
