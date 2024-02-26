import { header_temp,foot} from "./components.js";
Vue.component("header-temp",header_temp)
//-----------------------------------------TASKBAR----------------------------------------
const taskbar={
    data(){
      return{
        genres:[],
        join:false,
      }
    },  
    template:`
    <div style="z-index:0">
        <div class="taskbar">
            <nav class="navbar sticky-top navbar-expand-lg bg-light">
                <div class="container-fluid">
                    <span class="navbar-brand" style="font-family: 'Brush Script MT', cursive;">Mistborn</span>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            <li class="nav-item">
                            <a class="nav-link" href="/admin-dashboard">Home</a>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link btn" to="/admin/users">User </router-link>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link btn" to="/admin/request">Request</router-link>
                            </li>
                            <li class="nav-item">
                                <span @click="logout" class="nav-link btn">Log out</span>
                            </li>
                        </ul>
                        <div class="d-flex me-2">
                            <span class="p-2 rounded-4 text-warning border border-warning">Premium Member</span>
                        </div>
                        <div class="d-flex" role="search">
                            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                            <button class="btn btn-outline-success" type="submit">Search</button>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    </div>`,
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
        }
    }
}
Vue.component("task-bar", taskbar)

//--------------------------------ADMIN'S USER BODY PAGE---------------------------------------
const users_details={
    data(){
        return{
            active_details:true,
            active_books:false,
            all_users:[]
        }
    },
    template:`
    <div class="m-5">
        <div class="card text-center rounded-3 my-3" v-for="user in all_users">
            <div class="card-header">
            <ul class="nav nav-tabs card-header-tabs">
                <li class="nav-item">
                    <span @click="user.toggle=!user.toggle" class="nav-link btn" :class="{active:user.toggle}">Details</span>
                </li>
                <li class="nav-item">
                    <span @click="user.toggle=!user.toggle" class="nav-link btn" :class="{active:!user.toggle}">Books borrowed</span>
                </li>
            </ul>
            </div>
            <div v-if="user.toggle" class="card-body">
                <h5 class="card-title mb-3">User Details</h5>
                <div class="card-text row">
                    <p class="col-4">
                        <ul>
                            <li><span class="text-success">Name of user : </span> {{user.name}}</li>
                            <li><span class="text-success">Username : </span> {{user.user_name}}</li>
                            <li><span class="text-success">Role : </span> {{user.role}}</li>
                            <li><span class="text-success">Email id : </span> {{user.email}}</li>
                        </ul>
                    </p>
                    <p class="col-4">
                        <ul>
                            <br>
                            <li><span class="text-success">Premium Membership Status : </span> {{user.is_premium}}</li>
                            <li><span class="text-success">Active Status : </span> {{user.is_active}}</li> 
                        </ul>
                    </p>
                    <p class="col-4">
                        <ul>
                            <li><span class="text-success">Books held times : </span> {{user.books_borrowed}}</li>
                            <li><span class="text-success">Books hold : </span> {{user.books.length}}</li>
                            <li><span class="text-success">Book Hold Allowed : </span> <span v-if="user.is_premium">10</span>
                            <span v-else-if="user.role=='Student'">5</span><span v-else>7</span></li>
                            <li><span class="text-success">Requested Books : </span> {{req_books(user.requests)}}</li>
                        </ul> 
                    </p>
                </div>
            </div>
            <div v-if="!user.toggle" class="card-body">
                <h5 class="card-title mb-0">Borrowed Book's Details</h5>
                <p class="card-text">
                    <span class="text-danger mb-4">(Click on any book name to restrict its access)</span>
                    <ul v-if="user.books.length" class="list-group list-group-flush">
                        <li v-for="book in user.books" class="list-group-item">
                            <span class="btn pe-3 btn-outline-danger" @click="revoke(user.id,book.id)">Book Name : {{book.name}} </span>
                            <span class="ps-5 text-primary"> Genre : </span><span v-for="gen in book.genre">| {{gen.name}} |</span>
                        </li>
                    </ul>
                    <ul v-else>{{user.name}} does not own any book</ul>
                </p>
            </div>
        </div>
    </div>`,
    methods:{
        toogle_active:function(){
            this.active_details=!this.active_details;
            this.active_books=!this.active_books;
        },
        req_books:function(requests){
            let count=0
            for(let val of requests){
                if(!val.status){
                    count++;
                }
            }
            return count
        },
        revoke:function(u_id,b_id){
            let query=`mutation{
                revoke(u_id:${u_id},b_id:${b_id})
              }`
              const requestOptions = {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ query: query }),
                };
                let apiUrl="http://127.0.0.1:5000/graphql";
              fetch(apiUrl, requestOptions).then(data=> console.log(data))
        }
    },
    mounted:function(){
        let query=`{
          user{
              id,
              name,
              user_name,
              email,
              role,
              is_premium,
              is_active,
              books_borrowed,
              requests{
                status
              }
              books{
                id,
                name,
                genre{
                    name
                }
              }
          }
        }`
        const requestOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: query }),
          };
          let apiUrl="http://127.0.0.1:5000/graphql";
        fetch(apiUrl, requestOptions)
        .then(response => response.json())
        .then(data =>{
          for(let user of data.data.user){
            user.toggle=true;
            this.all_users.push(user)
          }
        })
        .catch(error => {
            console.error('GraphQL Error:', error);
        });
      }
}

