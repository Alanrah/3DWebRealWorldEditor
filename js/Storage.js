/**
 * @author mrdoob / http://mrdoob.com/
 */

var Storage = function () {

	var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

	if ( indexedDB === undefined  ) {

		console.warn( 'Storage: IndexedDB not available.' );
		return { init: function () {}, get: function () {}, set: function () {}, clear: function () {} };

	}

	//数据库名称和版本
	var name = 'threejs-editor';
	var version = 1;

	var database;

	return {

		init: function ( callback ) {

			//一个单独的数据库可以包含任意数量的对象存储空间
			var request = indexedDB.open( name, version );

			request.onupgradeneeded = function ( event ) {

				var db = event.target.result;//request.result 是一个 IDBDatabase 的实例
				//创建了一个名为‘states’的数据存储
				if ( db.objectStoreNames.contains( 'states' ) === false ) {

					db.createObjectStore( 'states' );//IndexedDB 使用对象存储空间而不是表

				}

			};
			request.onsuccess = function ( event ) {

				database = event.target.result;//database = request.result;

				callback();

			};
			request.onerror = function ( event ) {

				console.error( 'IndexedDB', event );

			};
			
		},

		get: function ( callback ) {

			var transaction = database.transaction( [ 'states' ], 'readwrite' );
			var objectStore = transaction.objectStore( 'states' );
			var request = objectStore.get( 0 );
			request.onsuccess = function ( event ) {

				callback( event.target.result );

			};

		},

		set: function ( data, callback ) {

			var start = performance.now();

			var transaction = database.transaction( [ 'states' ], 'readwrite' );
			var objectStore = transaction.objectStore( 'states' );
			
			var request = objectStore.put( data, 0 );
			request.onsuccess = function ( event ) {

				console.log( '[' + /\d\d\:\d\d\:\d\d/.exec( new Date() )[ 0 ] + ']', 'Saved state to IndexedDB. ' + ( performance.now() - start ).toFixed( 2 ) + 'ms' );

			};

		},

		clear: function () {

			if ( database === undefined ) return;

			var transaction = database.transaction( [ 'states' ], 'readwrite' );
			var objectStore = transaction.objectStore( 'states' );
			var request = objectStore.clear();
			request.onsuccess = function ( event ) {

				console.log( '[' + /\d\d\:\d\d\:\d\d/.exec( new Date() )[ 0 ] + ']', 'Cleared IndexedDB.' );

			};

		}

	};

};
