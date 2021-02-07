


export default function UserPage({user}){
    
    if (user){
    return(
        <div> 
            <img src={user.profile_pic ? user.profile_pic : null}></img>
            <p>name:{user.name ? user.name : null}</p>
            <p>email:{user.email ? user.email : null}</p>
            <p>username:{user.username ? user.username : null }</p>
            <p>bio:{user.bio ? user.bio : null}</p>
        </div>
    )}
    else{
        return null
    }
}