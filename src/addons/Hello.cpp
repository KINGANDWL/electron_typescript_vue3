#define AddonType_1

#ifdef AddonType_1
    // 使用官方的 node_api.h 方式编写nodejs addon
    #include <node_api.h>
    napi_value Say(napi_env env, napi_callback_info info) {
        napi_value res;
        napi_create_string_utf8(env, "hello world", 12, &res);
        return res;
    }

    napi_value Init(napi_env env, napi_value exports) {
        napi_status status;
        napi_property_descriptor desc = { "Say", 0, Say, 0, 0, 0, napi_default, 0 };
        status = napi_define_properties(env, exports, 1, &desc);
        return 0;
    }

    NAPI_MODULE(hello, Init)
#endif // AddonType_1




#ifdef AddonType_2
    // 使用gyp提供的 napi.h 方式编写nodejs addon
    #include <string>
    #include <stdio.h>
    #include <napi.h>

    using namespace Napi;

    void Hello(const CallbackInfo& info) {
        Env env = info.Env();
        // 检查参数
        if (info.Length() < 1 || !info[0].IsString()) {
            TypeError::New(env, "Invalid parameter, helloWorld(name: string).").ThrowAsJavaScriptException();
        }
        std::string name = info[0].As<String>().Utf8Value();
        printf("%s says: Hello, World!\n", (char*)name.c_str());
        return;
    }
    
    Object Initialize(Env env, Object exports) {
        exports.Set("MOD_ID", Number::New(env, 1399));
        exports.Set("Hello", Function::New(env, Hello));
        return exports;
    }

    NODE_API_MODULE(NODE_GYP_MODULE_NAME, Initialize)
#endif // AddonType_2

#ifdef AddonType_3
    // 使用gyp提供的 napi.h 方式编写nodejs addon
    #include <napi.h>

    Napi::String Say(const Napi::CallbackInfo& info)
    {
        Napi::Env env = info.Env();
        return Napi::String::New(env, "hell world");
    }

    Napi::Object Init(Napi::Env env, Napi::Object exports)
    {
        exports.Set(Napi::String::New(env, "say"), Napi::Function::New(env, Say));
        return exports;
    }

    NODE_API_MODULE(hello, Init)
#endif // AddonType_3