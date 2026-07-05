const express = require('express');
const path = require('path');
const yts = require('yt-search');
require('dotenv').config();

const app = express();
// Menggunakan port 3005 dari kemarin yang sudah aktif terkendali
const PORT = process.env.PORT || 3005; 

app.use(express.static(__dirname));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ENDPOINT UTAMA: Mencari daftar lagu berdasarkan nama penyanyi
app.post('/api/cari-artis', async (req, res) => {
    const { nama } = req.body;
    try {
        if (!nama) return res.status(400).json({ error: "Nama penyanyi tidak boleh kosong!" });
        
        // Cari lagu di YouTube (yang terbukti lancar dan gratis)
        const hasilCari = await yts(`${nama} audio`);
        
        // Ambil 15 hasil video teratas yang relevan
        const daftarLagu = hasilCari.videos.slice(0, 15).map(video => ({
            idVideo: video.videoId,
            judul: video.title,
            artis: video.author.name,
            durasi: video.timestamp,
            gambar: video.image
        }));

        res.json({ daftarLagu });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal mencari lagu di YouTube." });
    }
});

const PORT = process.env.PORT || 3005;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Fckoff Spotfy Player Aktif Terkendali!`);
    console.log(`Server berjalan secara publik pada port: ${PORT}\n`);
});