// --- Helpers ---
const YEAR_EL = document.getElementById('year');
if (YEAR_EL) YEAR_EL.textContent = new Date().getFullYear();

// --- Configuration des heures d'ouverture ---
const OPENING_HOURS = {
  1: { start: '08:00', end: '18:00' }, // Lundi
  2: { start: '08:00', end: '18:00' }, // Mardi
  3: { start: '08:00', end: '18:00' }, // Mercredi
  4: { start: '08:00', end: '18:00' }, // Jeudi
  5: { start: '08:00', end: '18:00' }, // Vendredi
  6: { start: '09:00', end: '14:00' }, // Samedi
  0: null                                 // Dimanche
};

function isOpen(now = new Date()){
  const d = now.getDay();
  const conf = OPENING_HOURS[d];
  if (!conf) return false;
  const [sh, sm] = conf.start.split(':').map(Number);
  const [eh, em] = conf.end.split(':').map(Number);
  const start = new Date(now); start.setHours(sh, sm, 0, 0);
  const end   = new Date(now); end.setHours(eh, em, 0, 0);
  return now >= start && now <= end;
}

function updateStatus(){
  const el = document.getElementById('status');
  if (!el) return;
  if (isOpen()){
    el.textContent = '✅ Ouvert maintenant';
    el.style.background = 'rgba(31,191,91,.12)';
    el.style.color = '#7ae0a4';
    el.style.borderColor = 'rgba(31,191,91,.35)';
  } else {
    el.textContent = '❌ Fermé';
    el.style.background = 'rgba(255,86,86,.10)';
    el.style.color = '#ffb3b3';
    el.style.borderColor = 'rgba(255,86,86,.28)';
  }
}
updateStatus();

// --- vCard (VCF) ---
const VCF = `BEGIN:VCARD
VERSION:3.0
N:Prenom;Nom;;;
FN:Nom Prénom
ORG:SOLIDIAGUI GROUPE
TITLE:Fonction / Métier
TEL;TYPE=CELL:+224621553315
EMAIL:herman@solidiagui.com
ADR;TYPE=WORK:Madina Corniche Sud, Conakry, Guinée
URL:https://solidiagui.com
END:VCARD`;

function downloadVCF(){
  const blob = new Blob([VCF], { type: 'text/vcard' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'contact.vcf'; a.click();
  URL.revokeObjectURL(url);
}

function shareCard(){
  if (navigator.share){
    navigator.share({ title:'SOLIDIAGUI GROUPE', text:'Carte de visite numérique', url:window.location.href })
      .catch(()=>{});
  } else {
    alert('Partage non supporté sur ce navigateur.');
  }
}

// --- QR ---
function generateQR(){
  const holder = document.getElementById('qrcode');
  const section = document.getElementById('qrSection');
  if (!holder || !section) return;
  holder.innerHTML = '';
  new QRCode(holder, { text: VCF, width: 180, height: 180, correctLevel: QRCode.CorrectLevel.H });
  section.classList.remove('hidden');
}
function hideQR(){
  const section = document.getElementById('qrSection');
  if (section) section.classList.add('hidden');
}
