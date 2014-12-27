# &lt;dropbox-button&gt;

Web Component wrapper for dropbox Button using Polymer

> Maintained by [kashiro](https://github.com/kashiro).

## Demo

> [Check it live](http://kashiro.github.io/dropbox-button/index.html).

## Dependency

* [Polymer](http://www.polymer-project.org/)

## Browser Compatibility

Depend on Polymer's [Browser Compatibility](http://www.polymer-project.org/compatibility.html)

* 2013/09 : support modern browser exclude IE

## Usage

1. Import Web Components' polyfill:

	```html
	<script src="//cdnjs.cloudflare.com/ajax/libs/polymer/0.0.20130905/polymer.min.js"></script>
	```

2. Import Custom Element:

	```html
	<link rel="import" href="src/dropbox-button.html">
	```

3. Start using it!

	```html
	<dropbox-button></dropbox-button>
	```

## Options

### common reqired

Attribute   | Options             | Default             | Description
---         | ---                 | ---                 | ---
`buttonType`| `chooser`, `saver`  | `chooser`           | [chooser](https://www.dropbox.com/developers/dropins/chooser/js), [saver](https://www.dropbox.com/developers/dropins/saver)
`appKey`    |                     |                     | [app key](https://www.dropbox.com/developers/apps)

### chooser required(*) or option

Attribute    | Options            | Default             | Description
---          | ---                | ---                 | ---
`multiselect`|                    | 'false'             | If true then multiple files can be selected in the Chooser
`linkType`   | 'preview','direct' | 'preview'           | See the [Link types](https://www.dropbox.com/developers/dropins/chooser/js#link-types) section below for more information.
`extensions` |                    |                     | If specified, the user will only be able to select files with these extensions.

### saver required(*) or option

Attribute    | Options            | Default             | Description
---          | ---                | ---                 | ---
`href`(*)    |                    | 'false'             | identifies the url of the file the Saver should add to the user’s Dropbox
`fileName`   |                    |                     | the user-friendly name of the file that should be saved to the user’s Dropbox can be included if desired.


more option [here](https://www.dropbox.com/developers/dropins)


## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

* v0.0.1 September 23, 2013
	* Started project using [boilerplate-element](https://github.com/customelements/boilerplate-element)

## License

[MIT License](http://opensource.org/licenses/MIT)
