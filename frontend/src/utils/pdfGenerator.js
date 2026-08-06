import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const exportAnalyticsToPDF = async (elementId, filename = 'Laporan_Analisis_Karbon_CarbonWise.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found!`);
    return;
  }

  try {
    // Gunakan scale 1.5 untuk keseimbangan ketajaman dan ukuran file ringan
    const canvas = await html2canvas(element, {
      scale: 1.5,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    // Gunakan kompresi JPEG 0.75 agar ukuran file berkurang hingga 80-90%
    const imgData = canvas.toDataURL('image/jpeg', 0.75);
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 10;

    pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};
