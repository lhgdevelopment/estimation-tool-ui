// ** Icon imports
import BiotechIcon from '@mui/icons-material/Biotech'
import GroupsIcon from '@mui/icons-material/Groups'
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
    icon: SettingsEthernetIcon,
    path: '/services'
  },
  {
    title: 'SOWs',
    icon: SettingsEthernetIcon,
    path: '/service-scopes'
  },
  {
    title: 'Deliverables',
    icon: SettingsEthernetIcon,
    path: '/service-deliverables'
  },
  {
    title: 'Tasks',
    icon: SettingsEthernetIcon,
    path: '/service-deliverable-tasks'
  },
  {
    title: 'Setings',
    icon: SettingsIcon,
    subMenu: [
      {
        title: 'Meeting Type',
        icon: SettingsEthernetIcon,
        path: '/meeting-type'
      },
      {
        title: 'Project Type',
        icon: SettingsEthernetIcon,
        path: '/project-type'
      }
    ]
  }
]

export default navigation
