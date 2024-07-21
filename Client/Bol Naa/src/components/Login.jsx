import axios from 'axios';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/userContext';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

export default function Login(){
        
    const navigate=useNavigate();

    const {setProfile,setIsLogin}=useContext(UserContext);
    
    const [open, setOpen] = useState(false);

    const[loginData,setLoginData]=useState({
        userName:"",
        password:""
    });
    
    const [loginError,setLoginError]=useState(false);

    const [successfulLogin,setSuccessfulLogin]=useState({
        login:false,
        userName:""
    });

    const [loginForm,setLoginForm]=useState(true);
    
    const[registerData,setRegisterData]=useState({
        yourName:"",
        userName:""
    });

    const [input,setInput]=useState({
        password:"",
        confirmPassword:""
    });
    
    const [userNameError,setuserNameError]=useState(false);

    const loginRef=useRef();
    
    let disableForm=true;
    
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    function changeLoginForm(){
        if(loginForm){
            setLoginData({
                userName:"",
                password:""
            })
            setLoginForm(false);
        }else{
            setRegisterData({
                yourName:"",
                userName:""
            })
            setInput({
                password:"",
                confirmPassword:""
            })
            setLoginForm(true);
        }
    }

    function handlePassword(e){
        const{name,value}=e.target;
        setInput(prev => ({
            ...prev,
            [name]: value
        }));

    };

    
    function changeLoginInfo(e){
        const{name,value}=e.target
        setLoginData(prev=>({
            ...prev,
            [name]:value
        }))
    }

    function changeRegisterationInfo(e){
        const{name,value}=e.target
        setRegisterData(prev=>({
            ...prev,
            [name]:value
        }))
    }
    
    
    async function handleSubmitLoginForm(e){
        e.preventDefault();

        if (loginData.userName != "" && loginData.password != "") {
            const response = await axios.post(`${import.meta.env.VITE_APP_PROXY_DOMAIN}/api/users/login`, loginData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            if(response.data.error){
                setLoginError(true);
                setTimeout(() => {
                    setLoginError(false);
                }, 3000)
            }else{
                setSuccessfulLogin({
                    login:true,
                    userName:loginData.userName
                })
                setProfile(response.data.profile)
                localStorage.setItem("authToken","bearer"+" "+response.data.authToken)
                setLoginData({
                    userName:"",
                    password:""
                })
                console.log(response.data);
            }
        }     
    }
    
    async function handleSubmitRegisterForm(e) {
        e.preventDefault();

        const response = await axios.post(`${import.meta.env.VITE_APP_PROXY_DOMAIN}/api/users/register`, {
            yourName: registerData.yourName,
            userName: registerData.userName,
            password: input.password,
        },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data.error) {
            setuserNameError(true);
            setTimeout(() => {
                setuserNameError(false);
            }, 5000)
        } else {
            setRegisterData({
                yourName: "",
                userName: ""
            });

            setInput({
                password: "",
                confirmPassword: ""
            })
            loginRef.current.click();
        }
    }
    
    let registerButtonStyle={
        backgroundColor:"grey",
        cursor:"not-allowed"
    };
    

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    if(input.password===input.confirmPassword && input.password!=""){
        disableForm=false;
    }

    if(!disableForm){
        registerButtonStyle={
            backgroundColor:"#03C988",
            cursor:"pointer"
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

    useEffect(() => {
        if (successfulLogin.login) {
            setIsLogin({
                loginState: true,
            });
            localStorage.setItem("loginState","true")
            navigate('/')
        }
        setLoginData({
            userName: "",
            password: ""
        })

    }, [successfulLogin])

    return (
        <>
            <div className="login-container">
                <span className='title flex items-center hover:cursor-default'><img className="title-icon" src="/images/logo.png" alt="" />BolNAA</span>
                {loginForm?
                    <form className="login-form" onSubmit={handleSubmitLoginForm}>
                    <input className="focus:border-green-400 focus:border-2 text-gray-400 font-semibold bg-black" type="text" minLength="4" autoCorrect="off" autoComplete="off" placeholder='UserName' name="userName" value={loginData.userName} onChange={changeLoginInfo}/>
                    <input className="focus:border-green-400 focus:border-2 text-gray-400 font-semibold bg-black" type="password" placeholder='Password' name='password' value={loginData.password} onChange={changeLoginInfo}/>
                    {loginError?<span className='username-error'>*Invalid Credentials. Try Again</span>:<span className='username-error flex items-center hover:cursor-pointer' onClick={handleOpen}><img src="/images/info.svg" alt="info icon" className="h-6 w-6 mr-2" /> GET LOGIN CREDENTIALS</span>}
                    <div className="login-buttons-container">
                    <button className="login-submit-button" type={(loginData.userName===""||loginData.password==="")?"button":"submit"} style={{backgroundColor:(loginData.userName===""||loginData.password==="")&&"grey",boxShadow:(loginData.userName===""||loginData.password==="")&&"none",cursor:(loginData.userName===""||loginData.password==="")&&"not-allowed"}}>Login</button>
                    <span className='signup-login-link' onClick={changeLoginForm}>New Here? Create Your Account Now</span>
                    </div>
                </form>
                :
                <form className="login-form" onSubmit={handleSubmitRegisterForm}>
                    <input className="focus:border-green-400 focus:border-2 text-gray-400 font-semibold bg-black" type="text" autoCorrect="off" autoComplete='off' placeholder='Your Name' name="yourName" required={true} value={registerData.yourName} onChange={changeRegisterationInfo}/>
                    <input className="focus:border-green-400 focus:border-2 text-gray-400 font-semibold bg-black" type="text" minLength="4" autoCorrect="off" autoComplete='off' placeholder='UserName (Min. Length is 4)' name="userName" required={true} value={registerData.userName} onChange={changeRegisterationInfo}/>
                    <input  className="focus:border-green-400 focus:border-2 text-gray-400 font-semibold bg-black" type="password" placeholder='Password' name='password' required={true} value={input.password} onChange={handlePassword}/>
                    <input className="text-gray-400 font-semibold bg-black" type="password" style={cPassBorder} placeholder='Confirm Password' name='confirmPassword' required={true} value={input.confirmPassword} onChange={handlePassword}/>
                    {userNameError?<span className='username-error'>*Username already exists. Try Another</span>:<span></span>}
                    <div className="login-buttons-container">
                    <button className="register-button" disabled={disableForm} style={registerButtonStyle} >Register</button>
                    <span className='signup-login-link' ref={loginRef} onClick={changeLoginForm}>Already have an Account? Click Here</span>
                    </div>

                </form>
                }
                
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={modalStyle}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Login Info
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                        <span className="text-slate-400">You can use the below credentials if you don't want to create a new user. (For Testing)</span>
                        </Typography>
                        <Typography sx={{mt:2}}>
                            <span className="text-slate-500"> • admin : admin</span>
                        </Typography>
                        <Typography>
                            <span className="text-slate-500"> • user : user</span>
                        </Typography>
                    </Box>
                </Modal>
            </div>
        </>
    )
}
