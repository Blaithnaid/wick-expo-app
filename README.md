# instructions for setup

to start developing:

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
