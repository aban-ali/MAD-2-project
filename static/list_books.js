import { header_temp,books_body,foot } from "./components.js";
const taskbar={
    data(){
        return{
            is_searched:false,
            name_search:false,
            genre_search:false,
            show_table:false,
            join:false
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
                        <span @click="home" class="btn nav-link">Home</span>
                    </li>
                    <li class="nav-item">
                        <span @click="logout" class="nav-link btn">Log out</span>
                    </li>
                </ul>

                <div v-if="$root.is_premium" class="d-flex me-2">
                    <span class="p-2 rounded-4 text-warning border border-warning">Premium Member</span>
                </div>
                <div v-else class="d-flex me-2">
                    <span @click="join=true" class="p-2 btn rounded-4 btn-outline-warning">
                        Become Premium Member
                    </span>
                </div>

                <div class="d-flex" role="search">
                    <input class="form-control me-2" type="search" placeholder="Search">
                    <button @click="search" class="btn btn-outline-success" type="submit">Search</button>
                </div>
            </div>
        </div>
    </nav>
    <div class="popup-form" v-if="this.join">
        <div class="overlay" @click="this.closeForm_member"></div>
        <div class="content">
        <span class="close-btn bg-danger rounded-3" @click="this.closeForm_member">&nbsp;&times;&nbsp;</span>
        <h2>Premium Subscription</h2>
            <ul>Benifits For Premium Members
                <li class="ms-4">Read in an ad-free environment</li>
                <li class="ms-4">Can hold upto 7 books</li>
                <li class="ms-4">Lorem ipsum dolor sit amet</li>
            </ul>
            <div>So why wait!! Become a member for $1 million now!</div>
            <div class="d-grid gap-2 my-3">
                <span @click="become_member" class="btn btn-outline-warning">Become a Member NOW</span>
            </div>
        </div>
    </div>
    <div v-if="is_searched">
        <div v-if="name_search">
        </div>
        <div v-if="genre_search">
        </div>
        <div v-if="no_search">
        </div>
    </div>
    <div>
    <div v-if="$root.role=='Admin'" class="d-grid gap-2">
        <button @click="show" class="btn btn-outline-success mx-5 my-2" type="button">Click here to see stats</button>
    </div>
    <table v-if="show_table" class="table table-success my-3 table-striped table-hover" style="width:80%; margin:auto;">
        <thead><tr><th>Quality</th><th>Value</th></tr></thead>
        <tbody><tr><td>Total number of books</td><td>1</td></tr>
        <tr><td>Most read book of all times</td><td>1</td></tr>
        <tr><td>Current most popular book</td><td>1</td></tr>
        <tr><td>Total number of genres</td><td>1</td></tr>
        <tr><td>Most like genre</td><td>1</td></tr>
        <tr><td>Total number of users</td><td>1</td></tr>
        <tr><td>Total number of Student users</td><td>1</td></tr>
        <tr><td>Total number of Faculty users</td><td>1</td></tr>
        <tr><td>Total number of active users</td><td>1</td></tr>
        <tr><td>Total number of books on hold by users</td><td>1</td></tr>
        <tr><td>Number of members with premium subscription</td><td>1</td></tr></tbody>
    </table>
    </div>
</div>`,
computed:{
    no_search:function(){
        if(!this.name_search && !this.genre_search){
            return true;
        }else{
            return false;
        }
    }
},
methods:{
    home:function(){
        if(books.role=="Admin"){
            window.location.href="/admin-dashboard";
        }else{
            window.location.href="/dashboard";
        }
    },
    show:function(){
        this.show_table=!this.show_table;
    },
    closeForm_member:function(){
        this.join=false
    },
    become_member:function(){
        let query=`mutation{
            user(user_name:"${book.user_name}",is_premium:true)
          }`
          console.log(query)
        const requestOption = {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: query }),
        };
        fetch('http://127.0.0.1:5000/graphql',requestOption).then(res=>res.json())
        .then(data=>{
            console.log(data)
        }).catch(err=>console.log("Graphql Error : ",err))
    },
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
            if(books.role=="Admin"){window.location.href='/admin';}
            else{window.location.href='/'}}
        }).catch(err=> console.log(err));
    },
    search:function(){
        
    }
    }
}



const books=new Vue({
    el:"#app",
    data:{
        role:"",
        username:"",
        is_premium:false
    },
    template:`
    <div>
        <header-temp/>
        <taskbar/>
        <books-body/>
        <foot-er/>
    </div>`,
    components:{
        "header-temp":header_temp,
        "taskbar":taskbar,
        "books-body":books_body,
        "foot-er":foot
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
            if(!data.active_status){
            window.location.href='/error_page';
        }else{
            this.role=data.role;
            this.username=data.username;
        }
        }).catch(err=> console.log(err));
        let query=`{
            user(user_name:"${this.username}"){
                is_premium
            }
          }`
          const requestOption = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ query: query }),
            };
            let apiUrl="http://127.0.0.1:5000/graphql";
          fetch(apiUrl, requestOption)
          .then(response => response.json())
          .then(data =>{
              this.is_premium=data.data.user[0].is_premium
          })
          .catch(error => {
              console.error('GraphQL Error:', error);
          });





    }
})