import React, { ButtonHTMLAttributes, DetailedHTMLProps, FC } from 'react';
import styles from './Button.module.css';
import classNames from 'classnames';

export interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  variant?: 'primary' | 'default',
}

const Button: FC<ButtonProps> = ({ variant, children, ...props }) => {
  const variantClass = styles[variant ?? 'default'];

  return (
    <button className={ classNames(styles.base, variantClass) } { ...props }>
      { children }
    </button>
  );
};

export default Button;
