import React, { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import styles from './Panel.module.css';
import classnames from 'classnames';

export type PanelProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const Panel: FC<PanelProps> = ({ children, className, ...props }) => (
  <div { ...props } className={ classnames(styles.panel, className) }>
    { children }
  </div>
);

export default Panel;
