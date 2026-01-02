// File management functions

// Get files from localStorage
function getFiles() {
    const filesData = localStorage.getItem('secureShareFiles');
    return filesData ? JSON.parse(filesData) : [];
}

// Get APKs from localStorage
function getAPKs() {
    const apksData = localStorage.getItem('secureShareAPKs');
    return apksData ? JSON.parse(apksData) : [];
}

// Get stats from localStorage
function getStats() {
    const statsData = localStorage.getItem('secureShareStats');
    return statsData ? JSON.parse(statsData) : {
        visits: 0,
        downloads: 0,
        totalFiles: 0,
        totalAPKs: 0
    };
}

// Save files to localStorage
function saveFiles(files) {
    localStorage.setItem('secureShareFiles', JSON.stringify(files));
}

// Save APKs to localStorage
function saveAPKs(apks) {
    localStorage.setItem('secureShareAPKs', JSON.stringify(apks));
}

// Save stats to localStorage
function saveStats(stats) {
    localStorage.setItem('secureShareStats', JSON.stringify(stats));
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Load dashboard data
function loadDashboard() {
    const stats = getStats();
    const files = getFiles();
    const apks = getAPKs();
    
    // Update stats
    document.getElementById('statsGrid').innerHTML = `
        <div class="stat-card">
            <div class="stat-number">${stats.visits}</div>
            <div class="stat-label">Site Visits</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${stats.downloads}</div>
            <div class="stat-label">Total Downloads</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${apks.length}</div>
            <div class="stat-label">APK Files</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${files.length}</div>
            <div class="stat-label">All Files</div>
        </div>
    `;
    
    // Load recent files (last 4)
    const recentFiles = files.slice(-4).reverse();
    const filesGrid = document.getElementById('recentFiles');
    
    if (recentFiles.length > 0) {
        filesGrid.innerHTML = recentFiles.map(file => `
            <div class="file-card">
                <div class="file-icon file-icon-general">
                    <i class="fas fa-file"></i>
                </div>
                <div class="file-name">${file.name}</div>
                <div class="file-meta">${file.fileSize || 'N/A'} • ${file.downloads || 0} downloads</div>
                <a href="#" class="file-download" onclick="downloadFile(${file.id}, 'file')">
                    <i class="fas fa-download"></i> Download
                </a>
            </div>
        `).join('');
    } else {
        filesGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-file"></i>
                <h3>No Files Yet</h3>
                <p>No files have been uploaded yet.</p>
            </div>
        `;
    }
    
    // Load recent APKs (last 4)
    const recentAPKs = apks.slice(-4).reverse();
    const apksGrid = document.getElementById('recentAPKs');
    
    if (recentAPKs.length > 0) {
        apksGrid.innerHTML = recentAPKs.map(apk => `
            <div class="file-card">
                <div class="file-icon apk-icon">
                    <i class="fab fa-android"></i>
                </div>
                <div class="file-name">${apk.name}</div>
                <div class="file-meta">${apk.fileSize || 'N/A'} • ${apk.downloads || 0} downloads</div>
                <a href="#" class="file-download" onclick="downloadFile(${apk.id}, 'apk')">
                    <i class="fas fa-download"></i> Download APK
                </a>
            </div>
        `).join('');
    } else {
        apksGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fab fa-android"></i>
                <h3>No APKs Yet</h3>
                <p>No APK files have been uploaded yet.</p>
            </div>
        `;
    }
}

// Load APKs page
function loadAPKs() {
    const apks = getAPKs();
    const apksList = document.getElementById('apksList');
    const emptyState = document.getElementById('emptyAPKs');
    
    if (apks.length > 0) {
        apksList.innerHTML = apks.reverse().map(apk => `
            <div class="file-card">
                <div class="file-icon apk-icon">
                    <i class="fab fa-android"></i>
                </div>
                <div class="file-name">${apk.name}</div>
                <div class="file-meta">${apk.fileSize || 'N/A'} • ${apk.downloads || 0} downloads • ${apk.date}</div>
                <a href="#" class="file-download" onclick="downloadFile(${apk.id}, 'apk')">
                    <i class="fas fa-download"></i> Download APK
                </a>
            </div>
        `).join('');
        
        if (emptyState) emptyState.style.display = 'none';
        apksList.style.display = 'grid';
    } else {
        if (emptyState) emptyState.style.display = 'block';
        apksList.style.display = 'none';
    }
}

// Load files page
function loadFiles() {
    const files = getFiles();
    const filesList = document.getElementById('filesList');
    const emptyState = document.getElementById('emptyFiles');
    
    if (files.length > 0) {
        filesList.innerHTML = files.reverse().map(file => `
            <div class="file-card">
                <div class="file-icon file-icon-general">
                    <i class="fas fa-file"></i>
                </div>
                <div class="file-name">${file.name}</div>
                <div class="file-meta">${file.fileSize || 'N/A'} • ${file.downloads || 0} downloads • ${file.date}</div>
                <a href="#" class="file-download" onclick="downloadFile(${file.id}, 'file')">
                    <i class="fas fa-download"></i> Download File
                </a>
            </div>
        `).join('');
        
        if (emptyState) emptyState.style.display = 'none';
        filesList.style.display = 'grid';
    } else {
        if (emptyState) emptyState.style.display = 'block';
        filesList.style.display = 'none';
    }
}

// Download file
function downloadFile(fileId, type) {
    if (!checkAuth()) return;
    
    let files, file;
    
    if (type === 'apk') {
        files = getAPKs();
        file = files.find(f => f.id === fileId);
    } else {
        files = getFiles();
        file = files.find(f => f.id === fileId);
    }
    
    if (!file) {
        showNotification('File not found.', 'error');
        return;
    }
    
    // Update download count
    file.downloads = (file.downloads || 0) + 1;
    
    // Update stats
    const stats = getStats();
    stats.downloads = (stats.downloads || 0) + 1;
    
    // Save changes
    if (type === 'apk') {
        saveAPKs(files);
    } else {
        saveFiles(files);
    }
    saveStats(stats);
    
    // Handle download based on type
    if (type === 'apk') {
        // Redirect to external link for APKs
        if (file.url) {
            window.open(file.url, '_blank');
            showNotification(`Redirecting to download: ${file.name}`, 'success');
        } else {
            showNotification('Download link not available.', 'error');
        }
    } else {
        // For regular files, simulate download
        if (file.fileData) {
            const link = document.createElement('a');
            link.href = file.fileData;
            link.download = file.fileName || file.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showNotification(`Downloading: ${file.name}`, 'success');
        } else {
            showNotification(`File download started: ${file.name}`, 'success');
        }
    }
    
    // Refresh page data
    if (window.location.pathname.includes('home.html')) {
        loadDashboard();
    } else if (window.location.pathname.includes('apks.html')) {
        loadAPKs();
    } else if (window.location.pathname.includes('files.html')) {
        loadFiles();
    }
}