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
            <p>বাংলাদেশের ক্রেতাদের কাছে সেরা টেক গ্যাজেট এবং সেরা ডিল পৌঁছে দেওয়া। আমরা বিশ্বাস করি প্রযুক্তি সবার জন্য সহজলভ্য হওয়া উচিত।</p>
          </div>
          <div class="about-card">
            <i class="fas fa-eye"></i>
            <h2>আমাদের দৃষ্টিভঙ্গি</h2>
            <p>বাংলাদেশের নং ১ টেক গ্যাজেট অ্যাফিলিয়েট প্ল্যাটফর্ম হয়ে ওঠা, যেখানে ক্রেতা পাবে সেরা ডিল এবং সঠিক তথ্য।</p>
          </div>
          <div class="about-card">
            <i class="fas fa-handshake"></i>
            <h2>আমাদের মূল্যবোধ</h2>
            <p>সততা, স্বচ্ছতা এবং গ্রাহক সন্তুষ্টি -这是我们信仰的核心。আমরা শুধুমাত্র সেরা পণ্যই রিকমেন্ড করি।</p>
          </div>
        </div>
      </div>
    </section>
  `;
}