import 'md-editor-rt/lib/style.css'
import { TProjectSOWProblemAndGoalsFormComponentProps } from './ProjectSOWProblemAndGoals.decorator'
import ProjectSOWProblemAndGoalsFormView from './ProjectSOWProblemAndGoals.view'

export default function ProjectSOWProblemAndGoalsFormComponent(props: TProjectSOWProblemAndGoalsFormComponentProps) {
  return <ProjectSOWProblemAndGoalsFormView {...props}></ProjectSOWProblemAndGoalsFormView>
}
