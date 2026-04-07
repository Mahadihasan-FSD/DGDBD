export async function renderContact(container) {
  if (!container) return;
  
  container.innerHTML = `
    <section class="page-section">
      <div class="contact-container">
        <div class="contact-header">
          <i class="fas fa-headset"></i>
          <h1>যোগাযোগ করুন</h1>
          <p>আমরা ২৪/৭ আপনার জন্য উন্মুক্ত</p>
        </div>
        
        <div class="contact-grid">
          <div class="contact-info">
            <div class="info-card">
              <i class="fab fa-facebook-messenger"></i>
              <h3>Messenger</h3>
              <p>সরাসরি মেসেঞ্জারে মেসেজ করুন</p>
              <a href="https://m.me/dgdbd.official" target="_blank" class="contact-btn messenger-btn">
                <i class="fab fa-facebook-messenger"></i> Messenger এ মেসেজ দিন
              </a>
            </div>
            
            <div class="info-card">
              <i class="fab fa-facebook"></i>
              <h3>Facebook Page</h3>
              <p>আমাদের ফেসবুক পেজ ফলো করুন</p>
              <a href="https://facebook.com/DailyGadgetDeals" target="_blank" class="contact-btn fb-btn">
                <i class="fab fa-facebook"></i> ফেসবুক পেজ ভিজিট করুন
              </a>
            </div>
          </div>
          
          <div class="contact-form-card">
            <h3><i class="fas fa-paper-plane"></i> দ্রুত মেসেজ করুন</h3>
            <form id="quickContactForm">
              <div class="form-group">
                <input type="text" id="contactName" placeholder="আপনার নাম" required>
              </div>
              <div class="form-group">
                <input type="email" id="contactEmail" placeholder="আপনার ইমেইল" required>
              </div>
              <div class="form-group">
                <textarea id="contactMessage" rows="5" placeholder="আপনার মেসেজ লিখুন..." required></textarea>
              </div>
              <button type="submit" class="submit-btn">
                <i class="fas fa-paper-plane"></i> মেসেজ পাঠান
              </button>
            </form>
            <p class="form-note">
              <i class="fas fa-info-circle"></i> 
              ফর্ম সাবমিট করলে আপনার মেসেজ আমাদের Facebook Messenger-এ চলে যাবে।
            </p>
          </div>
        </div>
        
        <div class="business-hours">
          <h3><i class="fas fa-clock"></i> ব্যবসায়িক সময়</h3>
          <div class="hours-grid">
            <div class="hour-item">
              <span>রবি - বৃহস্পতি</span>
              <strong>সকাল ১০টা - রাত ৮টা</strong>
            </div>
            <div class="hour-item">
              <span>শুক্র - শনি</span>
              <strong>সকাল ১১টা - রাত ৯টা</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
  
  const form = document.getElementById('quickContactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName')?.value || '';
      const email = document.getElementById('contactEmail')?.value || '';
      const message = document.getElementById('contactMessage')?.value || '';
      
      const fullMessage = `নাম: ${name}%0aইমেইল: ${email}%0a%0a${message}`;
      const messengerUrl = `https://m.me/dgdbd.official?text=${encodeURIComponent(fullMessage)}`;
      
      window.open(messengerUrl, '_blank');
      window.showToast('মেসেঞ্জারে রিডাইরেক্ট হচ্ছে...', 'success');
      form.reset();
    });
  }
}