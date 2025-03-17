import type { Meta, StoryObj } from '@storybook/react';

import Keychain from '@/components/Keychain';
import { KeychainProvider } from '@/contexts/keychain';

const meta = {
  title: 'components/Keychain',
  component: Keychain,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
  },
  decorators: [
    (Story) => (
      <KeychainProvider>
        <Story />
      </KeychainProvider>
    )
  ]
} satisfies Meta<typeof Keychain>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Initial: Story = {};
