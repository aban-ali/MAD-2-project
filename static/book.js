import { header_temp,foot } from "./components.js";

const book_taskbar={
    data(){
        return{
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
                        <a class="nav-link" aria-current="page" href="/admin-dashboard">Home</a>
                    </li>
                    <li class="nav-item">
                        <span @click="logout" class="nav-link btn">Log out</span>
                    </li>
                    </ul>
                    <div v-if="$root.user.is_premium" class="d-flex me-2">
                        <span class="p-2 rounded-4 text-warning border border-warning">Premium Member</span>
                    </div>
                    <div v-else class="d-flex me-2">
                        <span @click="join=true" class="p-2 btn rounded-4 btn-outline-warning">
                            Become Premium Member
                        </span>
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
                    <li class="ms-4">Download any book you want</li>
                    <li class="ms-4">Read in an ad-free environment</li>
                    <li class="ms-4">Can hold upto 7 books</li>
                </ul>
                <div>So why wait!! Become a member for $1 million now!</div>
                <div class="d-grid gap-2 my-3">
                    <span @click="become_member" class="btn btn-outline-warning">Become a Member NOW</span>
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
                    window.location.href='/admin';}
            }).catch(err=> console.log(err));
        },
        closeForm_member:function(){
            this.join=false
        },
        become_member:function(){
            let query=`mutation{
                user(user_name:"${book.user.user_name}",is_premium:true)
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
        }
    }
}


const body={
template:`
<div>
    <div class="text-center p-3" style="background-color:#FFCF81">
        <h4>{{$root.book_name}}</h4>
    </div>
    <div class="p-2" style="background-color:#FDFFAB">
        <h4 class=" text-center">Book Details</h4>
        <p><h5 class="d-inline">Book Description:</h5><span v-if="$root.book.description" class="ps-2">{{$root.book.description}}</span>
            <span v-else class="ps-2">No Description of book is present</span>
        </p>
        <p><h5 class="d-inline">Release Date:</h5><span class="ps-4">{{$root.book.release_date}}</span></p>
        <p><h5 class="d-inline">Genre:</h5><span v-if="$root.book.genre[0]" class="ps-4">
            <span v-for="gen in $root.book.genre" class="px-3">{{ gen.name }}</span>
            <span v-else> Unknown </span>
        </span></p>    
    </div>
    <div class="p-2" style="background-color:#D9EDBF">
        Please drop Your Review
    </div>
</div>`
}

const book=new Vue({
    el:"#app",
    data:{
        book_name:"",
        user:[],
        book:[]
    },
    template:`
    <div>
        <header-temp/>
        <taskbar/>
        <book-body/>
        <foot-er/>
    </div>`,
    components:{
        "header-temp":header_temp,
        "taskbar":book_taskbar,
        "book-body":body,
        "foot-er":foot
    },
    mounted:async function(){
        this.book_name=received.book_name
        const requestOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+localStorage.getItem('token')
            }
          };
          let username
          await fetch('http://127.0.0.1:5000/validate', requestOptions).then(res=>res.json())
          .then(data=> { 
            if(!data.active_status){
            window.location.href='/error_page';
        } username=data.username
        }).catch(err=> console.log(err));
        let query=`{
            user{
              name,
              user_name,
              role,
              is_premium
            }
            book(name:"${this.book_name}"){
                description,
                release_date,
                genre{
                    name
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
          let apiUrl="http://127.0.0.1:5000/graphql";
          fetch(apiUrl, requestOption)
          .then(response => response.json())
          .then(data =>{
              this.user=data.data.user[0];
              this.book=data.data.book[0];
              console.log(data.data)
          })
          .catch(error => {
              console.error('GraphQL Error:', error);
          });
    }
})