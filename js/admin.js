// Admin functions

// Load admin data
function loadAdminData() {
    const stats = getStats();
    const files = getFiles();
    const apks = getAPKs();
    
    // Update admin stats
    document.getElementById('adminStats').innerHTML = `
        <div class="stat-card">
            <div class="stat-number">${stats.visits || 0}</div>
            <div class="stat-label">Site Visits</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${stats.downloads || 0}</div>
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
    
    // Load admin files
    loadAdminFiles();
}

// Load admin files list
function loadAdminFiles() {
    const files = getFiles();
    const apks = getAPKs();
    const allFiles = [...apks, ...files];
    const adminFilesList = document.getElementById('adminFilesList');
    const emptyState = document.getElementById('emptyAdminFiles');
    
    if (allFiles.length > 0) {
        adminFilesList.innerHTML = allFiles.reverse().map(file => `
            <div class="file-card">
                <button class="file-delete" onclick="deleteFile(${file.id}, '${file.type}')">
                    <i class="fas fa-trash"></i>
                </button>
                <div class="file-icon ${file.type === 'apk' ? 'apk-icon' : 'file-icon-general'}">
                    <i class="${file.type === 'apk' ? 'fab fa-android' : 'fas fa-file'}"></i>
                </div>
                <div class="file-name">${file.name}</div>
                <div class="file-meta">${file.type.toUpperCase()} • ${file.fileSize || 'N/A'} • ${file.downloads || 0} downloads</div>
                <div class="file-meta">${file.type === 'apk' ? `Link: ${file.url || 'N/A'}` : `File: ${file.fileName || 'N/A'}`}</div>
            </div>
        `).join('');
        
        if (emptyState) emptyState.style.display = 'none';
        adminFilesList.style.display = 'grid';
    } else {
        if (emptyState) emptyState.style.display = 'block';
        adminFilesList.style.display = 'none';
    }
}

// Initialize upload form
function initUploadForm() {
    const fileTypeSelect = document.getElementById('fileType');
    const fileUploadInput = document.getElementById('fileUpload');
    const selectedFileDiv = document.getElementById('selectedFile');
    const apkUrlContainer = document.getElementById('apkUrlContainer');
    
    // Toggle APK URL field
    fileTypeSelect.addEventListener('change', function() {
        if (this.value === 'apk') {
            apkUrlContainer.style.display = 'block';
            document.getElementById('apkUrl').required = true;
        } else {
            apkUrlContainer.style.display = 'none';
            document.getElementById('apkUrl').required = false;
        }
    });
    
    // Handle file selection
    fileUploadInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            const file = this.files[0];
            selectedFileDiv.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <span>${file.name} (${formatFileSize(file.size)})</span>
            `;
        } else {
            selectedFileDiv.innerHTML = '';
        }
    });
    
    // Handle form submission
    document.getElementById('uploadForm').addEventListener('submit', function(e) {
        e.preventDefault();
        uploadFile();
    });
}

// Upload file
function uploadFile() {
    const fileName = document.getElementById('fileName').value;
    const fileType = document.getElementById('fileType').value;
    const fileUpload = document.getElementById('fileUpload');
    const apkUrl = fileType === 'apk' ? document.getElementById('apkUrl').value : null;
    
    // Validation
    if (!fileName.trim()) {
        showNotification('Please enter a file name.', 'error');
        return;
    }
    
    if (!fileUpload.files.length) {
        showNotification('Please select a file to upload.', 'error');
        return;
    }
    
    if (fileType === 'apk' && (!apkUrl || !apkUrl.trim())) {
        showNotification('Please provide a download link for the APK.', 'error');
        return;
    }
    
    const file = fileUpload.files[0];
    const fileSize = file.size;
    const reader = new FileReader();
    
    reader.onload = function(e) {
        // Create file object
        const newFile = {
            id: Date.now(),
            name: fileName,
            type: fileType,
            fileName: file.name,
            fileSize: formatFileSize(fileSize),
            downloads: 0,
            date: new Date().toLocaleDateString(),
            fileData: e.target.result, // Store as data URL
            url: fileType === 'apk' ? apkUrl : null
        };
        
        // Save file based on type
        if (fileType === 'apk') {
            const apks = getAPKs();
            apks.push(newFile);
            saveAPKs(apks);
        } else {
            const files = getFiles();
            files.push(newFile);
            saveFiles(files);
        }
        
        // Update stats
        const stats = getStats();
        stats.totalFiles = (stats.totalFiles || 0) + 1;
        if (fileType === 'apk') {
            stats.totalAPKs = (stats.totalAPKs || 0) + 1;
        }
        saveStats(stats);
        
        // Reset form
        document.getElementById('uploadForm').reset();
        document.getElementById('selectedFile').innerHTML = '';
        document.getElementById('apkUrlContainer').style.display = 'none';
        
        // Show success message
        showNotification(`File "${fileName}" uploaded successfully!`, 'success');
        
        // Refresh file lists
        loadAdminFiles();
        
        // Update other pages if they're open
        if (window.location.pathname.includes('home.html')) {
            loadDashboard();
        }
    };
    
    reader.readAsDataURL(file);
}

// Delete file
function deleteFile(fileId, type) {
    if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
        return;
    }
    
    let files, fileName;
    
    if (type === 'apk') {
        files = getAPKs();
        const fileIndex = files.findIndex(f => f.id === fileId);
        if (fileIndex !== -1) {
            fileName = files[fileIndex].name;
            files.splice(fileIndex, 1);
            saveAPKs(files);
        }
    } else {
        files = getFiles();
        const fileIndex = files.findIndex(f => f.id === fileId);
        if (fileIndex !== -1) {
            fileName = files[fileIndex].name;
            files.splice(fileIndex, 1);
            saveFiles(files);
        }
    }
    
    // Update stats
    const stats = getStats();
    stats.totalFiles = Math.max(0, (stats.totalFiles || 1) - 1);
    if (type === 'apk') {
        stats.totalAPKs = Math.max(0, (stats.totalAPKs || 1) - 1);
    }
    saveStats(stats);
    
    showNotification(`File "${fileName}" deleted successfully.`, 'success');
    loadAdminFiles();
}