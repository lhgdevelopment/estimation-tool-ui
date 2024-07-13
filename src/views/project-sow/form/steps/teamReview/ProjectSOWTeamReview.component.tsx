import 'md-editor-rt/lib/style.css'
import { TProjectSOWTeamReviewFormComponentProps } from './ProjectSOWTeamReview.decorator'
import ProjectSOWTeamReviewFormView from './ProjectSOWTeamReview.view'

export default function ProjectSOWTeamReviewFormComponent(props: TProjectSOWTeamReviewFormComponentProps) {
  return <ProjectSOWTeamReviewFormView {...props}></ProjectSOWTeamReviewFormView>
}
