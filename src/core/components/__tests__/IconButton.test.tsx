import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import type { FC } from 'react';
import { IconButton } from '../IconButton';

const MockIcon: FC<{ size: number }> = ({ size }) => <svg data-testid="mock-icon" data-size={size}/>;

describe('IconButton', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the given icon at size 16', () => {
    render(<IconButton label="Delete" onClick={vi.fn()} icon={MockIcon}/>, { wrapper: MantineProvider });

    const icon = screen.getByTestId('mock-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('data-size', '16');
  });

  it('exposes the label as the accessible name and tooltip', () => {
    render(<IconButton label="Delete cookie" onClick={vi.fn()} icon={MockIcon}/>, { wrapper: MantineProvider });

    expect(screen.getByLabelText('Delete cookie')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<IconButton label="Delete" onClick={onClick} icon={MockIcon}/>, { wrapper: MantineProvider });

    fireEvent.click(screen.getByLabelText('Delete'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('applies the given color and variant to the underlying action icon', () => {
    render(
      <IconButton label="Copied" onClick={vi.fn()} icon={MockIcon} color="green" variant="filled"/>,
      { wrapper: MantineProvider },
    );

    const button = screen.getByLabelText('Copied');
    expect(button).toHaveAttribute('data-variant', 'filled');
  });

  it('does not set a variant when none is given', () => {
    render(<IconButton label="Export" onClick={vi.fn()} icon={MockIcon}/>, { wrapper: MantineProvider });

    expect(screen.getByLabelText('Export')).not.toHaveAttribute('data-variant');
  });
});
