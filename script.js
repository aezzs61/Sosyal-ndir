document.getElementById('downloadBtn').addEventListener('click', async function() {
    const videoLink = document.getElementById('videoLink').value.trim();
    const resultArea = document.getElementById('resultArea');
    const saveBtn = document.getElementById('saveBtn');
    const downloadBtn = this;

    if (!videoLink) {
        alert("Lütfen bir YouTube linki yapıştırın!");
        return;
    }

    if (!videoLink.includes('youtube.com') && !videoLink.includes('youtu.be')) {
        alert("Lütfen geçerli bir YouTube bağlantısı girin.");
        return;
    }

    downloadBtn.innerText = "Video İşleniyor...";
    downloadBtn.disabled = true;
    downloadBtn.style.opacity = "0.7";
    resultArea.style.display = "none";

    const videoId = extractVideoId(videoLink);
    
    // Tarayıcıyı tetiklemeyen alternatif bir ücretsiz herkese açık GET API'si
    const apiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent('https://api.cobalt.tools/api/json')}`;

    try {
        // Doğrudan Cobalt yerine proxy tüneli üzerinden GET yapıyoruz, localhost CORS hatası vermez
        const response = await fetch(`https://api.codetabs.com/v1/proxy?url=${encodeURIComponent('https://api.cobalt.tools/api/json')}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: `https://www.youtube.com/watch?v=${videoId}`,
                videoQuality: '720'
            })
        });

        const result = await response.json();

        if (result && result.url) {
            saveBtn.href = result.url;
            resultArea.style.display = "block"; 
        } else {
            // Yedek Köprü
            saveBtn.href = `https://www.youtubepp.com/watch?v=${videoId}`;
            resultArea.style.display = "block";
        }

    } catch (error) {
        console.log("CORS nedeniyle otomatik köprü kuruldu.");
        // Localhostta her ihtimale karşı butonu aç ve çalıştır
        saveBtn.href = `https://www.youtubepp.com/watch?v=${videoId}`;
        resultArea.style.display = "block";
    } finally {
        downloadBtn.innerText = "Videoyu Yakala";
        downloadBtn.disabled = false;
        downloadBtn.style.opacity = "1";
    }
});

function extractVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
}
