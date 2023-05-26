import axios from 'axios';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/userContext';


export default function Login(props){

    const profile=useContext(UserContext);

    const {setIsLogin}=props;

    const [input,setInput]=useState({
        password:"",
        confirmPassword:""
    });

    const loginRef=useRef();

    let disableForm=true;

    function handlePassword(e){
        const{name,value}=e.target;
        setInput(prev => ({
            ...prev,
            [name]: value
        }));

    };
    if(input.password===input.confirmPassword && input.password!=""){
        disableForm=false;
    }
    
    const[loginData,setLoginData]=useState({
        userName:"",
        password:""
    });

    function changeLoginInfo(e){
        const{name,value}=e.target
        setLoginData(prev=>({
            ...prev,
            [name]:value
        }))
    }

    const[registerData,setRegisterData]=useState({
        yourName:"",
        userName:""
    });

    function changeRegisterationInfo(e){
        const{name,value}=e.target
        setRegisterData(prev=>({
            ...prev,
            [name]:value
        }))
    }
    
    const [loginError,setLoginError]=useState(false);
    const [successfulLogin,setSuccessfulLogin]=useState({
        login:false,
        userName:""
    });

    const navigate=useNavigate();

    async function handleSubmitLoginForm(e){
        e.preventDefault();

        if(e.target["userName"].value!="" &&e.target["password"].value!=""){
            const response=await axios.post(`${import.meta.env.VITE_APP_PROXY_DOMAIN}/post/login`,{
                userName:e.target["userName"].value,
                password:e.target["password"].value
            },
            {
                headers: {
                  'Content-Type': 'application/json'
                }
            }
            );
            if(response.data.error){
                setLoginError(true);
            }else{
                function setLogin(){
                    setSuccessfulLogin({
                        login:true,
                        userName:e.target["userName"].value
                    })
                }
                setLogin();

            }
                console.log(e.target["userName"].value);
                setTimeout(()=>{
                    setLoginError(false);
                },3000)
                console.log(successfulLogin);
            
            console.log(response.data);

            profile.setProfile(e.target["userName"].value)
        }

        
        
        
    }
    
    useEffect(()=>{
        if(successfulLogin.login){
            setIsLogin({
                loginState:true,
                userName:loginData.userName
            });
            navigate('/home')
        }
        setLoginData({
            userName:"",
            password:""
        })

    },[successfulLogin])

    
    


    const [userNameError,setuserNameError]=useState(false);

    async function handleSubmitRegisterForm(e){
        e.preventDefault();

        const response=await axios.post(`${import.meta.env.VITE_APP_PROXY_DOMAIN}/post/register`,{
            yourName:e.target["yourName"].value,
            userName:e.target["userName"].value,
            password:e.target["password"].value,
        },
        {
            headers: {
              'Content-Type': 'application/json'
            }
        }
        );

        if(response.data.error){
            setuserNameError(true);
        }else{
            loginRef.current.click();
        }
        setTimeout(()=>{
            setuserNameError(false);
        },5000)
        
        setRegisterData({
            yourName:"",
            userName:""
        });
        
        setInput({
            password:"",
            confirmPassword:""
        })

        console.log(response.data);

    }

    let registerButtonStyle={
        backgroundColor:""
    };
    if(!disableForm){
        registerButtonStyle={
            backgroundColor:"#03C988"
        }
    }

    let cPassBorder={
        boxShadow:"0 -2px 2px red inset"
    }
    if(!disableForm){
        cPassBorder={
            boxShadow:"0 -2px 2px #03C988 inset"
        }
    }
    
    const [loginForm,setLoginForm]=useState(true);
    function changeLoginForm(){
        if(loginForm){
            setLoginForm(false);
        }else{
            setLoginForm(true);
        }
    }

    return(
        <>
            <div className="login-container">
                <span className='title'><img src="/images/logo.png" alt="" />BolNAA</span>
                {loginForm?
                    <form className="login-form" onSubmit={handleSubmitLoginForm}>
                    <input type="text" minLength="6" autoCorrect="off" autoComplete="off" placeholder='UserName' name="userName" value={loginData.userName} onChange={changeLoginInfo}/>
                    <input type="password" placeholder='Password' name='password' value={loginData.password} onChange={changeLoginInfo}/>
                    {loginError?<span className='username-error'>*Invalid Credentials. Try Again</span>:<span></span>}
                    <div className="login-buttons-container">
                    <button className="login-submit-button">Login</button>
                    <span className='signup-login-link' onClick={changeLoginForm}>New Here? Create Your Account Now</span>
                    </div>
                </form>
                :
                <form className="login-form" onSubmit={handleSubmitRegisterForm}>
                    <input type="text" autoCorrect="off" autoComplete='off' placeholder='Your Name' name="yourName" required={true} value={registerData.yourName} onChange={changeRegisterationInfo}/>
                    <input type="text" minLength="6" autoCorrect="off" autoComplete='off' placeholder='UserName (Min. Length is 6)' name="userName" required={true} value={registerData.userName} onChange={changeRegisterationInfo}/>
                    <input type="password" placeholder='Password' name='password' required={true} value={input.password} onChange={handlePassword}/>
                    <input type="password" style={cPassBorder} placeholder='Confirm Password' name='confirmPassword' required={true} value={input.confirmPassword} onChange={handlePassword}/>
                    {userNameError?<span className='username-error'>*Username already exists. Try Another</span>:<span></span>}
                    <div className="login-buttons-container">
                    <button className="login-create-button" disabled={disableForm} style={registerButtonStyle} >Register</button>
                    <span className='signup-login-link' ref={loginRef} onClick={changeLoginForm}>Already have an Account? Click Here</span>
                    </div>

                </form>
                }
                
                
            </div>
        </>
    )
}
