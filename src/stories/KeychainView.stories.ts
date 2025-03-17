import type { Meta, StoryObj } from '@storybook/react';

import { KeychainView } from '@/components/Keychain';
import { fn } from '@storybook/test';

const keyPair = {
  publicKey: {} as CryptoKey,
  PrivateKey: {} as CryptoKey,
  did: () => 'did:key:publicprivatekeypair',
  toSecret: async () => "secret secret, I've got a secret!"
}

const publicOnlyKeyPair = {
  publicKey: {} as CryptoKey,
  did: () => 'did:key:publiconlykeypair',
}

const meta = {
  title: 'components/KeychainView',
  component: KeychainView,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    keyPairs: [],
    generateKeyPair: async () => keyPair,
    setSelectedKeyPair: fn()
  },
  decorators: [
  ]
} satisfies Meta<typeof KeychainView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Initial: Story = {};

export const WithKeys: Story = {
  args: {
    keyPairs: [keyPair, publicOnlyKeyPair]
  }
};
