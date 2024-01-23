export const header_temp={template:`
<div>
    <div class="head text-center">
        <h1>MISTBORN</h1>
        <h4>An Extensive Library for Readers</h4>
    </div>
</div>
`}

//----------------------------------TASKBAR---------------------------------------------------
export const taskbar={template:`
<div>
    <div class="taskbar">
    <nav class="navbar sticky-top navbar-expand-lg bg-light">
    <div class="container-fluid">
      <button class="navbar-brand btn" v-on:click="$root.show_sidebar" style="font-family: 'Brush Script MT', cursive;">Mistborn</button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#head">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">My books</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Log out</a>
          </li>
        </ul>
        <div class="d-flex" role="search">
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success" type="submit">Search</button>
        </div>
      </div>
    </div>
    </nav>
    </div>
</div>
`}

//------------------------SIDE-BAR--------------------------------------------------------------
export const side_bar={template:`
<div>
<div class="sidebar">
    <div class="border text-center text-primary" style="background-color:#DFFFD8"> More Options </div>
    </div>
</div>
`}

//---------------------------ADD_BOOK-------------------------------------------------------
export const add_book={
  data(){
    return{
      genres:[],
      selected_genre:[],
      g:"",
      book_name:""
    }
  },
  template:`
  <div class="popup-form" v-if="$root.add_book">
    <div class="overlay" @click="$root.closeForm_book"></div>
    <div class="content">
      <span class="close-btn bg-danger rounded-3" @click="$root.closeForm_book">&nbsp;&times;&nbsp;</span>
      <h2>Add a Book</h2>
      <form action="/add_book" method="post" @submit="submit_book" enctype="multipart/form-data">
        <div class="input-group mb-3">
          <span class="input-group-text" id="basic-addon1">@</span>
          <input required v-model="book_name" name="book_name" type="text" class="form-control" placeholder="Book Name">
        </div>
        <p id="book_msg" class="text-danger"></p>

        <div class="input-group mb-3">
          <input required type="file" name="book_file" class="form-control" id="inputGroupFile02">
          <label class="input-group-text" for="inputGroupFile02">Upload</label>
        </div>
        
        <div class="input-group mb-1">
          <label class="input-group-text" for="inputGroupSelect01">Genre</label>
          <select v-model="g" class="form-select" id="inputGroupSelect01">
            <option selected>Choose...</option>
            <option v-for="genre in this.genres">{{genre.name}}</option>
          </select>
        </div>
        <button @click="rem_genre(genre)" class="d-inline mx-1 btn btn-success" v-for="genre in selected_genre">{{ genre }}</button>
        
        <div class="input-group my-3">
          <span class="input-group-text">Description  </span>
          <textarea id="description" class="form-control" aria-label="With textarea"></textarea>
        </div>
        <div class="d-grid gap-2">
          <button class="btn btn-outline-success" type="submit">Submit</button>
        </div>
      </form>
    </div>
  </div>`,
  methods:{
    rem_genre:function(val){
      let index=this.selected_genre.indexOf(val);
      this.selected_genre.splice(index,1)
    },
    submit_book: function(event){
      event.preventDefault()
      let des=document.getElementById("description").value
      let query=`mutation{
        book(name:"${this.book_name}",genre:"${this.selected_genre}",description:"${des}")
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
            console.log(data)
        })
        .catch(error => {
            console.error('GraphQL Error:', error);
        });
        event.target.submit()
    }
  },
  watch:{
    g:function(val){
      if(val!="Choose..."){
        if(!this.selected_genre.includes(val)){
          this.selected_genre.push(val);
        }
      }
    },
    book_name:function(val){
      let query=`{
        book(name:"${val}"){
          name
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
          let b_name=data.data.book[0].name
            document.getElementById("book_msg").innerHTML="Book with name "+b_name+" alreay exists"
        })
        .catch(error => {
            document.getElementById("book_msg").innerHTML=""
        });
        }
  },
  mounted: async function(){
    let query=`{
      genres{
        name
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
        this.genres=data.data.genres;
    })
    .catch(error => {
        console.error('GraphQL Error:', error);
    });
  }
}

//------------------------------ADD_GENRE-----------------------------------------------
export const add_genre={
  data(){
    return{
      genres:[]
    }
  },
  template:`
  <div class="popup-form" v-if="$root.add_genre">
    <div class="overlay" @click="$root.closeForm_genre"></div>
    <div class="content">
      <span class="close-btn bg-danger rounded-3" @click="$root.closeForm_genre">&nbsp;&times;&nbsp;</span>
      <h2>Add a Genre</h2>
      <form @submit.prevent="submit_genre">
        <div class="input-group mb-2">
          <span class="input-group-text" id="basic-addon1">+</span>
          <input required id="genre" type="text" class="form-control" placeholder="Genre Name">
        </div>
        <p id="msg" class="text-danger"></p>
        <span class="border btn text-dark btn-outline-danger border-secondary mx-1 p-1 rounded-2" @click="del_genre(genre.name)" v-for="genre in genres">{{ genre.name }}</span>
        <div class="d-grid gap-2 my-3">
          <button class="btn btn-outline-success" type="submit">Submit</button>
        </div>
      </form>
    </div>
  </div>`,
  methods:{
    submit_genre: function(){
      let genre=document.getElementById("genre");
      let query=`mutation{
        genre(name:"${genre.value}")
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
      .catch(error => {
          console.error('GraphQL Error:', error);
      });
      location.reload()
    },
    del_genre: function(val){
      let genre=document.getElementById("genre");
      let query=`mutation{
        del_genre(name:"${val}")
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
          console.log(data)
      })
      .catch(error => {
          console.error('GraphQL Error:', error);
      });
      location.reload()
    }
  },
  mounted: async function(){
    let query=`{
      genres{
        name
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
        this.genres=data.data.genres;
    })
    .catch(error => {
        console.error('GraphQL Error:', error);
    });
  }
}


//------------------------------------EDIT_BOOK-----------------------------------------
export const edit_book={
  data(){
    return{
      is_present:false,
      id:0,
      name:"",
      des:"",
      genre:[],
      selected_genre:[],
      g:"",
      new_name:""
    }
  },
  template:`
  <div class="popup-form" v-if="$root.edit_book">
    <div class="overlay" @click="$root.closeForm_edit"></div>
    <div class="content">
      <span class="close-btn bg-danger rounded-3" @click="$root.closeForm_edit">&nbsp;&times;&nbsp;</span>
      <h2>Edit a Book</h2>
        <div class="input-group mb-2">
          <span class="input-group-text" id="basic-addon1">Name</span>
          <input required id="book_name" type="text" class="form-control" placeholder="Book Name">
          <button class="btn btn-outline-secondary" type="button" id="button-addon2" @click="search_book">Search</button>
        </div>
        <p id="err_msg" class="text-danger"></p>



        <div v-if="is_present" class="border-top border-start rounded-2 border-5 border-success">
          
          <div class="input-group ms-2 my-3">
            <span class="input-group-text" id="basic-addon1">@</span>
            <input required v-model="new_name" type="text" class="form-control" :placeholder="name">
          </div>

          <p id="book_msg" class=" ms-2 text-danger"></p>

          <div class=" ms-2 input-group mb-1">
            <label class="input-group-text" for="inputGroupSelect01">Genre</label>
            <select v-model="g" class="form-select" id="inputGroupSelect01">
              <option selected>Choose...</option>
              <option v-for="gen in this.genre">{{gen.name}}</option>
            </select>
          </div>

          <button @click="rem_genre(gen)" class="d-inline ms-2 mx-1 btn btn-success" v-for="gen in selected_genre">{{ gen }}</button>
          
          <div class="input-group ms-2 my-3">
            <span class="input-group-text">Description  </span>
            <textarea id="description" class="form-control" :placeholder="des"></textarea>
          </div>

          <div class="d-grid ms-2 gap-2 py-3 my-3">
            <button class="btn btn-outline-success" @click="confirm_edit">Submit</button>
          </div>
        </div>


    </div>
  </div>`,
  methods:{
    search_book:function(){
      let name=document.getElementById("book_name").value;
      let query=`{
        book(name:"${name}"){
          id,
          description,
          genre{
            name
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
          this.selected_genre=[]
          let res= data.data.book[0];
          this.id=res.id;
          this.des=res.description;
          this.name=name;
          this.is_present=true
          for(let gen of res.genre){
            this.selected_genre.push(gen.name);
          }
          console.log(this.selected_genre)
          document.getElementById("err_msg").innerHTML=""

      })
      .catch(error => {
        console.log("Error :",error)
        document.getElementById("err_msg").innerHTML="No book with given name exists"
        this.is_present=false
      });
    },
    rem_genre:function(val){
      let index=this.selected_genre.indexOf(val);
      this.selected_genre.splice(index,1)
    },
    confirm_edit:function(){
      this.des=document.getElementById("description").value
      let query=`mutation{
        edit_book(id:"${this.id}",name:"${this.new_name}",
        genre:"${this.selected_genre}",description:"${this.des}")
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
          console.log(data)
        })
        .catch(error => {
          console.log("Error has occured 🥱",error)
        });
      this.is_present=false
    }
  },
  watch:{
    g:function(val){
      if(val!="Choose..."){
        if(!this.selected_genre.includes(val)){
          this.selected_genre.push(val);
        }
      }
    },
    new_name:function(val){
      let query=`{
      book(name:"${val}"){
        name
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
        let b_name=data.data.book[0].name
          document.getElementById("book_msg").innerHTML="Book with name "+b_name+" alreay exists"
      })
      .catch(error => {
          document.getElementById("book_msg").innerHTML=""
      });
      }
  },
  mounted: async function(){
    let query=`{
      genres{
        name
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
        this.genre=data.data.genres;
    })
    .catch(error => {
        console.error('GraphQL Error:', error);
    });
  }
}


//------------------------------DELETE_BOOK/USER--------------------------------------------------
export const del_book={
  data(){
    return{
      users:[],
      books:[],
      check_book:false,
      check_user:false,
      book_name:"",
      user_name:""
    }
  },
  template:`
  <div class="popup-form" v-if="$root.delete_book">
    <div class="overlay" @click="$root.closeForm_edit"></div>
    <div class="content">
      <span class="close-btn bg-danger rounded-3" @click="$root.closeForm_edit">&nbsp;&times;&nbsp;</span>
      <h2>Delete a Book</h2>
        <div class=" ms-2 input-group mb-1">
          <label class="input-group-text" for="inputGroupSelect01">Genre</label>
          <select v-model="book_name" class="form-select" id="inputGroupSelect01">
            <option selected>Choose...</option>
            <option v-for="book in this.books">{{book}}</option>
          </select>
        </div>
        <div class="d-grid ms-2 gap-2 py-3 my-3">
          <button class="btn btn-outline-danger" @click="check_book=true">Delete</button>
        </div>
        <div class="mx-auto px-auto" v-if="check_book">
          &emsp;&emsp;&emsp;&emsp;
          <button @click="check_book=false" class="btn col-5 btn-outline-info" type="button">Cancel</button>
          <button @click="delete_book" class="btn col-5 btn-outline-danger" type="button">Delete</button>
        </div>
        <hr>
      <h2>Delete a User</h2>
        <div class=" ms-2 input-group mb-1">
          <label class="input-group-text" for="inputGroupSelect01">Genre</label>
          <select v-model="user_name" class="form-select" id="inputGroupSelect01">
            <option selected>Choose...</option>
            <option v-for="user in this.users">{{user.name}}&emsp;&emsp;&emsp;~{{user.username}}</option>
          </select>
        </div>
        <div class="d-grid ms-2 gap-2 py-3 my-3">
          <button class="btn btn-outline-danger" @click="check_user=true">Delete</button>
        </div>
        <div class="mx-auto px-auto" v-if="check_user">
        &emsp;&emsp;&emsp;&emsp;
          <button @click="check_user=false" class="btn col-5 btn-outline-info" type="button">Cancel</button>
          <button @click="delete_user" class="btn col-5 btn-outline-danger" type="button">Delete</button>
        </div>
    </div>
  </div>
  `,
  methods:{
    delete_book:function(){
      
    },
    delete_user:function(){
      let start=this.user_name.indexOf("~")+1
      let query=`mutation{
        delete_user(username:"${this.user_name.substring(start)}")
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
          console.log(data)
          this.check_user=false
          location.reload()
      })
      .catch(error => {
          console.error('GraphQL Error:', error);
      });
    }
  },
  mounted: function(){
    let query=`{
      book{
        name
      }
      user{
        name,
        user_name
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
        const result=data.data;
        for(let res of result.user){
          let u={"name":res.name,"username":res.user_name}
          this.users.push(u)
        }
        for(let res of result.book){
          this.books.push(res.name)
        }
    })
    .catch(error => {
        console.error('GraphQL Error:', error);
    });
  }
}