import axios from 'axios';


axios.defaults.headers.post['Content-Type'] =
    'application/x-www-form-urlencoded; charset=UTF-8';
axios.defaults.method = 'post';


export default axios;
