import { header_temp,books_body } from "./components.js";
const taskbar={
    data(){
        return{
            is_searched:false,
            name_search:false,
            genre_search:false,
            rating_search:false,
        }
    },
    template:`
<div>
    <nav class="navbar navbar-expand-lg bg-light">
        <div class="container-fluid">
            <span class="navbar-brand" style="font-family: 'Brush Script MT', cursive;">Mistborn</span>
            <div class="collapse text-center navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link" aria-current="page" href="/admin-dashboard">Home</a>
                </li>
                <li class="nav-item">
                    <span @click="logout" class="nav-link btn">Log out</span>
                </li>
                </ul>
                <div class="d-flex me-2">
                    <span class="p-2 rounded-4 text-warning border border-warning">Premium Member</span>
                </div>
                <div class="d-flex" role="search">
                    <input class="form-control me-2" type="search" placeholder="Search">
                    <button @click="search" class="btn btn-outline-success" type="submit">Search</button>
                </div>
            </div>
        </div>
    </nav>
    <div v-if="is_searched">
        <div v-if="name_search">
        </div>
        <div v-if="genre_search">
        </div>
        <div v-if="rating_search">
        </div>
        <div v-if="no_search">
        </div>
    </div>
</div>`,
computed:{
    no_search:function(){
        if(!this.name_search && !this.name_search && !this.name_search){
            return true;
        }else{
            return false;
        }
    }
},
methods:{
    logout:function(){
        const requestOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+localStorage.getItem('token')
            }
        };
        fetch('http://127.0.0.1:5000/logout', requestOptions).then(res=>res.json())
        .then(data=> { 
            if(!data.is_active){
                localStorage.removeItem("token")
                window.location.href='/admin';}
        }).catch(err=> console.log(err));
    },
    search:function(){
        
    }
    }
}



new Vue({
    el:"#app",
    template:`
    <div>
        <header-temp/>
        <taskbar/>
        <books-body/>
    </div>`,
    components:{
        "header-temp":header_temp,
        "taskbar":taskbar,
        "books-body":books_body
    },
    mounted:function(){
        const requestOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+localStorage.getItem('token')
            }
          };
          fetch('http://127.0.0.1:5000/validate', requestOptions).then(res=>res.json())
          .then(data=> { 
            if(!data.active_status || (data.role!="Admin")){
            window.location.href='/error_page';
        }
        }).catch(err=> console.log(err));
    }
})