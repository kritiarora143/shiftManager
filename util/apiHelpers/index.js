import axios from 'axios'

const serverURL = "https://5480-117-220-97-59.in.ngrok.io/shifts"

export const getShifts = () => {
    return axios.get(serverURL)
}
export const bookShift = (id) => {
    return axios.post(`${serverURL}/${id}/book`)
}
export const cancelShift = (id) => {
    return axios.post(`${serverURL}/${id}/cancel`)
}