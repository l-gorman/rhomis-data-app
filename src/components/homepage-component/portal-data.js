import { RiSurveyFill } from 'react-icons/ri'
import { VscInspect } from 'react-icons/vsc'
import { FcAcceptDatabase } from 'react-icons/fc'
import { FiDatabase } from 'react-icons/fi'
import { MdHelpOutline, MdOutlineDashboardCustomize, MdOutlineSendToMobile } from 'react-icons/md'
export const PortalDataAll = [
    {
        name: "Quickstart",
        text: "Get started straight away. Build a survey, collect test-data, and view your data.",
        icon: RiSurveyFill,
        link: "https://rhomis-survey.stats4sdtest.online/login",
        external: true,
        roles: ["basic"]
    },
    {
        name: "Manage Projects",
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
        link: "/project-management",
        external: false,
        roles: ["project-manager", "data-collector"]


    },
    {
        name: "Global Dataset",
        text: "Query publicly available survey data by time, location, and content.",
        icon: FiDatabase,
        link: "/project-management",
        external: false,
        roles: ["basic"]


    },
    {
        name: "Documentation",
        text: "See guidance for more advanced use case and how to contribute to our system",
        icon: MdHelpOutline,
        link: "https://rhomis-docs.readthedocs.io/en/latest/",
        external: true,
        roles: ["basic"]
    }
]

export const PortalDataNewUser = [
    {
        name: "Quickstart",
        text: "Get started straight away. Build a survey, collect test-data, and view your data",
        icon: RiSurveyFill,
        link: process.env.SURVEY_BUILDER_URL,
        external: true,
        roles: ["basic"]

    },
]