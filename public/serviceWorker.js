'use strict';

// convert to unit 8 array
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// register the service worker and the push, send the push.
const register = async () => {
    //---- Register the service worker ----
    console.log('Registering...');
    const registration = await navigator.serviceWorker.register('/worker.js',{
        scope:'/'
    });
    console.log('Registered.');
    //---- /-Register the service worker ----


    //----- Register the push ----
    console.log('Registering push...');

    const vapidPublicKey = "BJErYHpTCnLxxCdX0QKZKxYpnj8UpjyLgZRpkITdofanA_6h9c_ZMHzrHpx4W6TXvHWgfI3n4kig_tv-6GyZpGg"
    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly:true,
        applicationServerKey:convertedVapidKey
    })
    console.log('Push registered');
    //----- /-Register the push ----

    //----- Send push notification ----
    console.log('Sending push...');
    await fetch('/subscribe',{
        method:'POST',
        body: JSON.stringify(subscription),
        headers:{
            'content-type':'application/json'
        }
    })
    console.log('push Sent.');
}

// check if browser support service worker.
if ('serviceWorker' in navigator) {
    register()
        .catch(error =>
            console.log("error sending", error)
        )
}
