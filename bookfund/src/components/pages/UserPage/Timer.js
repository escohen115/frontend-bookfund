import React, {useState, useRef, useEffect} from 'react'

 
const Timer = ({mostRecent, timeLeft, setTimeLeft, displayTimer, setDisplayTimerTwo, reviewLeft })=>{
    // console.log('timer')
    // console.log('reviewleft:', reviewLeft)
    // console.log('timeleft:', timeLeft)
    // console.log('mostRecent!== null:', (mostRecent!== null))

    const [timerDays, setTimerDays] = useState(0)
    const [timerHours, setTimerHours] = useState(0)
    const [timerMinutes, setTimerMinutes] = useState(0)
    const [timerSeconds, setTimerSeconds] = useState(0)


    let interval = useRef()

    const startTimer = () => {

        // const countDownDate = new Date(parseInt(mostRecent.sponsor_date)+1209600000)
        const countDownDate = new Date(parseInt(mostRecent.sponsor_date)+60000)

   
        interval = setInterval(()=>{
            const now = new Date().getTime()
            const timeRemaining = countDownDate - now

            const days = Math.floor(timeRemaining / (1000 * 60 * 60 *24))
            const hours = Math.floor((timeRemaining % (1000 * 60 * 60 *24) / (1000*60*60)))
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60) / (1000 * 60)))
            const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000)
            
            if (timeRemaining < 0){
                // debugger
                setTimeLeft(false)
                clearInterval(interval.current)
                displayTimer = false
                setDisplayTimerTwo(false)
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
        let current = interval.current
        startTimer()
        return()=>{
            clearInterval(current)
        }
    })
    
    return (
        

        <div class="container">
            <h1 id="headline">Countdown until your next book:</h1>
                <div id="countdown">
                    <ul>
                        <li><span id="numbers">{timerDays}</span>days</li>
                        <li><span id="numbers">{timerHours}</span>Hours</li>
                        <li><span id="numbers">{timerMinutes}</span>Minutes</li>
                        <li><span id="numbers">{timerSeconds} </span>Seconds</li>
                    </ul>
                </div>
          </div>
         
    )
}

export default Timer



 