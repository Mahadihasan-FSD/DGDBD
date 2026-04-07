export async function renderAbout(container) {
  if (!container) return;
  
  container.innerHTML = `
    <section class="page-section">
      <div class="about-container">
        <div class="about-header">
          <i class="fas fa-bolt"></i>
          <h1>আমাদের সম্পর্কে</h1>
          <p>DGDBD - Daily Gadgets & Deals Bangladesh</p>
        </div>
        <div class="about-content">
          <div class="about-card">
            <i class="fas fa-rocket"></i>
            <h2>আমাদের মিশন</h2>
            <p>বাংলাদেশের ক্রেতাদের কাছে সেরা টেক গ্যাজেট এবং সেরা ডিল পৌঁছে দেওয়া।</p>
          </div>
        </div>
      </div>
    </section>
  `;
}