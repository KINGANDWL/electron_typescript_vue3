// 使用 node-addon-api 方式编写nodejs addon
#include <napi.h>
#include <iostream>

using namespace std;

Napi::Value Hello(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    // 检查参数
    if (info.Length() < 1 || !info[0].IsFunction()) {
        Napi::TypeError::New(env, "Invalid parameter, helloWorld(require: function).").ThrowAsJavaScriptException();
        return Napi::String::New(env, "");
    }

    Napi::Function require = info[0].As<Napi::Function>();
    return require.Call({Napi::String::New(env,"./main.js")});
}

Napi::Object Initialize(Napi::Env env, Napi::Object exports) {
    std::cout << "This is init" << std::endl;

    //相当于export={MOD_ID:1399}
    exports.Set(Napi::String::New(env, "MOD_ID"), Napi::Number::New(env, 1399));
    //相当于export={Hello:Hello}，后一个Hello是上面定义的void Hello函数
    exports.Set(Napi::String::New(env, "Hello"), Napi::Function::New(env, Hello));
    return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Initialize)