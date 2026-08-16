// Shared constants and setup used across all Pool Scoreboard pages
const gameTypeNames = {
    '8ball': '8-Ball',
    '9ball': '9-Ball',
    '10ball': '10-Ball',
    '141': '14.1',
    'bank': 'Bank Pool',
    'onepocket': 'One Pocket'
};

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .catch(err => console.log('Service Worker registration failed:', err));
}
