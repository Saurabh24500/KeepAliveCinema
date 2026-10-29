import type { ComponentPropsWithoutRef } from 'react'
import {
  buttonClasses,
  type ButtonSize,
  type ButtonVariant,
} from './buttonStyles'

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses(variant, size, className)}
      {...props}
    />
  )
}
