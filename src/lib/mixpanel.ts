import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = '0d4bdd357e74e917fe33fe784b6363e1'; 

mixpanel.init(MIXPANEL_TOKEN, {
    debug: true, 
});

export default mixpanel;

