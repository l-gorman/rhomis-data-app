import { RiSurveyFill } from 'react-icons/ri'
import { VscInspect } from 'react-icons/vsc'
import { FcAcceptDatabase } from 'react-icons/fc'
import { FiDatabase } from 'react-icons/fi'
import { MdHelpOutline, MdOutlineDashboardCustomize, MdOutlineSendToMobile, MdOutlineCreate } from 'react-icons/md'
export const PortalDataAll = [
    {
        name: "Build a Survey",
        label: "surveyBuilder",
        text: "Get started straight away. Build a survey, collect test-data, and view your data.",
        icon: RiSurveyFill,
        link: "https://rhomis-survey.stats4sdtest.online/login/",
        external: true,
    },
    {
        name: "Manage My Projects",
        label: "projectManager",
        text: "Check up on your projects, download your data, and control user access.",
        icon: MdOutlineDashboardCustomize,
        link: "/project-management",
        external: false,

    },

    {
        name: "Collect Data",
        label: "dataCollector",
        text: "Collect data for an existing project and access enumerator training materials",
        icon: MdOutlineSendToMobile,
        link: "/project-management",
        external: false,


    },
    {
        name: "Global Dataset",
        label: "globalData",
        text: "Query publicly available survey data by time, location, and content.",
        icon: FiDatabase,
        link: "/global-data",
        external: false,


    },
    {
        name: "Help",
        label: "help",
        text: "See guidance for more advanced use case and how to contribute to our system",
        icon: MdHelpOutline,
        link: "https://rhomis-docs.readthedocs.io/en/latest/",
        external: true,
    },
    {
        name: "Form Creation",
        label: "administrator",
        text: "Create projects and forms (only used for development)",
        icon: MdOutlineCreate,
        link: "/form-creation",
        external: false,
    }
]

