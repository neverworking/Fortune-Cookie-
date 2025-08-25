import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Typewriter from "./Typewriter.jsx";
import { fortunes } from '../fortunes.js'
import { UNLOCK_HOUR, toKey, unlockTimeFor, isUnlocked, msUntilNextUnlock, formatDuration, daysBetweenKeys } from '../utils_dates.js'

const STORAGE_KEYS = {
  lastOpened: 'dfc:lastOpened', // YYYY-MM-DD
  startDate: 'dfc:startDate',   // YYYY-MM-DD (first open day)
}

function useNow(tickMs = 1000){
  const [now, setNow] = useState(new Date())
  useEffect(()=>{
    const id = setInterval(()=> setNow(new Date()), tickMs)
    return ()=> clearInterval(id)
  }, [tickMs])
  return now
}

export default function Cookie(){
  const now = useNow(1000)
  const todayKey = toKey(now)
  const unlocked = isUnlocked(now)

  const lastOpened = localStorage.getItem(STORAGE_KEYS.lastOpened)
  const startDate = localStorage.getItem(STORAGE_KEYS.startDate)
  const openedToday = lastOpened === todayKey

  // Determine current fortune index
  const dayIndex = useMemo(()=>{
    if (!startDate) return 0
    return Math.max(0, daysBetweenKeys(todayKey, startDate))
  }, [todayKey, startDate])

  const currentFortune = fortunes[dayIndex % fortunes.length]

  const [cracked, setCracked] = useState(false)
  const [showSlip, setShowSlip] = useState(false)
  const [typingKey, setTypingKey] = useState(0) // to retrigger typewriter if needed

  useEffect(()=>{
    // If already opened today, show cracked + slip
    if (openedToday){
      setCracked(true)
      setShowSlip(true)
    } else {
      setCracked(false)
      setShowSlip(false)
    }
  }, [openedToday, todayKey])

  function handleOpen(){
    if (!unlocked) return
    if (openedToday) return

    // Start animation sequence
    setCracked(true)
    // delay slip show for effect
    setTimeout(()=>{
      setShowSlip(true)
      setTypingKey((k)=>k+1)
    }, 650)

    // Persist state
    localStorage.setItem(STORAGE_KEYS.lastOpened, todayKey)
    if (!startDate){
      localStorage.setItem(STORAGE_KEYS.startDate, todayKey)
    }
  }

  const msLeft = msUntilNextUnlock(now)
  const nextLabel = unlocked && openedToday ? 'Next cookie in' : 'Unlocks in'

  // Dev reset via ?dev=1
  const [dev, setDev] = useState(false)
  useEffect(()=>{
    const params = new URLSearchParams(window.location.search)
    if (params.get('dev') === '1') setDev(true)
  }, [])

  function resetProgress(){
    localStorage.removeItem(STORAGE_KEYS.lastOpened)
    localStorage.removeItem(STORAGE_KEYS.startDate)
    window.location.reload()
  }

  return (
    <div className="w-full h-full flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Daily Fortune Cookie
          </h1>
          <div className="text-sm text-white/80">
            <span className="hidden sm:inline">Unlock time:&nbsp;</span>
            <strong className="text-tint">{UNLOCK_HOUR}:00</strong>
          </div>
        </header>

        <div className="glass p-6 md:p-8 relative overflow-hidden">
          {/* subtle glow */}
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-tint/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-pink-300/10 blur-3xl pointer-events-none" />

          {/* Status row */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-2.5 h-2.5 rounded-full ${unlocked ? 'bg-green-400' : 'bg-yellow-300'} shadow-glow`} />
            <p className="text-sm md:text-base text-white/90">
              {unlocked ? (openedToday ? 'Today’s cookie opened ✔︎' : 'Ready to open ✨') : 'Locked until 10:00 AM ⏰'}
            </p>
          </div>

          {/* Cookie area */}
          <div className="relative flex flex-col items-center">
            {/* Sparkles on crack */}
            <AnimatePresence>
              {cracked && (
                <motion.img
                  key="sprk"
                  src="/sparkles.svg"
                  alt="sparkles"
                  className="absolute -top-10 w-36 opacity-80 pointer-events-none"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.85 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                />
              )}
            </AnimatePresence>

            {/* Cookie visuals */}
            <div className="h-48 md:h-60 flex items-center justify-center my-4">
              <div className="relative">
                {!cracked ? (
                  <motion.img
                    src="/cookie_closed.svg"
                    alt="fortune cookie"
                    className="w-44 md:w-56 cookie-shadow floaty"
                    onClick={handleOpen}
                    initial={{ scale: 0.95 }}
                    animate={{ scale: unlocked && !openedToday ? 1 : 0.98 }}
                    whileTap={{ scale: 0.92, rotate: -5 }}
                    whileHover={unlocked && !openedToday ? { scale: 1.03 } : {}}
                    style={{ cursor: unlocked && !openedToday ? 'pointer' : 'not-allowed' }}
                    transition={{ type: 'spring', stiffness: 250, damping: 12 }}
                  />
                ) : (
                  <div className="w-60 md:w-72 relative">
                    <motion.img
                      src="/cookie_left.svg"
                      alt="left cookie half"
                      className="w-32 md:w-36 absolute left-0 top-1/2 -translate-y-1/2 cookie-shadow"
                      initial={{ x: 0, rotate: 0, opacity: 1 }}
                      animate={{ x: -30, rotate: -20, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 120, damping: 12 }}
                    />
                    <motion.img
                      src="/cookie_right.svg"
                      alt="right cookie half"
                      className="w-32 md:w-36 absolute right-0 top-1/2 -translate-y-1/2 cookie-shadow"
                      initial={{ x: 0, rotate: 0, opacity: 1 }}
                      animate={{ x: 30, rotate: 20, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.02 }}
                    />

                    <AnimatePresence>
                      {showSlip && (
                        <motion.div
                          key="slip"
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: -30, opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                          className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
                        >
                          <div className="bg-white text-slate-800 rounded-md shadow-lg px-4 py-3 max-w-xs text-center">
                            <p className="text-sm leading-relaxed">
                              <Typewriter key={typingKey} text={currentFortune} speed={22} />
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>

            {/* Countdown */}
            <div className="mt-6 flex flex-col items-center gap-2">
              <p className="text-white/80 text-sm">{nextLabel}</p>
              <div className="text-xl md:text-2xl font-semibold tracking-wider tabular-nums">
                {formatDuration(msLeft)}
              </div>
            </div>

            {/* Callout */}
            {!unlocked && (
              <p className="mt-6 text-center text-white/80">
                Come back at <span className="text-white font-semibold">10:00 AM</span> for your daily cookie.
              </p>
            )}
            {unlocked && openedToday && (
              <p className="mt-6 text-center text-white/80">
                You’ve opened today’s cookie. See you tomorrow at <span className="text-white font-semibold">10:00 AM</span> 💌
              </p>
            )}
          </div>
        </div>

        <footer className="mt-6 flex items-center justify-between text-white/70 text-xs">
          <span>Made with 💙 for you</span>
          <div className="flex items-center gap-2">
            {dev && <button className="button" onClick={resetProgress}>Reset progress (dev)</button>}
            <a className="button" href="https://vercel.com/new" target="_blank" rel="noreferrer">Deploy</a>
          </div>
        </footer>
      </div>
    </div>
  )
}
