import 'md-editor-rt/lib/style.css'
import { TProjectSOWSummeryFormComponentProps } from './ProjectSOWSummery.decorator'
import ProjectSOWSummeryFormView from './ProjectSOWSummery.view'

export default function ProjectSOWSummeryFormComponent(props: TProjectSOWSummeryFormComponentProps) {
  return <ProjectSOWSummeryFormView {...props}></ProjectSOWSummeryFormView>
}
