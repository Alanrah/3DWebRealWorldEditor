/**
 * @author mrdoob / http://mrdoob.com/
 */

var Config = function ( name ) {

//浏览器localStorage的信息
	var storage = {
		'autosave': false,
		'theme': 'css/dark.css',
		'project/renderer': 'WebGLRenderer',
		'project/renderer/antialias': true,
		'project/renderer/gammaInput': false,
		'project/renderer/gammaOutput': false,
		'project/renderer/shadows': true,
		'project/vr': false,

		'settings/history': false
	};

//如果本地没有初始数据，则初始化strage
	if ( window.localStorage[ name ] === undefined ) {

		window.localStorage[ name ] = JSON.stringify( storage );

	} 
//载入listorage的用户数据
	else {

		var data = JSON.parse( window.localStorage[ name ] );

		for ( var key in data ) {

			storage[ key ] = data[ key ];

		}

	}

	return {

		getKey: function ( key ) {

			return storage[ key ];

		},

		setKey: function () { // key, value, key, value ...

			for ( var i = 0, l = arguments.length; i < l; i += 2 ) {

				storage[ arguments[ i ] ] = arguments[ i + 1 ];

			}

			window.localStorage[ name ] = JSON.stringify( storage );

			console.log( '[' + /\d\d\:\d\d\:\d\d/.exec( new Date() )[ 0 ] + ']', 'Saved config to LocalStorage.' );

		},

		clear: function () {

			delete window.localStorage[ name ];

		}

	};

};
