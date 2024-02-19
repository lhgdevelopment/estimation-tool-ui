// ** Icon imports
import BiotechIcon from '@mui/icons-material/Biotech'
import ChatIcon from '@mui/icons-material/Chat'
import EngineeringIcon from '@mui/icons-material/Engineering'
import GroupsIcon from '@mui/icons-material/Groups'
import LinkIcon from '@mui/icons-material/Link'
import SettingsIcon from '@mui/icons-material/Settings'
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet'
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes'
import { SvgIconTypeMap } from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'

type TNavigation = {
  title: string
  icon?: OverridableComponent<SvgIconTypeMap>
  path?: string
  subMenu?: TSubMenu[]
}
type TSubMenu = {
  title: string
  icon?: OverridableComponent<SvgIconTypeMap>
  path?: string
}
const navigation: TNavigation[] = [
  // {
  //   title: 'Projects',
  //   icon: ShoppingCartIcon,
  //   path: '/Project',
  //   component: 'button'
  // },

  // {
  //   title: 'Website Component Categories',
  //   icon: CategoryIcon,
  //   path: '/website-component-categories'
  // },
  // {
  //   title: 'Website Component',
  //   icon: DashboardIcon,
  //   path: '/website-component'
  // },
  // {
  //   title: 'Project Components',
  //   icon: DashboardCustomizeIcon,
  //   path: '/project-component'
  // },
  {
    title: 'Project SOW',
    icon: BiotechIcon,
    path: '/project-summery'
  },

  {
    title: 'Meeting Summery',
    icon: SpeakerNotesIcon,
    path: '/meeting-summery'
  },
  {
    title: 'Chat',
    icon: ChatIcon,
    path: '/chat'
  },

  {
    title: 'Service Management',
    icon: EngineeringIcon,
    path: 'service-management',
    subMenu: [
      {
        title: 'Service',
        icon: SettingsEthernetIcon,
        path: '/service-management/service'
      },
      {
        title: 'Groups',
        icon: SettingsEthernetIcon,
        path: '/service-management/service-groups'
      },
      {
        title: 'SOWs',
        icon: SettingsEthernetIcon,
        path: '/service-management/service-scopes'
      },
      {
        title: 'Deliverables',
        icon: SettingsEthernetIcon,
        path: '/service-management/service-deliverables'
      },
      {
        title: 'Tasks',
        icon: SettingsEthernetIcon,
        path: '/service-management/service-deliverable-tasks'
      }
    ]
  },
  {
    title: 'Setings',
    icon: SettingsIcon,
    path: 'settings',
    subMenu: [
      {
        title: 'Prompts',
        icon: SettingsEthernetIcon,
        path: '/settings/prompts'
      },
      {
        title: 'Meeting Type',
        icon: SettingsEthernetIcon,
        path: '/settings/meeting-type'
      },
      {
        title: 'Project Type',
        icon: SettingsEthernetIcon,
        path: '/settings/project-type'
      }
    ]
  },
  {
    title: 'User Management',
    icon: GroupsIcon,
    path: '/user-management',
    subMenu: [
      {
        title: 'Role & Permission',
        icon: SettingsEthernetIcon,
        path: '/user-management/role-permission'
      },
      {
        title: 'User',
        icon: SettingsEthernetIcon,
        path: '/user-management/users'
      }
    ]
  },

  {
    title: 'Referance Links',
    icon: LinkIcon,
    path: '',
    subMenu: [
      {
        title: 'Windmill',
        icon: GroupsIcon,
        path: 'https://windmill-dashboard.vercel.app/'
      },
      {
        title: 'MUI',
        icon: GroupsIcon,
        path: 'https://mui.com/material-ui/all-components/'
      },
      {
        title: 'MUI Icons',
        icon: GroupsIcon,
        path: 'https://mui.com/material-ui/material-icons/'
      }
    ]
  }
]

export default navigation
