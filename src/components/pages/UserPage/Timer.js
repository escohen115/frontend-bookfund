import React, {useState, useRef, useEffect} from 'react'

 
const Timer = ({mostRecent, timeLeft, setTimeLeft, displayTimer })=>{
    
    const [timerDays, setTimerDays] = useState(0)
    const [timerHours, setTimerHours] = useState(0)
    const [timerMinutes, setTimerMinutes] = useState(0)
    const [timerSeconds, setTimerSeconds] = useState(0)


    let interval = useRef()

    const startTimer = () => {

        // const countDownDate = new Date(parseInt(mostRecent.sponsor_date)+1209600000)
        // const countDownDate = new Date(parseInt(mostRecent.sponsor_date)+180000)
        const countDownDate = new Date(parseInt(mostRecent.sponsor_date)+20000)

   
        interval = setInterval(()=>{
            const now = new Date().getTime()
            const timeLeft = countDownDate - now

            const days = Math.floor(timeLeft / (1000 * 60 * 60 *24))
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 *24) / (1000*60*60)))
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60) / (1000 * 60)))
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
            
            if (timeLeft < 0){
                setTimeLeft(false)
                clearInterval(interval.current)
                displayTimer = false
            }
            else{
                //update timer
                setTimerDays(days)
                setTimerHours(hours)
                setTimerMinutes(minutes)
                setTimerSeconds(seconds)
            }

        }, 1000)
    }

    useEffect(()=>{
        startTimer()
        return()=>{
            clearInterval(interval.current)
        }
    })
    
    return (
        <div>
      
            <p>days:{timerDays}</p>
            <p>hours:{timerHours}</p>
            <p>minutes:{timerMinutes}</p>
            <p>seconds:{timerSeconds}</p>
           
        </div> 
    )
}

export default Timer



 