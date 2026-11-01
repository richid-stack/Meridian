import { describe, expect, it, vi } from 'vitest';
import type { ReactElement } from 'react';
import { Switch } from './Switch';

type Props = { role?: string; 'aria-checked'?: boolean; onClick?: () => void; disabled?: boolean };
const render = (p: Parameters<typeof Switch>[0]) => (Switch(p) as ReactElement<Props>).props;

describe('Switch', () => {
  it('is a switch with its state exposed', () => {
    expect(render({ checked: true, onChange: () => {}, children: 'Alerts' })).toMatchObject({ role: 'switch', 'aria-checked': true });
    expect(render({ checked: false, onChange: () => {}, children: 'Alerts' })['aria-checked']).toBe(false);
  });
  it('asks for the opposite value when pressed', () => {
    const on = vi.fn();
    render({ checked: false, onChange: on, children: 'Alerts' }).onClick?.();
    expect(on).toHaveBeenCalledWith(true);
    const off = vi.fn();
    render({ checked: true, onChange: off, children: 'Alerts' }).onClick?.();
    expect(off).toHaveBeenCalledWith(false);
  });
  it('can be disabled', () => expect(render({ checked: false, onChange: () => {}, disabled: true, children: 'x' }).disabled).toBe(true));
});
