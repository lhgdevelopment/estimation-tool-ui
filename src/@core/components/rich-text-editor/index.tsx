import { IJoditEditorProps, Jodit } from 'jodit-react'
import dynamic from 'next/dynamic'
import { RefObject, useRef } from 'react'
import { useSelector } from 'react-redux'
import { DeepPartial } from 'redux'
import { RootState } from 'src/@core/store/reducers'

type TRichTextEditorProps = IJoditEditorProps

export function RichTextEditor(props: TRichTextEditorProps) {
  const JoditEditor = dynamic(() => import('jodit-react').then(mod => mod.default), { ssr: false })

  const isDark = useSelector((state: RootState) => state.theme.isDark)
  const editorRef: RefObject<Jodit> = useRef<Jodit>(null)
  const config: DeepPartial<Jodit['options']> = {
    enter: 'br',
    theme: isDark ? 'dark' : '',
    defaultActionOnPaste: 'insert_as_html',
    defaultActionOnPasteFromWord: 'insert_as_html',
    askBeforePasteFromWord: false,
    askBeforePasteHTML: false
  }

  return <JoditEditor {...props} ref={editorRef} config={config} />
}