//-----------------------------------USER'S REQUEST---------------------------------------------
const users_request={
    data(){
        return{
            request:[]
        }
    },
    template:`<div>
    <div v-if="request.length>0" class="m-5">
        <div v-for="req in request" v-if="req.user.role!='Admin'" class="card">
            <h5 class="card-header">Request</h5>
            <div class="card-body">
                <h5 class="card-title">Request Details</h5>
                <div class="card-text row">
                    <p class="col-4">
                        <ul>
                            <li><span class="text-success">Name of user :</span> {{req.user.name}}</li>
                            <li><span class="text-success">Username :</span> {{req.user.user_name}}</li>
                            <li><span class="text-success">Premium Membership Status :</span> {{req.user.is_premium}}</li>
                            <li><span class="text-success">Type of User :</span> {{req.user.role}}</li>
                            <li><span class="text-success">Books read times :</span> {{req.user.books_borrowed}}</li>
                            <li><span class="text-success">Books hold/allowed :</span> {{ req.user.books.length }}/ <span v-if="req.user.is_premium">10</span>
                            <span v-else-if="req.user.role=='Student'">5</span><span v-else>7</span></li>
                        </ul>
                    </p>
                    <p class="col-4">
                        <ul>
                            <li><span class="text-success">Name of book :</span> {{req.book.name}}</li>
                            <li><span class="text-success">Genres : </span>
                                <ol>
                                    <li v-for="gen in req.book.genre">{{gen.name}}</li>
                                </ol>
                            </li>
                        </ul>
                    </p>
                    <p class="col-4">
                        <ul>
                            <h5>Book Access Permission</h5>
                            <button @click="accept_req(req.user.id,req.book.id,req.user.books.length,req.user.is_premium,req.user.role)" class="btn btn-outline-success mb-3 p-2">Accept Request</button><br>
                            <button @click="reject_req(req.user.id,req.book.id)" class="btn btn-outline-danger p-2">Reject Request </button>
                        </ul>
                    </p>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="m-5">
        <h3 class="text-center my-4">No request to display</h3>
        <ul>
        <li class="my-3">Man you are not advertising your website properly</li>
        <li class="my-3">Either that or your books are so bad that users don't want to read them.</li>
        </ul>
    </div>
    </div>`,
    methods:{
        accept_req:function(u_id,b_id,hold,is_premium,role){
            let max=0
            if(is_premium){
                max=10
            }else if(role=='Faculty'){
                max=7
            }else{
                max=5
            }
            if(hold>=max){
                alert("User has reached max limit of requesting books")
                return
            }
            let query=`mutation{
                request(u_id:${u_id},b_id:${b_id},status:true)
            }`
            const requestOptions = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: query }),
              };
              let apiUrl="http://127.0.0.1:5000/graphql";
            fetch(apiUrl, requestOptions)
            .catch(error => {
                console.error('GraphQL Error:', error);
            });
        },
        reject_req:function(u_id,b_id){
            let query=`mutation{
                request(u_id:${u_id},b_id:${b_id},status:false)
            }`
            const requestOptions = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: query }),
              };
              let apiUrl="http://127.0.0.1:5000/graphql";
            fetch(apiUrl, requestOptions)
            .catch(error => {
                console.error('GraphQL Error:', error);
            });
        }
    },
    mounted:function(){
        let query=`{
            request{
                status,
                user{
                    id,
                    name,
                    user_name,
                    role,
                    is_premium,
                    books_borrowed,
                    books{
                        id
                    }
                },
                book{
                    id,
                    name,
                    genre{
                        name
                    }
                    }
                }
          }`
          const requestOptions = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ query: query }),
            };
            let apiUrl="http://127.0.0.1:5000/graphql";
          fetch(apiUrl, requestOptions)
          .then(response => response.json())
          .then(data =>{
            this.request=data.data.request
            console.log(this.request)
          })
          .catch(error => {
              console.error('GraphQL Error:', error);
          });
    }
}

//-----------------------------------ROUTER----------------------------------------
const router=new VueRouter({
    mode:'history',
    routes:[
        {path :'/admin/users', component:users_details},
        {path:'/admin/request', component:users_request}
    ]
})

//----------------------------------MAIN COMPONENT---------------------------------------------
const admin_user=new Vue({
    el:"#app",
    data:{
        users_details:[]
    },
    template:`
    <div>
        <header-temp/>
        <task-bar/>
        <router-view></router-view>
        <foot-er/>
    </div>`,
    router,
    components:{
        "foot-er":foot
    }
})