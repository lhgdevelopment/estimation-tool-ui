import { RootState } from '@core/store/reducers'
import { IJoditEditorProps, Jodit } from 'jodit-react'
import dynamic from 'next/dynamic'
import { RefObject, useCallback, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'

type TRichTextEditorProps = IJoditEditorProps & {
  value: string
  onChange: (value: string) => void
}

const JoditEditor = dynamic(() => import('jodit-react').then(mod => mod.default), { ssr: false })
type InsertMode = 'insert_as_html' | 'insert_as_text' | 'insert_clear_html' | 'insert_only_text'
export function RichTextEditor({ value, onChange, ...props }: TRichTextEditorProps) {
  const isDark = useSelector((state: RootState) => state.theme.isDark)
  const editorRef: RefObject<Jodit | null> = useRef<Jodit | null>(null)

  // Memoize the config object to prevent reinitialization on every render
  const config = useMemo(
    () => ({
      enter: 'br' as 'br' | 'div' | 'p' | undefined,
      theme: isDark ? 'dark' : '',
      buttons: ['bold', 'italic', 'underline', 'ul', 'ol'], // Only these buttons will be shown
      contentCSS: '', // Removes all custom content styles
      defaultActionOnPaste: 'insert_as_html' as InsertMode,
      defaultActionOnPasteFromWord: 'insert_as_html',
      askBeforePasteFromWord: false,
      askBeforePasteHTML: false
    }),
    [isDark]
  )

  // Use a callback to avoid unnecessary re-renders
  const handleEditorChange = useCallback(
    (newContent: string) => {
      onChange(newContent)
    },
    [onChange] // Only recreate if onChange changes
  )

  return <JoditEditor value={value} onChange={handleEditorChange} ref={editorRef} config={config} {...props} />
}
