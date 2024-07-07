import 'md-editor-rt/lib/style.css'
import { TProjectSOWOverviewFormComponentProps } from './ProjectSOWOverview.decorator'
import ProjectSOWOverviewFormView from './ProjectSOWOverview.view'

export default function ProjectSOWOverviewFormComponent(props: TProjectSOWOverviewFormComponentProps) {
  return <ProjectSOWOverviewFormView {...props}></ProjectSOWOverviewFormView>
}
