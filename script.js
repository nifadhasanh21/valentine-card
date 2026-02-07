document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const valentineCard = document.getElementById("valentineCard");
  const upload1 = document.getElementById("upload1");
  const upload2 = document.getElementById("upload2");
  const upload3 = document.getElementById("upload3");
  const upload4 = document.getElementById("upload4");
  const downloadBtn = document.getElementById("downloadBtn");
  const printBtn = document.getElementById("printBtn");
  const shareBtn = document.getElementById("shareBtn");
  const glowSlider = document.getElementById("glowSlider");
  const nameInput = document.getElementById("nameInput");
  const resetBtn = document.getElementById("resetBtn");
  const successMessage = document.getElementById("successMessage");
  const closeSuccess = document.getElementById("closeSuccess");

  // Set initial recipient name
  nameInput.value = "Nifad";
  updateMessage();

  // Smart photo fitting function
  function smartFitImage(imgElement, containerWidth, containerHeight) {
    const img = new Image();
    img.onload = function() {
      const imgWidth = this.width;
      const imgHeight = this.height;
      const imgAspectRatio = imgWidth / imgHeight;
      const containerAspectRatio = containerWidth / containerHeight;
      
      // Determine image orientation and apply appropriate styling
      if (imgAspectRatio > 1.2) {
        // Landscape image (wider than tall)
        imgElement.classList.add('landscape');
        imgElement.classList.remove('portrait', 'square');
        imgElement.style.objectFit = 'cover';
        imgElement.style.objectPosition = 'center center';
      } else if (imgAspectRatio < 0.8) {
        // Portrait image (taller than wide)
        imgElement.classList.add('portrait');
        imgElement.classList.remove('landscape', 'square');
        imgElement.style.objectFit = 'contain';
        imgElement.style.objectPosition = 'center center';
        imgElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        imgElement.style.padding = '10px';
      } else {
        // Square or near-square image
        imgElement.classList.add('square');
        imgElement.classList.remove('portrait', 'landscape');
        imgElement.style.objectFit = 'cover';
        imgElement.style.objectPosition = 'center center';
      }
      
      // Apply smart positioning based on image content
      if (imgAspectRatio > 1.5) {
        // Very wide landscape - focus on center
        imgElement.style.objectPosition = 'center 30%';
      } else if (imgAspectRatio < 0.7) {
        // Very tall portrait
        imgElement.style.objectPosition = 'center 20%';
      }
    };
    img.src = imgElement.src;
  }

  // Enhanced photo filter
  function applyEnhancedRomanticFilter(imgElement) {
    // Smart filters based on image analysis
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = this.width;
      canvas.height = this.height;
      ctx.drawImage(this, 0, 0);
      
      // Get average brightness
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let totalBrightness = 0;
      for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        totalBrightness += (r + g + b) / 3;
      }
      const avgBrightness = totalBrightness / (imageData.data.length / 4);
      
      // Apply smart filters based on brightness
      let filter = '';
      if (avgBrightness < 100) {
        // Dark image - enhance more
        filter = 'brightness(1.15) contrast(1.1) saturate(1.2)';
      } else if (avgBrightness > 180) {
        // Very bright image - tone down
        filter = 'brightness(0.95) contrast(1.05) saturate(1.05)';
      } else {
        // Normal image
        filter = 'brightness(1.08) contrast(1.08) saturate(1.15)';
      }
      
      // Add warm tone
      filter += ' sepia(0.1)';
      
      imgElement.style.filter = filter;
      imgElement.style.transition = 'filter 0.7s ease, transform 0.5s ease';
      
      // Add subtle scale effect
      imgElement.style.transform = 'scale(1.02)';
      setTimeout(() => {
        imgElement.style.transform = 'scale(1)';
      }, 300);
    };
    img.src = imgElement.src;
  }

  // Upload photo functionality
  function setupPhotoUpload(uploadInput, photoNumber) {
    uploadInput.addEventListener("change", function (e) {
      if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();

        reader.onload = function (event) {
          const img = new Image();
          img.onload = function () {
            const photoFrame = document.querySelector(`.frame-${photoNumber}`);
            const placeholder = document.getElementById(`photo${photoNumber}`);
            const frameRect = photoFrame.getBoundingClientRect();

            let imgElement = photoFrame.querySelector(".couple-photo");

            if (!imgElement) {
              imgElement = document.createElement("img");
              imgElement.className = "couple-photo";
              imgElement.alt = `Couple Photo ${photoNumber}`;
              imgElement.id = `uploadedPhoto${photoNumber}`;

              photoFrame.insertBefore(imgElement, placeholder);
            }

            imgElement.src = event.target.result;
            imgElement.style.display = "block";
            photoFrame.classList.add("has-photo");
            placeholder.style.display = "none";
            
            // Apply smart fitting
            smartFitImage(imgElement, frameRect.width, frameRect.height);
            
            // Apply enhanced filter
            applyEnhancedRomanticFilter(imgElement);
            
            showSuccessMessage(`Photo ${photoNumber} uploaded successfully!`);
          };
          img.src = event.target.result;
        };

        reader.readAsDataURL(e.target.files[0]);
      }
    });
  }

  // Setup all photo uploads
  setupPhotoUpload(upload1, 1);
  setupPhotoUpload(upload2, 2);
  setupPhotoUpload(upload3, 3);
  setupPhotoUpload(upload4, 4);

  // Update romantic message with recipient's name
  function updateMessage() {
    const name = nameInput.value.trim() || "Nifad";
    const messageElement = document.querySelector(".message-text");
    messageElement.innerHTML = `"Every moment with you is my favorite memory. Happy Valentine's Day, ${name} ❤️"`;
  }

  // Glow intensity control
  glowSlider.addEventListener("input", function () {
    const glowValue = this.value;
    const bokehs = document.querySelectorAll(".bokeh");

    bokehs.forEach((bokeh) => {
      const currentOpacity = parseFloat(
        bokeh.style.opacity || getComputedStyle(bokeh).opacity,
      );
      const baseOpacity = parseFloat(
        bokeh.getAttribute("data-base-opacity") || 0.3,
      );
      const newOpacity = baseOpacity * (glowValue / 100);
      bokeh.style.opacity = newOpacity;
    });

    const sparkles = document.querySelectorAll(".sparkle");
    sparkles.forEach((sparkle) => {
      const baseOpacity = parseFloat(
        sparkle.getAttribute("data-base-opacity") || 0.5,
      );
      const newOpacity = baseOpacity * (glowValue / 100);
      sparkle.style.opacity = newOpacity;
    });
  });

  // Initialize bokeh base opacity values
  function initializeBokehOpacity() {
    const bokehs = document.querySelectorAll(".bokeh");
    bokehs.forEach((bokeh, index) => {
      const baseOpacity = parseFloat(getComputedStyle(bokeh).opacity);
      bokeh.setAttribute("data-base-opacity", baseOpacity);
    });

    const sparkles = document.querySelectorAll(".sparkle");
    sparkles.forEach((sparkle, index) => {
      const baseOpacity = 0.5;
      sparkle.setAttribute("data-base-opacity", baseOpacity);
    });
  }

  // Name input change handler
  nameInput.addEventListener("input", updateMessage);

  // Reset to default
  resetBtn.addEventListener("click", function () {
    const photoFrames = document.querySelectorAll(".photo-frame");
    const placeholders = document.querySelectorAll(".empty-photo-placeholder");
    const uploadedPhotos = document.querySelectorAll(".couple-photo");

    uploadedPhotos.forEach((photo) => {
      photo.remove();
    });

    placeholders.forEach((placeholder) => {
      placeholder.style.display = "flex";
    });

    photoFrames.forEach((frame) => {
      frame.classList.remove("has-photo");
    });

    nameInput.value = "Nifad";
    updateMessage();

    glowSlider.value = 70;
    glowSlider.dispatchEvent(new Event("input"));

    upload1.value = "";
    upload2.value = "";
    upload3.value = "";
    upload4.value = "";

    showSuccessMessage("Card has been reset to default settings!");
  });

  // Create a downloadable version of the card with optimized photos
  function createDownloadableCard() {
    const downloadContainer = document.createElement('div');
    downloadContainer.id = 'downloadCardContainer';
    downloadContainer.style.cssText = `
      position: fixed;
      top: -9999px;
      left: -9999px;
      width: 800px;
      height: 700px;
      z-index: -9999;
    `;
    
    const cardClone = valentineCard.cloneNode(true);
    cardClone.id = 'downloadCard';
    cardClone.style.cssText = `
      width: 800px;
      height: 700px;
      padding: 40px;
      margin: 0;
      background: linear-gradient(145deg, #0c0c0c 0%, #1a1a1a 100%);
      border-radius: 20px;
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(232, 180, 188, 0.1);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
    `;
    
    const photosContainer = cardClone.querySelector('.photos-container');
    if (photosContainer) {
      photosContainer.style.cssText = `
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        gap: 20px;
        height: 65%;
        margin-bottom: 25px;
        position: relative;
        z-index: 2;
      `;
      
      const frames = photosContainer.querySelectorAll('.photo-frame');
      frames.forEach(frame => {
        frame.style.cssText = `
          border-radius: 15px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          border: 2px solid rgba(232, 180, 188, 0.3);
        `;
      });
      
      // Set 2x2 grid positions for all 4 frames
      const frame1 = photosContainer.querySelector('.frame-1');
      if (frame1) {
        frame1.style.gridColumn = "1";
        frame1.style.gridRow = "1";
      }
      
      const frame2 = photosContainer.querySelector('.frame-2');
      if (frame2) {
        frame2.style.gridColumn = "2";
        frame2.style.gridRow = "1";
      }
      
      const frame3 = photosContainer.querySelector('.frame-3');
      if (frame3) {
        frame3.style.gridColumn = "1";
        frame3.style.gridRow = "2";
      }
      
      const frame4 = photosContainer.querySelector('.frame-4');
      if (frame4) {
        frame4.style.gridColumn = "2";
        frame4.style.gridRow = "2";
      }
    }
    
    const messageSection = cardClone.querySelector('.romantic-message');
    if (messageSection) {
      messageSection.style.cssText = `
        background: rgba(0, 0, 0, 0.5);
        border-radius: 15px;
        padding: 25px;
        position: relative;
        z-index: 2;
        border-left: 4px solid #e8b4bc;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
      `;
    }
    
    // Copy all uploaded photos to the clone with optimization
    for (let i = 1; i <= 4; i++) {
      const originalPhoto = document.getElementById(`uploadedPhoto${i}`);
      if (originalPhoto && originalPhoto.src) {
        const clonePhotoContainer = cardClone.querySelector(`.frame-${i}`);
        if (clonePhotoContainer) {
          const placeholder = clonePhotoContainer.querySelector('.empty-photo-placeholder');
          if (placeholder) {
            placeholder.style.display = 'none';
          }
          
          const img = document.createElement('img');
          img.src = originalPhoto.src;
          img.className = 'couple-photo';
          
          // Apply smart styling based on original photo
          if (originalPhoto.classList.contains('portrait')) {
            img.className += ' portrait';
            img.style.cssText = `
              width: 100%;
              height: 100%;
              object-fit: contain;
              display: block;
              filter: brightness(1.08) contrast(1.08) saturate(1.15) sepia(0.1);
              background-color: rgba(0, 0, 0, 0.7);
              padding: 15px;
            `;
          } else if (originalPhoto.classList.contains('landscape')) {
            img.className += ' landscape';
            img.style.cssText = `
              width: 100%;
              height: 100%;
              object-fit: cover;
              display: block;
              filter: brightness(1.08) contrast(1.08) saturate(1.15) sepia(0.1);
              object-position: center center;
            `;
          } else {
            img.className += ' square';
            img.style.cssText = `
              width: 100%;
              height: 100%;
              object-fit: cover;
              display: block;
              filter: brightness(1.08) contrast(1.08) saturate(1.15) sepia(0.1);
              object-position: center center;
            `;
          }
          
          clonePhotoContainer.appendChild(img);
        }
      }
    }
    
    downloadContainer.appendChild(cardClone);
    document.body.appendChild(downloadContainer);
    
    return downloadContainer;
  }

  // Download card as image
  downloadBtn.addEventListener("click", function () {
    const originalText = downloadBtn.innerHTML;
    downloadBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Optimizing & Generating...';
    downloadBtn.disabled = true;

    if (typeof html2canvas !== "undefined") {
      const downloadContainer = createDownloadableCard();
      const downloadCard = document.getElementById('downloadCard');
      
      // Wait for images to load
      setTimeout(() => {
        html2canvas(downloadCard, {
          scale: 3,
          useCORS: true,
          backgroundColor: null,
          allowTaint: true,
          width: 800,
          height: 700,
          logging: false,
          imageTimeout: 15000,
          removeContainer: true
        })
          .then((canvas) => {
            const link = document.createElement("a");
            link.download = `valentine-card-${nameInput.value || "nifad"}.png`;
            link.href = canvas.toDataURL("image/png", 0.95); // 95% quality
            link.click();

            document.body.removeChild(downloadContainer);

            downloadBtn.innerHTML = originalText;
            downloadBtn.disabled = false;

            showSuccessMessage(
              "High-quality card downloaded successfully! Ready for printing.",
            );
          })
          .catch((error) => {
            console.error("Error generating image:", error);
            const container = document.getElementById('downloadCardContainer');
            if (container) {
              document.body.removeChild(container);
            }
            downloadBtn.innerHTML = originalText;
            downloadBtn.disabled = false;
            alert("There was an error generating the image. Please try again.");
          });
      }, 1000); // Give time for images to load
    } else {
      alert("Please make sure the page is fully loaded and try again.");
      downloadBtn.innerHTML = originalText;
      downloadBtn.disabled = false;
    }
  });

  // Print card
  printBtn.addEventListener("click", function () {
    const getPhotoSrc = (photoNumber) => {
      const imgElement = document.getElementById(`uploadedPhoto${photoNumber}`);
      if (imgElement && imgElement.src) {
        return imgElement.src;
      }
      return "";
    };

    const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Valentine's Day Card for ${nameInput.value || "Nifad"}</title>
                <style>
                    body { 
                        font-family: 'Arial', sans-serif; 
                        margin: 0; 
                        padding: 20px; 
                        background: #f5f5f5;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                    }
                    .print-card {
                        width: 8.5in;
                        height: 11in;
                        background: linear-gradient(145deg, #0c0c0c 0%, #1a1a1a 100%);
                        border-radius: 20px;
                        padding: 40px;
                        position: relative;
                        overflow: hidden;
                        color: white;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                        border: 1px solid #e8b4bc;
                    }
                    .print-card h1 {
                        text-align: center;
                        font-family: 'Dancing Script', cursive;
                        font-size: 3rem;
                        color: #e8b4bc;
                        margin-bottom: 30px;
                    }
                    .print-images {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        grid-template-rows: 1fr 1fr;
                        gap: 20px;
                        margin-bottom: 30px;
                        height: 400px;
                    }
                    .print-img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        border-radius: 15px;
                        border: 2px solid #e8b4bc;
                        background-color: rgba(0, 0, 0, 0.3);
                    }
                    .print-img.portrait {
                        object-fit: contain;
                        background-color: rgba(0, 0, 0, 0.7);
                        padding: 15px;
                    }
                    .print-img.landscape {
                        object-fit: cover;
                        object-position: center center;
                    }
                    .print-img.square {
                        object-fit: cover;
                        object-position: center center;
                    }
                    .print-message {
                        font-family: 'Dancing Script', cursive;
                        font-size: 2.5rem;
                        text-align: center;
                        padding: 30px;
                        border-top: 2px solid #e8b4bc;
                        margin-top: 20px;
                    }
                    .signature {
                        font-family: 'Dancing Script', cursive;
                        font-size: 2rem;
                        text-align: right;
                        color: #e8b4bc;
                        margin-top: 20px;
                    }
                    .empty-print-placeholder {
                        background: rgba(26, 26, 26, 0.8);
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        color: rgba(232, 180, 188, 0.5);
                        font-size: 1.2rem;
                        border-radius: 13px;
                        border: 2px dashed rgba(232, 180, 188, 0.2);
                    }
                    @media print {
                        body { background: white; }
                        .print-card { 
                            box-shadow: none; 
                            width: 100%;
                            height: auto;
                            page-break-inside: avoid;
                        }
                        .print-images {
                            page-break-inside: avoid;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="print-card">
                    <h1>Happy Valentine's Day, ${nameInput.value || "Nifad"}!</h1>
                    <div class="print-images">
                        ${getPhotoSrc(1) ? `<img src="${getPhotoSrc(1)}" alt="Couple Photo 1" class="print-img portrait">` : 
                          `<div class="print-img empty-print-placeholder">
                            <i class="fas fa-heart"></i>
                            <span>Photo 1</span>
                          </div>`}
                        ${getPhotoSrc(2) ? `<img src="${getPhotoSrc(2)}" alt="Couple Photo 2" class="print-img landscape">` : 
                          `<div class="print-img empty-print-placeholder">
                            <i class="fas fa-heart"></i>
                            <span>Photo 2</span>
                          </div>`}
                        ${getPhotoSrc(3) ? `<img src="${getPhotoSrc(3)}" alt="Couple Photo 3" class="print-img square">` : 
                          `<div class="print-img empty-print-placeholder">
                            <i class="fas fa-heart"></i>
                            <span>Photo 3</span>
                          </div>`}
                        ${getPhotoSrc(4) ? `<img src="${getPhotoSrc(4)}" alt="Couple Photo 4" class="print-img">` : 
                          `<div class="print-img empty-print-placeholder">
                            <i class="fas fa-heart"></i>
                            <span>Photo 4</span>
                          </div>`}
                    </div>
                    <div class="print-message">
                        "Every moment with you is my favorite memory. Happy Valentine's Day, ${nameInput.value || "Nifad"} ❤️"
                    </div>
                    <div class="signature">With all my love</div>
                </div>
                <script>
                    window.addEventListener('load', function() {
                        setTimeout(function() {
                            window.print();
                        }, 1500);
                    });
                <\/script>
            </body>
            </html>
        `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(printContent);
    printWindow.document.close();
  });

  // Share card
  shareBtn.addEventListener("click", function () {
    if (navigator.share) {
      navigator
        .share({
          title: `Valentine's Day Card for ${nameInput.value || "Nifad"}`,
          text: "I created a beautiful Valentine's Day card!",
          url: window.location.href,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing:", error));
    } else {
      showSuccessMessage(
        "Share feature is available on mobile devices. On desktop, you can download and share the card image.",
      );
    }
  });

  // Show success message
  function showSuccessMessage(message) {
    const successContent = successMessage.querySelector(".success-content");
    successContent.querySelector("h3").textContent =
      message.split("!")[0] + "!";
    successContent.querySelector("p").textContent =
      message.split("!")[1] || "The card has been updated.";
    successMessage.style.display = "flex";
  }

  // Close success message
  closeSuccess.addEventListener("click", function () {
    successMessage.style.display = "none";
  });

  // Initialize on page load
  initializeBokehOpacity();
  glowSlider.dispatchEvent(new Event("input"));

  // Add html2canvas library dynamically if not present
  if (typeof html2canvas === "undefined") {
    const script = document.createElement("script");
    script.src = "https://html2canvas.hertzen.com/dist/html2canvas.min.js";
    script.onload = function () {
      console.log("html2canvas loaded successfully");
    };
    document.head.appendChild(script);
  }

  // Handle window resize for responsive photo fitting
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      const photos = document.querySelectorAll('.couple-photo');
      photos.forEach((photo, index) => {
        if (photo.src) {
          const photoFrame = photo.closest('.photo-frame');
          if (photoFrame) {
            const frameRect = photoFrame.getBoundingClientRect();
            smartFitImage(photo, frameRect.width, frameRect.height);
          }
        }
      });
    }, 250);
  });
});