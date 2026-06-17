# Kan Yönetim Platformu

İstanbul genelinde kan bağışı süreçlerini merkezileştirmeyi amaçlayan dijital platform.

## Teknolojiler
- **Backend:** C# - ASP.NET Core Web API (.NET 9.0)
- **Frontend:** React (Vite)
- **Veritabanı:** PostgreSQL (Docker ile containerize edilmiş) + EF Core
- **Kimlik Doğrulama:** JWT (JSON Web Token)

## Gereksinimler
Projenin çalışması için bilgisayarınızda şu araçların kurulu olması gerekir:
1. **Docker Desktop** (Veritabanı için)
2. **.NET 9.0 SDK** (Backend için)
3. **Node.js** ve **npm** (Frontend için)

## Nasıl Çalıştırılır?

### 1. Veritabanını Başlatın (Docker)
Docker Desktop uygulamasını açın ve projenin ana dizininde şu komutu çalıştırarak PostgreSQL veritabanını başlatın:
```bash
docker compose up -d
```
Bu komut, PostgreSQL veritabanını `localhost:5455` portunda ve pgAdmin panelini `localhost:5050` portunda ayağa kaldırır.

### 2. Uygulamayı Başlatın (Kolay Yöntem)
Projenin ana dizininde aşağıdaki tek komutu çalıştırarak hem frontend hem backend bağımlılıklarını kurup projeyi başlatabilirsiniz:
```bash
npm run dev
```

### 3. Manuel Başlatma (Alternatif)
Eğer frontend ve backend'i ayrı ayrı başlatmak isterseniz:

**Backend'i Başlatın:**
```bash
cd backend/KanYonetim.API
dotnet run
```
API otomatik olarak `http://localhost:5090` adresinde çalışacaktır. İlk çalışmada veritabanı (PostgreSQL) şeması otomatik oluşturulur ve İstanbul ilçeleri seed verisi olarak eklenir.

**Frontend'i Başlatın:**
```bash
cd frontend
npm install
npm run dev
```
Uygulama `http://localhost:3000` adresinde açılacaktır.

## Özellikler
- **Cinsiyet Bazlı Uygunluk:** Erkekler için 3 ay (90 gün), Kadınlar için 4 ay (120 gün) kuralı.
- **Mesafe Sıralaması:** Bağışçıların konumuna (ilçe merkezi) göre en yakın hastane taleplerini sıralama (Haversine formülü).
- **Modern Tasarım:** Koyu tema, glassmorphism bileşenleri ve kullanıcı dostu arayüz.
