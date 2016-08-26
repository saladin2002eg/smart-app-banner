Smart App Banner
================

Lightweight smart app banner with no jQuery (or any other framework) requirement.

Based on 'jQuery Smart Banner' by Arnold Daniels <arnold@jasny.net> https://github.com/jasny/jquery.smartbanner

## Difference

* Standalone (no frameworks required)
* Different icons/price for iOS and Android
* Available as npm-module

## Installation

`$ npm install --save smart-app-banner`


## Usage

```html
<html>
  <head>
    <title>MyPage</title>

    <meta name="dw-itunes-app" content="app-id=1019193036, app-argument=dwmobile%3A//customUrl">
    <meta name="google-play-app" content="app-id=com.docuware.mobile, app-argument=dwmobile%3A//customUrl">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta name="msApplication-ID" content="bc2c5350-67b8-497c-a5ef-68f28f70d3d1"/>
    <meta name="msApplication-URL" content="dwmobile%3A//customUrl"/>

    <link rel="stylesheet" href="node_modules/smart-app-banner/smart-app-banner.css" type="text/css" media="screen">
    <link rel="windows-touch-icon" href="windows-icon.png" />
    <link rel="android-touch-icon" href="android-icon.png" />
  </head>
  <body>
    ...
    <script src="node_modules/smart-app-banner/smart-app-banner.js"></script>
    <script type="text/javascript">
      new SmartBanner({
          daysHidden: -1,   // days to hide banner after close button is clicked (defaults to 15)
          daysReminder: -1, // days to hide banner after "VIEW" button is clicked (defaults to 90)
          appStoreLanguage: 'us', // language code for the App Store (defaults to user's browser language)
          title: 'DocuWare Mobile',
          author: 'DocuWare',
          button: 'Open',
          store: {
              android: 'In Google Play',
              windows: 'In Windows store'
          },
          price: {
              android: 'Free',
              windows: 'Free'
          }
      });
    </script>
  </body>
</html>
```

## URL-Integration

If you want to implement custom URL-Integration, just add the attribute app-argument to the platform-meta-tag. Keep in mind to escape the URL-sequence.
```html
    <meta name="dw-itunes-app" content="app-id=502838820, app-argument=myscheme%3A//customUrl">
    <meta name="google-play-app" content="app-id=ru.hh.android, app-argument=myscheme%3A//customUrl">
    <meta name="msApplication-URL" content="myscheme%3A//customUrl">
```

## Development

The following commands are available for compiling the project:

| Command | Result |
| ------- | ------ |
| `npm install` | Installs the required dependencies |
| `npm run build` | Builds the application JavaScript. |

## See also

* [smartappbanner.js](https://github.com/ain/smartbanner.js) an alternative smart app banner.
