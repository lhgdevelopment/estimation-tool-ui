// ** Icon imports
import BiotechIcon from '@mui/icons-material/Biotech'
import GroupsIcon from '@mui/icons-material/Groups'
import LinkIcon from '@mui/icons-material/Link'
import SettingsIcon from '@mui/icons-material/Settings'
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet'
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
    title: 'Prompts',
    icon: SettingsEthernetIcon,
    path: '/prompts'
  },
  {
    title: 'Meeting Summery',
    icon: GroupsIcon,
    path: '/meeting-summery'
  },

  {
    title: 'Services',
    icon: SettingsIcon,
    path: 'services',
    subMenu: [
      {
        title: 'Service',
        icon: SettingsEthernetIcon,
        path: '/services/service'
      },
      {
        title: 'Groups',
        icon: SettingsEthernetIcon,
        path: '/services/service-groups'
      },
      {
        title: 'SOWs',
        icon: SettingsEthernetIcon,
        path: '/services/service-scopes'
      },
      {
        title: 'Deliverables',
        icon: SettingsEthernetIcon,
        path: '/services/service-deliverables'
      },
      {
        title: 'Tasks',
        icon: SettingsEthernetIcon,
        path: '/services/service-deliverable-tasks'
      }
    ]
  },
  {
    title: 'Setings',
    icon: SettingsIcon,
    path: 'settings',
    subMenu: [
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
    title: 'Users',
    icon: GroupsIcon,
    path: '/users'
  },

  {
    title: 'Referance Links',
    icon: LinkIcon,
    path: 'settings',
    subMenu: [
      {
        title: 'Windmill',
        icon: GroupsIcon,
        path: 'https://search.vercel.app/'
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
