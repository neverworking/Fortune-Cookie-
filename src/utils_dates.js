export const UNLOCK_HOUR = 10; // 10 AM local time

export function toKey(date){
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const da = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${da}`;
}

export function startOfDay(date){
  const d = new Date(date);
  d.setHours(0,0,0,0);
  return d;
}

export function unlockTimeFor(date){
  const d = startOfDay(date);
  d.setHours(UNLOCK_HOUR,0,0,0);
  return d;
}

export function isUnlocked(now){
  return now.getTime() >= unlockTimeFor(now).getTime();
}

export function msUntilNextUnlock(now){
  const todayUnlock = unlockTimeFor(now).getTime();
  const nowMs = now.getTime();
  if (nowMs < todayUnlock){
    return todayUnlock - nowMs;
  } else {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate()+1);
    return unlockTimeFor(tomorrow).getTime() - nowMs;
  }
}

export function formatDuration(ms){
  if (ms < 0) ms = 0;
  const totalSeconds = Math.floor(ms/1000);
  const hrs = Math.floor(totalSeconds/3600);
  const mins = Math.floor((totalSeconds%3600)/60);
  const secs = totalSeconds%60;
  const pad = (n)=>String(n).padStart(2,'0');
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}

export function daysBetweenKeys(keyA, keyB){
  const a = startOfDay(new Date(keyA));
  const b = startOfDay(new Date(keyB));
  const diff = a.getTime() - b.getTime();
  return Math.floor(diff / (1000*60*60*24));
}
