// Utility functions

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate URL
function validateURL(url) {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
}

// Get file extension
function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}

// Get file icon based on extension
function getFileIcon(extension) {
    const icons = {
        'pdf': 'file-pdf',
        'doc': 'file-word',
        'docx': 'file-word',
        'xls': 'file-excel',
        'xlsx': 'file-excel',
        'ppt': 'file-powerpoint',
        'pptx': 'file-powerpoint',
        'zip': 'file-archive',
        'rar': 'file-archive',
        'jpg': 'file-image',
        'jpeg': 'file-image',
        'png': 'file-image',
        'gif': 'file-image',
        'mp4': 'file-video',
        'avi': 'file-video',
        'mov': 'file-video',
        'mp3': 'file-audio',
        'wav': 'file-audio'
    };
    
    return icons[extension.toLowerCase()] || 'file';
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => showNotification('Copied to clipboard!', 'success'))
        .catch(() => showNotification('Failed to copy.', 'error'));
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Check if mobile device
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Add loading state to button
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        const originalText = button.innerHTML;
        button.setAttribute('data-original-text', originalText);
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    } else {
        button.disabled = false;
        const originalText = button.getAttribute('data-original-text');
        if (originalText) {
            button.innerHTML = originalText;
        }
    }
}