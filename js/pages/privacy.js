export async function renderPrivacy(container) {
  if (!container) return;
  
  container.innerHTML = `
    <section class="page-section">
      <div class="privacy-container">
        <div class="privacy-header">
          <i class="fas fa-shield-alt"></i>
          <h1>গোপনীয়তা নীতি</h1>
          <p>আপনার তথ্য সুরক্ষা আমাদের অগ্রাধিকার</p>
        </div>
        
        <div class="privacy-content">
          <div class="privacy-card">
            <h2><i class="fas fa-database"></i> আমরা কী তথ্য সংগ্রহ করি?</h2>
            <p>আমরা শুধুমাত্র আপনার নাম, ইমেইল এবং লগইন তথ্য সংগ্রহ করি যা Google অ্যাকাউন্ট বা রেজিস্ট্রেশনের মাধ্যমে দেওয়া হয়। আমরা আপনার ক্রেডিট কার্ড বা ব্যাংক তথ্য সংগ্রহ করি না।</p>
          </div>
          
          <div class="privacy-card">
            <h2><i class="fas fa-chart-line"></i> আমরা তথ্য কীভাবে ব্যবহার করি?</h2>
            <ul>
              <li>আপনার অভিজ্ঞতা ব্যক্তিগতকৃত করতে</li>
              <li>আমাদের সাইটের উন্নতি করতে</li>
              <li>আপনার সাথে যোগাযোগ করতে (যদি প্রয়োজন হয়)</li>
              <li>ক্লিক ট্র্যাকিং এবং অ্যাফিলিয়েট কমিশনের জন্য</li>
            </ul>
          </div>
          
          <div class="privacy-card">
            <h2><i class="fas fa-share-alt"></i> তথ্য শেয়ারিং</h2>
            <p>আমরা আপনার তথ্য তৃতীয় পক্ষের সাথে বিক্রি বা শেয়ার করি না। শুধুমাত্র প্রয়োজনীয় ক্ষেত্রে (যেমন: অ্যাফিলিয়েট লিংক ট্র্যাকিং) সীমিত তথ্য ব্যবহার করা হয়।</p>
          </div>
          
          <div class="privacy-card">
            <h2><i class="fas fa-cookie-bite"></i> কুকিজ</h2>
            <p>আমরা আপনার অভিজ্ঞতা উন্নত করতে কুকিজ ব্যবহার করি। আপনি আপনার ব্রাউজার থেকে কুকিজ ডিজেবল করতে পারেন, তবে সাইটের কিছু ফাংশন কাজ নাও করতে পারে।</p>
          </div>
          
          <div class="privacy-card">
            <h2><i class="fas fa-user-shield"></i> আপনার অধিকার</h2>
            <p>আপনার যেকোনো সময় আপনার অ্যাকাউন্ট ডিলিট করার অধিকার রয়েছে। ডিলিট করতে চাইলে আমাদের contact পেজে মেসেজ করুন।</p>
          </div>
          
          <div class="privacy-update">
            <i class="fas fa-calendar-alt"></i>
            <span>শেষ আপডেট: জানুয়ারি ২০২৫</span>
          </div>
        </div>
      </div>
    </section>
  `;
}