import { DASHBOARD_REDUX_STATE } from "@/constants/common"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const loadAuthUser = () => {
  const state = localStorage.getItem(DASHBOARD_REDUX_STATE)
  if(!state) return null
  const parsed = JSON.parse(state)
  return parsed.login?.user
}

export const setAuthUser = (data: any) => {
  const state = localStorage.getItem(DASHBOARD_REDUX_STATE)
  if(!state) {
    let d = {
      login: {
        user: data
      }
    }
    localStorage.setItem(DASHBOARD_REDUX_STATE, JSON.stringify(d))
    return
  }
  const parsed = JSON.parse(state)
  if(!parsed.login) {
    parsed.login = {
      user: data
    }
  }else{
    parsed.login.user = data
  }

  localStorage.setItem(DASHBOARD_REDUX_STATE, JSON.stringify(parsed))
}