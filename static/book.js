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
                        <span @click="home" class="btn nav-link">Home</span>
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
        <div class="popup-form" v-if="this.join" style="z-index: 5;">
            <div class="overlay" @click="this.closeForm_member"></div>
            <div class="content">
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
    </div>`,
    computed:{
        url:function(){
            console.log(book)
            
        }
    },
    methods:{
        home:function(){
            if(book.user.role=="Admin"){
                window.location.href="/admin-dashboard";
            }else{
                window.location.href="/dashboard";
            }
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
    data(){
        return{
            read_permission:false
        }
    },
template:`
<div>
    <div class="text-center p-3" style="background-color:#D9EDBF;">
        <h4 class="text-success">{{$root.book_name}}</h4>
        <div id="time_end" class="text-center text-danger"></div>
        <embed v-if="read_permission" :src="url" type="application/pdf" width="80%" height="600px">
        <div class="d-grid gap-2 col-6 mx-auto">
            <button v-if="$root.user.role!='Admin' && !$root.status" class="btn btn-info" @click="read_book"><span v-if="$root.err">Request Access for 1 week</span>
            <span v-else-if="!$root.status">Request Pending</span></button>
            <button v-if="$root.user.role=='Admin' || $root.status" class="btn btn-info" @click="read_permission=!read_permission">Read Book</button>
        </div>
    </div>
    <hr class="border border-5 m-0 py-0 px-2 border-success">
    <div class="p-2 mt-0" style="background-color:#D9EDBF">
        <h4 class="text-success text-center">Book Details</h4>
        <p><h5 class="d-inline">Book Description:</h5><span v-if="$root.book.description" class="ps-2">{{$root.book.description}}</span>
            <span v-else class="ps-2">No Description of book is present</span>
        </p>
        <p><h5 class="d-inline">Release Date:</h5><span class="ps-4">{{$root.book.release_date}}</span></p>
        <p><h5 class="d-inline">Genre:</h5><span v-if="$root.book.genre[0]" class="ps-4">
            <span v-for="gen in $root.book.genre" class="px-3">{{ gen.name }}</span></span>
            <span v-else> Unknown </span>
        </p>    
    </div>
    <hr class="border border-5 m-0 py-0 px-2 border-success">
    <div class="p-2" style="background-color:#D9EDBF">
        <h4 class="text-center text-success"> Please drop Your Review</h4>
        <div class="input-group" style="width:80%; margin:auto;">
            <span class="input-group-text">Review</span>
            <textarea class="form-control" id="review"></textarea>
            <button @click="submit_review" class="btn btn-outline-secondary">Submit</button>
        </div>
    </div>
    <hr class="border border-5 m-0 py-0 px-2 border-success">
    <div class="py-3" style="background-color:#D9EDBF">
    <div v-for="rev in $root.reviews" v-if="rev.review" class="my-1 p-2 mx-3 border rounded-3 border-info"  style="background-color:#cde9a7">
        <p class="px-1 text-success">Review by: {{ rev.user.name }} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;Username ~{{rev.user.user_name}}</p>
        <p class="px-4 text-center">{{rev.review}}</p>
    </div></div>
</div>`,
computed:{
    url:function(){
        return "http://127.0.0.1:5000/pdf/"+book.book.id+".pdf"
    }
},
methods:{
    submit_review:function(){
        let review=document.getElementById("review").value
        let query=`mutation{
            add_review(
                u_id:${book.user.id},
                b_id:${book.book.id},
                review:"${review}"
            )
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
          .catch(error => {
              console.error('GraphQL Error:', error);
          });
          location.reload();
    },
    read_book:function(){
        if(book.err){
            let query=`mutation{
                request(
                    u_id:${book.user.id},
                    b_id:${book.book.id})
                }`
              const requestOption = {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ query: query }),
                };
              let apiUrl="http://127.0.0.1:5000/graphql";
              fetch(apiUrl, requestOption).catch(err=>console.log(err))
        } else if(book.status){
            this.book_id=book.book.id;
        }
        location.reload()
    }
    },
}

const book=new Vue({
    el:"#app",
    data:{
        book_name:"",
        user:[],
        book:[],
        reviews:[],
        status:false,
        deadline:"",
        err:false
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
            user(user_name:"${username}"){
              id,
              name,
              user_name,
              role,
              is_premium
            }
            book(name:"${this.book_name}"){
                id,
                description,
                release_date,
                genre{
                    name
                },
                reviews{
                    review,
                    user{
                        name,
                        user_name
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
          let apiUrl="http://127.0.0.1:5000/graphql";
          await fetch(apiUrl, requestOption)
          .then(response => response.json())
          .then(data =>{
              this.user=data.data.user[0];
              this.book=data.data.book[0];
              this.reviews=data.data.book[0].reviews
          })
          .catch(error => {
              console.error('GraphQL Error:', error);
          });

          let q=`{
            request(
                u_id:${this.user.id},
                b_id:${this.book.id}){
                    status,
                    deadline
                }
            }`
          const req = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ query: q }),
            };
          await fetch(apiUrl, req)
          .then(response => response.json())
          .then(data =>{
              this.status=data.data.request[0].status;
              this.deadline=data.data.request[0].deadline;
            })
          .catch(error => {
              this.err=true;
          });
          if(this.status){
            document.getElementById("time_end").innerHTML="Your Request Time ends on : "+this.deadline
          }else{
            document.getElementById("time_end").innerHTML=""
          }
    }
})