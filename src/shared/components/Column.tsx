import React, { CSSProperties, DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import styles from './Column.module.css';
import classNames from 'classnames';
import { px } from '@shared/helpres/styles';

export type ColumnProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  gap?: number;
};

const Column: FC<ColumnProps> = ({ children, className, ...props }) => {
  const { style, gap, ...divProps } = props;
  const styleObj: CSSProperties = {
    ...style ?? {},
    gap: px(gap),
  };

  return (
    <div className={ classNames(styles.column, className) } style={ styleObj } { ...divProps }>
      { children }
    </div>
  );
};

export default Column;