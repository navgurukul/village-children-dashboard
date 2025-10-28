import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN; 

mixpanel.init(MIXPANEL_TOKEN, {
    debug: import.meta.env.DEV, 
});

export default mixpanel;
