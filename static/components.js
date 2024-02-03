//------------------------------Header--------------------------------------------------------
export const header_temp={template:`
<div>
    <div class="head text-center">
        <h1>MISTBORN</h1>
        <h4>An Extensive Library for Readers</h4>
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
    submit_book:async function(event){
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
        await fetch(apiUrl, requestOptions)
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
            if(this.book_name.length>0){document.getElementById("book_msg").innerHTML="Book with name "+b_name+" alreay exists"}        })
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
    <div class="overlay" @click="$root.closeForm_delete"></div>
    <div class="content">
      <span class="close-btn bg-danger rounded-3" @click="$root.closeForm_delete">&nbsp;&times;&nbsp;</span>
      <h2>Delete a Book</h2>
        <div class=" ms-2 input-group mb-1">
          <label class="input-group-text" for="inputGroupSelect01">Book Name</label>
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
          <label class="input-group-text" for="inputGroupSelect01">User Name</label>
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
      let query=`mutation{
        delete_book(name:"${this.book_name}")
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
          this.check_book=false
      })
      .catch(error => {
          console.error('GraphQL Error:', error);
      });
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

//------------------------------BOOK'S PAGE BODY----------------------------------------------
export const books_body={
  data(){
      return{
          books:[],
          last_sort:"Name"
      }
  },
  template:`
  <div>
      <div class=" float-end input-group mt-3 me-4" style="width:30%;">
          <select class="form-select" id="sort_type">
              <option selected>Name</option>
              <option>Latest</option>
              <option>Most Read</option>
          </select>
          <button @click="sort" class="btn btn-outline-secondary" type="button">Sort By</button>
      </div>
      <br>
      <br>
      <ul class="list-group m-3 list-group-horizontal-xxl">
          <li class="list-group-item rounded-2 pb-0 m-2 row">
            <p class="d-inline float-start col-1 h5">Index</p>
            <p class="d-inline float-start col-3 h5">Book Name </p>
            <p class="d-inline float-end h5 col-2">Release Date</p>
            <p class="d-inline float-end h5 col-5">Genre</p>
          </li>
          
          <li @click="go_to(book.name)" v-for="(book,index) in books" class="list-group-item btn rounded-2 pb-0 m-2 row">
            <p class="d-inline float-start col-1">{{index+1}}</p>
            <p class="d-inline ms-5 float-start col-1">{{book.name}}</p>
            <p class="d-inline float-end col-3">{{book.release_date}}</p>
            <p class="d-inline float-end col-5"><span class="me-0" v-for="gen in book.genre">| {{gen.name}} |</span></p>
            <div v-if="$root.role=='Admin'" class="text-start"><br><br><br>
              User who have access to this book : <span  v-if="book.users[0]"><span v-for="user in book.users" class="btn">{{user.name}} &nbps;&nbps; ~{{user.user_name}}</span></span>
              <span v-else class="text-danger">No one is currently reading this book</span>
            </div> 
          </li>
      </ul>
  </div>`,
  methods:{
      sort:function(){
          let sort_type=document.getElementById("sort_type").value
          if(sort_type=="Name"){
            if(this.last_sort==sort_type){
                this.books=this.books.slice().sort((a,b)=>b.name.localeCompare(a.name))
                this.last_sort=""
            }
            else{
              this.books=this.books.slice().sort((a,b)=>a.name.localeCompare(b.name))
              this.last_sort=sort_type
            }
          }
          else if(sort_type=="Latest"){
            if(this.last_sort==sort_type){
              this.books=this.books.slice().sort((a,b)=>b.release_date.localeCompare(a.release_date))
              this.last_sort=""
          }
          else{
            this.books=this.books.slice().sort((a,b)=>a.release_date.localeCompare(b.release_date))
            this.last_sort=sort_type
          }
          }else if(sort_type=="Most Read"){
            if(this.last_sort==sort_type){
              this.books=this.books.slice().sort((a,b)=>b.borrow_count.localeCompare(a.borrow_count))
              this.last_sort=""
          }
          else{
            this.books=this.books.slice().sort((a,b)=>a.borrow_count.localeCompare(b.borrow_count))
            this.last_sort=sort_type
          }
          }
      },
      go_to:function(name){
        window.location.href="/book/"+name;
      }
  },
  mounted:function(){
      let query=`{
          book{
              id,
              name,
              description,
              release_date,
              borrow_count,
              hold_count,
              users{
                name,
                user_name
              },
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
      fetch('http://127.0.0.1:5000/graphql',requestOption).then(res=>res.json())
      .then(data=>{
          let res=data.data.book;
          this.books=res;
      }).catch(err=>console.log("Graphql Error : ",err))
  }
}
//-------------------------------FOOTER--------------------------------------------
export const foot={
  template:`
  <div class="stickey-bottom bg-dark text-light p-3 pb-4">
  <br>
    Click here to view Company's Policy Guidline
    <br>

    <div class="my-4 row">
      <div class="col-4">
        <li>Lorem ipsum dolor sit amet</li>
        <li>Lorem ipsum dolor sit amet</li>
        <li>Lorem ipsum dolor sit amet</li>
      </div>
      <div class="col-4">
        <li>Lorem ipsum dolor sit amet</li>
        <li>Lorem ipsum dolor sit amet</li>
        <li>Lorem ipsum dolor sit amet</li>
      </div>
      <div class="col-4">
        <li>Lorem ipsum dolor sit amet</li>
        <li>Lorem ipsum dolor sit amet</li>
        <li>Lorem ipsum dolor sit amet</li>
      </div>
    </div>
    <div class="float-end text-warning">
      Made by- Mohammad Aban Ali
    </div>
  </div>`
}