document.getElementById('downloadBtn').addEventListener('click', async function() {
    const videoLink = document.getElementById('videoLink').value.trim();
    const resultArea = document.getElementById('resultArea');
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

    // Canlı sitede 404 vermeyecek olan gerçek indirme tünelleri
    const mp4DownloadUrl = `https://www.youtubepp.com/watch?v=${videoId}`;
    const audioApiUrl = `https://youtube-video-fast-downloader-24-7.p.rapidapi.com/download_audio/${videoId}?quality=251`;
    
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-host': 'youtube-video-fast-downloader-24-7.p.rapidapi.com',
            'x-rapidapi-key': 'a97210ca27mshca0a4f6a44ada0dp1a1efdjsn6fc298dcfb3e'
        }
    };

    try {
        const response = await fetch(audioApiUrl, options);
        const result = await response.json();
        let finalAudioUrl = result.file || result.reserved_file || result.url;

        if (finalAudioUrl) {
            resultArea.innerHTML = `
                <h3>Medya İndirilmeye Hazır!</h3>
                <a id="saveBtnVideo" href="${mp4DownloadUrl}" target="_blank" style="background-color: #0056b3; margin-bottom: 10px; display: block; padding: 12px; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; text-align: center;">Cihaza Kaydet (MP4 Görüntülü)</a>
                <a id="saveBtnAudio" href="${finalAudioUrl}" target="_blank" style="background-color: #800020; display: block; padding: 12px; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; text-align: center;">Cihaza Kaydet (MP3/Opus Ses)</a>
            `;
        } else {
            resultArea.innerHTML = `
                <h3>Video İndirilmeye Hazır!</h3>
                <a id="saveBtnVideo" href="${mp4DownloadUrl}" target="_blank" style="background-color: #0056b3; display: block; padding: 12px; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; text-align: center;">Cihaza Kaydet (MP4 Görüntülü)</a>
            `;
        }
        resultArea.style.display = "block";

    } catch (error) {
        // Canlıda CORS aşılırsa RapidAPI patlasa bile MP4 butonu her türlü açılacak
        resultArea.innerHTML = `
            <h3>Video İndirilmeye Hazır!</h3>
            <a id="saveBtnVideo" href="${mp4DownloadUrl}" target="_blank" style="background-color: #0056b3; display: block; padding: 12px; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; text-align: center;">Cihaza Kaydet (MP4 Görüntülü)</a>
        `;
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
