export async function renderTerms(container) {
  if (!container) return;
  
  container.innerHTML = `
    <section class="page-section">
      <div class="terms-container">
        <div class="terms-header">
          <i class="fas fa-file-contract"></i>
          <h1>Terms & Conditions</h1>
          <p>শর্তাবলী ও নীতিমালা</p>
        </div>
        
        <div class="terms-content">
          <div class="terms-card">
            <h2><i class="fas fa-info-circle"></i> 1. General Information</h2>
            <p>Welcome to DGDBD (Daily Gadgets & Deals Bangladesh). By accessing and using our website, you agree to comply with and be bound by the following terms and conditions.</p>
          </div>
          
          <div class="terms-card">
            <h2><i class="fas fa-shopping-cart"></i> 2. Affiliate Disclosure</h2>
            <p>DGDBD is an affiliate website. We earn commissions from purchases made through our affiliate links (Daraz, Rokomari, etc.). This does not affect the price you pay. We only recommend products we believe provide value to our users.</p>
          </div>
          
          <div class="terms-card">
            <h2><i class="fas fa-check-circle"></i> 3. Product Information</h2>
            <p>Product images, descriptions, and prices are provided by our affiliate partners. While we strive for accuracy, we cannot guarantee that all information is 100% accurate or up-to-date. Always verify product details on the seller's website before purchasing.</p>
          </div>
          
          <div class="terms-card">
            <h2><i class="fas fa-external-link-alt"></i> 4. External Links</h2>
            <p>Our website contains links to external sites (Daraz, Rokomari, etc.). We are not responsible for the content, privacy policies, or practices of these third-party websites. Clicking on affiliate links is at your own risk.</p>
          </div>
          
          <div class="terms-card">
            <h2><i class="fas fa-user-lock"></i> 5. User Accounts</h2>
            <p>When you create an account with us, you must provide accurate information. You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>
          </div>
          
          <div class="terms-card">
            <h2><i class="fas fa-ban"></i> 6. Prohibited Activities</h2>
            <p>You may not use our website for any illegal or unauthorized purpose. You may not attempt to hack, disrupt, or damage our website or its functionality.</p>
          </div>
          
          <div class="terms-card">
            <h2><i class="fas fa-gavel"></i> 7. Refund & Return Policy</h2>
            <p>DGDBD does not sell products directly. We are an affiliate platform. All refunds, returns, and warranty claims must be handled directly with the seller (Daraz, Rokomari, etc.). Please refer to their respective policies.</p>
          </div>
          
          <div class="terms-card">
            <h2><i class="fas fa-calendar-alt"></i> 8. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the site constitutes acceptance of the modified terms.</p>
          </div>
          
          <div class="terms-card">
            <h2><i class="fas fa-envelope"></i> 9. Contact Us</h2>
            <p>If you have any questions about these Terms & Conditions, please contact us through our <a href="#" onclick="window.location.hash='contact'">Contact Page</a> or message us on Facebook Messenger.</p>
          </div>
          
          <div class="terms-update">
            <i class="fas fa-calendar-alt"></i>
            <span>Last Updated: January 2024</span>
          </div>
        </div>
      </div>
    </section>
  `;
  
  // Fix any internal links
  const contactLink = document.querySelector('.terms-card a');
  if (contactLink) {
    contactLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.hash = 'contact';
    });
  }
}