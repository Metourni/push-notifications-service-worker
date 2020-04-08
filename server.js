const express = require('express');
const path = require('path');
const logger = require('morgan');
const webPush = require('web-push');

const config = require('./config');

const port =config.api.port || 5431;
const app = express();

// Set app logger
app.use(logger('dev'));

// Pars the requests
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Test route.
app.get('/test', function(req, res) {
    return res.send('API is working..')
})

// Config the static part
// the __dirname is the current directory from where the script is running
app.use(express.static(path.join(__dirname, 'public')))

// set web push configuration
webPush.setVapidDetails('mailto:en_metourni@esi.dz',config.vapidKey.public,config.vapidKey.private);

let subscriptions= [];
// subscribe
app.post('/subscribe',(req,res,next)=>{
    // Get the subscription object.
    const subscription = req.body
    console.log(' req.body', req.body)

    // send success status
    res.status(201).json({subscription:true})

    // set the data
    const data = JSON.stringify({title:"Meto push notification created"})

    // send the notificaton
    webPush.sendNotification(subscription,data)
        .catch(error=>{
            console.log("error pushing notification",error)
        })

    subscriptions.push(subscription)
})

// send a custom notification endpoint.
app.post('/send-push-notification',(req,res)=>{
    const {title,content} = req.body;
    subscriptions.map((subscription,index) =>{
        console.log('subscription: ',index)
        // set the data
        const data = JSON.stringify({title,content})

        // send the notification
        webPush.sendNotification(subscription,data)
            .catch(error=>{
                console.log("error pushing notification",error)
            })
    })
    // send success status
    res.status(201).json({sent:true})
})

/** Handel Errors */
app.use((req, res, next) => {
    const error = new Error('Resource not Found');
    error.status = 404;
    next(error);
});
app.use((error, req, res) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message || "Server Error!"
        }
    });
});
app.listen(port,()=>{
    console.log('The app : ' + config.app.name + ' Server started on : ' + config.api.baseUrl);
})


