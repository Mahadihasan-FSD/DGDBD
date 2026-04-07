export async function renderTerms(container) {
  if (!container) return;
  
  container.innerHTML = `
    <section class="page-section">
      <div class="terms-container">
        <div class="terms-header">
          <i class="fas fa-file-contract"></i>
          <h1>শর্তাবলী ও নীতিমালা</h1>
          <p>Terms & Conditions</p>
        </div>
        
        <div class="terms-content">
          <div class="terms-card">
            <h2><i class="fas fa-info-circle"></i> ১. সাধারণ তথ্য</h2>
            <p>DGDBD (Daily Gadgets & Deals Bangladesh) এ স্বাগতম। আমাদের ওয়েবসাইট ব্যবহার করার মাধ্যমে আপনি নিম্নলিখিত শর্তাবলীতে সম্মত হচ্ছেন।</p>
          </div>
          
          <div class="terms-card">
            <h2><i class="fas fa-shopping-cart"></i> ২. অ্যাফিলিয়েট ডিসক্লোজার</h2>
            <p>DGDBD একটি অ্যাফিলিয়েট ওয়েবসাইট। আমাদের অ্যাফিলিয়েট লিংকের মাধ্যমে (Daraz, Rokomari ইত্যাদি) কেনাকাটা করলে আমরা কমিশন পাই। এটি আপনার মূল্যের উপর কোনো প্রভাব ফেলে না। আমরা শুধুমাত্র সেই পণ্যই রিকমেন্ড করি যা আমাদের ব্যবহারকারীদের জন্য ভালো বলে মনে করি।</p>
          </div>
          
          <div class="terms-card">
            <h2><i class="fas fa-check-circle"></i> ৩. পণ্যের তথ্য</h2>
            <p>পণ্যের ছবি, বিবরণ এবং দাম আমাদের অ্যাফিলিয়েট পার্টনারদের দ্বারা সরবরাহ করা হয়। আমরা নির্ভুলতার জন্য চেষ্টা করি, কিন্তু ১০০% তথ্য সঠিক বা আপ-টু-ডেট হবে তার গ্যারান্টি দিতে পারি না। কেনার আগে বিক্রেতার ওয়েবসাইটে পণ্যের বিবরণ যাচাই করে নিন।</p>
          </div>
          
          <div class="terms-card">
            <h2><i class="fas fa-external-link-alt"></i> ৪. বাহ্যিক লিংক</h2>
            <p>আমাদের ওয়েবসাইটে বাহ্যিক সাইটের লিংক রয়েছে (Daraz, Rokomari ইত্যাদি)। এই তৃতীয় পক্ষের ওয়েবসাইটের কন্টেন্ট, প্রাইভেসি পলিসি বা অনুশীলনের জন্য আমরা দায়ী নই। অ্যাফিলিয়েট লিংকে ক্লিক করা আপনার নিজের ঝুঁকিতে হবে।</p>
          </div>
          
          <div class="terms-card">
            <h2><i class="fas fa-user-lock"></i> ৫. ইউজার অ্যাকাউন্ট</h2>
            <p>আপনি যখন আমাদের সাথে অ্যাকাউন্ট তৈরি করেন, আপনাকে সঠিক তথ্য প্রদান করতে হবে। আপনার অ্যাকাউন্ট এবং পাসওয়ার্ডের গোপনীয়তা বজায় রাখার জন্য আপনি দায়ী। আপনার অ্যাকাউন্টের অধীনে ঘটে যাওয়া সকল কার্যকলাপের জন্য আপনি দায়িত্ব গ্রহণ করেন।</p>
          </div>
          
          <div class="terms-card">
            <h2><i class="fas fa-ban"></i> ৬. নিষিদ্ধ কার্যক্রম</h2>
            <p>আপনি আমাদের ওয়েবসাইট কোনো অবৈধ বা অননুমোদিত উদ্দেশ্যে ব্যবহার করতে পারবেন না। আপনি আমাদের ওয়েবসাইট হ্যাক, ব্যাহত বা ক্ষতিগ্রস্ত করার চেষ্টা করতে পারবেন না।</p>
          </div>
          
          <div class="terms-card">
            <h2><i class="fas fa-gavel"></i> ৭. রিফান্ড ও রিটার্ন পলিসি</h2>
            <p>DGDBD সরাসরি পণ্য বিক্রি করে না। আমরা একটি অ্যাফিলিয়েট প্ল্যাটফর্ম। সমস্ত রিফান্ড, রিটার্ন এবং ওয়ারেন্টি ক্লেইম সরাসরি বিক্রেতার (Daraz, Rokomari ইত্যাদি) সাথে নিষ্পত্তি করতে হবে। তাদের নিজ নিজ নীতিমালা দেখুন।</p>
          </div>
          
          <div class="terms-card">
            <h2><i class="fas fa-calendar-alt"></i> ৮. শর্তাবলীর পরিবর্তন</h2>
            <p>আমরা যেকোনো সময় এই শর্তাবলী সংশোধন করার অধিকার সংরক্ষণ করি। পরিবর্তনগুলি পোস্ট করার সাথে সাথেই কার্যকর হবে। সাইটের আপনার অব্যাহত ব্যবহার সংশোধিত শর্তাবলী গ্রহণ করে।</p>
          </div>
          
          <div class="terms-card">
            <h2><i class="fas fa-envelope"></i> ৯. যোগাযোগ</h2>
            <p>এই শর্তাবলী সম্পর্কে আপনার কোন প্রশ্ন থাকলে, আমাদের <a href="#" onclick="window.location.hash='contact'">যোগাযোগ পৃষ্ঠা</a> এর মাধ্যমে বা ফেসবুক মেসেঞ্জারে মেসেজ করুন।</p>
          </div>
          
          <div class="terms-update">
            <i class="fas fa-calendar-alt"></i>
            <span>শেষ আপডেট: জানুয়ারি ২০২৫</span>
          </div>
        </div>
      </div>
    </section>
  `;
  
  // Fix internal links
  const contactLink = document.querySelector('.terms-card a');
  if (contactLink) {
    contactLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.hash = 'contact';
    });
  }
}