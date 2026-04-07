import { getCurrentUser, logoutUser, deleteUserAccount, getUserProfile } from '../firebase/auth.js';

export async function renderProfile(container) {
  if (!container) return;
  
  const user = getCurrentUser();
  
  if (!user) {
    container.innerHTML = `
      <div class="page-section">
        <div class="profile-container">
          <div class="profile-header">
            <i class="fas fa-user-lock"></i>
            <h1>প্রোফাইল দেখতে লগইন করুন</h1>
            <button class="login-prompt-btn" id="loginPromptBtn"><i class="fas fa-sign-in-alt"></i> লগইন করুন</button>
          </div>
        </div>
      </div>
    `;
    const loginBtn = document.getElementById('loginPromptBtn');
    if (loginBtn) loginBtn.onclick = () => document.getElementById('authBtn')?.click();
    return;
  }
  
  const profile = await getUserProfile(user.uid);
  
  container.innerHTML = `
    <section class="page-section">
      <div class="profile-container">
        <div class="profile-header">
          <div class="profile-avatar">
            <i class="fas fa-user-circle"></i>
          </div>
          <h1>আমার প্রোফাইল</h1>
          <p>${user.email}</p>
        </div>
        <div class="profile-content">
          <div class="profile-card">
            <h2><i class="fas fa-user"></i> ব্যক্তিগত তথ্য</h2>
            <div class="profile-info">
              <div class="info-row">
                <span class="info-label"><i class="fas fa-user"></i> নাম:</span>
                <span class="info-value">${escapeHtml(user.displayName || profile?.displayName || 'নাম নেই')}</span>
              </div>
              <div class="info-row">
                <span class="info-label"><i class="fas fa-envelope"></i> ইমেইল:</span>
                <span class="info-value">${escapeHtml(user.email)}</span>
              </div>
              <div class="info-row">
                <span class="info-label"><i class="fas fa-venus-mars"></i> জেন্ডার:</span>
                <span class="info-value">${profile?.gender === 'Male' ? 'পুরুষ' : profile?.gender === 'Female' ? 'মহিলা' : profile?.gender || 'উল্লেখ নেই'}</span>
              </div>
              <div class="info-row">
                <span class="info-label"><i class="fas fa-id-card"></i> ইউজার আইডি:</span>
                <span class="info-value">${user.uid}</span>
              </div>
            </div>
          </div>
          
          <div class="profile-card danger-zone">
            <h2><i class="fas fa-exclamation-triangle"></i> বিপদজনক এলাকা</h2>
            <p style="color: var(--danger); margin-bottom: 1rem;">
              <strong>সতর্কতা:</strong> অ্যাকাউন্ট ডিলিট করলে আপনার সকল তথ্য স্থায়ীভাবে মুছে যাবে। 
              এই action undo করা যাবে না।
            </p>
            <button class="delete-account-btn" id="deleteAccountBtn">
              <i class="fas fa-trash-alt"></i> অ্যাকাউন্ট ডিলিট করুন
            </button>
          </div>
          
          <div class="profile-actions">
            <button class="logout-btn" id="logoutBtn">
              <i class="fas fa-sign-out-alt"></i> লগআউট করুন
            </button>
          </div>
        </div>
      </div>
    </section>
  `;
  
  // লগআউট বাটন
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      if (confirm('লগআউট করতে চান?')) {
        await logoutUser();
        window.location.hash = 'home';
        // পেজ রিলোড না করে UI আপডেট করুন
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    });
  }
  
  // অ্যাকাউন্ট ডিলিট বাটন - এখন সম্পূর্ণ কাজ করবে
  const deleteBtn = document.getElementById('deleteAccountBtn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', async () => {
      // প্রথম কনফার্মেশন
      const confirmed = confirm('⚠️ সতর্কতা!\n\nআপনার অ্যাকাউন্ট স্থায়ীভাবে ডিলিট হবে।\nআপনার সকল ডেটা মুছে যাবে।\n\nআপনি কি নিশ্চিত?');
      
      if (!confirmed) return;
      
      // দ্বিতীয় কনফার্মেশন - DELETE টাইপ করতে হবে
      const deleteText = prompt("কনফার্ম করতে 'DELETE' টাইপ করুন:");
      
      if (deleteText !== 'DELETE') {
        window.showToast('ডিলিট বাতিল করা হয়েছে', 'error');
        return;
      }
      
      // ডিলিট প্রসেস
      const deleted = await deleteUserAccount();
      
      if (deleted) {
        window.showToast('অ্যাকাউন্ট ডিলিট করা হয়েছে', 'success');
        // হোম পেজে রিডাইরেক্ট
        window.location.hash = 'home';
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    });
  }
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}