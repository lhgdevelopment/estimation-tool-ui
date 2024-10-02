import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import TeamsPromptsComponent from "../../../../../views/user-management/teams-prompts/TeamsPrompts.component";

const Teams = () => {
  return <TeamsPromptsComponent />
}
Teams.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default Teams
