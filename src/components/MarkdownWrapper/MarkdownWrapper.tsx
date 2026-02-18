import type { ReactNode } from 'react';
import styles from './MarkdownWrapper.module.css';

type Props = {
  height?: string;
  children: ReactNode;
};

export function MarkdownWrapper({ height, children }: Props) {
  return (
    <div className={styles.root} style={{ height: height ?? '65%' }}>
      {children}
    </div>
  );
}