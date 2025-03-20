// resources/js/app-store.js

document.addEventListener('DOMContentLoaded', function() {
    // Platform detection
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);

    // Set platform class on body
    if (isIOS) {
        document.body.classList.add('platform-ios');
    } else if (isAndroid) {
        document.body.classList.add('platform-android');
    } else if (isMobile) {
        document.body.classList.add('platform-mobile');
    } else {
        document.body.classList.add('platform-desktop');
    }

    // Handle platform-specific redirect banners
    const platformBanners = document.querySelectorAll('.install-banner');
    platformBanners.forEach(banner => {
        banner.addEventListener('click', function() {
            const platform = this.getAttribute('data-platform');

            // Replace with your actual app store URLs
            if (platform === 'android') {
                window.location.href = 'https://play.google.com/store/apps/details?id=your.app.id';
            } else if (platform === 'ios') {
                window.location.href = 'https://apps.apple.com/app/id1234567890';
            }
        });
    });

    // Show appropriate banners based on platform
    const androidBanner = document.querySelector('.android-banner');
    const iosBanner = document.querySelector('.ios-banner');

    if (androidBanner && iosBanner) {
        if (isIOS) {
            androidBanner.style.display = 'none';
        } else if (isAndroid) {
            iosBanner.style.display = 'none';
        }
    }

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                window.location.href = `/search?q=${encodeURIComponent(this.value)}`;
            }
        });
    }

    // Handle download buttons
    const downloadButtons = document.querySelectorAll('.download-btn');
    downloadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const hasContentLocker = this.getAttribute('data-has-locker') === 'true';
            const hasSmartLink = this.getAttribute('data-smart-link') === 'true';
            const cpaLink = this.getAttribute('data-cpa-link');

            const processingBar = this.previousElementSibling.querySelector('.processing-indicator');
            const processingTime = processingBar ? parseInt(processingBar.getAttribute('data-time')) : 2000;

            // Show processing animation
            if (processingBar) {
                processingBar.style.width = '0';

                setTimeout(() => {
                    processingBar.style.width = '100%';
                }, 50);

                setTimeout(() => {
                    processingBar.style.width = '0';

                    // After animation completes, handle the download logic
                    if (hasContentLocker && cpaLink) {
                        showContentLocker(cpaLink);
                    } else if (hasSmartLink) {
                        handleSmartLink(this);
                    } else {
                        // Regular download
                        const defaultLink = this.getAttribute('data-default-link');
                        if (defaultLink) {
                            window.location.href = defaultLink;
                        }
                    }
                }, processingTime);
            } else {
                // No processing bar, handle download immediately
                if (hasContentLocker && cpaLink) {
                    showContentLocker(cpaLink);
                } else if (hasSmartLink) {
                    handleSmartLink(this);
                } else {
                    // Regular download
                    const defaultLink = this.getAttribute('data-default-link');
                    if (defaultLink) {
                        window.location.href = defaultLink;
                    }
                }
            }
        });
    });

    // Content locker modal functionality
    function showContentLocker(cpaLink) {
        const modal = document.getElementById('contentLockerModal');
        const iframe = document.getElementById('cpaFrame');

        if (modal && iframe) {
            iframe.src = cpaLink;
            modal.style.display = 'block';

            // Handle modal close
            const closeButton = modal.querySelector('.close-modal');
            if (closeButton) {
                closeButton.onclick = function() {
                    modal.style.display = 'none';
                    iframe.src = '';
                }
            }

            // Close when clicking outside modal
            window.onclick = function(event) {
                if (event.target === modal) {
                    modal.style.display = 'none';
                    iframe.src = '';
                }
            }

            // Listen for messages from the iframe (CPA completion)
            window.addEventListener('message', function(event) {
                // Verify origin for security
                if (event.origin !== new URL(cpaLink).origin) return;

                if (event.data.action === 'cpa_completed') {
                   // CPA offer completed, close modal and redirect
                   modal.style.display = 'none';
                   if (event.data.redirectUrl) {
                       window.location.href = event.data.redirectUrl;
                   } else {
                       // Default success action if no redirect URL provided
                       window.location.reload();
                   }
               }
           });
       }
   }

   // Smart link handling based on detected platform
   function handleSmartLink(button) {
       if (isAndroid) {
           const androidLink = button.getAttribute('data-android-link');
           if (androidLink) {
               window.location.href = androidLink;
               return;
           }
       } else if (isIOS) {
           const iosLink = button.getAttribute('data-ios-link');
           if (iosLink) {
               window.location.href = iosLink;
               return;
           }
       } else {
           // Desktop platforms
           const userAgent = navigator.userAgent.toLowerCase();

           if (userAgent.indexOf('windows') !== -1) {
               const windowsLink = button.getAttribute('data-windows-link');
               if (windowsLink) {
                   window.location.href = windowsLink;
                   return;
               }
           } else if (userAgent.indexOf('mac') !== -1) {
               const macLink = button.getAttribute('data-mac-link');
               if (macLink) {
                   window.location.href = macLink;
                   return;
               }
           } else if (userAgent.indexOf('linux') !== -1) {
               const linuxLink = button.getAttribute('data-linux-link');
               if (linuxLink) {
                   window.location.href = linuxLink;
                   return;
               }
           }
       }

       // Fallback to default link if platform-specific link not available
       const defaultLink = button.getAttribute('data-default-link');
       if (defaultLink) {
           window.location.href = defaultLink;
       }
   }

   // Initialize processing indicators
   const processingIndicators = document.querySelectorAll('.processing-indicator');
   processingIndicators.forEach(indicator => {
       indicator.style.width = '0';
       indicator.style.transition = `width ${indicator.getAttribute('data-time')}ms ease-in-out`;
   });

   // Analytics tracking for downloads (placeholder - implement with your analytics service)
   function trackDownload(appId, appType) {
       if (window.analyticsTracker) {
           window.analyticsTracker.trackEvent('app_download', {
               app_id: appId,
               app_type: appType,
               platform: isIOS ? 'ios' : (isAndroid ? 'android' : 'desktop')
           });
       }
   }
});
