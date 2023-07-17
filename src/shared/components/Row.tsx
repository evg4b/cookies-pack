import React, { CSSProperties, FC } from 'react';
import styles from './Row.module.css';
import classnames from 'classnames';
import { px } from '@shared/helpres/styles';

export type RowProps = DivProps & {
  justifyContent?: "space-around" | "space-between" | "space-evenly" | "stretch";
  alignItems?: "center" | "end" | "flex-end" | "flex-start" | "self-end" | "self-start" | "start";
  gap?: number;
};

const Row: FC<RowProps> = ({ children, className, gap, ...props }) => {
  const { style, justifyContent, alignItems, ...divProps } = props;
  const styleObject: CSSProperties = {
    ...style ?? {},
    gap: px(gap),
    justifyContent: justifyContent,
    alignItems: alignItems,
  };

  return (
    <div className={ classnames(styles.row, className) } style={ styleObject } { ...divProps }>
      { children }
    </div>
  );
};

export default Row;
