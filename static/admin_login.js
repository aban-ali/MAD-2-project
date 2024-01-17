Vue.component("title-bar",{template: `
<div class="text-center py-3 border border-5" style="background-color: #A6F6FF">
    <h4 style="color:#6499FE">Librarian's Login Page</h4>
</div>
`})
Vue.component("admin-login",{template:`
<div>
    <title-bar></title-bar>
    <div class="app rounded-4 pb-3 mb-3" style="background-color: #9EDDFF">
        <h4 class="p-3">Enter Your Details</h4>
        <form action="/admin" method="post" class="px-5 pt-5 py-3 mb-0" @submit="$root.get_token">
        <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1">@</span>
            <input required id="username" name="username" type="text" class="form-control" placeholder="Username">
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1">Password</span>
            <input required id="password" name="pass" type="password" class="form-control" placeholder="Password">
        </div>
        <div v-if="$root.login_msg" class="text-danger">{{ $root.login_msg }}</div>
        <button class="btn btn-outline-primary btn-lg" >Login</button>
    </form>
    <p>Forgot <router-link to='/admin-details'>username/password</router-link>?</p> 
    </div>
</div>
`})

Vue.component("admin-register",{template:`
<div>
    <title-bar></title-bar>
    <div class="app rounded-4 pb-3 mb-3" style="background-color: #9EDDFF">
    <h4 class="p-3">Please register youself first<span class="text-primary"> Admin</span></h4>
    <form action="/admin" method="post" class="px-5 pt-5 py-3 mb-0">
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
            <input required name="username" type="text" class="form-control" placeholder="Give yourself a username :)">
        </div>
        <div class="input-group mt-2 mt-3">
            <span class="input-group-text" id="basic-addon1">Password</span>
            <input v-model="$root.pwd" name="pass" required type="password" class="form-control" placeholder="password">
        </div>
        <div class="text-danger pb-4"> {{ $root.check_password }} </div>
        <br>
        <button type="submit" v-bind:disabled="$root.is_disabled" class="btn btn-outline-primary btn-lg" >Register</button>
    </form>
    </div>
</div>
`})

const admin_details={template:`
<div>
    <title-bar></title-bar>
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
            <p class="text-center h5" id="admin_details"></p>
            <br><br>
            <router-link to="/admin"> Go Back </router-link>
        </div>
    </div>
</div>
`}

const admin_gate={template:`
<div>
    <div v-if="$root.admin_exists">
        <admin-login></admin-login>
    </div>
    <div v-else>
        <admin-register></admin-register>
    </div>
</div>
`}


let router = new VueRouter({
    mode:'history',
    routes:[
        {path:'/admin',component: admin_gate},
        {path:'/admin-details',component: admin_details}
    ]
})

new Vue({
    el: "#app",
    data:{
        admin_exists:true,
        is_disabled:true,
        pwd:"",
        login_msg:""
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
                user(name:"${name}", email:"${email}", role:"Admin"){
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
            let a =await api(requestOptions)
            try{
                a=a.data.user[0]
                document.getElementById("h_details").innerHTML="Your Username and Password";
                document.getElementById("admin_details").innerHTML=`Username: ${a.user_name}   <br> Password : ${a.password}`
            }catch(err){
                document.getElementById("h_details").innerHTML="Please provide your correct Details"
                document.getElementById("admin_details").innerHTML=""
            }
        },
        get_token: async function(event){
            event.preventDefault();
            const username=document.getElementById("username").value
            const password=document.getElementById("password").value
            let query=`{
                user(user_name:"${username}",role:"Admin"){
                    id
                    password   }
                    }`
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: query }),
                };
            let a =await api(requestOptions)
            try{
                a= a.data.user[0]
                if (a.password==password){
                    const url="http://127.0.0.1:5000/token/"+a.id
                    let token=await fetch(url).then(res=> res.json())
                    .then(data=> data.token).catch(err=> console.log("token error:",err))
                    localStorage.setItem('token',token);
                    event.target.submit();
                }
            }catch(err){
                this.login_msg="Either username or password is incorrect"
            }
        }
    },
    mounted:async function(){
        let query=`{
            user(role:"Admin"){
                id}
            }`
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: query }),
            };
        let res= await api(options);
        res=res.data.user
        if (res.length>0){
            this.admin_exists=true
        }
        else{
            this.admin_exists=false
        }
    }
})


async function api(requestOptions){
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