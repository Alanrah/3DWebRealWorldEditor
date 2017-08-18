//将branchUL的界面信息和leftbarLib存储在indexedDB
MatStorage = function(){
    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

    if ( indexedDB === undefined  ) {
        console.warn( 'Storage: IndexedDB not available.' );
        return { init: function () {}, get: function () {}, set: function () {}, clear: function () {} };
    }

    //数据库名称和版本
    var name = 'material-editor';
    var version = 1;
    var database;

    return {
        init: function ( callback ) {

            //一个单独的数据库可以包含任意数量的对象存储空间
            var request = indexedDB.open( name, version );
            //唯一可以修改数据库结构的地方,可以创建和删除对象存储空间以及构建和删除索引
            request.onupgradeneeded = function ( event ) {

                var db = event.target.result;//request.result 是一个 IDBDatabase 的实例
                //创建了一个名为‘materialDB’的数据存储
                if ( db.objectStoreNames.contains( 'materialDB' ) === false ) {

                    db.createObjectStore( 'materialDB' );//IndexedDB 使用对象存储空间而不是表

                }

            };
            request.onsuccess = function ( event ) {

                database = event.target.result;//database = request.result;
                //IDBDatabase {name: "material-editor", version: 1, 
                //objectStoreNames: DOMStringList, onabort: null, onclose: null…}
                //console.log(database)
                
                //IDBOpenDBRequest {onblocked: null, result: IDBDatabase, error: null, 
                //source: null, onupgradeneeded: function
                //console.log(request)

                //callback();

            };
            request.onerror = function ( event ) {

                console.error( 'IndexedDB', event );

            };
            
        },

        get: function ( callback ) {

            var transaction = database.transaction( [ 'materialDB' ], 'readwrite' );
            var objectStore = transaction.objectStore( 'materialDB' );
            var request = objectStore.get( 0 );

            request.onsuccess = function ( event ) {

                console.log('success');
                //Event {isTrusted: true, type: "success",
                // target: IDBRequest, currentTarget: IDBRequest, eventPhase: 2…}
                //console.log(event);
                callback( event.target.result );

            };
            transaction.oncomplete = function(event) {
                
              console.log("读取成功!");
              //console.log(event.target.result)//undefined
            };

            transaction.onerror = function(event) {
              console.log("读取失败!"+event);
            };
            
        },

        set: function ( data, callback ) {

            var start = performance.now();

            var transaction = database.transaction( [ 'materialDB' ], 'readwrite' );
            var objectStore = transaction.objectStore( 'materialDB' );
            //objectStore.clear();
            //add() 函数要求数据库中不能已经有相同键的对象存在
            //如果试图修改一个现有条目，或者并不关心是否有一个同样的条目已经存在，使用 put()函数
            var request = objectStore.put( data, 0 );//objectStore.put(item, key);
            request.onsuccess = function ( event ) {

                console.log( '[' + /\d\d\:\d\d\:\d\d/.exec( new Date() )[ 0 ] + ']', 'Saved state to IndexedDB. ' + ( performance.now() - start ).toFixed( 2 ) + 'ms' );

            };

            transaction.oncomplete = function(event) {
              console.log("transaction put done!");
            };

            transaction.onerror = function(event) {
              console.log("transaction put fail!"+event);
            };

        },

        clear: function () {

            if ( database === undefined ) return;

            var transaction = database.transaction( [ 'materialDB' ], 'readwrite' );
            var objectStore = transaction.objectStore( 'materialDB' );
            var request = objectStore.clear();
            request.onsuccess = function ( event ) {

                console.log( '[' + /\d\d\:\d\d\:\d\d/.exec( new Date() )[ 0 ] + ']', 'Cleared IndexedDB.' );

            };

            transaction.oncomplete = function(event) {
              console.log("transaction done!");
            };

            transaction.onerror = function(event) {
              console.log("transaction fail!"+event);
            };

        }
}
}