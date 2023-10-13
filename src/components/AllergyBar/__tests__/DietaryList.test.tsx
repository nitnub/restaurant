import { render } from '@testing-library/react';
import each from 'jest-each';
import '@testing-library/jest-dom';
import DietaryList from '../DietaryList';

interface DietaryListProps {
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
}

interface DietaryTestProps {
  title: string;
  input: DietaryListProps;
  expected: DietaryTestOutput;
}

interface DietaryTestOutput {
  include: DietaryOption[];
  exclude: DietaryOption[];
  count: number;
}

type DietaryOption = 'Vegan' | 'Vegetarian' | 'Gluten Free';

const veganOnly: DietaryTestProps = {
  title: 'Vegan only',
  input: { vegetarian: false, vegan: true, glutenFree: false },
  expected: {
    include: ['Vegan'],
    exclude: ['Vegetarian', 'Gluten Free'],
    count: 1,
  },
};

const vegetarianOnly: DietaryTestProps = {
  title: 'Vegetarian only',
  input: { vegetarian: true, vegan: false, glutenFree: false },
  expected: {
    include: ['Vegetarian'],
    exclude: ['Vegan', 'Gluten Free'],
    count: 1,
  },
};

const glutenFreeOnly: DietaryTestProps = {
  title: 'Gluten Free only',
  input: { vegetarian: false, vegan: false, glutenFree: true },
  expected: {
    include: ['Gluten Free'],
    exclude: ['Vegan', 'Vegetarian'],
    count: 1,
  },
};

const veganAndVegetarian: DietaryTestProps = {
  title: 'Vegan and Vegetarian',
  input: { vegetarian: true, vegan: true, glutenFree: false },
  expected: {
    include: ['Vegan'],
    exclude: ['Vegetarian', 'Gluten Free'],
    count: 1,
  },
};

const veganAndGlutenFree: DietaryTestProps = {
  title: 'Vegan and Gluten Free',
  input: { vegetarian: false, vegan: true, glutenFree: true },
  expected: {
    include: ['Vegan', 'Gluten Free'],
    exclude: ['Vegetarian'],
    count: 2,
  },
};

const vegetarianAndGlutenFree: DietaryTestProps = {
  title: 'Vegetarian and Gluten Free',
  input: { vegetarian: true, vegan: false, glutenFree: true },
  expected: {
    include: ['Vegetarian', 'Gluten Free'],
    exclude: ['Vegan'],
    count: 2,
  },
};

const allThreeItems: DietaryTestProps = {
  title: 'Vegan, Vegetarian, and Gluten Free',
  input: { vegetarian: true, vegan: true, glutenFree: true },
  expected: {
    include: ['Vegan', 'Gluten Free'],
    exclude: ['Vegetarian'],
    count: 2,
  },
};

const noItems: DietaryTestProps = {
  title: 'Empty props',
  input: { vegetarian: false, vegan: false, glutenFree: false },
  expected: {
    include: [],
    exclude: ['Vegan', 'Vegetarian', 'Gluten Free'],
    count: 0,
  },
};

const testCases: DietaryTestProps[] = [
  veganOnly,
  vegetarianOnly,
  glutenFreeOnly,
  veganAndVegetarian,
  veganAndGlutenFree,
  vegetarianAndGlutenFree,
  allThreeItems,
  noItems,
];

describe('DietaryList test suite', () => {
  describe('expected icons are included for...', () => {
    each(testCases).it('$title', (tc: DietaryTestProps) => {
      const { container } = render(<DietaryList dietaryProps={tc.input} />);

      tc.expected.include.forEach((value) => {
        expect(container.innerHTML).toContain(value);
      });
      tc.expected.exclude.forEach((value) => {
        expect(container.innerHTML).not.toContain(value);
      });
    });
  });

  describe('displays an empty line when argument is...', () => {
    each([null, undefined]).it('%s', (prop) => {
      const { container } = render(<DietaryList dietaryProps={prop} />);

      expect(container.childElementCount).toBe(1);
      expect(container).toContainHTML('<br/>');
    });
  });
});
