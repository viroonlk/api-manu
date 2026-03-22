const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// ใส่ API Key ของคุณตรงนี้ (เช็คให้ดีว่าไม่มีช่องว่างเกินมานะฮะ)
const API_KEY = '906683b96fmsh44b4717abf406dap15a0ebjsn6ff6a6596850';

// 1. หน้าแรก (เอาไว้เช็คว่าเซิร์ฟเวอร์รันอยู่ไหม)
app.get('/', (req, res) => {
    res.send('<h1>เซิร์ฟเวอร์น้อง Devie พร้อมทำงานแล้วฮะ! 🔴😈</h1>');
});

// 2. API ค้นหานักเตะ (สำหรับปุ่มนักเตะ)
app.get('/api/search-player', async (req, res) => {
    const playerName = req.query.name || 'bruno';
    try {
        const response = await axios.get(`https://free-api-live-football-data.p.rapidapi.com/football-players-search?search=${playerName}`, {
            headers: {
                'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com',
                'x-rapidapi-key': API_KEY
            }
        });
        const player = response.data.response[0].player;
        res.json({
            reply_text: `นี่ฮะข้อมูล! ${player.name} อายุ ${player.age} ปี สัญชาติ ${player.nationality} ฮะ`
        });
    } catch (error) {
        res.json({ reply_text: "ง่า... Devie หาข้อมูลนักเตะคนนี้ไม่เจอฮะ ลองชื่ออื่นดูนะ" });
    }
});

// 3. API นัดถัดไป (สำหรับปุ่มนัดต่อไป)
app.get('/api/next-match', async (req, res) => {
    try {
        const response = await axios.get('https://v3.football.api-sports.io/fixtures?team=33&next=1', {
            headers: {
                'x-rapidapi-key': API_KEY,
                'x-rapidapi-host': 'v3.football.api-sports.io'
            }
        });

        const match = response.data.response[0];
        if (match) {
            const home = match.teams.home.name;
            const away = match.teams.away.name;
            const venue = match.fixture.venue.name;
            const date = new Date(match.fixture.date).toLocaleString('th-TH', { 
                dateStyle: 'long', 
                timeStyle: 'short' 
            });

            res.json({
                reply_text: `นัดต่อไปมาแล้วฮะ! 🔴\n⚽️ ${home} vs ${away}\n📅 วันที่: ${date}\n🏟 สนาม: ${venue}\nอย่าลืมเชียร์กันนะฮะ! 😈`
            });
        } else {
            res.json({ reply_text: "ช่วงนี้ยังไม่มีโปรแกรมแข่งนัดถัดไปเลยฮะ" });
        }
    } catch (error) {
        res.json({ reply_text: "ง่า... ตอนนี้ Devie เช็คตารางแข่งไม่ได้ฮะ ลองใหม่อีกทีนะ" });
    }
});

app.listen(port, () => {
    console.log(`🚀 เซิร์ฟเวอร์รันแล้วที่ http://localhost:${port}`);
});