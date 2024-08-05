
export default function Welcome() {
    return (
        <div className='md:flex-grow md:w-auto md:inline-block bg-slate-900 hidden w-0'>
            <div className='chatbox-welcome-container'>
                <img className='chatbox-welcome-image' src="../images/logo.png" alt="" />
                <span className='chatbox-welcome-message'>Thank You for using BolNAA!!!</span>
            </div>
        </div>
    )
}
