document.getElementById('uploadForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData();
    const fileField = document.querySelector('input[type="file"]');
    formData.append('image', fileField.files[0]);
    
    const response = await fetch('/upload', {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        loadImages();
    } else {
        console.error('Upload failed');
    }
});

async function loadImages() {
    const response = await fetch('/images');
    const images = await response.json();
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';
    images.forEach(image => {
        const img = document.createElement('img');
        img.src = `/uploads/${image.filename}`;
        gallery.appendChild(img);
    });
}

loadImages();
