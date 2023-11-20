// ** Icon imports
import InventoryIcon from '@mui/icons-material/Inventory'
import WebIcon from '@mui/icons-material/Web'
import { SvgIconTypeMap } from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'
import HomeOutline from 'mdi-material-ui/HomeOutline'

type TNavigation = {
  title: string
  icon?: OverridableComponent<SvgIconTypeMap>
  path: string
}
const navigation: TNavigation[] = [
  // {
  //   title: 'Projects',
  //   icon: ShoppingCartIcon,
  //   path: '/projects',
  //   component: 'button'
  // },

  {
    title: 'Website Component Categories',
    icon: InventoryIcon,
    path: '/website-component-categories'
  },
  {
    title: 'Website Component',
    icon: WebIcon,
    path: '/website-component'
  },
  {
    title: 'Project Components',
    icon: HomeOutline,
    path: '/projects-components'
  }
]

export default navigation
