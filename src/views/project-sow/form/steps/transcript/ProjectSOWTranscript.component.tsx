import 'md-editor-rt/lib/style.css'
import { TProjectSOWTranscriptFormComponentProps } from './ProjectSOWTranscript.decorator'
import ProjectSOWTranscriptFormView from './ProjectSOWTranscript.view'

export default function ProjectSOWTranscriptFormComponent(props: TProjectSOWTranscriptFormComponentProps) {
  return <ProjectSOWTranscriptFormView {...props} />
}
