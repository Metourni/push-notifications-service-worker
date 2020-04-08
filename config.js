require('dotenv').config();

module.exports ={
    app:{
        name:'Push Notification',
    },
    api:{
        baseUrl:process.env.BASE_URL,
        port: process.env.PORT
    },
    vapidKey:{
        public: process.env.PUBLIC_VAPID_KEY,
        private: process.env.PRIVATE_VAPID_KEY,
    }
}
