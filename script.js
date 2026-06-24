document.getElementById('downloadBtn').addEventListener('click', function() {
    let videoLink = document.getElementById('videoLink').value.trim();
    const resultArea = document.getElementById('resultArea');
    const saveBtn = document.getElementById('saveBtn');

    if (!videoLink) {
        alert("Lütfen bir YouTube linki yapıştırın!");
        return;
    }

    // Link temizleme kontrolü
    if (videoLink.includes('url=')) {
        const urlParams = new URLSearchParams(videoLink.split('?')[1]);
        if (urlParams.has('url')) {
            videoLink = urlParams.get('url');
        }
    }

    if (!videoLink.includes('youtube.com') && !videoLink.includes('youtu.be')) {
        alert("Lütfen geçerli bir YouTube bağlantısı girin.");
        return;
    }

    this.innerText = "Bağlantı Hazırlanıyor...";
    this.disabled = true;

    // Temiz YouTube indirme kodu
    const videoId = extractVideoId(videoLink);
    const cleanDownloadUrl = `https://www.youtubepp.com/watch?v=${videoId}`;

    // Yeni sekme açmıyoruz! Sayfadaki "Cihaza Kaydet" butonunun hedefini değiştiriyoruz.
    saveBtn.href = cleanDownloadUrl;
    
    // Alt taraftaki Bordo-Mavi indirme kutusunu görünür yapıyoruz
    resultArea.style.display = "block";

    // Üstteki butonu eski haline getiriyoruz
    this.innerText = "Videoyu Yakala";
    this.disabled = false;
});

// Video ID'sini çeken fonksiyon
function extractVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
}
