import { fireEvent, render, screen } from '@testing-library/react-native';

import { FormTextInput } from './FormTextInput';

describe('FormTextInput', () => {
  it('renders its label and placeholder', async () => {
    await render(<FormTextInput label="Email" placeholder="name@university.edu" />);
    expect(screen.getByText('Email')).toBeOnTheScreen();
    expect(screen.getByPlaceholderText('name@university.edu')).toBeOnTheScreen();
  });

  it('exposes the label as the accessibility name', async () => {
    await render(<FormTextInput label="Email" />);
    expect(screen.getByLabelText('Email')).toBeOnTheScreen();
  });

  it('shows an error message and marks the field invalid', async () => {
    await render(<FormTextInput label="Email" error="Email is required" />);
    expect(screen.getByText('Email is required')).toBeOnTheScreen();
    expect(screen.getByLabelText('Email')).toHaveProp('aria-invalid', true);
  });

  it('does not mark the field invalid when there is no error', async () => {
    await render(<FormTextInput label="Email" />);
    expect(screen.getByLabelText('Email')).toHaveProp('aria-invalid', false);
  });

  it('adds a reveal toggle for secure inputs', async () => {
    await render(<FormTextInput label="Password" secure />);

    const reveal = screen.getByLabelText('Show password');
    expect(reveal).toBeOnTheScreen();

    await fireEvent.press(reveal);
    expect(screen.getByLabelText('Hide password')).toBeOnTheScreen();
  });
});
