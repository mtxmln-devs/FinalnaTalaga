// ===== MODAL CONTROLS =====
function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}

// Close modal when clicking dark overlay background
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      m.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
});

// ===== AUTO-DISMISS FLASH MESSAGES =====
document.addEventListener('DOMContentLoaded', function() {
  const flashes = document.querySelectorAll('.flash');
  flashes.forEach(flash => {
    setTimeout(() => {
      flash.style.transition = 'opacity 0.5s ease';
      flash.style.opacity = '0';
      setTimeout(() => flash.remove(), 500);
    }, 4000); // auto-dismiss after 4 seconds
  });
});

// ===== CONFIRM DELETE HELPER =====
function confirmDelete(formId, message) {
  if (confirm(message || 'Are you sure you want to delete this record?')) {
    document.getElementById(formId).submit();
  }
}
