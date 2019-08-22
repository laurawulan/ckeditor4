/* bender-tags: editor, selection */
/* bender-ckeditor-plugins: table, basicstyles, list, colorbutton */

( function() {
	'use strict';

	bender.editors = {
		classic: {},
		divarea: {
			config: {
				extraPlugins: 'divarea'
			}
		},
		inline: {
			creator: 'inline'
		}
	};

	// (#3175)
	var tests = {
		'test selection optimization case 1': testSelection( {
			initial: '<p>foo</p><p>[bar</p><p>]baz</p>',
			expected: '<p>foo</p><p>[bar]@</p><p>baz</p>'
		} ),

		'test selection optimization case 2': testSelection( {
			initial: '<p>foo[</p><p>bar]</p><p>baz</p>',
			expected: '<p>foo</p><p>[bar]@</p><p>baz</p>'
		} ),

		'test selection optimization case 3': testSelection( {
			initial: '<p>foo[</p><p>bar</p><p>]baz</p>',
			expected: '<p>foo</p><p>[bar]@</p><p>baz</p>'
		} ),

		'test selection optimization case 4': testSelection( {
			initial: '<p>foo</p><p>[bar</p><p>b]az</p>',
			expected: '<p>foo</p><p>[bar@</p><p>b]az</p>'
		} ),

		'test selection optimization case 5': testSelection( {
			initial: '<p>fo[o</p><p>bar]</p><p>baz</p>',
			expected: '<p>fo[o@</p><p>bar]</p><p>baz</p>'
		} ),

		'test selection optimization case 6': testSelection( {
			initial: '<p>foo</p><p>[bar</p><p>]baz</p>',
			expected: '<p>foo</p><p>[bar]@</p><p>baz</p>'
		} ),

		'test selection optimization case 7': testSelection( {
			initial: '<p>foo</p><p>[]bar</p><p>baz</p>',
			expected: '<p>foo</p><p>^bar@</p><p>baz</p>'
		} ),

		'test selection optimization case 8': testSelection( {
			initial: '<ul><li>[foo</li><li>]bar</li></ul>',
			expected: '<ul><li>[foo]@</li><li>bar</li></ul>'
		} ),

		'test selection optimization case 9': testSelection( {
			initial: '<ul><li>foo</li><li>[bar</li></ul><p>]baz</p>',
			expected: '<ul><li>foo</li><li>[bar]@</li></ul><p>baz</p>'
		} ),

		'test selection optimization case 10': testSelection( {
			initial: '<p><strong>[Foo</strong> bar</p><p>]baz</p>',
			expected: '<p><strong>[Foo</strong> bar]@</p><p>baz</p>'
		} ),

		'test selection optimization case 11': testSelection( {
			initial: '<p>Foo[</p><p><strong>bar]</strong> baz</p>',
			expected: '<p>Foo</p><p><strong>[bar]</strong> baz@</p>'
		} ),

		'test selection optimization case 12': testSelection( {
			initial:
				'<table border="1" cellpadding="1" cellspacing="1" style="width:500px"><tbody>' +
				'<tr><td>foo</td><td>bar</td></tr>' +
				'<tr><td>baz</td><td><span style="color:#e74c3c">[faz</span></td></tr>' +
				'</tbody></table><p>]Paragraph</p>',
			expected:
				'<table border="1" cellpadding="1" cellspacing="1" style="width:500px"><tbody>' +
				'<tr><td>foo</td><td>bar</td></tr>' +
				'<tr><td>baz</td><td><span style="color:#e74c3c">[faz]</span>@</td></tr>' +
				'</tbody></table><p>Paragraph</p>'
		} ),

		'test selection optimization is prevented when shift key is pressed': testSelection( {
			initial: '<p>foo</p><p>[bar</p><p>]baz</p>',
			expected: '<p>foo</p><p>[bar@</p><p>]baz</p>',
			callback: function( editor, assertEditorHtml ) {
				editor._.shiftPressed = true;
				assertEditorHtml();
				editor._.shiftPressed = false;
			}
		} )
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

	bender.test( tests );

	function testSelection( options ) {
		return function( editor ) {
			if ( options.callback ) {
				options.callback( editor, assertEditorHtml );
			} else {
				assertEditorHtml();
			}

			function assertEditorHtml() {
				bender.tools.selection.setWithHtml( editor, options.initial );

				var expected = options.expected,
					actual = bender.tools.selection.getWithHtml( editor );

				assert.isInnerHtmlMatching( expected, actual, {
					compareSelection: true,
					normalizeSelection: true,
					sortAttributes: true,
					fixStyles: true
				} );
			}
		};
	}
} )();
