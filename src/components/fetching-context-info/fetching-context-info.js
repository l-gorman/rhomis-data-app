import axios from 'axios'

async function FetchUserInformation(props) {
    const response = await axios({
        method: "get",
        url: process.env.REACT_APP_AUTHENTICATOR_URL + "api/meta-data/",
        headers: {
            'Authorization': props.authToken
        }
    })
    console.log("user info")
    console.log(response.data)
    props.setUserInfo(response.data)
    // return (response.data)
}

function CheckUserInformation() {

}

function CheckForLocalToken(props) {
    const localToken = localStorage.getItem("userToken")

    const currentDate = new Date()
    const localTokenCreationTime = new Date(localStorage.getItem("createdAt"))

    console.log("Difference")
    console.log(currentDate.getTime() - localTokenCreationTime.getTime())

    const timeDifference = currentDate.getTime() - localTokenCreationTime.getTime()
    if (timeDifference < 60 * 60 * 1000) {
        props.setAuthToken(localToken)
    }
}

export {
    CheckForLocalToken,
    FetchUserInformation,
}