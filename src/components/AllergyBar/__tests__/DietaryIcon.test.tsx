import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import each from 'jest-each';
import '@testing-library/jest-dom';
import DietaryIcon from '../DietaryIcon/DietaryIcon';

interface RenderIconProp {
  iconProp: string;
  label: string;
  expected: string;
}

interface TooltipProp {
  iconProp: string;
  expected: string;
}

describe('DietaryIcon test suite', () => {
  describe('renders icon for...', () => {
    const renderIconProps: RenderIconProp[] = [
      {
        iconProp: 'vegetarian',
        label: 'Vegetarian',
        expected: 'vegetarianIcon',
      },
      {
        iconProp: 'glutenFree',
        label: 'Gluten Free',
        expected: 'glutenFreeIcon',
      },
      { iconProp: 'vegan', label: 'Vegan', expected: 'veganIcon' },
    ];

    each(renderIconProps).it('$label', (tc: RenderIconProp) => {
      const { iconProp, label, expected } = tc;
      render(<DietaryIcon icon={iconProp} />);

      const veganElement = screen.getByLabelText(label);
      const icon = veganElement.querySelector('svg');

      expect(icon.getAttribute('name')).toBe(expected);
    });
  });

  describe('returns null when argument is...', () => {
    each([null, undefined, 0, -1, 1, 'anUnknownString']).it('%s', (prop) => {
      const { container } = render(<DietaryIcon icon={prop} />);

      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('displays tooltip for...', () => {
    let toolTip: HTMLElement;

    const toolTipProps: TooltipProp[] = [
      { iconProp: 'vegetarian', expected: 'Vegetarian' },
      { iconProp: 'glutenFree', expected: 'Gluten Free' },
      { iconProp: 'vegan', expected: 'Vegan' },
    ];

    each(toolTipProps).it('$expected', async (tc: TooltipProp) => {
      const { iconProp, expected } = tc;

      render(<DietaryIcon icon={iconProp} />);
      const veganElement = screen.getByLabelText(expected);

      await userEvent.hover(veganElement);
      await waitFor(() => (toolTip = screen.getByRole('tooltip')));

      expect(toolTip).toHaveTextContent(expected);
    });
  });
});
