# WidgetUser

[![npm](https://img.shields.io/npm/v/vca-widget-user.svg)](https://www.npmjs.com/package/vca-widget-user) [![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)

> Implements different visualizations for a user.

## Preconditions
Using this package requires a running version of [Drops](https://github.com/Viva-con-Agua/drops), that has already 
implemented [issue #225](https://github.com/Viva-con-Agua/drops/issues/225). Additionally, the web server you are using
to run the front end application using this widget, has to use the same domain and the same port as 
[Drops](https://github.com/Viva-con-Agua/drops). [Drops](https://github.com/Viva-con-Agua/drops) has to be deployed 
using the path prefix `/drops/`.

## Widgets
This package implements several UI elements to handle user-specific interaction with the business objects `User` and 
`Crew` of the Pool² (e.g. input fields to search for a user or HTML and CSS code to present a user in a standard way). 
Using the widgets implemented here, you can ensure that users of your microservice will have the same user experience 
regarding other users as using the other microservices of Pool².

### Plain crew name
Since microservices should be loosely coupled, ideally they only save references to data objects managed by other 
microservices. Therefore, you need widgets to print a data object, if you only have a reference. 

This widget prints a crew name by a given crews `UUID`.

![](./src/images/screenshot_crew_plain_name.png)

You can use it that way:
```xml
<CrewPlainName id="606693fe-c057-4f05-8b29-2cc4975dda82" />
```
Since it has been implemented as a simple `<span>` tag without any styling, you can define the font and background color
as you want.

| Parameter | Type | Optional | Default | Description |
|-----------|------|----------|---------|-------------|
| `id` | String | required | *No default value* | The crews `UUID`. It will be used for an ajax request to obtain the crew object. |

*There are no slots for this widget*

*There are no events of this widget*

### Crew select
It allows the user to select a crew. The widget fires an event after selection that returns the `UUID` of the selected 
crew.

![](./src/images/screenshot_crew_select.png)

You can use it that way (`crewUuid` and `handler` are example names for variable and function):
```xml
<CrewSelect value="crewUuid" :disabled="false" v-on:input="handler" />
```

| Parameter | Type | Optional | Default | Description |
|-----------|------|----------|---------|-------------|
| `value` | String | optional | `""` | The `UUID` of the crew selected by default (e.g. a previously selected value). |
| `disabled` | Boolean | optional | `false` | Indicates if the select box is disabled. |

*There are no slots for this widget* 

| Event | Data |
|-------|------|
| `input` | The `UUID` of the selected crew. |

### Tag
Using this widget, you can show user or crew names as small (removable) tags. On click, the user will be redirected to 
the profile page of the user that is represented by the tag. 

![](./src/images/screenshot_tag_user.png) 
![](./src/images/screenshot_tag_crew.png)

You can use it that way:
```xml
<Tag uuid="606693fe-c057-4f05-8b29-2cc4975dda82" :removable="false" :crew="false" />
```

| Parameter | Type | Optional | Default | Description |
|-----------|------|----------|---------|-------------|
| `uuid` | String | optional | *No default value* | The `UUID` of the user whose name has to be printed. |
| `user` | Object | optional | *No default value* | The whole user object, thus an additional ajax request (in contrast to the parameter `uuid`) is not required. |
| `removable` | Boolean | optional | `false` | Indicates if the "X" button has to be visible. |
| `crew` | Boolean | optional | `false` | If set to `true` the name of the users crew instead of the individuals name is been used.  |

*There are no slots for this widget*

| Event | Data |
|-------|------|
| `vca-user-remove` | The `object` representing the removed user. |
| `vca-user-focus` | The `object` representing the focused user. |
| `vca-user-blur` | The `object` representing the blurred user. | 

### Avatar
Shows the avatar (profile image) of a user.

![](./src/images/screenshot_avatar_big.png)
![](./src/images/screenshot_avatar_small.png)

You can use it that way:
```xml
<Avatar :user="user" type="type" />
```

| Parameter | Type | Optional | Default | Description |
|-----------|------|----------|---------|-------------|
| `user` | Object | optional | *No default value* | The whole user object. |
| `type` | String | required | - | The `type` can be `'medium'` (4em x 4em), `'large'` (10em x 10em) or `'profile'` (20em x 20em). |

*There are no slots for this widget*

*There are no events of this widget*

## Installation

```bash
npm install --save vca-widget-user
```

## Usage

### Bundler (Webpack, Rollup)

```js
import Vue from 'vue'
import WidgetUserList from 'vca-widget-user'
// You need a specific loader for CSS files like https://github.com/webpack/css-loader
import 'vca-widget-user/dist/vca-widget-user.css'

Vue.use(WidgetUserList)

export default {
  name: 'App',
  components: { WidgetUserList },
  data () {
    return { options: {
      'type': { 'menue': true, 'value': 'table' },
      'sorting': { 'menue': { 'field': 'Supporter_firstName', 'dir': 'ASC' } },
      'lang': 'de'
    } }
  }
}

```

Inside your template:
```xml
<template>
  <div id="app">
    <WidgetUserList :options="options" />
  </div>
</template>
```

#### Existing internationalization
If you already use [vue-i18n](https://www.npmjs.com/package/vue-i18n) to handle your internationalization and localization, we have to merge our messages into 
yours. You can do this in your `main.js` before you instantiate your Vue App.

```js
import Vue from 'vue';
...
import VueI18n from 'vue-i18n';
import WidgetUserList from 'vca-widget-user' // use `WidgetUser` if you don't need a list of users

Vue.use(VueI18n);

const i18n = new VueI18n({
    locale: locale,
    messages: {
        'en-US': require('@/lang/en_US'),
        'de-DE': require('@/lang/de_VCA'),
        'ja-JA': require('../node_modules/element-ui/lib/locale/lang/ja')
    }
});

// the most important line of code here
Vue.use(WidgetUserList, { 'i18n': i18n })

/* eslint-disable no-new */

new Vue({
  ...
  i18n,
  components: { WidgetUserList },
  ...
}).$mount('#app');
```
Afterwards, you don't have to use `Vue.use(WidgetUserList)` in your components again.

### Browser

```html
<!-- Include after Vue -->
<!-- Local files -->
<link rel="stylesheet" href="widget-user/dist/widget-user.css"></link>
<script src="vca-widget-user/dist/widget-user.js"></script>

<!-- From CDN -->
<link rel="stylesheet" href="https://unpkg.com/vca-widget-user/dist/widget-user.css"></link>
<script src="https://unpkg.com/vca-widget-user"></script>
```

## Development

### Launch visual tests

```bash
npm run dev
```

### Launch Karma with coverage

```bash
npm run dev:coverage
```

### Build

Bundle the js and css of to the `dist` folder:

```bash
npm run build
```


## Publishing

The `prepublish` hook will ensure dist files are created before publishing. This
way you don't need to commit them in your repository.

```bash
# Bump the version first
# It'll also commit it and create a tag
npm version
# Push the bumped package and tags
git push --follow-tags
# Ship it 🚀
npm publish
```

## License

[MIT](http://opensource.org/licenses/MIT)
