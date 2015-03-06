# &lt;tab-panel&gt;

> VanillaJS Tab Panel

## Demo

[Check it live!](http://sparksm.github.io/tab-panel)

## Install

Install the component using [Bower](http://bower.io/):

```sh
$ bower install tab-panel --save
```

Or [download as ZIP](https://github.com/sparksm/tab-panel/archive/master.zip).

## Usage

1. Import Web Components' polyfill:

    ```html
    <script src="bower_components/webcomponentsjs/webcomponents.min.js"></script>
    ```

2. Import Custom Element:

    ```html
    <link rel="import" href="bower_components/tab-panel/src/tab-panel.html">
    ```

3. Start using it!

    ```html
    <tab-panel>
    	<div class="tabcontent">
    		<h1>title</h1>
    		<div>...</div>
    	</div>
    	<div class="tabcontent">
    		<h1>title</h1>
    		<div>...</div>
    	</div>
    </tab-panel>
    ```

## Options

Attribute     | Options     | Default      | Description
---           | ---         | ---          | ---
`scroll`         | *singleton*    | ``        | Switches from a static tab structure to a scrollspy type stack.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

For detailed changelog, check [Releases](https://github.com/sparksm/tab-panel/releases).

## License

[MIT License](http://opensource.org/licenses/MIT)
