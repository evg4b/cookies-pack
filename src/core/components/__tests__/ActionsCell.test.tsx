import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MantineProvider, Table } from '@mantine/core';
import { ActionsCell } from '../CookiesTable/ActionsCell';

const renderInTable = (ui: React.ReactNode) => render(
  <Table>
    <Table.Tbody>
      <Table.Tr>{ui}</Table.Tr>
    </Table.Tbody>
  </Table>,
  { wrapper: MantineProvider },
);

describe('ActionsCell', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders its children inside a table data cell by default', () => {
    const { container } = renderInTable(
      <ActionsCell>
        <button>action</button>
      </ActionsCell>,
    );

    expect(screen.getByText('action')).toBeInTheDocument();
    expect(container.querySelector('td')).not.toBeNull();
    expect(container.querySelector('th')).toBeNull();
  });

  it('renders inside the given Component when provided', () => {
    const { container } = renderInTable(
      <ActionsCell Component={Table.Th}>
        <button>action</button>
      </ActionsCell>,
    );

    expect(screen.getByText('action')).toBeInTheDocument();
    expect(container.querySelector('th')).not.toBeNull();
    expect(container.querySelector('td')).toBeNull();
  });

  it('renders multiple children', () => {
    renderInTable(
      <ActionsCell>
        <button>first</button>
        <button>second</button>
      </ActionsCell>,
    );

    expect(screen.getByText('first')).toBeInTheDocument();
    expect(screen.getByText('second')).toBeInTheDocument();
  });
});
