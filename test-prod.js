// Simulate a bot request (no browser headers)
const url = 'https://checkers4-pi.vercel.app/validation-key.txt';

console.log(`Fetching ${url}...`);

try {
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'PiNetwork/1.0 (Bot)', // Simulate a bot user agent
            'Accept': '*/*',
            'Cache-Control': 'no-cache'
        }
    });

    console.log(`Status: ${response.status}`);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));

    const text = await response.text();
    console.log('Body Length:', text.length);
    console.log('Body Preview:', text.substring(0, 50));

    if (text.includes('<!DOCTYPE html>')) {
        console.error('❌ FAILURE: Received HTML instead of raw text!');
    } else if (text.trim() === '6ea15fed2af1a0d886e63765a') {
        console.log('✅ SUCCESS: Received exact key!');
    } else {
        console.error('⚠️ WARNING: Content mismatch or extra characters.');
        console.log(`Received: "${text}"`);
    }
} catch (error) {
    console.error('Fetch error:', error);
}
