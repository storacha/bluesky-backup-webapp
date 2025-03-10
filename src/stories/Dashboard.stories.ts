import type { Meta, StoryObj } from '@storybook/react';

import { Dashboard } from './Dashboard';
import { Context } from '@w3ui/react';
import { withReactContext } from 'storybook-react-context'
import { BskyAuthContext } from '@/contexts';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Dashboard',
  component: Dashboard,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {},
  decorators: [
    withReactContext({
      context: BskyAuthContext,
      contextValue: { initialized: false, authenticated: false }
    }),
    withReactContext({
      context: Context,
      contextValue: [{}]
    })
  ]
} satisfies Meta<typeof Dashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Uninitialized: Story = {};

export const BlueskyUnautheticated: Story = {
  decorators: [
    withReactContext({
      context: BskyAuthContext,
      contextValue: { initialized: true, authenticated: false }
    }),
    withReactContext({
      context: Context,
      contextValue: [{}]
    })
  ]
};

export const StorachaUnauthenticated: Story = {
  decorators: [
    withReactContext({
      context: BskyAuthContext,
      contextValue: { initialized: true, authenticated: true }
    }),
    withReactContext({
      context: Context,
      contextValue: [{
        accounts: [],
        client: {}
      }]
    })
  ]
};

export const StorachaAuthenticated: Story = {
  decorators: [
    withReactContext({
      context: BskyAuthContext,
      contextValue: { initialized: true, authenticated: true, userProfile: {} }
    }),
    withReactContext({
      context: Context,
      contextValue: [{
        accounts: [{}],
        client: {},
        spaces: []
      }]
    })
  ]
};

