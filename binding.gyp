{
    "targets": [{
        "target_name": "Hello",
        "cflags!": [ "-fno-exceptions" ],
        "cflags_cc!": [ "-fno-exceptions" ],
        "sources": [
            "addons/src/Hello.cpp"
        ],
        "include_dirs": [
            "<!@(node -p \"require('node-addon-api').include\")"
        ],
        "library_dirs": [ ],
        "libraries": [ ],
        "dependencies": [
            "<!(node -p \"require('node-addon-api').gyp\")"
        ],
        "defines": [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ]
    }]
}