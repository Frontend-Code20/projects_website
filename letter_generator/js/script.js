// Forms
const businessForm = document.getElementById('business-form')
const personalForm = document.getElementById('personal-form')
const applicationFrom = document.getElementById('application-form')

// Modal variables
const letterPreview = document.getElementById('letter-preview');
const downloadbtn = document.getElementById('download');
const newLetterBtn = document.getElementById('newLetterBtn');

const backBtn = document.getElementById('backBtn')
const homeBtn = document.getElementById('homeBtn')


let currentBlob = null;

backBtn.addEventListener('click', () => {

    formTabs.style.display = 'none';
    dashboard.style.display = 'flex'
    
});

homeBtn.addEventListener('click', () => {
    
    formTabs.style.display = 'none';
    modal.style.display = 'none';
    dashboard.style.display = 'flex'

});

businessForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(businessForm);

    const newFormData = Object.fromEntries(formData.entries())

    const letterBlob = await generateBusinessPdfBlob(newFormData);
    currentBlob = letterBlob
    const url = URL.createObjectURL(letterBlob);
    modal.style.display = 'flex'
    letterPreview.src = url
    downloadbtn.href = url 

});
console.log(personalForm);

personalForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(personalForm);

    const newFormData = Object.fromEntries(formData.entries()); 

    const letterBlob = await generatePersonalPdfBlob(newFormData);
    const url = URL.createObjectURL(letterBlob);
    modal.style.display = 'flex';
    letterPreview.src = url;
    downloadbtn.href = url;

})

applicationFrom.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(applicationFrom);

    // Convert to plain object
    const data = Object.fromEntries(formData.entries());

    const letterBlob = await generateApplicationBlob(data);
    const url = URL.createObjectURL(letterBlob);
    modal.style.display = 'flex';
    letterPreview.src = url;
    downloadbtn.href = url;
});

async function generateBusinessPdfBlob(formData) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Sender Info
    doc.setFontSize(16);
    doc.text(formData?.senderName, 20, 20);
    doc.text(formData?.senderCompany, 20, 28);
    doc.text(formData?.senderAddress, 20, 36);

    doc.text(formData?.date, 20, 48);
    
    // Recipient Info
    doc.text(formData?.recipientName, 20, 60);
    doc.text(formData?.recipientCompany, 20, 68);
    doc.text(formData?.recipientAddress, 20, 76);
    doc.text(`Subject: ${formData?.subject}`, 20, 90);
    doc.text(formData?.salutation, 20, 106);
    
    doc.setFontSize(14);
    const lines = doc.splitTextToSize(formData?.body, 180);
    doc.text(lines, 20, 116);


    console.log(lines.length);
    
    const bodyEnd = 120 + lines.length * 6;
    doc.setFontSize(16);
    doc.text(formData?.closing, 20, bodyEnd);
    doc.text(formData?.senderName, 20, bodyEnd + 8);
    

    const blob = doc.output("blob")
    return blob;
}

async function generatePersonalPdfBlob(formData) {
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(formData?.senderName, 20, 20);
    doc.text(formData?.senderAddress, 20, 28);
    doc.text(formData?.date, 20, 44);
    doc.text(formData?.recipientName, 20, 60);
    doc.text(formData?.recipientAddress, 20, 68);
    doc.text(`Subject: ${formData?.subject}`, 20, 84);
    doc.text(formData?.salutation, 20, 100);
    
    doc.setFontSize(14);
    const lines = doc.splitTextToSize(formData?.body, 180)
    doc.text(lines, 20, 112);
    
    doc.setFontSize(16);
    const bodyEnd = 116 + lines.length * 6;
    doc.text(formData?.closing, 20, bodyEnd);
    doc.text(formData?.signature, 20, bodyEnd + 8);

    const blob = doc.output('blob');
    return blob;
}

async function generateApplicationBlob(formData) {
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(formData?.senderName, 20, 20);
    doc.text(formData?.date, 20, 36);
    doc.text(formData?.recipientName, 20, 52);
    doc.text(formData?.companyName, 20, 60);
    doc.text(`Subject: ${formData?.jobTitle} Application`, 20, 76);

    const lines = doc.splitTextToSize(formData?.body, 180);
    doc.text(lines,20, 88);
    
    const bodyEnd = 104 + lines.length * 6
    doc.text(formData?.closing, 20, bodyEnd);
    doc.text(formData?.signatureName, 20, bodyEnd + 8);

    const blob = doc.output('blob');
    return blob;
}