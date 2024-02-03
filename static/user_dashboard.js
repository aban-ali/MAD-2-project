import { header_temp,foot } from "./components.js";
Vue.component("header-temp",header_temp)


//----------------------------------TASKBAR---------------------------------------------------
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
          <button data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample" class="navbar-brand btn" style="font-family: 'Brush Script MT', cursive;">
          Mistborn</button>
          
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
              <router-link class="nav-link" to="/dashboard">Home</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/mybooks">My books</router-link>
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
              <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
              <button class="btn btn-outline-success" type="submit">Search</button>
            </div>
          </div>
        </div>
        </nav>
        <div class="popup-form" v-if="this.join" style="z-index:1">
            <div class="overlay" @click="this.closeForm_member"></div>
            <div class="content text-dark">
            <span class="close-btn bg-danger rounded-3" @click="this.closeForm_member">&nbsp;&times;&nbsp;</span>
            <h2>Premium Subscription</h2>
                <ul>Benifits For Premium Members
                    <li class="ms-4">Read in an ad-free environment</li>
                    <li class="ms-4">Can hold upto 7 books</li>
                    <li class="ms-4">Lorem ipsum dolor sit amet</li>
                </ul>
                <div>So why wait!! Become a member for just $1 million now!</div>
                <div class="d-grid gap-2 my-3">
                    <span @click="become_member" class="btn btn-outline-warning">Become a Member NOW</span>
                </div>
            </div>
        </div>
        <div class="offcanvas offcanvas-start rounded-5" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasExampleLabel" style="font-family: 'Brush Script MT', cursive; margin:auto;">MISTBORN</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">
            <div class="mb-5">
              Mistborn is an official library for both the employees and student of IIT MADRAS.<br><br>
              Lorem ipsum dolor sit amet<br>
              Lorem ipsum dolor sit amet<br>
              Lorem ipsum dolor sit amet<br>
              Lorem ipsum dolor sit amet<br>
              Lorem ipsum dolor sit amet<br>
            </div>
            <div class="accordion" id="accordionExample">
              <div class="accordion-item">
                <h2 class="accordion-header" id="headingOne">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    All Genre
                  </button>
                </h2>
                <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                  <div class="accordion-body">
                    <li v-for="genre in genres">{{genre.name}}</li>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
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
                    window.location.href='/';}
            }).catch(err=> console.log(err));
        },
        closeForm_member:function(){
            this.join=false
        },
        become_member:function(){
            let query=`mutation{
                user(user_name:"${user_dashboard.user_name}",is_premium:true)
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
            .catch(err=>console.log("Graphql Error : ",err))
        },
    },
    mounted:function(){
      let query=`{
        genres{
          name,
          count
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
        console.log(data.data)
          this.genres=data.data
      })
      .catch(error => {
          console.error('GraphQL Error:', error);
      });
    }
    }
Vue.component("task-bar", taskbar)


//---------------------------------------BOOK DASHBOARD--------------------------------------
const books_dashboard={
    data(){
        return{

        }
    },
    template:`
    <div>
        <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
                <div class="carousel-item active">
                    <img src="http://127.0.0.1:5000/image/1" height="300px" width="100px" class="d-block w-100">
                </div>
                <div class="carousel-item">
                    <img src="http://127.0.0.1:5000/image/2" height="300px" width="100px" class="d-block w-100">
                </div>
                <div class="carousel-item">
                    <img src="http://127.0.0.1:5000/image/3" height="300px" width="100px" class="d-block w-100" >
                </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
        <div>

        </div>
    </div>`,
    mounted:function(){
        let query=`{
            book{
                id,
                name,
                description,
                release_date,
                borrow_count,
                hold_count,
                genre{
                    name
                }
            }
            genres{
                name,
                count
            }
          }`
          const requestOption = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ query: query }),
            };
        fetch('http://127.0.0.1:5000/graphql',requestOption).then(res=>res.json())
        .then(data=>{
            let res=data.data.book;
            this.books=res;
        }).catch(err=>console.log("Graphql Error : ",err))
    }
}


//------------------------------------MY BOOKS-------------------------------------------------
const my_books={
    data(){
        return{
            
        }
    },
    template:`
    <div class="m-5">
        <div class="card my-3">
            <h5 class="card-header">Featured</h5>
            <div class="card-body">
            <h5 class="card-title">Special title treatment</h5>
            <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
            <a href="#" class="btn btn-primary">Go somewhere</a>
            </div>
        </div>
    </div>`,
    mounted:function(){
        let query=`{
            user(user_name:"${user_dashboard.username}"){
                id,
                role,
                books{
                    id,
                    name,
                    description,
                    release_date,
                    borrow_count,
                    hold_count,
                    genre{
                        name
                    }

                }
            }
          }`
          const requestOption = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ query: query }),
            };
        fetch('http://127.0.0.1:5000/graphql',requestOption).then(res=>res.json())
        .then(data=>{
            console.log("Answer",data.data)
        }).catch(err=>console.log("Graphql Error : ",err))
    }
}

let router= new VueRouter({
    mode:'history',
    routes:[
        {path :'/dashboard', component:books_dashboard},
        {path:'/mybooks', component:my_books}
    ]
})

const user_dashboard=new Vue({
    el:"#app",
    data:{
        username:"",
        is_premium:false
    },
    template:`
    <div>
        <header-temp/>
        <task-bar/>
        <router-view></router-view>
        <foot-er/>
    </div>
    `,
    components:{
        "foot-er":foot,
    },
    router,
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
        }else{
            this.username=data.username
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
              this.is_premium=data.data.user.is_premium
          })
          .catch(error => {
              console.error('GraphQL Error:', error);
          });
    }
})