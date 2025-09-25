import { DASHBOARD_REDUX_STATE, REPORT_AUDIT_STATUS_LABEL, REPORT_STATUS_LABEL } from "@@/constants";
import { format } from "date-fns/format";

const pluralRules = new Intl.PluralRules('en-US');


export function updateNestedField(obj: any, path: string, value: any): any {
    const keys = path.split(".");
    let newObj = { ...obj }; // Start with a shallow copy of the input object
    let current = newObj;

    // Iterate over the keys, but stop at the second-to-last key
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        // If the current level does not have the key, create an empty object
        if (!(key in current)) {
            current[key] = {};
        }
        // Move deeper into the object, creating shallow copies as needed
        current[key] = { ...current[key] };
        current = current[key];
    }

    // Update the final key with the new value
    current[keys[keys.length - 1]] = value;

    return newObj;
}

export const pluralize = (count: number, noun: string, suffix = 's') =>
    `${count} ${noun}${count > 1 ? suffix : ''}`;

export const pluralizeWithMapping = (count: number, mapping: {one: string, other: string}) => pluralRules.select(count) == "one" ? mapping.one : mapping.other;

export const gracefulStringWrap = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text

    let parts: string[] = []

    let startIndex = 0
    while (true) {
        let i = text.indexOf(" ", startIndex + maxLength)
        if (i === -1) {
            parts.push(text.substring(startIndex, text.length))
            return parts
        }
        parts.push(text.substring(startIndex, i))
        startIndex = i + 1
    }
}

export const getErrorMessage = (error: any) => {
    if (error?.response?.data?.message) {
        return error.response.data.message
    }
    return error.message
}

export const getReportStatusTitle = (statusCode: number) => {
    return REPORT_STATUS_LABEL['' + statusCode] || ""
}

export const getReportAuditStatusTitle = (statusCode: number) => {
    return REPORT_AUDIT_STATUS_LABEL['' + statusCode] || ""
}

export const formatMonthlyReportSession = (date: string) => {
    return format(date, 'MMMM, yyyy')
}

export const loadAuthUser = () => {
  const state = localStorage.getItem(DASHBOARD_REDUX_STATE)
  if(!state) return null
  const parsed = JSON.parse(state)
  return parsed.login.user
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