//将branchUL的界面信息和leftbarLib存储在indexedDB
var materialDB = function(){
    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

    if ( indexedDB === undefined  ) {
        console.warn( 'Storage: IndexedDB not available.' );
    }
        //数据库名称和版本
    var name = 'material-editor';
    var version = 1;
    var database;


    function init ( callback ) {

        var request = indexedDB.open( name, version );
        request.onupgradeneeded = function ( event ) {

            var db = event.target.result;
            //创建了一个名为‘states’的数据存储
            if ( db.objectStoreNames.contains( 'materialLib' ) === false ) {

                db.createObjectStore( 'materialLib' );

            }

        };
        request.onsuccess = function ( event ) {

            database = event.target.result;

            callback();

        };
        request.onerror = function ( event ) {

            console.error( 'IndexedDB', event );

        };

        }
}