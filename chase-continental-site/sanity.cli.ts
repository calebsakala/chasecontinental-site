import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '87a8gku7',
    dataset: 'production'
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    autoUpdates: true,
    appId: 'y2kxhrc1bf8cv2ulju5vepuo'
  }
})
