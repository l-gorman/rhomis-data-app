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

    return localToken
}


async function GetFormInformation(props) {

    const result = await axios({
        method: 'post',
        url: process.env.REACT_APP_API_URL + "api/project-data",
        headers: {
            'Authorization': props.authToken
        },
        data: {
            projectName: props.projectName,
            formName: props.formName
        }
    })


    if (result.status === 200) {

        props.setFormData(result.data)
    }
    if (result.status === 400) {
        alert(result.data)
    }

}

async function GetInformationForFormComponent(props) {

    console.log("GET FORM INFO")
    console.log(props)
    const authToken = await CheckForLocalToken({ setAuthToken: props.setAuthToken })
    await FetchUserInformation({
        authToken: authToken,
        setUserInfo: props.setUserInfo
    })

    await GetFormInformation({
        authToken: authToken,
        projectName: props.projectName,
        formName: props.formName,
        setFormData: props.setFormData
    })
}


export {
    CheckForLocalToken,
    FetchUserInformation,
    GetFormInformation,
    GetInformationForFormComponent
}