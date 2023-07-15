import React, { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import styles from './Row.module.css';
import classnames from 'classnames';

export type RowProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  justifyContent?: string;
  alignItems?: string;
  gap?: number;
};

const Row: FC<RowProps> = ({ children, className, ...props }) => (
  <div className={ classnames(styles.row, className) } { ...props }>
    { children }
  </div>
);

export default Row;
