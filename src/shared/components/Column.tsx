import React, { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import styles from './Column.module.css';
import classNames from 'classnames';

export type ColumnProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  gap?: number;
};

const Column: FC<ColumnProps> = ({ children, className, ...props }) => (
  <div className={ classNames(styles.column, className) }  { ...props }>
    { children }
  </div>
);

export default Column;
