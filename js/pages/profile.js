import { getCurrentUser, logoutUser, deleteUserAccount, getUserProfile, updateUserProfile } from '../firebase/auth.js';

let isEditing = false;

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
  await renderProfileContent(container, user, profile);
}

async function renderProfileContent(container, user, profile, editing = false) {
  if (!container) return;
  
  if (!editing) {
    // ভিউ মোড
    container.innerHTML = `
      <section class="page-section">
        <div class="profile-container">
          <div class="profile-header">
            <div class="profile-avatar">
              ${profile?.photoURL ? `<img src="${profile.photoURL}" alt="Profile">` : `<i class="fas fa-user-circle"></i>`}
            </div>
            <h1>আমার প্রোফাইল</h1>
            <p>${user.email}</p>
          </div>
          <div class="profile-content">
            <div class="profile-card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h2><i class="fas fa-user"></i> ব্যক্তিগত তথ্য</h2>
                <button class="edit-profile-btn" id="editProfileBtn">
                  <i class="fas fa-edit"></i> এডিট
                </button>
              </div>
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
                  <span class="info-value">${getGenderBangla(profile?.gender)}</span>
                </div>
                <div class="info-row">
                  <span class="info-label"><i class="fas fa-phone"></i> ফোন নম্বর:</span>
                  <span class="info-value">${profile?.phone || 'যোগ করুন'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label"><i class="fas fa-map-marker-alt"></i> ঠিকানা:</span>
                  <span class="info-value">${profile?.address || 'যোগ করুন'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label"><i class="fas fa-calendar"></i> জয়েন তারিখ:</span>
                  <span class="info-value">${formatDate(profile?.createdAt || user.createdAt)}</span>
                </div>
              </div>
            </div>
            
            <div class="profile-card">
              <h2><i class="fas fa-chart-line"></i> পরিসংখ্যান</h2>
              <div class="stats-grid">
                <div class="stat-box">
                  <i class="fas fa-shopping-cart"></i>
                  <div class="stat-number">0</div>
                  <div class="stat-label">মোট অর্ডার</div>
                </div>
                <div class="stat-box">
                  <i class="fas fa-eye"></i>
                  <div class="stat-number">0</div>
                  <div class="stat-label">পণ্য ভিউ</div>
                </div>
                <div class="stat-box">
                  <i class="fas fa-heart"></i>
                  <div class="stat-number">0</div>
                  <div class="stat-label">উইশলিস্ট</div>
                </div>
                <div class="stat-box">
                  <i class="fas fa-clock"></i>
                  <div class="stat-number">${getDaysSince(profile?.createdAt || user.createdAt)}</div>
                  <div class="stat-label">দিন সক্রিয়</div>
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
    
    // এডিট বাটন
    const editBtn = document.getElementById('editProfileBtn');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        renderProfileContent(container, user, profile, true);
      });
    }
    
  } else {
    // এডিট মোড
    container.innerHTML = `
      <section class="page-section">
        <div class="profile-container">
          <div class="profile-header">
            <div class="profile-avatar">
              <i class="fas fa-user-edit"></i>
            </div>
            <h1>প্রোফাইল এডিট করুন</h1>
            <p>আপনার তথ্য আপডেট করুন</p>
          </div>
          <div class="profile-content">
            <div class="profile-card">
              <h2><i class="fas fa-user-edit"></i> তথ্য পরিবর্তন করুন</h2>
              <form id="editProfileForm" class="edit-profile-form">
                <div class="form-group">
                  <label><i class="fas fa-user"></i> নাম</label>
                  <input type="text" id="editName" value="${escapeHtml(user.displayName || profile?.displayName || '')}" placeholder="আপনার নাম">
                </div>
                
                <div class="form-group">
                  <label><i class="fas fa-venus-mars"></i> জেন্ডার</label>
                  <select id="editGender" class="gender-select">
                    <option value="">জেন্ডার নির্বাচন করুন</option>
                    <option value="Male" ${profile?.gender === 'Male' ? 'selected' : ''}>পুরুষ (Male)</option>
                    <option value="Female" ${profile?.gender === 'Female' ? 'selected' : ''}>মহিলা (Female)</option>
                    <option value="Other" ${profile?.gender === 'Other' ? 'selected' : ''}>অন্যান্য (Other)</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label><i class="fas fa-phone"></i> ফোন নম্বর</label>
                  <input type="tel" id="editPhone" value="${escapeHtml(profile?.phone || '')}" placeholder="01XXXXXXXXX">
                </div>
                
                <div class="form-group">
                  <label><i class="fas fa-map-marker-alt"></i> ঠিকানা</label>
                  <textarea id="editAddress" rows="3" placeholder="আপনার সম্পূর্ণ ঠিকানা">${escapeHtml(profile?.address || '')}</textarea>
                </div>
                
                <div class="form-group">
                  <label><i class="fas fa-link"></i> প্রোফাইল ছবি URL (ঐচ্ছিক)</label>
                  <input type="url" id="editPhotoURL" value="${escapeHtml(profile?.photoURL || '')}" placeholder="https://...">
                </div>
                
                <div class="form-actions">
                  <button type="submit" class="save-btn">
                    <i class="fas fa-save"></i> সংরক্ষণ করুন
                  </button>
                  <button type="button" class="cancel-btn" id="cancelEditBtn">
                    <i class="fas fa-times"></i> বাতিল করুন
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    `;
    
    // ফর্ম সাবমিট
    const form = document.getElementById('editProfileForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const updatedData = {
          displayName: document.getElementById('editName')?.value || user.displayName,
          gender: document.getElementById('editGender')?.value,
          phone: document.getElementById('editPhone')?.value,
          address: document.getElementById('editAddress')?.value,
          photoURL: document.getElementById('editPhotoURL')?.value
        };
        
        // আপডেট প্রোফাইল
        const success = await updateUserProfile(user.uid, updatedData);
        
        if (success) {
          // ইউজার ডিসপ্লে নাম আপডেট করুন
          if (updatedData.displayName && updatedData.displayName !== user.displayName) {
            user.displayName = updatedData.displayName;
            localStorage.setItem('dgdbd_current_user', JSON.stringify(user));
          }
          
          window.showToast('প্রোফাইল আপডেট করা হয়েছে!', 'success');
          // ভিউ মোডে ফিরে যান
          const newProfile = await getUserProfile(user.uid);
          renderProfileContent(container, user, newProfile, false);
        } else {
          window.showToast('আপডেট ব্যর্থ হয়েছে', 'error');
        }
      });
    }
    
    // ক্যান্সেল বাটন
    const cancelBtn = document.getElementById('cancelEditBtn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        renderProfileContent(container, user, profile, false);
      });
    }
  }
  
  // লগআউট বাটন (ভিউ মোডে)
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      if (confirm('লগআউট করতে চান?')) {
        await logoutUser();
        window.location.hash = 'home';
        setTimeout(() => window.location.reload(), 100);
      }
    });
  }
  
  // অ্যাকাউন্ট ডিলিট বাটন
  const deleteBtn = document.getElementById('deleteAccountBtn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', async () => {
      const confirmed = confirm('⚠️ সতর্কতা!\n\nআপনার অ্যাকাউন্ট স্থায়ীভাবে ডিলিট হবে।\nআপনার সকল ডেটা মুছে যাবে।\n\nআপনি কি নিশ্চিত?');
      
      if (!confirmed) return;
      
      const deleteText = prompt("কনফার্ম করতে 'DELETE' টাইপ করুন:");
      
      if (deleteText !== 'DELETE') {
        window.showToast('ডিলিট বাতিল করা হয়েছে', 'error');
        return;
      }
      
      const deleted = await deleteUserAccount();
      
      if (deleted) {
        window.showToast('অ্যাকাউন্ট ডিলিট করা হয়েছে', 'success');
        window.location.hash = 'home';
        setTimeout(() => window.location.reload(), 500);
      }
    });
  }
}

function getGenderBangla(gender) {
  if (gender === 'Male') return 'পুরুষ';
  if (gender === 'Female') return 'মহিলা';
  if (gender === 'Other') return 'অন্যান্য';
  return 'উল্লেখ নেই';
}

function formatDate(dateString) {
  if (!dateString) return 'নতুন ইউজার';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD');
  } catch {
    return 'নতুন ইউজার';
  }
}

function getDaysSince(dateString) {
  if (!dateString) return 0;
  try {
    const joinDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - joinDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch {
    return 0;
  }
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}