import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateCertificate = async (userName, date, bloodType, hospitalName) => {
  // Ekran dışı kapsayıcı oluşturma
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.width = '800px';
  container.style.height = '600px';
  container.style.backgroundColor = '#ffffff';
  container.style.padding = '24px';
  container.style.boxSizing = 'border-box';
  container.style.border = '12px solid #991b1b';
  container.style.fontFamily = "'Arial', sans-serif";
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';

  container.innerHTML = `
    <div style="width: 100%; height: 100%; border: 4px solid #f87171; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; background-color: #ffffff;">
      <div style="text-align: center; color: #991b1b; font-size: 42px; font-weight: 900; margin-bottom: 10px; letter-spacing: 2px;">
        TEŞEKKÜR BELGESİ
      </div>
      <div style="font-size: 22px; color: #64748b; font-weight: bold; margin-bottom: 40px; text-align: center; letter-spacing: 1px;">
        HAYAT AĞI KAN YÖNETİM PLATFORMU
      </div>
      <div style="font-size: 20px; color: #334155; text-align: center; max-width: 650px; line-height: 1.8;">
        Sayın <strong style="font-size: 24px; color: #0f172a;">${userName || 'Gönüllü Bağışçımız'}</strong>,<br/><br/>
        ${hospitalName || 'hastanemize'} ulaştırılmak üzere yaptığınız 
        <strong style="color: #991b1b;">${bloodType || 'Kan'}</strong> bağışı ile bir hastamıza umut oldunuz.<br/><br/>
        <em style="font-size: 22px; color: #991b1b;">"Bir damla kan, kurtarılan bir can..."</em><br/><br/>
        İyilik dolu bu davranışınız için sonsuz şükranlarımızı sunarız.
      </div>
      <div style="margin-top: 60px; width: 100%; display: flex; justify-content: center; font-size: 18px;">
        <div style="text-align: center;">
          <div style="font-weight: 800; color: #0f172a;">Hayat Ağı Platformu</div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, { scale: 2, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [800, 600]
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, 800, 600);
    pdf.save(`Tesekkur_Belgesi_${(userName || 'Donor').replace(/ /g, '_')}.pdf`);
  } catch (error) {
    console.error('PDF generation error:', error);
  } finally {
    document.body.removeChild(container);
  }
};
