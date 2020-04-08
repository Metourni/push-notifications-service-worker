console.log('worker loaded');

self.addEventListener('push',event=>{
    const data = event.data.json();
    console.log('Push notification received.',data);
    self.registration.showNotification(data.title,{
        body: data.content || 'Meto notification',
        icon:'https://metourni-portfolio.herokuapp.com/favicon.ico'
    })
})
