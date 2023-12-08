// ** Icon imports
import CategoryIcon from '@mui/icons-material/Category'
import DashboardIcon from '@mui/icons-material/Dashboard'
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize'
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet'
import { SvgIconTypeMap } from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'

type TNavigation = {
  title: string
  icon?: OverridableComponent<SvgIconTypeMap>
  path: string
}
const navigation: TNavigation[] = [
  // {
  //   title: 'Projects',
  //   icon: ShoppingCartIcon,
  //   path: '/Project',
  //   component: 'button'
  // },

  {
    title: 'Website Component Categories',
    icon: CategoryIcon,
    path: '/website-component-categories'
  },
  {
    title: 'Website Component',
    icon: DashboardIcon,
    path: '/website-component'
  },
  {
    title: 'Project Components',
    icon: DashboardCustomizeIcon,
    path: '/project-component'
  },
  {
    title: 'Project Summery',
    icon: DashboardCustomizeIcon,
    path: '/project-summery'
  },
  {
    title: 'Prompts',
    icon: SettingsEthernetIcon,
    path: '/prompts'
  }
]

export default navigation
