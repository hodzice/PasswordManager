import './App.css';
import {useState, useEffect} from "react";
import Axios from 'axios';
import LoginPage from './components/LoginPage';

function App() {

  useEffect(() => {
    Axios.get("http://localhost:3001/app/showpasswords").then((response) => {
      setPasswordList(response.data)
    });
  }, []);

  const adminLogin = {
    email: "root@gmail.com",
    password: "rootPassword"
  }

  const[admin, setAdmin] = useState({name: "", email: ""});
  const[errMessage, setErrMessage] = useState('');
  const[website, setWebsite] = useState('');
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const[passwordList, setPasswordList] = useState([]);

  const login = details => {
    console.log(details);

    if(details.email === adminLogin.email && details.password === adminLogin.password){
      console.log("Logged In");
      setAdmin({
        name: details.name,
        email: details.email
      });
    } else {
      setErrMessage("Wrong username or password");
    }
  }

  const logout = () => {
    setAdmin({name: "", email: ""});
  }

  const submitPassword = () => {
    Axios.post("http://localhost:3001/app/add", {website: website, email: email, password: password});
    
    setPasswordList([...passwordList, {website: website, email: email, password: password},
    ]);
  };

  const deletePassword = (id) => {
    Axios.delete(`http://localhost:3001/app/delete/${id}`)

      setPasswordList(
        passwordList.filter((val) => {
          return val.id !== id;
        })
      )
  };

  const decryptPassword = (encryption) => {
    Axios.post("http://localhost:3001/app/decryptpassword", {
      password: encryption.password,
      iv: encryption.iv,
    }).then((response) => {
      setPasswordList(
        passwordList.map((val) => {
          return val.id === encryption.id
            ? {
                id: val.id,
                website: val.website,
                email: val.email,
                password: response.data,
                iv: val.iv,
              }
            : val;
        })
      );
    });
  };

  return (
    <div className="App">
      <h1>CyberSafe</h1>
      {(admin.email !== "") ? (
        <div className="welcome_page"> 
          Welcome to your password manager, {admin.name}
        <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <LoginPage login = {login} Error={errMessage}/>
      )}
      <h4>Enter the website, email, and password you would like to add:</h4>
      <div className = "AddPassword">
      <input type="text" name="website" placeholder="Website" onChange={(event) => {
        setWebsite(event.target.value)}}/>
      <input type="text" name="email" placeholder="email@email.com" onChange={(event) => {
        setEmail(event.target.value)}}/>
      <input type="text" name="password" placeholder="password" onChange={(event) => {
        setPassword(event.target.value)}}/>
      </div>

      <div className="addbutton" onClick={submitPassword}>Add Password</div>

      {passwordList.map((val) => {
        return <div className="passwords">
          <h3>{val.website}</h3>  
          <h4>{val.email} </h4>
          <h4>{val.password}</h4>

          <div className="deletebutton" onClick={()=> {deletePassword(val.id)}}>Delete Password</div>
          <div className="showpassword" onClick ={() => {decryptPassword({password: val.password, iv: val.iv, id: val.id})}}>Show Password</div>         
          </div>
      })}


    </div>
  );
}

export default App;
