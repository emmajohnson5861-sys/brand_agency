import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'

type InquirySelectProps = {
  id: string
  name: string
  options: string[]
  placeholder: string
  required?: boolean
  error?: string
  onChange?: () => void
}

export default function InquirySelect({ id, name, options, placeholder, required = false, error, onChange }: InquirySelectProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [active, setActive] = useState(0)
  const searchRef = useRef({ text: '', time: 0 })
  const choices = required ? options : ['', ...options]

  useEffect(() => {
    if (!open) return
    const closeOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', closeOutside)
    return () => document.removeEventListener('pointerdown', closeOutside)
  }, [open])

  useEffect(() => {
    if (open) rootRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  function reveal() {
    setActive(Math.max(0, choices.indexOf(value)))
    setOpen(true)
  }

  function choose(index: number) {
    setValue(choices[index])
    setOpen(false)
    onChange?.()
  }

  function navigate(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Tab') { setOpen(false); return }
    if (event.key === 'Escape') { if (open) { event.preventDefault(); event.stopPropagation() }; setOpen(false); return }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (open) choose(active)
      else reveal()
      return
    }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault()
      if (!open) reveal()
      else setActive(previous => event.key === 'Home' ? 0 : event.key === 'End' ? choices.length - 1 : (previous + (event.key === 'ArrowDown' ? 1 : -1) + choices.length) % choices.length)
      return
    }
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault()
      const now = Date.now()
      const query = (now - searchRef.current.time < 700 ? searchRef.current.text : '') + event.key.toLowerCase()
      searchRef.current = { text: query, time: now }
      const index = choices.findIndex(choice => choice.toLowerCase().startsWith(query))
      if (index >= 0) { setActive(index); setOpen(true) }
    }
  }

  return <div className="inquiry-dropdown" ref={rootRef} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }}>
    <input type="hidden" name={name} value={value} />
    <button className={`inquiry-select-trigger${value ? '' : ' is-placeholder'}`} id={id} type="button" role="combobox" aria-labelledby={`${id}-label`} aria-expanded={open} aria-controls={`${id}-options`} aria-haspopup="listbox" aria-required={required} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} aria-activedescendant={open ? `${id}-option-${active}` : undefined} onClick={() => open ? setOpen(false) : reveal()} onKeyDown={navigate}>
      <span>{value || placeholder}</span>
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.3" /></svg>
    </button>
    {open && <div className="inquiry-select-options" id={`${id}-options`} role="listbox" aria-labelledby={`${id}-label`} data-lenis-prevent>
      {choices.map((choice, index) => <div className={`inquiry-select-option${active === index ? ' is-active' : ''}`} key={choice} id={`${id}-option-${index}`} data-index={index} role="option" aria-selected={value === choice} onPointerMove={() => setActive(index)} onMouseDown={event => event.preventDefault()} onClick={() => choose(index)}>
        <span>{choice || placeholder}</span>
        {value === choice && <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m3 8 3 3 7-7" stroke="currentColor" strokeWidth="1.3" /></svg>}
      </div>)}
    </div>}
  </div>
}
