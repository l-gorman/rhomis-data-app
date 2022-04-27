import React, { useState, useContext, useEffect } from 'react'
import { Card, Button, Spinner } from 'react-bootstrap'
import { useParams, useHistory } from 'react-router-dom'

import AuthContext from '../authentication-component/AuthContext'
import UserContext from '../user-info-component/UserContext'

import { GetInformationForFormComponent, Set } from '../fetching-context-info/fetching-context-info'

import { FetchUserInformation } from '../fetching-context-info/fetching-context-info'
import { AiOutlineArrowLeft } from 'react-icons/ai'

import QRCode from 'react-qr-code'
import { deflateSync } from 'zlib'

import axios from 'axios'


async function ProcessData(props) {
    console.log(props)
    const form = props.data.forms.filter((item) => item.name === props.formSelected && item.project === props.projectSelected)[0]
    const result = await axios({
        method: 'post',
        url: process.env.REACT_APP_API_URL + "api/process-data",
        headers: {
            'Authorization': props.authToken
        },
        data: {
            commandType: props.commandType,
            projectName: props.projectSelected,
            formName: props.formSelected,
            formVersion: form.formVersion,
            draft: props.draft,
        }
    })
    return (result)
}

function SetInitialFormState(props) {

    // Check if the form code in the URL is correct
    function CheckFormCode(props) {
        if (!props.data) {
            return false
        }
        if (!props.data.forms) {
            return false
        }
        let form = props.data.forms.filter((item) => item.name === props.formSelected & item.project === props.projectSelected)
        if (form.length === 1) {
            return true
        }
        return (false)
    }

    // Check if the user is a project manager
    function CheckProjectManager(props) {


        if (!props.data) {
            return false
        }
        if (!props.data.user) {
            return false
        }

        if (!props.data.user.roles) {
            return false
        }

        if (!props.data.user.roles.projectManager) {
            return false
        }

        if (props.data.user.roles.projectManager.includes(props.projectSelected)) {
            return true
        }


        return false

    }

    // Check if the ODK configuration details are included
    function CheckODKConf(props) {

        if (!props.data) {
            return false
        }

        if (!props.data.forms) {
            return false
        }
        let form = props.data.forms.filter((item) => item.name === props.formSelected && item.project === props.projectSelected)
        if (form.length !== 1) {
            return false
        }

        if (form[0].draft === true) {
            return form[0].draftCollectionDetails

        }
        if (form[0].draft === false) {
            return form[0].collectionDetails
        }


        return false
    }

    // Check if the encoded ODK settings exist
    function CheckEncodedSettings(props) {

        if (!props.data) {
            return false
        }

        if (!props.data.forms) {
            return false
        }
        let form = props.data.forms.filter((item) => item.name === props.formSelected && item.project === props.projectSelected)

        if (form.length !== 1) {
            return false
        }

        if (form[0].draft === true) {
            let odkConf = form[0].draftCollectionDetails
            return deflateSync(JSON.stringify(odkConf)).toString('base64')

        }
        if (form[0].draft === false) {
            let odkConf = form[0].collectionDetails
            return deflateSync(JSON.stringify(odkConf)).toString('base64')
        }


        return false

    }

    // Check if the form is a draft
    function CheckDraft(props) {

        if (!props.data) {
            return false
        }

        if (!props.data.forms) {
            return false
        }
        let form = props.data.forms.filter((item) => item.name === props.formSelected && item.project === props.projectSelected)

        if (form.length !== 1) {
            return false
        }

        if (form[0].draft === true) {
            return true

        }
        if (form[0].draft === false) {
            return false
        }
        return false

    }

    // Check if a code for the form should be rendered

    const renderODKFormCode = CheckFormCode({
        data: props.data,
        formSelected: props.formSelected,
        projectSelected: props.projectSelected
    })


    const projectManagerOfForm = CheckProjectManager({
        data: props.data,
        projectSelected: props.projectSelected
    })


    const odkConf = CheckODKConf({
        data: props.data,
        projectSelected: props.projectSelected,
        formSelected: props.formSelected
    })

    const encoded_settings = CheckEncodedSettings({
        data: props.data,
        projectSelected: props.projectSelected,
        formSelected: props.formSelected
    })

    const draft = CheckDraft({
        data: props.data,
        projectSelected: props.projectSelected,
        formSelected: props.formSelected
    })

    // Need to add data collecter as an option
    const stateToReturn = {
        renderODKFormCode: renderODKFormCode,
        projectManagerOfForm: projectManagerOfForm,
        odkConf: odkConf,
        encoded_settings: encoded_settings,
        draft: draft
    }
    return stateToReturn
}





