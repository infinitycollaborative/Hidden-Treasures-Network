'use client'

import { InputHTMLAttributes } from 'react'

type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

export function Switch({ className, ...props }: SwitchProps) {
  return (
    <input
      type="checkbox"
      role="switch"
      className={`relative inline-flex h-6 w-11 items-center rounded-full border border-gray-300 bg-gray-200 transition data-[checked=true]:bg-aviation-sky ${className || ''}`}
      {...props}
    />
  )
}
