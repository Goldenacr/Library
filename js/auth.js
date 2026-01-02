// Authentication functions

const PASSCODES = {
    USER: 'CIPHER01',
    ADMIN: 'MATILDA'
};

// Check if user is authenticated
function checkAuth() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Check if user is admin and authenticated
function checkAdminAuth() {
    const user = getCurrentUser();
    if (!user || !user.isAdmin) {
        window.location.href = 'home.html';
        return false;
    }
    return true;
}

// Get current user from localStorage
function getCurrentUser() {
    const userData = localStorage.getItem('secureShareUser');
    return userData ? JSON.parse(userData) : null;
}

// Get all users from localStorage
function getUsers() {
    const usersData = localStorage.getItem('secureShareUsers');
    return usersData ? JSON.parse(usersData) : [];
}

// Save users to localStorage
function saveUsers(users) {
    localStorage.setItem('secureShareUsers', JSON.stringify(users));
}

// Register new user
function registerUser(username, password, passcode) {
    // Validate passcode
    if (![PASSCODES.USER, PASSCODES.ADMIN].includes(passcode)) {
        showNotification('Invalid passcode. Please check and try again.', 'error');
        return false;
    }
    
    // Check if username already exists
    const users = getUsers();
    if (users.some(u => u.username === username)) {
        showNotification('Username already exists. Please choose another.', 'error');
        return false;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        username,
        password,
        isAdmin: passcode === PASSCODES.ADMIN,
        joined: new Date().toISOString(),
        lastLogin: null
    };
    
    // Save user
    users.push(newUser);
    saveUsers(users);
    
    // Auto login
    loginUser(username, password);
    
    return true;
}

// Login user
function loginUser(username, password) {
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
        showNotification('Invalid username or password.', 'error');
        return false;
    }
    
    // Update last login
    user.lastLogin = new Date().toISOString();
    saveUsers(users);
    
    // Save current user
    localStorage.setItem('secureShareUser', JSON.stringify(user));
    
    showNotification(`Welcome back, ${username}!`, 'success');
    return true;
}

// Logout user
function logoutUser() {
    localStorage.removeItem('secureShareUser');
    window.location.href = 'login.html';
}

// Update user UI
function updateUserUI() {
    const user = getCurrentUser();
    const userSection = document.getElementById('userSection');
    const mobileUserSection = document.getElementById('mobileUserSection');
    
    if (user && userSection) {
        const firstLetter = user.username.charAt(0).toUpperCase();
        const adminBadge = user.isAdmin ? '<span class="user-admin">(Admin)</span>' : '';
        
        userSection.innerHTML = `
            <div class="user-avatar">${firstLetter}</div>
            <div>
                <div class="user-name">${user.username}</div>
                ${adminBadge}
            </div>
            <button class="btn btn-danger btn-sm" onclick="logoutUser()">
                <i class="fas fa-sign-out-alt"></i> Logout
            </button>
        `;
    }
    
    if (user && mobileUserSection) {
        const firstLetter = user.username.charAt(0).toUpperCase();
        const adminBadge = user.isAdmin ? '<span class="user-admin">(Admin)</span>' : '';
        
        mobileUserSection.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                <div class="user-avatar">${firstLetter}</div>
                <div>
                    <div class="user-name">${user.username}</div>
                    ${adminBadge}
                </div>
            </div>
            <button class="btn btn-danger btn-block" onclick="logoutUser()">
                <i class="fas fa-sign-out-alt"></i> Logout
            </button>
        `;
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}