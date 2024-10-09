// ** Icon imports
import BadgeIcon from '@mui/icons-material/Badge'
import BiotechIcon from '@mui/icons-material/Biotech'
import EngineeringIcon from '@mui/icons-material/Engineering'
import EventRepeatIcon from '@mui/icons-material/EventRepeat'
import GroupsIcon from '@mui/icons-material/Groups'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import LinkIcon from '@mui/icons-material/Link'
import SettingsIcon from '@mui/icons-material/Settings'
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet'
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes'
import { SvgIconTypeMap } from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'
import Diversity3Icon from '@mui/icons-material/Diversity3';
import MemoryIcon from '@mui/icons-material/Memory';

type TNavigation = {
  title: string
  icon?: OverridableComponent<SvgIconTypeMap>
  path: string
  subMenu?: TSubMenu[]
  accessBy?: string[]
}
type TSubMenu = {
  title: string
  icon?: OverridableComponent<SvgIconTypeMap>
  path?: string
  accessBy?: string[]
}
const navigation: TNavigation[] = [
  {
    title: 'Project SOW',
    icon: BiotechIcon,
    path: '/project-summary',
    accessBy: ['Admin']
  },

  {
    title: 'Meeting Summary',
    icon: SpeakerNotesIcon,
    path: '/meeting-summary',
    accessBy: ['Admin']
  },
  {
    title: 'Leads',
    icon: LeaderboardIcon,
    path: '/leads',
    accessBy: ['Admin']
  },

  // {
  //   title: 'Hive AI',
  //   icon: HiveIcon,
  //   path: '/ai-assistant'
  // },
  {
    title: 'Service Management',
    icon: EngineeringIcon,
    path: 'service-management',
    accessBy: ['Admin'],
    subMenu: [
      {
        title: 'Services',
        icon: SettingsEthernetIcon,
        path: '/service-management/service-tree',
        accessBy: ['Admin']
      },
      {
        title: 'Hourly Rates',
        icon: BadgeIcon,
        path: '/service-management/hourly-rates',
        accessBy: ['Admin']
      },
      {
        title: 'Questions',
        icon: SettingsEthernetIcon,
        path: '/service-management/service-question',
        accessBy: ['Admin']
      }
    ]
  },
  {
    title: 'Setings',
    icon: SettingsIcon,
    path: 'settings',
    accessBy: ['Admin'],
    subMenu: [
      {
        title: 'AI Prompts',
        icon: SettingsEthernetIcon,
        path: '/settings/prompts',
        accessBy: ['Admin']
      },

      {
        title: 'Meeting Type',
        icon: SettingsEthernetIcon,
        path: '/settings/meeting-type',
        accessBy: ['Admin']
      },
      {
        title: 'Project Type',
        icon: SettingsEthernetIcon,
        path: '/settings/project-type',
        accessBy: ['Admin']
      },
      {
        title: 'Update Log',
        icon: EventRepeatIcon,
        path: '/settings/update-log',
        accessBy: ['Admin']
      },
      {
        title: 'Memory',
        icon: EventRepeatIcon,
        path: '/settings/memory',
        accessBy: ['Admin']
      }
    ]
  },
  {
    title: 'User Management',
    icon: GroupsIcon,
    path: '/user-management',
    accessBy: ['Admin'],
    subMenu: [
      {
        title: 'Role & Permission',
        icon: SettingsEthernetIcon,
        path: '/user-management/role-permission',
        accessBy: ['Admin']
      },
      {
        title: 'User',
        icon: SettingsEthernetIcon,
        path: '/user-management/users',
        accessBy: ['Admin']
      },
      {
        title: 'Teams',
        icon: MemoryIcon,
        path: '/user-management/teams',
        accessBy: ['Admin']
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
      },
      {
        title: 'Time Cloud',
        icon: GroupsIcon,
        path: 'https://time.cloud.lhgdev.com/'
      }
    ]
  }
]

export default navigation
