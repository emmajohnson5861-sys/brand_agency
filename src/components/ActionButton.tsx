import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'

type ActionButtonProps = {
  children: string
  arrow?: boolean
} & (ButtonHTMLAttributes<HTMLButtonElement> & { href?: never } | AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })

export default function ActionButton(props: ActionButtonProps) {
  const { children, className = '', arrow = false } = props
  const icon = <svg viewBox="0 0 24 24" fill="none"><path d="M4 12h16m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>

  const content = <>
      <span className="button-label" aria-hidden="true">
        <span className="button-text button-text-one">{children}</span>
        <span className="button-text button-text-two">{children}</span>
      </span>
      {arrow && <span className="button-arrows" aria-hidden="true"><span className="button-arrow">{icon}</span><span className="button-arrow button-arrow-next">{icon}</span></span>}
  </>

  if (props.href !== undefined) {
    const { children: _children, className: _className, arrow: _arrow, ...linkProps } = props
    return <a {...linkProps} className={`pill ${className}`} aria-label={children}>{content}</a>
  }

  const { children: _children, className: _className, arrow: _arrow, ...buttonProps } = props
  return <button type="button" {...buttonProps} className={`pill ${className}`} aria-label={children}>{content}</button>
}