function CardBody(props) {
    console.log(props)

    return (
        <>
            <ol>
                <li><a href='https://docs.getodk.org/collect-install/' target="_blank">Install ODK</a></li>
                <li>Open the ODK app</li>
                <li>Scan this QR code</li>
            </ol>
            <div className="qr-code-container">

                {props.formState.encoded_settings ? <QRCode value={props.formState.encoded_settings} /> : <Spinner
                    as="span"
                    animation="border"
                    size="100px"
                    role="status"
                    aria-hidden="true"
                />}

            </div>


            {
                props.formState.draft ? <>

                    <br />


                    < br />
                    <Button className="bg-dark border-0" style={{ "margin": "10px" }}
                        onClick={async () => {
                            await ProcessData({
                                commandType: "generate",
                                draft: props.formState.draft,
                                authToken: props.authToken,
                                data: props.data,
                                formSelected: props.formSelected,
                                projectSelected: props.projectSelected
                            })
                            console.log("Finished Generating Data")
                        }}

                    >Generate Mock Submissions</Button>

                    <br />
                    <p>*Your form is currently saved as a draft. Any submissions you make
                        will be removed once the form is finalised. Mock submissions are a useful way to see what your
                        data might look like, they will also be deleted once you finalise the form* </p>
                </>
                    : <></>
            }


        </>
    )

}




export default function DataCollectionComponent() {

    const projectSelected = useParams().projectName
    const formSelected = useParams().formName

    const [renderInstallCode, setRenderInstallCode] = useState(false)
    const [renderODKFormCode, setRenderODKFormCode] = useState(true)

    const [authToken, setAuthToken] = useContext(AuthContext)
    const [adminData, setAdminData] = useContext(UserContext)

    const history = useHistory()

    const [initialState, setInitialState] = useState({
        renderODKFormCode: false,
        projectManagerOfForm: false,
        dataAnalystOfForm: false,
        odkConf: false,
        encoded_settings: false,
        draft: false,
        data:{
            forms:[],
            users:[],
            projects:[]
        }
    })



    useEffect(() => {

        async function FetchUserInfo(){
            await FetchUserInformation({
                authToken: authToken,
                setUserInfo: setAdminData
            })
        }

        FetchUserInfo()
        
    }, [])

    useEffect(() => {
        const new_form_state = SetInitialFormState({
            data: adminData,
            formSelected: formSelected,
            projectSelected: projectSelected
        })

        console.log("Setting initial state")
        console.log(new_form_state)
        console.log(adminData)

        setInitialState(new_form_state)


    }, [adminData])

    return (
        <div id="project-management-container" className="sub-page-container">

            <Card className="main-card border-0">
                <Card.Header className=" bg-dark text-white">
                    <div className="main-card-header-container">
                        <h3>Collect Data</h3>

                        <div style={{ "display": "flex", "flex-direction": "row", "margin-left": "auto" }} >
                            <div className="main-card-header-item">{projectSelected}</div>
                            <div className="main-card-header-item">{formSelected}</div>

                            <Button className="bg-dark border-0" onClick={() => {
                                history.push("/projects/" + projectSelected)

                            }}>
                                <AiOutlineArrowLeft size={25} />
                            </Button>
                        </div>
                    </div>

                </Card.Header>
                <Card.Body className="main-card-body">



                    <CardBody formState={initialState} 
                    data={adminData}
                    authToken={authToken}
                    formSelected={formSelected}
                    projectSelected={projectSelected}/>

                </Card.Body>
            </Card>
        </div >

    )
}
