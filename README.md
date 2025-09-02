# Wick

Wick is a comprehensive Social Media Management (SMM) platform, consisting primarily of an app and associated promotional website. Various other media have been produced for the platform, namely a set of TikTok filters — AR experiences hosted on the video platform. Wick is intended to be tailored in particular towards small businesses, up-and-coming influencers, and other social media users. It provides a wide range of tools to streamline content creation, track performance analytics, and more efficiently engage with followers and customers across various social media platforms. 

## links

- [official website](https://getwick.live/home)
- [website repository](https://github.com/Blaithnaid/wick-vite-site)
- [archived first attempt](https://github.com/Blaithnaid/wick-ionic) (built in Ionic)

## to start developing:

- clone the repo
- run `npm install`
- most branches require a development build, but you can try with expo go:
  - to run with expo go, run `npm start` and scan the QR code with the expo go app on your phone
  - you can also install an ios or android simulator and hit `i` or `a` in the terminal to run the app on the simulator
  - you can get an ios simulator on mac by installing xcode from the app store. setup instructions are [here](https://docs.expo.dev/workflow/ios-simulator/)
  - android simulators require android studio. setup instructions are [here](https://docs.expo.dev/workflow/android-studio-emulator/)
- to run a development we need to build it.
  - i've only tested ios dev builds. run `npx expo run:ios` to start. it will fail initially
  - after it fails, open the `Podfile` in the ios directory and change the target platform to 15.5
  - if we try build again afterwards, it should succeed!
