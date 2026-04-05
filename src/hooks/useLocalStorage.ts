import { useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T): [T, (val: T) => void] {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  function setValue(value: T) {
    try {
      setStored(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // ignore
    }
  }

  return [stored, setValue]
}
