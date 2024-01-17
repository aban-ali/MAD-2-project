import { header_temp } from "./components.js";
import { taskbar } from "./components.js";
import { side_bar } from "./components.js";
Vue.component("header-temp",header_temp)
Vue.component("task-bar", taskbar)
Vue.component("side-bar",side_bar)

const user_dashboard=new Vue({
    el:"#app",
    data:{
        sidebar:false
    },
    template:`
    <div>
        <header-temp/>
        <task-bar/>
        <side-bar v-if="sidebar" />
        hjkldfghjkljhfgyuewfbyrhefuijenghelbriugberiugbhelifljfljfhahfhasdfihfbuihfn<br>
        fdsagfjhsdfkajsdhfkajsdbfkdsahfhhkdhfdksjahfksdalhfkasdfkahfklasdhfkajsdhfkalsdfkajsh<br><br>
        <br><br><br>
        fdsafasdfsdfsdhafladsbfkjdsahfkjhasdklfh
    </div>
    `,
    methods:{
        show_sidebar:function(){
            this.sidebar=!this.sidebar
        }

    },
    mounted: async function(){
        const requestOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+localStorage.getItem('token')
            }
          };
          await fetch('http://127.0.0.1:5000/validate', requestOptions).then(res=>res.json())
          .then(data=> {
            if(!data.active_status){
            window.location.href='/error_page';
        }
        }).catch(err=> console.log(err));
    }
})