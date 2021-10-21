import { RiSurveyFill } from 'react-icons/ri'
import { VscInspect } from 'react-icons/vsc'
import { FcAcceptDatabase } from 'react-icons/fc'
import { FiDatabase } from 'react-icons/fi'
import { MdHelpOutline, MdOutlineDashboardCustomize, MdOutlineSendToMobile, MdOutlineCreate } from 'react-icons/md'
export const PortalDataAll = [
    {
        name: "Build a Survey",
        text: "Get started straight away. Build a survey, collect test-data, and view your data.",
        icon: RiSurveyFill,
        link: "https://rhomis-survey.stats4sdtest.online/login",
        external: true,
        roles: ["basic"]
    },
    {
        name: "Manage My Projects",
        text: "Check up on your projects, download your data, and control user access.",
        icon: MdOutlineDashboardCustomize,
        link: "/project-management",
        external: false,
        roles: ["project-manager", "project-analyst"]

    },

    {
        name: "Collect Data",
        text: "Collect data for an existing project and access enumerator training materials",
        icon: MdOutlineSendToMobile,
        link: "/data-collection",
        external: false,
        roles: ["project-manager", "data-collector"]


    },
    {
        name: "Global Dataset",
        text: "Query publicly available survey data by time, location, and content.",
        icon: FiDatabase,
        link: "/global-data",
        external: false,
        roles: ["basic"]


    },
    {
        name: "Help",
        text: "See guidance for more advanced use case and how to contribute to our system",
        icon: MdHelpOutline,
        link: "https://rhomis-docs.readthedocs.io/en/latest/",
        external: true,
        roles: ["basic"]
    },
    {
        name: "Form Creation",
        text: "Create projects and forms (only used for development)",
        icon: MdOutlineCreate,
        link: "/form-creation",
        external: false,
        roles: ["basic"]
    }
]

export const PortalDataNewUser = [
    {
        name: "Build a Survey",
        text: "Get started straight away. Build a survey, collect test-data, and view your data",
        icon: RiSurveyFill,
        link: process.env.SURVEY_BUILDER_URL,
        external: true,
        roles: ["basic"]

    },
]