const axios = require('axios');

(async () => {
    console.log('Monitoring AIS count...');
    for (let i = 0; i < 5; i++) {
        try {
            const response = await axios.get('http://localhost:5001/api/ais');
            console.log(`[${new Date().toLocaleTimeString()}] Ships detected: ${response.data.length}`);
            if (response.data.length > 0) {
                const lngs = response.data.map(s => s.lng);
                const west = lngs.filter(l => l < 108).length;
                const central = lngs.filter(l => l >= 108 && l < 120).length;
                const east = lngs.filter(l => l >= 120).length;
                
                console.log(`- Distribution: West=${west}, Central=${central}, East=${east}`);
                console.log(`- Lng range: ${Math.min(...lngs).toFixed(2)} to ${Math.max(...lngs).toFixed(2)}`);
            }
        } catch (err) {
            console.error('Error:', err.message);
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
})();
