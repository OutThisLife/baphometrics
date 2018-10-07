import 'react-virtualized/styles.css'

import Panel from '@/components/panel'
import styled from 'styled-components'

export default styled(Panel)`
  > div {
    display: grid;
    grid-template-columns: repeat(40, 1fr);
    grid-template-rows: min-content 1fr;
    height: 100%;
  }

  header {
    grid-row: 1;
    grid-column: 1 / -1;
  }

  header + div[style] {
    grid-row: 2;
    grid-column: 1 / -1;
    width: 100% !important;

    ${({ isOpen }: any) => `
      pointer-events: ${isOpen ? 'none' : 'auto'};
      filter: ${isOpen ? 'blur(2px) opacity(0.5)' : 'none'};
    `};

    [style*="width"] {
      width: 100% !important;
    }
  }

  aside {
    z-index: 5;
    grid-row: 2;
    grid-column: 1 / -1;
  }
` as any
