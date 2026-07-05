const express = require('express');
const path = require('path');
const yts = require('yt-search');
require('dotenv').config();

const app = express();

// Menggunakan folder 'public' untuk file statis agar dibaca sempurna oleh Vercel
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Rute utama untuk menampilkan index.html dari folder public
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
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

// Penyelamat Eror Vercel: Hanya menjalankan app.listen jika dijalankan di komputer lokal (buka Vercel)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3005;
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`\n🚀 Fckoff Spotfy Player Aktif Terkendali di Lokal!`);
        console.log(`Server berjalan secara publik pada port: ${PORT}\n`);
    });
}

// WAJIB: Mengekspor app Express agar bisa dibaca sebagai Serverless Function oleh Vercel
module.exports = app;