let login={template: `
<div class="app rounded-4 py-3" style="background-color: #9EDDFF">
    <h4 class="p-3">Please Login to continue</h4>
    <form action="/login" method="post" class="px-5 pt-5 py-3 mb-0">
        <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1">@</span>
            <input required id="username" type="text" class="form-control" placeholder="Username">
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1">Password</span>
            <input required id="password" type="password" class="form-control" placeholder="Password">
        </div>
        <button class="btn btn-outline-primary btn-lg" >Login</button>
    </form>
    <p>Forgot <router-link to='/forgot-password'>username/password</router-link>?</p>
    <hr>
    <p>Not a member. Don't worry.<br><router-link to='/register'> Register Now</router-link></p>
</div>
`}

let register={template:`
<div class="app rounded-4 pb-3 mb-3" style="background-color: #9EDDFF">
    <h4 class="p-3">Register To Begin Your <span class="text-primary">Reading Journey </span></h4>
    <form action="/register" method="post" class="px-5 pt-5 py-3 mb-0">
        <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1">Name</span>
            <input required type="text" name="name" class="form-control" placeholder="Your Name">
        </div>
        <div class="input-group mb-3">
            <input type="email" name="email" class="form-control" placeholder="Your email id">
            <span required class="input-group-text" id="basic-addon1">@xyz.com</span>
        </div>
        <div class="input-group mb-2">
            <span class="input-group-text" id="basic-addon1">@</span>
            <input v-model="$root.username" required name="username" type="text" class="form-control" placeholder="Give yourself a username :)">
        </div>
        <div v-bind:class="{'text-danger':$root.is_danger,'text-success':$root.is_success }" >{{ $root.user_msg }}</div>
        <div class="input-group mt-2 mt-3">
            <span class="input-group-text" id="basic-addon1">Password</span>
            <input v-model="$root.pwd" name="pass" required type="password" class="form-control" placeholder="password">
        </div>
        <div class="text-danger pb-4"> {{ $root.check_password }} </div>
        <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
            <input type="radio" class="btn-check" name="btnradio" id="btnradio1" value="Student" autocomplete="off" checked>
            <label class="btn btn-outline-light" for="btnradio1">Student</label>
            <input type="radio" class="btn-check" name="btnradio" id="btnradio2" value="Faculty" autocomplete="off">
            <label class="btn btn-outline-light" for="btnradio2">Faculty</label>
        </div>
        <br>
        <br>
        <button v-bind:disabled="$root.is_disabled" class="btn btn-outline-primary btn-lg" >Register</button>
    </form>
<hr>
    <p class="mb-1">Already a member <br><router-link to='/'>Login</router-link> Now</p>
</div>
`}

let forgot={template:`
<div class="app rounded-4 pb-3 mb-3" style="background-color: #9EDDFF">
    <h4 class="p-3">Fill in the Details to get your <br><span class="text-danger">Forgotten Username/Password</span></h4>
    <div class="px-5 pt-3 py-3 mb-0">    
        <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1">Name</span>
            <input required type="text" id="name" class="form-control" placeholder="Your Name">
        </div>
        <div class="input-group mb-3">
            <input type="email" id="email" class="form-control" placeholder="Your email id">
            <span required class="input-group-text" id="basic-addon1">@xyz.com</span>
        </div>
        <button class="btn btn-outline-danger" v-on:click="$root.show_details">Confirm</button>
        <hr>
        <h4 class="text-center text-danger" id="h_details"></h4>
        <p class="text-center h5" id="user_details"></p>
        <br><br>
        <router-link to="/"> Go Back </router-link>
    </div>
</div>
`}


let router= new VueRouter({
    routes:[
        {path :'/', component:login},
        {path :'/register', component:register},
        {path :'/forgot-password', component:forgot}
    ]
})


let first_page = new Vue({
    el:'#app',
    data: {
        pwd :"",
        username:"",
        user_msg:"",
        is_disabled : true,
        is_danger: false,
        is_success: false
    },
    router,
    computed:{
        check_password: function(){
            let len=this.pwd.length
            if (len<7 && len>0){
                this.is_disabled=true
                return "Password should be of more than 6 characters"
            } 
            this.is_disabled=false
            return
        }
    },
    methods:{
        show_details:async function(){
            const name=document.getElementById("name").value
            const email=document.getElementById("email").value
            let query=`{
                user(name:"${name}", email:"${email}"){
                    user_name
                     password   }
                    }`
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: query }),
                };
            let a =await abc(requestOptions)
            try{
                a=a.data.user[0]
                document.getElementById("h_details").innerHTML="Your Username and Password";
                document.getElementById("user_details").innerHTML=`Username: ${a.user_name}   <br> Password : ${a.password}`
            }catch(err){
                document.getElementById("h_details").innerHTML="Please provide your correct Details"
            }
        }
    },
    watch:{
        username: async function(val){
            let len=this.username.length
            if (len>0){
                let query=`{user(user_name:"${this.username}"){name}}`
                const requestOptions = {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query: query }),
                  };
                  let a= await abc(requestOptions)
                  a=a.data.user
                  if (a.length >0){
                    this.is_danger=true
                    this.is_success=false
                    this.is_disabled=true
                    this.user_msg=this.username+" has already been taken"
                    return
                  }
                  else{
                    this.is_danger=false
                    this.is_success=true
                    this.is_disabled=false
                    this.user_msg=this.username+" is a valid username"
                    return
                  }
            }
            this.user_msg=""
            this.is_disabled=true
            return 
        }
    }
})
async function abc(requestOptions){
    let apiUrl="http://127.0.0.1:5000/graphql";
    return fetch(apiUrl, requestOptions)
    .then(response => response.json())
    .then(data =>{
        return data
    })
    .catch(error => {
        console.error('GraphQL Error:', error);
    });
}