import React, { FC } from 'react';
import styles from './Panel.module.css';
import classnames from 'classnames';

const Panel: FC<DivProps> = ({ children, className, ...props }) => (
  <div className={ classnames(styles.panel, className) } { ...props }>
    { children }
  </div>
);

export default Panel;
