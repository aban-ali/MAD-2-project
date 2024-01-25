import { header_temp,add_book, add_genre, edit_book,del_book } from "./components.js";

Vue.component("header-temp",header_temp)
Vue.component("add-book",add_book)
Vue.component("add-genre",add_genre)
Vue.component("edit-book",edit_book)
Vue.component("delete-book",del_book)
const taskbar={template:`
<div>
    <nav class="navbar navbar-expand-lg bg-light">
        <div class="container-fluid">
            <span class="navbar-brand" style="font-family: 'Brush Script MT', cursive;">Mistborn</span>
            <div class="collapse text-center navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link disabled" aria-current="page" href="#head">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Log out</a>
                </li>
                </ul>
                <div class="d-flex">
                    <span class="p-2 rounded-4 text-warning border border-warning">Premium Member</span>
                </div>
            </div>
        </div>
    </nav>
</div>
`}


const operations={template:`
<div class="container">
    <div class="row">
        <div class="col-3 pt-3">
            <button class="btn" @click="$root.add_books"><ion-icon class="icon" name="add-circle-outline"></ion-icon>
            <p>Add a Book</p></button>
        </div>
        <div class="col-3 pt-3">
            <button class="btn" @click="$root.edit_books"><ion-icon class="icon" name="create-outline"></ion-icon>
            <p>Edit a Book</p></button>
        </div>
        <div class="col-3 pt-3">
            <button class="btn" @click="$root.deletes"><ion-icon class="icon" name="trash-outline"></ion-icon>
            <p>Delete a user/book</p></button>
        </div>
        <div class="col-3 pt-3">
            <button class="btn" @click="$root.add_genres"><ion-icon class="icon" name="add-outline"></ion-icon>
            <p>Add a Genre</p></button>
        </div>
    </div>
</div>`}

const go_to_books={
    template:`
    <div @click="admin_books_page" class="btn border border-1 my-3 border-success text-center rounded-2 btn-outline-success" style="width:90%;margin-left:5%">
        <h5 class="text-decoration-underline">Books</h5>
        <div class="row text-muted">
            <div class="col-6">
                <ul>Stats</ul>
                <li>Most viewed books</li>
                <li>Most viewed genre</li>
                <li>Most rated books</li>
                <ul>And more ...</ul>
            </div>
            <div class="col-6 text-muted">
                <ul>About Books</ul>
                <li>Most viewed books</li>
                <li>Most viewed genre</li>
                <li>Most rated books</li>
                <ul>And more ...</ul>
            </div>
        </div>
    </div>`,
    methods:{
        admin_books_page:function(){
            window.location.href='/admin/books';
        }
    }
}

const go_to_users={
    template:`
    <div @click="admin_users_page" class="btn border border-1 my-3 border-success text-center rounded-2 btn-outline-success" style="width:90%;margin-left:5%">
        <h5 class="text-decoration-underline">Users</h5>
        <div class="row text-muted">
            <div class="col-6">
                <ul>Stats</ul>
                <li>Most avid reader</li>
                <li>Most viewed genre</li>
                <li>Most rated books</li>
                <ul>And more ...</ul>
            </div>
            <div class="col-6 text-muted">
                <ul>About User</ul>
                <li>List of all Users</li>
                <li>Type of User</li>
                <li>Most rated books</li>
                <ul>And more ...</ul>
            </div>
        </div>
    </div>`,
    methods:{
        admin_users_page:function(){
            window.location.href='/admin/users';
        }
    }
}

const admin_dash=new Vue({
    el:"#app",
    data:{
        add_book:false,
        add_genre:false,
        edit_book:false,
        delete_book:false
    },
    template:`
    <div>
        <header-temp/>
        <taskbar/>
        <operations/>
        <add-book/>
        <add-genre/>
        <edit-book/>
        <delete-book/>
        <go-to-books/>
        <go-to-users/>
    </div>`,
    components:{
        "taskbar":taskbar,
        "operations":operations,
        "go-to-books":go_to_books,
        "go-to-users":go_to_users
    },
    methods:{
        add_books: function(){
            this.add_book=true;
        },
        edit_books: function(){
            this.edit_book=true;
        },
        deletes:function(){
            this.delete_book=true;
        },
        add_genres: function(){
            this.add_genre=true;
        },
        closeForm_book:function(){
            this.add_book=false;
        },
        closeForm_genre:function(){
            this.add_genre=false;
        },
        closeForm_edit:function(){
            this.edit_book=false
        },
        closeForm_delete:function(){
            this.delete_book=false
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
            if(!data.active_status || (data.role!="Admin")){
            window.location.href='/error_page';
        }
        }).catch(err=> console.log(err));
    }
})